import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { storage } from "../lib/storage";
import { useAuth } from "../context/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState(() => storage.get("rf_events", []));
  const ev = useMemo(() => events.find((e) => e.id === id), [events, id]);

  useEffect(() => storage.set("rf_events", events), [events]);

  if (!ev) {
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

  const isOwner = user?.email === ev.creatorEmail;
  const participants = Array.isArray(ev.participants) ? ev.participants : [];
  const iJoined = !!participants.find((p) => p.email === user?.email);

  function toggleJoin() {
    if (!user || isOwner) return;
    const updated = events.map((e) => {
      if (e.id !== ev.id) return e;
      const list = Array.isArray(e.participants) ? [...e.participants] : [];
      const me = { email: user.email, name: user.name };
      const idx = list.findIndex((p) => p.email === me.email);
      if (idx >= 0) list.splice(idx, 1);
      else list.push(me);
      return { ...e, participants: list };
    });
    setEvents(updated);
  }

  function remove() {
    if (!confirm("Ali ste prepričani, da želite izbrisati ta dogodek?")) return;
    const updated = events.filter((e) => e.id !== ev.id);
    storage.set("rf_events", updated);
    setEvents(updated);
    navigate("/events");
  }

  return (
    <div className="container">
      <div className="card grid" style={{ marginTop: 16 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <h2 style={{ margin: 0 }}>{ev.sport}</h2>
        </div>

        <div className="row">
          <span className="badge">{ev.location}</span>
          <span className="badge">
            {ev.date} {ev.time}
          </span>
          <span className="badge">Nivo: {ev.level}</span>
          {ev.ageGroup && (
            <span className="badge">Starostna skupina: {ev.ageGroup}</span>
          )}
        </div>

        {ev.description && <p>{ev.description}</p>}

        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <span className="badge">Objavil: {ev.creatorName}</span>
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
                <Link className="btn ghost" to={`/events/${ev.id}/edit`}>
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
