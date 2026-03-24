import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import ContactPage from "./pages/Contact";
import Success from "./pages/Success";

export default function App() {
    return (
        <div className="app">
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:slug" element={<EventDetail />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/success" element={<Success />} />
            </Routes>

            <Footer />
        </div>
    );
}