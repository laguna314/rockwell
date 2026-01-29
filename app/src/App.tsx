import { useEffect, useState } from "react";
import Header from "./components/Header";
import EventCard from "./components/EventCard";

type Event = {
  id: string;
  title: string;
  dateISO: string;
  posterUrl: string;
  alcoholWristbandsRequired?: boolean;
};

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(setEvents);
  }, []);

  return (
    <div className="app">
      <Header />

      <main className="container">
        <img src="/ROCKWELL-01.png" className="logo" />

        <h1>Amarillo’s Home for Live Music</h1>
        <p className="subhead">Concerts • Special Events • Private Rentals</p>

        <section>
          <h2>Upcoming Shows</h2>
          <div className="grid">
            {events.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
