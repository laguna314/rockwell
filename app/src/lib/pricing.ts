import type { PublicTicketType } from "./accedo";

const SERVICE_FEE_CENTS = 125;

export function calculateSubtotalCents(
  ticketTypes: PublicTicketType[],
  quantities: Record<string, number>
) {
  return ticketTypes.reduce((sum, tt) => {
    const qty = quantities[tt.id] || 0;
    const price = tt.priceCents ?? 0;
    return sum + price * qty;
  }, 0);
}

export function calculateTicketCount(quantities: Record<string, number>) {
  return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
}

export function calculateProcessingFeeCents(
  baseSubtotalCents: number,
  serviceFeeCents: number
) {
  const preProcessingCents = baseSubtotalCents + serviceFeeCents;
  if (preProcessingCents <= 0) return 0;

  return Math.ceil((0.029 * preProcessingCents + 30) / (1 - 0.029));
}

export function calculateOrderPricing(
  ticketTypes: PublicTicketType[],
  quantities: Record<string, number>
) {
  const subtotalCents = calculateSubtotalCents(ticketTypes, quantities);
  const ticketCount = calculateTicketCount(quantities);
  const serviceFeeCents = ticketCount * SERVICE_FEE_CENTS;
  const processingFeeCents = calculateProcessingFeeCents(
    subtotalCents,
    serviceFeeCents
  );
  const totalCents = subtotalCents + serviceFeeCents + processingFeeCents;

  return {
    subtotalCents,
    ticketCount,
    serviceFeeCents,
    processingFeeCents,
    totalCents,
  };
}