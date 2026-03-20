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
        const [eventData, ticketData] = await Promise.all([
          getEventBySlug(slug),
          getTicketTypesBySlug(slug),
        ]);

        setEvent(eventData);
        setTicketTypes(ticketData);
      } catch (err: any) {
        setError(err?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  function onQuantityChange(ticketTypeId: string, quantity: number) {
    setQuantities((prev) => ({
      ...prev,
      [ticketTypeId]: quantity,
    }));
  }

  async function onCheckout() {
    if (!event) return;

    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([ticketTypeId, quantity]) => ({
        ticketTypeId,
        quantity,
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
        cancelUrl: `${window.location.origin}${location.pathname}`,
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
        disabled={buying}
        className="rounded-xl border px-6 py-3"
      >
        {buying ? "Redirecting..." : "Buy Tickets"}
      </button>
    </section>
  );
}