import type { PublicTicketType } from "../lib/accedo";

type Props = {
    ticketTypes: PublicTicketType[];
    quantities: Record<string, number>;
    onQuantityChange: (ticketTypeId: string, quantity: number) => void;
};

function formatPrice(cents?: number | null) {
    if (typeof cents !== "number") return "";
    return `$${(cents / 100).toFixed(2)}`;
}

export default function TicketSelector({
    ticketTypes,
    quantities,
    onQuantityChange,
}: Props) {
    if (!ticketTypes.length) {
        return (
            <div className="ticket-empty-state">
                No ticket types are available for this event yet.
            </div>
        );
    }

    return (
        <div className="ticket-selector">
            {ticketTypes.map((ticket) => {
                const quantity = quantities[ticket.id] || 0;
                const soldOut = !ticket.isAvailable;

                return (
                    <div
                        key={ticket.id}
                        className={`ticket-row ticket-row-inline ${soldOut ? "ticket-row-disabled" : ""}`}
                    >
                        <div className="ticket-row-main">
                            <div className="ticket-row-name-wrap">
                                <div className="ticket-row-name">
                                    {ticket.name}
                                </div>
                                {ticket.description && !soldOut ? (
                                    <div className="ticket-row-sub">
                                        {ticket.description}
                                    </div>
                                ) : soldOut ? (
                                    <div className="ticket-row-sub">
                                        Sold out
                                    </div>
                                ) : null}
                            </div>

                            <div className="ticket-row-price">
                                {soldOut
                                    ? "Sold out"
                                    : formatPrice(ticket.priceCents)}
                            </div>
                        </div>

                        <div className="ticket-row-controls">
                            <button
                                type="button"
                                className="ticket-stepper-btn"
                                onClick={() =>
                                    onQuantityChange(
                                        ticket.id,
                                        Math.max(0, quantity - 1)
                                    )
                                }
                                disabled={soldOut || quantity <= 0}
                                aria-label={`Decrease ${ticket.name}`}
                            >
                                −
                            </button>

                            <div className="ticket-qty-pill" aria-live="polite">
                                {quantity}
                            </div>

                            <button
                                type="button"
                                className="ticket-stepper-btn"
                                onClick={() =>
                                    onQuantityChange(ticket.id, quantity + 1)
                                }
                                disabled={soldOut}
                                aria-label={`Increase ${ticket.name}`}
                            >
                                +
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
