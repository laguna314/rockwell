import { useState } from "react";

type FormState = {
    inquiryType: string;
    fullName: string;
    email: string;
    phone: string;
    organization: string;
    preferredDate: string;
    guestCount: string;
    message: string;
    website: string;
};

const initialState: FormState = {
    inquiryType: "show",
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    preferredDate: "",
    guestCount: "",
    message: "",
    website: "",
};

export default function Contact() {
    const [form, setForm] = useState<FormState>(initialState);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    const messagePlaceholder =
        form.inquiryType === "show"
            ? "Tell us about the artist, genre, expected draw, preferred date, and any production needs."
            : form.inquiryType === "private"
              ? "Tell us about the occasion, preferred date, estimated attendance, and anything else we should know."
              : form.inquiryType === "corporate"
                ? "Tell us about your company, event goals, preferred date, setup needs, and guest count."
                : "How can we help?";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Failed to send inquiry");
            }

            setSuccess(
                "Thanks! Your message has been sent. We’ll be in touch soon."
            );
            setForm(initialState);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while sending your inquiry."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container">
            <section className="section contact-page">
                <div className="contact-hero">
                    <div className="pill-label">Rockwell Event Center</div>
                    <h1 className="contact-title">Contact & Rental Inquiry</h1>
                    <p className="contact-subtitle">
                        Have a question or want to rent the venue for a show,
                        private event, or corporate gathering? Send us the
                        details below and we’ll get back to you.
                    </p>
                </div>

                <div className="contact-layout">
                    <div className="contact-card contact-card-glass">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <input
                                type="text"
                                value={form.website}
                                onChange={(e) =>
                                    update("website", e.target.value)
                                }
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                className="contact-honeypot"
                            />

                            <div className="contact-form-grid">
                                <div className="contact-field contact-field-full">
                                    <label htmlFor="inquiryType">
                                        Inquiry Type
                                    </label>
                                    <select
                                        id="inquiryType"
                                        value={form.inquiryType}
                                        onChange={(e) =>
                                            update(
                                                "inquiryType",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="show">
                                            Book a Show
                                        </option>
                                        <option value="private">
                                            Private Event
                                        </option>
                                        <option value="corporate">
                                            Corporate Event
                                        </option>
                                        <option value="general">
                                            General Question
                                        </option>
                                    </select>
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        required
                                        value={form.fullName}
                                        onChange={(e) =>
                                            update("fullName", e.target.value)
                                        }
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) =>
                                            update("email", e.target.value)
                                        }
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            update("phone", e.target.value)
                                        }
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="organization">
                                        Organization / Company
                                    </label>
                                    <input
                                        id="organization"
                                        type="text"
                                        value={form.organization}
                                        onChange={(e) =>
                                            update(
                                                "organization",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="preferredDate">
                                        Preferred Event Date
                                    </label>
                                    <input
                                        id="preferredDate"
                                        type="date"
                                        value={form.preferredDate}
                                        onChange={(e) =>
                                            update(
                                                "preferredDate",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="guestCount">
                                        Estimated Guest Count
                                    </label>
                                    <input
                                        id="guestCount"
                                        type="number"
                                        min="1"
                                        value={form.guestCount}
                                        onChange={(e) =>
                                            update("guestCount", e.target.value)
                                        }
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="contact-field contact-field-full">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={7}
                                        value={form.message}
                                        onChange={(e) =>
                                            update("message", e.target.value)
                                        }
                                        placeholder={messagePlaceholder}
                                    />
                                </div>
                            </div>

                            {success ? (
                                <div className="contact-alert contact-alert-success">
                                    {success}
                                </div>
                            ) : null}

                            {error ? (
                                <div className="contact-alert contact-alert-error">
                                    {error}
                                </div>
                            ) : null}

                            <div className="contact-actions">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn primary"
                                >
                                    {loading ? "Sending..." : "Send Inquiry"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <aside className="contact-side">
                        <div className="find-card">
                            <div className="find-title">What to send us</div>
                            <div className="contact-side-list muted">
                                <div>• Type of event or question</div>
                                <div>• Preferred date or timeframe</div>
                                <div>• Estimated attendance</div>
                                <div>
                                    • Artist, company, or occasion details
                                </div>
                                <div>• Any setup or production needs</div>
                            </div>
                        </div>

                        <div className="find-card">
                            <div className="find-title">Best for</div>
                            <div className="contact-badges">
                                <span className="badge">Live Shows</span>
                                <span className="badge">Private Events</span>
                                <span className="badge badge-accent">
                                    Corporate Events
                                </span>
                                <span className="badge">
                                    Community Gatherings
                                </span>
                            </div>
                        </div>

                        <div className="rentals-photo">
                            <img
                                src="/venue/rockwell5.jpg"
                                alt="Rockwell Event Center interior"
                                loading="lazy"
                            />
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
