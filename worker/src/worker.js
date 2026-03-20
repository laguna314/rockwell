const ACCEDO_API_BASE = "https://accedotickets.com";

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