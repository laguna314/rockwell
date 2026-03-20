import type { PublicTicketType } from "../lib/accedo";
import { formatCurrency } from "../lib/format";

type Props = {
  ticketTypes: PublicTicketType[];
  quantities: Record<string, number>;
  onQuantityChange: (ticketTypeId: string, quantity: number) => void;
};

export default function TicketSelector({
  ticketTypes,
  quantities,
  onQuantityChange,
}: Props) {
  return (
    <div className="space-y-4">
      {ticketTypes.map((tt) => (
        <div
          key={tt.id}
          className="flex items-center justify-between rounded-xl border border-white/10 p-4"
        >
          <div>
            <div className="font-semibold">{tt.name}</div>
            <div>{formatCurrency(tt.priceCents)}</div>
            <div>{tt.isAvailable ? `${tt.remaining} left` : "Sold Out"}</div>
          </div>

          <input
            type="number"
            min={0}
            max={tt.remaining}
            value={quantities[tt.id] || 0}
            disabled={!tt.isAvailable}
            onChange={(e) =>
              onQuantityChange(tt.id, Math.max(0, Number(e.target.value || 0)))
            }
            className="w-20 rounded border px-2 py-1 text-black"
          />
        </div>
      ))}
    </div>
  );
}