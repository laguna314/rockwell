import { useMemo } from "react";

export default function SuccessPage() {
    const sessionId = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("session_id");
    }, []);

    return (
        <section className="mx-auto max-w-3xl space-y-6 p-8 text-center">
            <h1 className="text-4xl font-bold">Purchase Complete</h1>

            <p>Your order was submitted successfully.</p>
            <p>Please check your email for your tickets and wallet delivery.</p>

            {sessionId ? (
                <p className="text-sm opacity-70">
                    Confirmation reference: {sessionId}
                </p>
            ) : null}

            <div className="flex justify-center gap-3 pt-4">
                <a className="btn primary" href="/events">
                    View More Events
                </a>
                <a className="btn outline" href="/">
                    Back to Home
                </a>
            </div>
        </section>
    );
}
