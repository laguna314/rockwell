import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="header-inner">
                <div className="footer-left">
                    <div className="footer-brand">Rockwell Event Center</div>
                    <div className="muted">
                        Amarillo, TX • Live Music • Rentals
                    </div>
                </div>

                <div className="footer-links">
                    <Link to="/events">Events</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </div>
        </footer>
    );
}