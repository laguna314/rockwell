import type { PublicTicketType } from "../lib/accedo";
import type { OrderPricing } from "../lib/pricing";

type Props = {
    ticketTypes: PublicTicketType[];
    quantities: Record<string, number>;
    onQuantityChange: (ticketTypeId: string, quantity: number) => void;
    pricing: OrderPricing;
};

function formatPrice(cents?: number | null) {
    if (cents == null) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
}

function clampQuantity(qty: number) {
    return Math.max(0, qty);
}

export default function TicketSelector({
    ticketTypes,
    quantities,
    onQuantityChange,
    pricing,
}: Props) {
    const { subtotalCents, serviceFeeCents, processingFeeCents, totalCents } =
        pricing;

    return (
        <div className="ticket-selector">
            {ticketTypes.map((tt) => {
                const qty = quantities[tt.id] || 0;
                const price = tt.priceCents ?? 0;
                const lineTotalCents = price * qty;

                return (
                    <div key={tt.id} className="ticket-row">
                        <div className="ticket-row-inline">
                            <div className="ticket-row-main">
                                <div className="ticket-row-name-wrap">
                                    <div className="ticket-row-name">
                                        {tt.name}
                                    </div>

                                    {tt.description && (
                                        <div className="ticket-row-sub">
                                            {tt.description}
                                        </div>
                                    )}

                                    {qty > 0 && (
                                        <div className="ticket-row-line-total">
                                            {qty} × {formatPrice(price)} ={" "}
                                            {formatPrice(lineTotalCents)}
                                        </div>
                                    )}
                                </div>

                                <div className="ticket-row-price">
                                    {formatPrice(price)}
                                </div>
                            </div>

                            <div className="ticket-row-controls">
                                <button
                                    type="button"
                                    className="ticket-stepper-btn"
                                    onClick={() =>
                                        onQuantityChange(
                                            tt.id,
                                            clampQuantity(qty - 1)
                                        )
                                    }
                                    disabled={qty <= 0}
                                >
                                    −
                                </button>

                                <div className="ticket-qty-pill">{qty}</div>

                                <button
                                    type="button"
                                    className="ticket-stepper-btn"
                                    onClick={() =>
                                        onQuantityChange(tt.id, qty + 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {totalCents > 0 && (
                <div className="event-detail-card event-detail-card-glass">
                    <div className="summary-row">
                        <span>Tickets</span>
                        <span>{formatPrice(subtotalCents)}</span>
                    </div>

                    <div className="summary-row">
                        <span>Platform Fee</span>
                        <span>{formatPrice(serviceFeeCents)}</span>
                    </div>

                    <div className="summary-row">
                        <span>Processing Fee</span>
                        <span>{formatPrice(processingFeeCents)}</span>
                    </div>

                    <div className="event-detail-total-row">
                        <strong>Total</strong>
                        <strong>{formatPrice(totalCents)}</strong>
                    </div>
                </div>
            )}
        </div>
    );
}
