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
        <section className="mx-auto max-w-4xl px-6 py-14">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    Contact Rockwell Event Center
                </h1>
                <p className="mt-3 max-w-2xl text-base opacity-80">
                    Have a question or want to rent the venue? Send us a message
                    below.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                    <input
                        type="text"
                        value={form.website}
                        onChange={(e) => update("website", e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="hidden"
                    />

                    <div className="md:col-span-2">
                        <label
                            htmlFor="inquiryType"
                            className="mb-2 block text-sm font-medium"
                        >
                            Inquiry Type
                        </label>
                        <select
                            id="inquiryType"
                            value={form.inquiryType}
                            onChange={(e) =>
                                update("inquiryType", e.target.value)
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                        >
                            <option value="show">Book a Show</option>
                            <option value="private">Private Event</option>
                            <option value="corporate">Corporate Event</option>
                            <option value="general">General Question</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-medium"
                        >
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            required
                            value={form.fullName}
                            onChange={(e) => update("fullName", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium"
                        >
                            Phone
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="organization"
                            className="mb-2 block text-sm font-medium"
                        >
                            Organization / Company
                        </label>
                        <input
                            id="organization"
                            type="text"
                            value={form.organization}
                            onChange={(e) =>
                                update("organization", e.target.value)
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="preferredDate"
                            className="mb-2 block text-sm font-medium"
                        >
                            Preferred Event Date
                        </label>
                        <input
                            id="preferredDate"
                            type="date"
                            value={form.preferredDate}
                            onChange={(e) =>
                                update("preferredDate", e.target.value)
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="guestCount"
                            className="mb-2 block text-sm font-medium"
                        >
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
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                            placeholder="Optional"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="message"
                            className="mb-2 block text-sm font-medium"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            required
                            rows={6}
                            value={form.message}
                            onChange={(e) => update("message", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                            placeholder={messagePlaceholder}
                        />
                    </div>

                    {success ? (
                        <div className="md:col-span-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">
                            {success}
                        </div>
                    ) : null}

                    {error ? (
                        <div className="md:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
                            {error}
                        </div>
                    ) : null}

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Inquiry"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}