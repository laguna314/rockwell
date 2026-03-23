const ACCEDO_API_BASE = "https://accedotickets.com";

function json(data, init) {
    return new Response(JSON.stringify(data), {
        ...init,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            ...(init?.headers || {}),
        },
    });
}

function escapeHtml(input) {
    return String(input)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function inquiryLabel(type) {
    switch (type) {
        case "show":
            return "Book a Show";
        case "private":
            return "Private Event";
        case "corporate":
            return "Corporate Event";
        default:
            return "General Question";
    }
}

async function handleContactRequest(request, env) {
    try {
        const body = await request.json();

        const inquiryType = String(body?.inquiryType || "general").trim();
        const fullName = String(body?.fullName || "").trim();
        const email = String(body?.email || "").trim();
        const phone = String(body?.phone || "").trim();
        const organization = String(body?.organization || "").trim();
        const preferredDate = String(body?.preferredDate || "").trim();
        const guestCount = String(body?.guestCount || "").trim();
        const message = String(body?.message || "").trim();
        const website = String(body?.website || "").trim(); // honeypot

        if (website) {
            return json({ ok: true });
        }

        if (!fullName || !email || !message) {
            return json(
                { error: "Please complete name, email, and message." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json(
                { error: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        if (!env.SENDGRID_API_KEY) {
            console.error("Missing SENDGRID_API_KEY");
            return json(
                { error: "Email service is not configured." },
                { status: 500 }
            );
        }

        if (!env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
            console.error("Missing CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL");
            return json(
                { error: "Contact email settings are not configured." },
                { status: 500 }
            );
        }

        const label = inquiryLabel(inquiryType);
        const subject = `Rockwell Event Center Inquiry: ${label}`;

        const text = `
New inquiry submitted from the Rockwell Event Center website

Inquiry Type: ${label}
Name: ${fullName}
Email: ${email}
Phone: ${phone || "N/A"}
Organization / Company: ${organization || "N/A"}
Preferred Event Date: ${preferredDate || "N/A"}
Estimated Guest Count: ${guestCount || "N/A"}

Message:
${message}
        `.trim();

        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
                <h2>New Rockwell Event Center Inquiry</h2>
                <p><strong>Inquiry Type:</strong> ${escapeHtml(label)}</p>
                <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
                <p><strong>Organization / Company:</strong> ${escapeHtml(organization || "N/A")}</p>
                <p><strong>Preferred Event Date:</strong> ${escapeHtml(preferredDate || "N/A")}</p>
                <p><strong>Estimated Guest Count:</strong> ${escapeHtml(guestCount || "N/A")}</p>
                <p><strong>Message:</strong></p>
                <div style="white-space: pre-wrap; border: 1px solid #ddd; padding: 12px; border-radius: 8px;">
                    ${escapeHtml(message)}
                </div>
            </div>
        `;

        const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email: env.CONTACT_TO_EMAIL }],
                        subject,
                    },
                ],
                from: {
                    email: env.CONTACT_FROM_EMAIL,
                    name: "Rockwell Website",
                },
                reply_to: {
                    email,
                    name: fullName,
                },
                content: [
                    {
                        type: "text/plain",
                        value: text,
                    },
                    {
                        type: "text/html",
                        value: html,
                    },
                ],
            }),
        });

        if (!sgRes.ok) {
            const errorText = await sgRes.text();
            console.error("SendGrid send failed:", sgRes.status, errorText);

            return json(
                { error: "Unable to send inquiry right now." },
                { status: 500 }
            );
        }

        return json({ ok: true });
    } catch (err) {
        console.error("Contact form error:", err);
        return json(
            { error: err?.message || "Unable to send inquiry right now." },
            { status: 500 }
        );
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        try {
            // GET /api/events
            if (request.method === "GET" && url.pathname === "/api/events") {
                const res = await fetch(
                    `${ACCEDO_API_BASE}/api/public/venues/rockwell-event-center/events`
                );

                if (!res.ok) {
                    return Response.json(
                        { error: "Failed to load events" },
                        { status: res.status || 500 }
                    );
                }

                const data = await res.json();
                return Response.json(data.events || []);
            }

            // GET /api/events/:slug/ticket-types
            if (
                request.method === "GET" &&
                /^\/api\/events\/[^/]+\/ticket-types$/.test(url.pathname)
            ) {
                const parts = url.pathname.split("/");
                const slug = encodeURIComponent(parts[3]);

                const res = await fetch(
                    `${ACCEDO_API_BASE}/api/public/events/${slug}/ticket-types`
                );

                if (!res.ok) {
                    return Response.json(
                        { error: "Failed to load ticket types" },
                        { status: res.status || 500 }
                    );
                }

                const data = await res.json();
                return Response.json({ ticketTypes: data.ticketTypes || [] });
            }

            // GET /api/events/:slug
            if (
                request.method === "GET" &&
                /^\/api\/events\/[^/]+$/.test(url.pathname)
            ) {
                const parts = url.pathname.split("/");
                const slug = encodeURIComponent(parts[3]);

                const res = await fetch(
                    `${ACCEDO_API_BASE}/api/public/events/${slug}`
                );

                if (!res.ok) {
                    return Response.json(
                        { error: "Failed to load event" },
                        { status: res.status || 500 }
                    );
                }

                const data = await res.json();
                return Response.json(data);
            }

            // POST /api/checkout/session
            if (
                request.method === "POST" &&
                url.pathname === "/api/checkout/session"
            ) {
                const body = await request.text();

                const res = await fetch(
                    `${ACCEDO_API_BASE}/api/checkout/session`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body,
                    }
                );

                const text = await res.text();

                return new Response(text, {
                    status: res.status,
                    statusText: res.statusText,
                    headers: {
                        "Content-Type":
                            res.headers.get("Content-Type") ||
                            "application/json",
                    },
                });
            }

            // POST /api/contact
            if (request.method === "POST" && url.pathname === "/api/contact") {
                return handleContactRequest(request, env);
            }

            const res = await env.ASSETS.fetch(request);

            if (res.status === 404) {
                return env.ASSETS.fetch(
                    new Request(new URL("/index.html", url))
                );
            }

            return res;
        } catch (err) {
            console.error("Rockwell worker error:", err);

            if (url.pathname.startsWith("/api/")) {
                return Response.json(
                    { error: err?.message || "Request failed" },
                    { status: 500 }
                );
            }

            return new Response("Internal Server Error", { status: 500 });
        }
    },
};
