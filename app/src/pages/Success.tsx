import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchOrderBySession } from "../lib/accedo";
import { formatDateTime } from "../lib/format";

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 12;

export default function Success() {
    const [params] = useSearchParams();
    const sessionId = useMemo(() => params.get("session_id") ?? "", [params]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<null | Awaited<
        ReturnType<typeof fetchOrderBySession>
    >>(null);
    const [pollCount, setPollCount] = useState(0);

    useEffect(() => {
        setPollCount(0);
    }, [sessionId]);

    useEffect(() => {
        if (!sessionId) return;

        let alive = true;
        let timer: number | undefined;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchOrderBySession(sessionId);
                console.log("rockwell success order", data);

                if (!alive) return;

                setOrder(data);

                const tickets = Array.isArray(data?.tickets) ? data.tickets : [];

                const hasPerTicketLinks = tickets.some(
                    (t) =>
                        !!t.appleWalletUrl ||
                        !!t.googleWalletUrl ||
                        !!t.pdfUrl ||
                        !!t.passUrl
                );

                const hasLinks =
                    !!data.appleWalletUrl ||
                    !!data.googleWalletUrl ||
                    !!data.pdfUrl ||
                    hasPerTicketLinks;

                if (data.status === "paid" && hasLinks) {
                    return;
                }

                if (pollCount >= MAX_POLL_ATTEMPTS) {
                    return;
                }

                timer = window.setTimeout(() => {
                    setPollCount((c) => c + 1);
                }, POLL_INTERVAL_MS);
            } catch (e: any) {
                if (!alive) return;
                console.error("success page load error", e);
                setError(e?.message || "Failed to load order");
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();

        return () => {
            alive = false;
            if (timer) clearTimeout(timer);
        };
    }, [sessionId, pollCount]);

    const tickets = Array.isArray(order?.tickets) ? order.tickets : [];
    const hasTicketList = tickets.length > 0;

    const hasAnyTicketLinks = hasTicketList
        ? tickets.some((t) => !!t.appleWalletUrl || !!t.googleWalletUrl)
        : false;

    const hasWalletLinks =
        hasAnyTicketLinks ||
        !!order?.appleWalletUrl ||
        !!order?.googleWalletUrl;

    const hasPdf = !!order?.pdfUrl;

    return (
        <main className="container">
            <section className="section">
                <div style={{ marginBottom: "1rem" }}>
                    <Link to="/events" className="link">
                        ← Back to events
                    </Link>
                </div>

                <div className="event-detail-card event-detail-card-glass">
                    <div className="pill-label pill-label-accent">
                        Order Confirmed
                    </div>

                    <h1 className="h2" style={{ marginTop: "0.5rem" }}>
                        Your tickets are being prepared
                    </h1>

                    <p className="p" style={{ marginTop: "0.75rem" }}>
                        Add them to your wallet for the fastest entry. PDF is
                        available as a backup.
                    </p>

                    {!sessionId ? (
                        <p className="muted" style={{ marginTop: "1.5rem" }}>
                            No session ID found. Please return to Events and try again.
                        </p>
                    ) : loading && !order ? (
                        <p className="muted" style={{ marginTop: "1.5rem" }}>
                            Loading your order…
                        </p>
                    ) : error ? (
                        <p className="muted" style={{ marginTop: "1.5rem" }}>
                            {error}
                        </p>
                    ) : order ? (
                        <>
                            <div
                                className="event-detail-card"
                                style={{ marginTop: "1.5rem" }}
                            >
                                <div className="event-detail-meta">
                                    <div>
                                        <strong>Event:</strong> {order.eventTitle || "Event"}
                                    </div>
                                    <div>
                                        <strong>Date:</strong>{" "}
                                        {order.dateISO ? formatDateTime(order.dateISO) : "TBA"}
                                    </div>
                                    <div>
                                        <strong>Venue:</strong> {order.venue || "Rockwell Event Center"}
                                    </div>
                                    <div>
                                        <strong>Receipt sent to:</strong> {order.email ?? "—"}
                                    </div>
                                    <div>
                                        <strong>Status:</strong> {order.status || "pending"}
                                    </div>
                                </div>
                            </div>

                            {order.status !== "paid" && pollCount < MAX_POLL_ATTEMPTS ? (
                                <div
                                    className="muted"
                                    style={{ marginTop: "1rem", fontSize: "0.9rem" }}
                                >
                                    Syncing tickets… ({pollCount + 1}/{MAX_POLL_ATTEMPTS})
                                </div>
                            ) : null}

                            {hasWalletLinks || hasPdf ? (
                                <div
                                    style={{
                                        display: "grid",
                                        gap: "1rem",
                                        marginTop: "1.5rem",
                                    }}
                                >
                                    {hasTicketList ? (
                                        <div style={{ display: "grid", gap: "1rem" }}>
                                            {tickets.map((t, idx) => {
                                                const label = `Ticket ${t.index ?? idx + 1}`;
                                                const apple = t.appleWalletUrl ?? null;
                                                const google = t.googleWalletUrl ?? null;

                                                return (
                                                    <div
                                                        key={t.ticketId ?? idx}
                                                        className="event-detail-card"
                                                    >
                                                        <div
                                                            style={{
                                                                fontWeight: 800,
                                                                marginBottom: "0.9rem",
                                                            }}
                                                        >
                                                            {label}
                                                        </div>

                                                        <div
                                                            style={{
                                                                display: "grid",
                                                                gap: "0.75rem",
                                                                gridTemplateColumns:
                                                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                                            }}
                                                        >
                                                            <a
                                                                className={`btn primary ${apple ? "" : "disabled-link"}`}
                                                                href={apple ?? "#"}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                aria-disabled={!apple}
                                                            >
                                                                Add to Apple Wallet
                                                            </a>

                                                            <a
                                                                className={`btn outline ${google ? "" : "disabled-link"}`}
                                                                href={google ?? "#"}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                aria-disabled={!google}
                                                            >
                                                                Add to Google Wallet
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                display: "grid",
                                                gap: "0.75rem",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                            }}
                                        >
                                            <a
                                                className={`btn primary ${order.appleWalletUrl ? "" : "disabled-link"}`}
                                                href={order.appleWalletUrl ?? "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-disabled={!order.appleWalletUrl}
                                            >
                                                Add to Apple Wallet
                                            </a>

                                            <a
                                                className={`btn outline ${order.googleWalletUrl ? "" : "disabled-link"}`}
                                                href={order.googleWalletUrl ?? "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-disabled={!order.googleWalletUrl}
                                            >
                                                Add to Google Wallet
                                            </a>
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            display: "grid",
                                            gap: "0.75rem",
                                            gridTemplateColumns:
                                                "repeat(auto-fit, minmax(220px, 1fr))",
                                        }}
                                    >
                                        <a
                                            className={`btn outline ${order.pdfUrl ? "" : "disabled-link"}`}
                                            href={order.pdfUrl ?? "#"}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-disabled={!order.pdfUrl}
                                        >
                                            Download PDF Backup
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="muted" style={{ marginTop: "1.5rem" }}>
                                    Links aren’t available yet. Refresh in a few seconds.
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="muted" style={{ marginTop: "1.5rem" }}>
                            No order found for this session.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}