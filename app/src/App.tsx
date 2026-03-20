import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventsPage from "../src/pages/EventsPage";
import EventDetail from "../src/pages/EventDetail";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetail />} />
        </Routes>
    );
}