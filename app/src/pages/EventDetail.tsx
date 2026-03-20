import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import TicketSelector from "../components/TicketSelector";
import SectionTitle from "../components/SectionTitle";
import {
    createCheckoutSession,
    getEventBySlug,
    getTicketTypesBySlug,
    type PublicEventDetail,
    type PublicTicketType,
} from "../lib/accedo";
import { formatDateTime } from "../lib/format";

export default function EventDetailPage() {
    const { slug = "" } = useParams();
    const location = useLocation();

    const [event, setEvent] = useState<PublicEventDetail | null>(null);
    const [ticketTypes, setTicketTypes] = useState<PublicTicketType[]>([]);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                const [eventData, ticketData] = await Promise.all([
                    getEventBySlug(slug),
                    getTicketTypesBySlug(slug),
                ]);

                setEvent(eventData);
                setTicketTypes(ticketData);
            } catch (err: any) {
                setError(err?.message || "Failed to load event");
                setEvent(null);
                setTicketTypes([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    function onQuantityChange(ticketTypeId: string, quantity: number) {
        setQuantities((prev) => ({
            ...prev,
            [ticketTypeId]: Math.max(0, quantity),
        }));
    }

    async function onCheckout() {
        if (!event) return;

        const items = Object.entries(quantities)
            .filter(([, quantity]) => Number(quantity) > 0)
            .map(([ticketTypeId, quantity]) => ({
                ticketTypeId,
                quantity: Number(quantity),
            }));

        if (!items.length) {
            setError("Please select at least one ticket.");
            return;
        }

        try {
            setBuying(true);
            setError("");

            const result = await createCheckoutSession({
                eventId: event.id,
                items,
                cancelUrl: `${window.location.origin}${location.pathname}${location.search}`,
            });

            if (result?.url) {
                window.location.href = result.url;
            } else {
                setError("Missing checkout URL.");
            }
        } catch (err: any) {
            setError(err?.message || "Checkout failed.");
        } finally {
            setBuying(false);
        }
    }

    const hasAvailableTickets = ticketTypes.some((tt) => tt.isAvailable);

    const selectedTotalCents = ticketTypes.reduce((sum, tt) => {
        const qty = quantities[tt.id] || 0;
        return sum + qty * (tt.price_cents || 0);
    }, 0);

    return (
        <div className="app">
            <Header />

            <main className="container">
                <section className="section">
                    <div style={{ marginBottom: "1rem" }}>
                        <Link to="/events" className="link">
                            ← Back to events
                        </Link>
                    </div>

                    {loading ? (
                        <div className="muted">Loading event...</div>
                    ) : error && !event ? (
                        <div className="muted">{error}</div>
                    ) : !event ? (
                        <div className="muted">Event not found.</div>
                    ) : (
                        <>
                            <SectionTitle
                                title={event.title}
                                subtitle={`${formatDateTime(event.dateISO)} • ${event.agePolicy || "See details"}`}
                            />

                            <div className="event-detail-grid">
                                <div className="event-detail-main">
                                    {event.poster_url ? (
                                        <div className="event-detail-poster-wrap">
                                            <img
                                                src={event.poster_url}
                                                alt={event.title}
                                                className="event-detail-poster"
                                            />
                                        </div>
                                    ) : null}

                                    <div className="event-detail-card event-detail-card-glass">
                                        <div className="pill-label">
                                            About This Event
                                        </div>
                                        <p className="event-detail-description">
                                            {event.description ||
                                                "More event details coming soon."}
                                        </p>
                                    </div>
                                </div>

                                <aside className="event-detail-side">
                                    <div className="event-detail-card event-detail-card-glass">
                                        <div className="pill-label">
                                            Event Details
                                        </div>

                                        <div className="event-detail-meta">
                                            <div>
                                                <strong>Date:</strong>{" "}
                                                {formatDateTime(event.dateISO)}
                                            </div>
                                            <div>
                                                <strong>Venue:</strong>{" "}
                                                {event.venue?.name ||
                                                    "Rockwell Event Center"}
                                            </div>
                                            <div>
                                                <strong>Location:</strong>{" "}
                                                {event.venue?.city ||
                                                    "Amarillo"}
                                                , {event.venue?.state || "TX"}
                                            </div>
                                            <div>
                                                <strong>Policy:</strong>{" "}
                                                {event.agePolicy ||
                                                    "See details"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="event-detail-card event-detail-ticket-card">
                                        <div className="pill-label pill-label-accent">
                                            Tickets
                                        </div>

                                        <TicketSelector
                                            ticketTypes={ticketTypes}
                                            quantities={quantities}
                                            onQuantityChange={onQuantityChange}
                                        />

                                        {error ? (
                                            <div className="event-detail-inline-error">
                                                {error}
                                            </div>
                                        ) : null}

                                        <div className="event-detail-buy-wrap">
                                                        {selectedTotalCents > && (<div className="event-detail-total-row">
                                                            <span>Order Total</span>
                                                            <strong>
                                                                $
                                                                {(
                                                                    selectedTotalCents / 100
                                                                ).toFixed(2)}
                                                            </strong>
                                                        </div>
                                                        )}
                                            <button
                                                onClick={onCheckout}
                                                disabled={
                                                    buying ||
                                                    !hasAvailableTickets
                                                }
                                                className="event-detail-buy-btn rockwell-checkout-btn"
                                            >
                                                {buying
                                                    ? "Redirecting to Secure Checkout..."
                                                    : hasAvailableTickets
                                                      ? "Secure Checkout"
                                                      : "Sold Out"}
                                            </button>

                                            {hasAvailableTickets ? (
                                                <div className="secure-checkout-note">
                                                    Secure checkout powered by
                                                    Accedo Tickets
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </>
                    )}
                </section>

                <footer className="footer">
                    <div className="footer-left">
                        <div className="footer-brand">
                            Rockwell Event Center
                        </div>
                        <div className="muted">
                            Amarillo, TX • Live Music • Rentals
                        </div>
                    </div>
                    <div className="footer-links">
                        <Link to="/events">Events</Link>
                        <Link to="/book">Book</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
