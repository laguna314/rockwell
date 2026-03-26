import type { PublicTicketType } from "./accedo";

const PLATFORM_FEE_CENTS = 125;
const SALES_TAX_RATE = 0.0625;

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
  platformFeeCents: number
) {
  const preProcessingCents = baseSubtotalCents + platformFeeCents;
  if (preProcessingCents <= 0) return 0;

  return Math.ceil((0.029 * preProcessingCents + 30) / (1 - 0.029));
}

export function calculateSalesTaxCents(
  taxableAmountCents: number
) {
  if (taxableAmountCents <= 0) return 0;
  return Math.round(taxableAmountCents * SALES_TAX_RATE);
}

export function calculateOrderPricing(
  ticketTypes: PublicTicketType[],
  quantities: Record<string, number>
) {
  const subtotalCents = calculateSubtotalCents(ticketTypes, quantities);
  const ticketCount = calculateTicketCount(quantities);

  const platformFeeCents = ticketCount * PLATFORM_FEE_CENTS;

  const processingFeeCents = calculateProcessingFeeCents(
    subtotalCents,
    platformFeeCents
  );

  const serviceFeesCents = platformFeeCents + processingFeeCents;

  const salesTaxCents = calculateSalesTaxCents(
    subtotalCents + serviceFeesCents
  );

  const totalCents = subtotalCents + serviceFeesCents + salesTaxCents;

  return {
    subtotalCents,
    ticketCount,
    platformFeeCents,
    processingFeeCents,
    serviceFeesCents,
    salesTaxCents,
    totalCents,
  };
}