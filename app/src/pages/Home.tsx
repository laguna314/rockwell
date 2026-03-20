import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import Placeholder from "../components/Placeholder";
import SectionTitle from "../components/SectionTitle";
import { getRockwellEvents, type PublicVenueEvent } from "../lib/accedo";

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
    const [events, setEvents] = useState<PublicVenueEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        getRockwellEvents()
            .then((data) => setEvents(data))
            .catch((err) => {
                console.error("Failed to load Rockwell events", err);
                setEvents([]);
            })
            .finally(() => setLoadingEvents(false));
    }, []);

    const featured = useMemo(() => events[0] ?? null, [events]);

    return (
        <div className="app">
            <Header />

            <section className="hero">
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

                        <h1 className="hero-title">
                            Amarillo’s Home for Live Music
                        </h1>
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
                            <span className="badge badge-accent">
                                Mobile tickets available
                            </span>
                            <span className="badge">
                                Fast entry • Secure checkout
                            </span>
                        </div>
                    </div>

                    <div className="hero-panel">
                        <div className="panel">
                            <div className="panel-kicker">Featured</div>

                            {featured ? (
                                <>
                                    <div className="panel-title">
                                        {featured.title}
                                    </div>
                                    <div className="panel-meta">
                                        {formatLong(featured.dateISO)}
                                    </div>

                                    <div className="panel-actions">
                                        <a
                                            className="btn primary"
                                            href={`/events/${featured.slug}`}
                                        >
                                            Buy Tickets
                                        </a>
                                        <a
                                            className="btn outline"
                                            href={`/events/${featured.slug}`}
                                        >
                                            Details
                                        </a>
                                    </div>

                                    {featured.agePolicy ? (
                                        <div className="panel-note">
                                            {featured.agePolicy}
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <div className="panel-title">
                                        Next show spotlight
                                    </div>
                                    <div className="panel-meta">
                                        Hook this to your next scheduled event
                                    </div>
                                    <Placeholder
                                        label="FEATURED EVENT GRAPHIC (placeholder)"
                                        height={180}
                                    />
                                    <div className="panel-actions">
                                        <a
                                            className="btn primary"
                                            href="#events"
                                        >
                                            Tickets
                                        </a>
                                        <a
                                            className="btn outline"
                                            href="#events"
                                        >
                                            Lineup
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hero-glow" aria-hidden="true" />
            </section>

            <main className="container">
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
                        <div className="stat-label">
                            Local scene • Touring acts
                        </div>
                    </div>
                </section>

                <section id="events" className="section">
                    <SectionTitle
                        title="Upcoming Shows"
                        subtitle="Tickets are fast, mobile-friendly, and secure."
                        right={
                            <a className="link" href="/events">
                                View all →
                            </a>
                        }
                    />

                    <div className="grid">
                        {!loadingEvents && events.length ? (
                            events.map((e) => (
                                <EventCard key={e.id} event={e} />
                            ))
                        ) : (
                            <>
                                <Placeholder
                                    label="EVENT CARD (placeholder)"
                                    height={360}
                                />
                                <Placeholder
                                    label="EVENT CARD (placeholder)"
                                    height={360}
                                />
                                <Placeholder
                                    label="EVENT CARD (placeholder)"
                                    height={360}
                                />
                            </>
                        )}
                    </div>
                </section>

                <section className="section">
                    <SectionTitle
                        title="The Venue"
                        subtitle="A look inside Rockwell Event Center."
                    />
                    <div className="photo-strip">
                        <div className="venue-photo">
                            <img
                                src="/venue/rockwellout.jpg"
                                alt="Exterior of Rockwell Event Center"
                                loading="lazy"
                            />
                        </div>

                        <div className="venue-photo">
                            <img
                                src="/venue/rockwell2.jpg"
                                alt="Inside Rockwell Event Center"
                                loading="lazy"
                            />
                        </div>

                        <div className="venue-photo">
                            <img
                                src="/venue/rockwell5.jpg"
                                alt="Venue space at Rockwell Event Center"
                                loading="lazy"
                            />
                        </div>

                        <div className="venue-photo">
                            <img
                                src="/venue/rockwellstage.jpg"
                                alt="Stage at Rockwell Event Center"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>

                <section className="section">
                    <SectionTitle
                        title="Why Rockwell"
                        subtitle="Promoters, bands, and fans — this is what makes Rockwell different."
                    />

                    <div className="features">
                        <div className="feature">
                            <div className="feature-title">
                                Stage-ready production
                            </div>
                            <div className="feature-text">
                                Clean power, clean sound, and a layout that
                                works for small and large live shows.
                            </div>
                        </div>
                        <div className="feature">
                            <div className="feature-title">
                                Fast entry + mobile tickets
                            </div>
                            <div className="feature-text">
                                Digital first, but paper tickets are good too!
                            </div>
                        </div>
                        <div className="feature">
                            <div className="feature-title">
                                Great for touring & locals
                            </div>
                            <div className="feature-text">
                                From local showcases to touring nights —
                                flexible setup.
                            </div>
                        </div>
                        <div className="feature">
                            <div className="feature-title">
                                Age policies per event
                            </div>
                            <div className="feature-text">
                                Age restrictions and event policies are shown
                                directly on each event listing.
                            </div>
                        </div>
                        <div className="feature">
                            <div className="feature-title">
                                Parking / location
                            </div>
                            <div className="feature-text">
                                Add real parking/location info here.
                                <span className="muted"> (placeholder)</span>
                            </div>
                        </div>
                        <div className="feature">
                            <div className="feature-title">
                                Community + special events
                            </div>
                            <div className="feature-text">
                                Concerts, parties, corporate events, and
                                community nights.
                            </div>
                        </div>
                    </div>
                </section>

                <section id="book" className="section rentals">
                    <div className="rentals-inner">
                        <div>
                            <h2 className="rentals-title">
                                Private Rentals Available
                            </h2>
                            <p className="rentals-text">
                                Need a space for a party, release show,
                                corporate event, fundraiser, or community
                                gathering? Tell us what you’re planning — we’ll
                                respond fast.
                            </p>

                            <div className="rentals-actions">
                                <a className="btn primary" href="/book">
                                    Start a Rental Inquiry
                                </a>
                                <a className="btn outline" href="/contact">
                                    Contact
                                </a>
                            </div>

                            <div className="rentals-bullets">
                                <div>• Flexible setup options</div>
                                <div>• Staffed events (placeholder)</div>
                                <div>• Add-ons available (placeholder)</div>
                            </div>
                        </div>

                        <div className="rentals-media">
                            <div className="rentals-photo">
                                <img
                                    src="/venue/rockwell5.jpg"
                                    alt="Rockwell Event Center rental space"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section signup">
                    <div className="signup-inner">
                        <div>
                            <h2 className="signup-title">
                                Get show announcements
                            </h2>
                            <p className="signup-text">
                                Be first to know about new shows, presales, and
                                special events.
                            </p>
                        </div>
                        <div className="signup-form">
                            <Placeholder label="COMING SOON" height={92} />
                        </div>
                    </div>
                </section>

                <section className="section">
                    <SectionTitle
                        title="What people say"
                        subtitle="Drop real quotes reviews here when you have them."
                    />
                    <div className="quotes">
                        <div className="quote">
                            <div className="quote-text">
                                “Best sound in town.”
                            </div>
                            <div className="quote-by">— Reviewer</div>
                        </div>
                        <div className="quote">
                            <div className="quote-text">
                                “The staff handled our event perfectly.”
                            </div>
                            <div className="quote-by">— Promoter</div>
                        </div>
                        <div className="quote">
                            <div className="quote-text">
                                “Rockwell brings the energy.”
                            </div>
                            <div className="quote-by">— Artist</div>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <SectionTitle
                        title="Find Rockwell"
                        subtitle="Add address, map embed, parking notes, and contact info here."
                    />
                    <div className="find">
                        <div className="find-card">
                            <div className="find-title">Address</div>
                            <div className="muted">16301 I-27</div>
                            <div className="muted">Canyon, TX 79015</div>
                            <div className="find-actions">
                                <a
                                    className="btn outline"
                                    href="https://www.google.com/maps/search/?api=1&query=Rockwell+Event+Center+Amarillo+TX"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                        <div className="find-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5414.498098649695!2d-101.92061582291012!3d35.0426639647856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87015d0e03972d4d%3A0x65404ceb549e2b15!2sRockwell%20Event%20Center%20Canyon%2CTX!5e1!3m2!1sen!2sus!4v1774043414830!5m2!1sen!2sus"
                                width="600"
                                height="450"
                                style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </section>

                <footer className="footer">
                    <div className="footer-left">
                        <div className="footer-brand">
                            Rockwell Event Center
                        </div>
                        <div className="muted">
                            Amarillo, TX • Live Music • Rentals
                        </div>
                    </div>
                    <div className="footer-links">
                        <a href="/events">Events</a>
                        <a href="/book">Book</a>
                        <a href="/contact">Contact</a>
                    </div>
                </footer>
            </main>

            <div className="sticky-cta">
                <a className="btn primary" href="#events">
                    Tickets
                </a>
                <a className="btn outline" href="#book">
                    Book
                </a>
            </div>
        </div>
    );
}
