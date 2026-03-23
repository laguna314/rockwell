import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import SectionTitle from "../components/SectionTitle";
import Placeholder from "../components/Placeholder";
import { getRockwellEvents, type PublicVenueEvent } from "../lib/accedo";

export default function EventsPage() {
    const [events, setEvents] = useState<PublicVenueEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getRockwellEvents()
            .then((data) => setEvents(data))
            .catch((err) => {
                console.error("Failed to load events", err);
                setError("Failed to load events");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app">

            <main className="container">
                <section className="section">
                    <SectionTitle
                        title="All Upcoming Events"
                        subtitle="Browse everything happening at Rockwell."
                    />

                    {error ? (
                        <div className="muted">{error}</div>
                    ) : loading ? (
                        <div className="grid">
                            <Placeholder label="EVENT CARD" height={360} />
                            <Placeholder label="EVENT CARD" height={360} />
                            <Placeholder label="EVENT CARD" height={360} />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="muted">No upcoming events.</div>
                    ) : (
                        <div className="grid">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}