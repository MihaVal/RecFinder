import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.events.getAll();
        setEvents(response.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Napaka pri nalaganju dogodkov');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [location.key]);

  const filtered = useMemo(() => events, [events]);

  return (
    <div className="container events-list">
      {loading && <div className="card">Nalaganje dogodkov...</div>}
      {error && <div className="card error">{error}</div>}
      {!loading && !error && user && (
        <div className="card create-event-prompt">
          <h3>Ustvari nov dogodek</h3>
          <p>Organiziraj svoj športni dogodek in povabi druge!</p>
          <Link to="/events/new" className="btn btn-primary">
            + Novi dogodek
          </Link>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && <div className="card">Ni dogodkov.</div>}
      {!loading && !error && filtered.map((ev) => {
        const count = ev.participants?.length || 0;
        return (
          <div className="event-card" key={ev.id}>
            <h3>{ev.sport}</h3>
            <p>
              📍 <strong>Lokacija:</strong> {ev.location}
            </p>
            <p>
              📅 <strong>Datum:</strong> {ev.date}
            </p>
            <p>
              ⏰ <strong>Čas:</strong> {ev.time}
            </p>
            <p>
              ⭐ <strong>Nivo:</strong> {ev.level}/5
            </p>
            {ev.ageGroup && (
              <p>
                👥 <strong>Starostna Skupina:</strong> {ev.ageGroup}
              </p>
            )}
            <p>
              🎯 <strong>Organizator:</strong> {ev.creatorName}
            </p>
            <p>
              🧑‍🤝‍🧑 <strong>Udeleženci:</strong> {count}
            </p>
            <Link to={`/events/${ev.id}`} className="btn view-details">
              View Details
            </Link>
          </div>
        );
      })}
    </div>
  );
}
