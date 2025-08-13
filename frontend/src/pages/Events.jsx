import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { storage } from "../lib/storage";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState(() => storage.get("rf_events", []));
  const location = useLocation();

  useEffect(() => {
    setEvents(storage.get("rf_events", []));
  }, [location.key]);

  const filtered = useMemo(() => events, [events]);

  return (
    <div className="container events-list">
      {filtered.length === 0 && <div className="card">Ni dogodkov.</div>}
      {filtered.map((ev) => {
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
