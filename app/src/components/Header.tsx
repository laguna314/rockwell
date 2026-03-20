import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const { pathname } = useLocation();

    function isActive(path: string) {
        return pathname.startsWith(path);
    }

    return (
        <header className="header">
            <div className="header-inner">
                {/* LEFT: LOGO */}
                <Link to="/" className="header-logo">
                    <img src="/ROCKWELL-01.png" alt="Rockwell" />
                </Link>

                {/* RIGHT: NAV + CTA */}
                <div className="header-right">
                    <nav className="header-nav">
                        <Link
                            to="/events"
                            className={isActive("/events") ? "active" : ""}
                        >
                            Events
                        </Link>

                        <Link to="/book">Rentals</Link>
                        <Link to="/contact">Contact</Link>
                    </nav>

                    <Link to="/events" className="btn primary header-cta">
                        Buy Tickets
                    </Link>
                </div>
            </div>
        </header>
    );
}