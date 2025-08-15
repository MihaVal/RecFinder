import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../config/api";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const response = await api.events.getById(id);
        setEvent(response);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 16 }}>
          Nalaganje...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 16 }}>
          Dogodek ne obstaja.{" "}
          <button className="btn ghost" onClick={() => navigate("/events")}>
            Nazaj
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.email === event.creatorEmail;
  const participants = Array.isArray(event.participants) ? event.participants : [];
  const iJoined = !!participants.find((p) => p.email === user?.email);

  async function toggleJoin() {
    if (!user || isOwner) return;
    try {
      if (iJoined) {
        await api.events.leave(event.id);
      } else {
        await api.events.join(event.id);
      }
      // Refresh event data
      const updatedEvent = await api.events.getById(id);
      setEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to toggle join:', error);
    }
  }

  async function remove() {
    if (!confirm("Ali ste prepričani, da želite izbrisati ta dogodek?")) return;
    try {
      await api.events.delete(event.id);
      navigate("/events");
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }

  return (
    <div className="container">
      <div className="card grid" style={{ marginTop: 16 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <h2 style={{ margin: 0 }}>{event.sport}</h2>
        </div>

        <div className="row">
          <span className="badge">{event.location}</span>
          <span className="badge">
            {new Date(event.dateTime).toLocaleDateString('sl-SI')} {new Date(event.dateTime).toLocaleTimeString('sl-SI', {hour: '2-digit', minute: '2-digit'})}
          </span>
          <span className="badge">Nivo: {event.skillLevel}</span>
          {event.ageGroup && (
            <span className="badge">Starostna skupina: {event.ageGroup}</span>
          )}
        </div>

        {event.description && <p>{event.description}</p>}

        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <span className="badge">Objavil: {event.creatorName}</span>
            <span className="badge">Udeleženci: {participants.length}</span>
          </div>
          <div className="row">
            {!isOwner && user && (
              <button className="btn" onClick={toggleJoin}>
                {iJoined ? "Zapusti" : "Pridruži se"}
              </button>
            )}
            {isOwner && (
              <>
                <Link className="btn ghost" to={`/events/${event.id}/edit`}>
                  Uredi
                </Link>
                <button className="btn ghost" onClick={remove}>
                  Izbriši
                </button>
              </>
            )}
            <button className="btn" onClick={() => navigate("/events")}>
              Nazaj
            </button>
          </div>
        </div>

        <div className="card" style={{ background: "#0a1424" }}>
          <strong>Seznam udeležencev</strong>
          {participants.length === 0 ? (
            <p>Trenutno ni prijavljenih udeležencev.</p>
          ) : (
            <ul>
              {participants.map((p) => (
                <li key={p.email}>
                  {p.name} ({p.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
