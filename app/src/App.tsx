import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import EventCard from "./components/EventCard";
import Placeholder from "./components/Placeholder";
import SectionTitle from "./components/SectionTitle";

type Event = {
  id: string;
  slug: string;
  title: string;
  dateISO: string;
  posterUrl: string;
  alcoholWristbandsRequired?: boolean;
};

function formatLong(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const featured = useMemo(() => events[0] ?? null, [events]);

  return (
    <div className="app">
      <Header />

      {/* HERO */}
      <section className="hero">
        {/* Video/Photo placeholder */}
        <div className="hero-media" aria-hidden="true">
          <div className="hero-bg" />
        </div>

        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-brand">
            <img
              src="/ROCKWELL-01.png"
              className="logo"
              alt="Rockwell Event Center"
            />

            <h1 className="hero-title">Amarillo’s Home for Live Music</h1>
            <p className="hero-sub">
              Concerts • Special Events • Private Rentals
            </p>

            <div className="hero-cta">
              <a className="btn primary" href="#events">
                View Upcoming Shows
              </a>
              <a className="btn outline" href="#book">
                Book the Venue
              </a>
            </div>

            <div className="hero-badges">
              <span className="badge">All ages unless noted</span>
              <span className="badge badge-accent">Alcohol wristbands at select events</span>
              <span className="badge">Fast entry • Mobile tickets</span>
            </div>
          </div>

          {/* Right-side highlight card (stacked under on mobile) */}
          <div className="hero-panel">
            <div className="panel">
              <div className="panel-kicker">Featured</div>
              {featured ? (
                <>
                  <div className="panel-title">{featured.title}</div>
                  <div className="panel-meta">{formatLong(featured.dateISO)}</div>
                  <div className="panel-actions">
                    <a className="btn primary" href="#events">
                      Buy Tickets
                    </a>
                    <a className="btn outline" href={`/events/${featured.slug}`}>
                      Details
                    </a>
                  </div>
                  {featured.alcoholWristbandsRequired && (
                    <div className="panel-note">
                      Alcohol policy: wristbands required to purchase/consume alcohol. Valid ID required for 21+ wristband.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="panel-title">Next show spotlight</div>
                  <div className="panel-meta">Hook this to your next scheduled event</div>
                  <Placeholder label="FEATURED EVENT GRAPHIC (placeholder)" height={180} />
                  <div className="panel-actions">
                    <a className="btn primary" href="#events">Tickets</a>
                    <a className="btn outline" href="#events">Lineup</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* subtle “lights” gradient */}
        <div className="hero-glow" aria-hidden="true" />
      </section>

      <main className="container">

        {/* QUICK STATS */}
        <section className="stats">
          <div className="stat">
            <div className="stat-num">• • •</div>
            <div className="stat-label">Capacity (placeholder)</div>
          </div>
          <div className="stat">
            <div className="stat-num">Pro</div>
            <div className="stat-label">Sound + stage-ready</div>
          </div>
          <div className="stat">
            <div className="stat-num">Amarillo</div>
            <div className="stat-label">Local scene • Touring acts</div>
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section id="events" className="section">
          <SectionTitle
            title="Upcoming Shows"
            subtitle="Tickets are fast, mobile-friendly, and secure. Wristbands for alcohol at select events."
            right={<a className="link" href="/events">View all →</a>}
          />

          <div className="grid">
            {events.length ? (
              events.map((e) => <EventCard key={e.id} event={e} />)
            ) : (
              <>
                <Placeholder label="EVENT CARD (placeholder)" height={360} />
                <Placeholder label="EVENT CARD (placeholder)" height={360} />
                <Placeholder label="EVENT CARD (placeholder)" height={360} />
              </>
            )}
          </div>
        </section>

        {/* PHOTO STRIP */}
        <section className="section">
          <SectionTitle
            title="The Venue"
            subtitle="Drop real venue photos here. This strip sells the vibe instantly."
          />
          <div className="photo-strip">
            <Placeholder label="PHOTO 1 (placeholder)" height={180} />
            <Placeholder label="PHOTO 2 (placeholder)" height={180} />
            <Placeholder label="PHOTO 3 (placeholder)" height={180} />
            <Placeholder label="PHOTO 4 (placeholder)" height={180} />
          </div>
        </section>

        {/* WHY ROCKWELL */}
        <section className="section">
          <SectionTitle
            title="Why Rockwell"
            subtitle="Promoters, bands, and fans — this is what makes Rockwell hit different."
          />

          <div className="features">
            <div className="feature">
              <div className="feature-title">Stage-ready production</div>
              <div className="feature-text">
                Clean power, clean sound, and a layout that works for live shows.
                <span className="muted"> (Specs placeholder)</span>
              </div>
            </div>
            <div className="feature">
              <div className="feature-title">Fast entry + mobile tickets</div>
              <div className="feature-text">
                Embedded checkout and mobile-friendly scanning.
              </div>
            </div>
            <div className="feature">
              <div className="feature-title">Great for touring & locals</div>
              <div className="feature-text">
                From local showcases to touring nights — flexible setup.
              </div>
            </div>
            <div className="feature">
              <div className="feature-title">Alcohol wristband system</div>
              <div className="feature-text">
                Certain events require wristbands for alcohol. Valid ID required for a 21+ wristband.
              </div>
            </div>
            <div className="feature">
              <div className="feature-title">Parking / location</div>
              <div className="feature-text">
                Add real parking/location info here.
                <span className="muted"> (placeholder)</span>
              </div>
            </div>
            <div className="feature">
              <div className="feature-title">Community + special events</div>
              <div className="feature-text">
                Concerts, parties, corporate events, and community nights.
              </div>
            </div>
          </div>
        </section>

        {/* RENTALS */}
        <section id="book" className="section rentals">
          <div className="rentals-inner">
            <div>
              <h2 className="rentals-title">Private Rentals Available</h2>
              <p className="rentals-text">
                Need a space for a party, release show, corporate event, fundraiser, or community gathering?
                Tell us what you’re planning — we’ll respond fast.
              </p>

              <div className="rentals-actions">
                <a className="btn primary" href="/book">Start a Rental Inquiry</a>
                <a className="btn outline" href="/contact">Contact</a>
              </div>

              <div className="rentals-bullets">
                <div>• Flexible setup options</div>
                <div>• Staffed events (placeholder)</div>
                <div>• Add-ons available (placeholder)</div>
              </div>
            </div>

            <div className="rentals-media">
              <Placeholder label="RENTALS HERO IMAGE (placeholder)" height={320} />
              <div className="rentals-mini">
                <Placeholder label="FLOORPLAN / CAPACITY (placeholder)" height={140} />
                <Placeholder label="AMENITIES (placeholder)" height={140} />
              </div>
            </div>
          </div>
        </section>

        {/* EMAIL LIST */}
        <section className="section signup">
          <div className="signup-inner">
            <div>
              <h2 className="signup-title">Get show announcements</h2>
              <p className="signup-text">
                Be first to know about new shows, presales, and special events.
              </p>
            </div>
            <div className="signup-form">
              <Placeholder label="EMAIL SIGNUP FORM (placeholder)" height={92} />
              <div className="muted">Connect to your email tool later (Mailchimp, ConvertKit, etc.)</div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="section">
          <SectionTitle
            title="What people say"
            subtitle="Drop real quotes/reviews here when you have them."
          />
          <div className="quotes">
            <div className="quote">
              <div className="quote-text">“Best sound in town.”</div>
              <div className="quote-by">— Reviewer (placeholder)</div>
            </div>
            <div className="quote">
              <div className="quote-text">“The staff handled our event perfectly.”</div>
              <div className="quote-by">— Promoter (placeholder)</div>
            </div>
            <div className="quote">
              <div className="quote-text">“Rockwell brings the energy.”</div>
              <div className="quote-by">— Artist (placeholder)</div>
            </div>
          </div>
        </section>

        {/* SOCIAL FEED */}
        <section className="section">
          <SectionTitle
            title="From the feed"
            subtitle="Placeholder grid for Instagram / socials. Swap to embeds later."
            right={<a className="link" href="#" aria-disabled="true">Follow @rockwell… (placeholder)</a>}
          />
          <div className="ig-grid">
            <Placeholder label="IG POST (placeholder)" height={180} />
            <Placeholder label="IG POST (placeholder)" height={180} />
            <Placeholder label="IG POST (placeholder)" height={180} />
            <Placeholder label="IG POST (placeholder)" height={180} />
            <Placeholder label="IG POST (placeholder)" height={180} />
            <Placeholder label="IG POST (placeholder)" height={180} />
          </div>
        </section>

        {/* MAP / CONTACT */}
        <section className="section">
          <SectionTitle
            title="Find Rockwell"
            subtitle="Add address, map embed, parking notes, and contact info here."
          />
          <div className="find">
            <div className="find-card">
              <div className="find-title">Address</div>
              <div className="muted">Street address (placeholder)</div>
              <div className="muted">Amarillo, TX</div>
              <div className="find-actions">
                <a className="btn outline" href="#contact">Contact</a>
                <a className="btn primary" href="#events">Tickets</a>
              </div>
            </div>
            <div className="find-map">
              <Placeholder label="GOOGLE MAP EMBED (placeholder)" height={260} />
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-left">
            <div className="footer-brand">Rockwell Event Center</div>
            <div className="muted">Amarillo, TX • Live Music • Rentals</div>
          </div>
          <div className="footer-links">
            <a href="/events">Events</a>
            <a href="/book">Book</a>
            <a href="/contact">Contact</a>
          </div>
        </footer>
      </main>

      {/* Sticky Mobile CTA */}
      <div className="sticky-cta">
        <a className="btn primary" href="#events">Tickets</a>
        <a className="btn outline" href="#book">Book</a>
      </div>
    </div>
  );
}
