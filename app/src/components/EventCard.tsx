import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { PublicVenueEvent } from "../lib/accedo";

function formatShort(iso?: string | null) {
    if (!iso) return "Date TBA";

    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Date TBA";

    return d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function formatPrice(cents?: number | null) {
    if (cents == null) return "See details";
    return `$${(cents / 100).toFixed(2)}`;
}

type EventCardProps = {
    event: PublicVenueEvent;
};

export default function EventCard({ event }: EventCardProps) {
    const when = useMemo(() => formatShort(event.dateISO), [event.dateISO]);

    const venueName = event.venue?.name || "Rockwell Event Center";
    const venueCity = event.venue?.city || "Amarillo";
    const venueState = event.venue?.state || "TX";

    const hasTickets = event.hasTicketsAvailable !== false;

    return (
        <article className="event-card">
            <div className="event-media">
                <img
                    src={event.poster_url || "/posters/example.jpg"}
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                />
                <div className="event-media-overlay" />

                <div className="event-tags">
                    <span className="tag">{when}</span>
                    {event.agePolicy ? (
                        <span className="tag tag-accent">
                            {event.agePolicy}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="event-body">
                <h3 className="event-title">{event.title}</h3>

                <div className="event-meta">
                    <span className="meta-dot" />
                    <span>{venueName}</span>
                    <span className="meta-sep">•</span>
                    <span>
                        {venueCity}, {venueState}
                    </span>
                </div>

                <div className="event-price">
                    Starting at {formatPrice(event.startingPriceCents)}
                </div>

                <div className="event-actions">
                    <Link className="btn primary" to={`/events/${event.slug}`}>
                        {hasTickets ? "Buy Tickets" : "Sold Out"}
                    </Link>

                    <Link className="btn outline" to={`/events/${event.slug}`}>
                        Details
                    </Link>
                </div>
            </div>
        </article>
    );
}
