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
        <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                {ticketTypes.map((tt, index) => {
                    const qty = quantities[tt.id] || 0;
                    const basePriceCents = tt.price_cents ?? 0;

                    return (
                        <div
                            key={tt.id}
                            className={`flex items-center justify-between gap-4 px-4 py-4 ${
                                index !== ticketTypes.length - 1
                                    ? "border-b border-white/10"
                                    : ""
                            }`}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="truncate text-sm font-semibold text-white">
                                        {tt.name}
                                    </span>
                                    <span className="whitespace-nowrap text-sm text-white/75">
                                        {formatPrice(basePriceCents)}
                                    </span>
                                </div>

                                {tt.description ? (
                                    <p className="mt-1 text-xs text-white/50">
                                        {tt.description}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    className="h-9 w-9 rounded-full border border-white/15 bg-white/5 text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                    onClick={() =>
                                        onQuantityChange(
                                            tt.id,
                                            clampQuantity(qty - 1)
                                        )
                                    }
                                    disabled={qty <= 0}
                                    aria-label={`Decrease ${tt.name}`}
                                >
                                    −
                                </button>

                                <div className="w-8 text-center text-sm font-medium text-white">
                                    {qty}
                                </div>

                                <button
                                    type="button"
                                    className="h-9 w-9 rounded-full border border-white/15 bg-white/5 text-lg text-white transition hover:bg-white/10"
                                    onClick={() =>
                                        onQuantityChange(tt.id, qty + 1)
                                    }
                                    aria-label={`Increase ${tt.name}`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-white/80">
                        <span>Tickets</span>
                        <span>{formatPrice(subtotalCents)}</span>
                    </div>

                    <div className="my-2 border-t border-white/10" />

                    <div className="flex items-center justify-between text-white/70">
                        <span>Platform Fee</span>
                        <span>{formatPrice(serviceFeeCents)}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/70">
                        <span>Processing Fee</span>
                        <span>{formatPrice(processingFeeCents)}</span>
                    </div>

                    <div className="pt-2 border-t border-white/10" />

                    <div className="flex items-center justify-between text-base font-semibold text-white">
                        <span>Total</span>
                        <span>{formatPrice(totalCents)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}