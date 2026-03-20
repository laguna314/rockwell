import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { getRockwellEvents, type PublicVenueEvent } from "../lib/accedo";

export default function EventsPage() {
  const [events, setEvents] = useState<PublicVenueEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRockwellEvents()
      .then(setEvents)
      .catch((err) => setError(err.message || "Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading events...</div>;
  if (error) return <div className="p-8">{error}</div>;
  if (!events.length) return <div className="p-8">No upcoming events.</div>;

  return (
    <section className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-4xl font-bold">Upcoming Events</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}