import { useState } from "react";

export default function EventCard({ event }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <img src={event.posterUrl} />
      <h3>{event.title}</h3>

      {event.alcoholWristbandsRequired && (
        <span className="badge">Alcohol wristbands</span>
      )}

      <button onClick={() => setOpen(true)}>Buy Tickets</button>

      {open && (
        <div className="modal">
          <div className="modal-inner">
            <h4>Stripe Payment Placeholder</h4>
            <p>
              Stripe Payment Element will be embedded here.
            </p>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
