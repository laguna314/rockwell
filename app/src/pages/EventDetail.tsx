import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import TicketSelector from "../components/TicketSelector";
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
                setError("");
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
        setQuantities((prev: Record<string, number>) => ({
            ...prev,
            [ticketTypeId]: Math.max(0, quantity),
        }));
    }

    async function onCheckout() {
        if (!event) return;

        const items: { ticketTypeId: string; quantity: number }[] =
            Object.entries(quantities as Record<string, number>)
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

    if (loading) return <div className="p-8">Loading event...</div>;
    if (error && !event) return <div className="p-8">{error}</div>;
    if (!event) return <div className="p-8">Event not found.</div>;

    return (
        <section className="mx-auto max-w-5xl space-y-6 p-6">
            {event.poster_url ? (
                <img
                    src={event.poster_url}
                    alt={event.title}
                    className="max-h-[520px] w-full rounded-2xl object-cover"
                />
            ) : null}

            <div className="space-y-2">
                <h1 className="text-4xl font-bold">{event.title}</h1>
                <p>{formatDateTime(event.dateISO)}</p>
                <p>{event.agePolicy || "See details"}</p>
                <p>{event.venue.name}</p>
            </div>

            <div>
                <p>{event.description}</p>
            </div>

            <TicketSelector
                ticketTypes={ticketTypes}
                quantities={quantities}
                onQuantityChange={onQuantityChange}
            />

            {error ? <div>{error}</div> : null}

            <button
                onClick={onCheckout}
                disabled={buying || !hasAvailableTickets}
                className="rounded-xl border px-6 py-3"
            >
                {buying
                    ? "Redirecting..."
                    : hasAvailableTickets
                      ? "Buy Tickets"
                      : "Sold Out"}
            </button>
        </section>
    );
}
