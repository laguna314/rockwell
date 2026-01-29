import { useMemo, useState } from "react";

function formatShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function EventCard({ event }: any) {
  const [open, setOpen] = useState(false);

  const wristbands = !!event.alcoholWristbandsRequired;

  const when = useMemo(() => {
    try {
      return formatShort(event.dateISO);
    } catch {
      return "Date TBA";
    }
  }, [event.dateISO]);

  return (
    <>
      <article className="event-card">
        <div className="event-media">
          <img src={event.posterUrl} alt={event.title} loading="lazy" />
          <div className="event-media-overlay" />

          <div className="event-tags">
            <span className="tag">{when}</span>
            {wristbands && <span className="tag tag-accent">Alcohol wristbands</span>}
          </div>
        </div>

        <div className="event-body">
          <h3 className="event-title">{event.title}</h3>

          <div className="event-meta">
            <span className="meta-dot" />
            <span>Rockwell Event Center</span>
            <span className="meta-sep">•</span>
            <span>Amarillo, TX</span>
          </div>

          <div className="event-actions">
            <button className="btn primary" onClick={() => setOpen(true)}>
              Buy Tickets
            </button>
            <a className="btn outline" href={`/events/${event.slug ?? ""}`}>
              Details
            </a>
          </div>

          {wristbands && (
            <p className="event-note">
              Alcohol policy: wristbands required to purchase/consume alcohol. Valid ID required for a 21+ wristband.
            </p>
          )}
        </div>
      </article>

      {open && (
        <div
          className="checkout-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Secure checkout"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="checkout-sheet">
            <div className="checkout-header">
              <div>
                <div className="checkout-kicker">Secure Checkout</div>
                <div className="checkout-title">{event.title}</div>
                <div className="checkout-sub">
                  Ticket purchase powered by Stripe (placeholder)
                </div>
              </div>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="checkout-grid">
              <div className="checkout-left">
                <div className="summary">
                  <div className="summary-row">
                    <span className="muted">Date</span>
                    <span>{event.dateISO ? new Date(event.dateISO).toLocaleString() : "TBA"}</span>
                  </div>
                  <div className="summary-row">
                    <span className="muted">Venue</span>
                    <span>Rockwell Event Center</span>
                  </div>
                  {wristbands && (
                    <div className="summary-note">
                      Wristbands required for alcohol. Valid ID required for 21+ wristband.
                    </div>
                  )}
                </div>

                <div className="poster-mini">
                  <img src={event.posterUrl} alt={`${event.title} poster`} />
                </div>
              </div>

              <div className="checkout-right">
                {/* STRIPE PLACEHOLDER AREA */}
                <div className="stripe-shell">
                  <div className="stripe-title">Payment</div>
                  <div className="stripe-ph">
                    [Stripe Payment Element mounts here]
                  </div>
                  <div className="stripe-ph small">[Email / billing fields]</div>
                  <div className="stripe-ph small">[Pay button]</div>
                  <div className="stripe-foot">
                    This is a placeholder. Replace with your Payment Element + confirmPayment flow.
                  </div>
                </div>

                <div className="checkout-actions">
                  <button className="btn outline" onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn primary" onClick={() => setOpen(false)}>
                    Close Placeholder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
