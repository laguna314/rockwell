import type { PublicTicketType } from "../lib/accedo";

type Props = {
    ticketTypes: PublicTicketType[];
    quantities: Record<string, number>;
    onQuantityChange: (ticketTypeId: string, quantity: number) => void;
};

const SERVICE_FEE_CENTS = 125;

function formatPrice(cents?: number | null) {
    if (cents == null) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
}

function clampQuantity(qty: number) {
    return Math.max(0, qty);
}

function calculateSubtotalCents(
    ticketTypes: PublicTicketType[],
    quantities: Record<string, number>
) {
    return ticketTypes.reduce((sum, tt) => {
        const qty = quantities[tt.id] || 0;
        const price = tt.price_cents ?? 0;
        return sum + price * qty;
    }, 0);
}

function calculateTicketCount(quantities: Record<string, number>) {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
}

function calculateProcessingFeeCents(
    baseSubtotalCents: number,
    serviceFeeCents: number
) {
    const preProcessingCents = baseSubtotalCents + serviceFeeCents;
    if (preProcessingCents <= 0) return 0;

    return Math.ceil((0.029 * preProcessingCents + 30) / (1 - 0.029));
}

export default function TicketSelector({
    ticketTypes,
    quantities,
    onQuantityChange,
}: Props) {
    const subtotalCents = calculateSubtotalCents(ticketTypes, quantities);
    const ticketCount = calculateTicketCount(quantities);
    const serviceFeeCents = ticketCount * SERVICE_FEE_CENTS;

    const processingFeeCents = calculateProcessingFeeCents(
        subtotalCents,
        serviceFeeCents
    );

    const totalCents = subtotalCents + serviceFeeCents + processingFeeCents;

    return (
        <div className="ticket-selector">
            {ticketTypes.map((tt) => {
                const qty = quantities[tt.id] || 0;
                const price = tt.price_cents ?? 0;

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
                                </div>

                                <div className="ticket-row-price">
                                    {formatPrice(price)}
                                </div>
                            </div>

                            <div className="ticket-row-controls">
                                <button
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

                                <div className="ticket-qty-pill">
                                    {qty}
                                </div>

                                <button
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

            {/* SUMMARY */}
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