import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../lib/storage";
import { useAuth } from "../context/AuthContext";

const SPORTS = [
  "Nogomet",
  "Košarka",
  "Odbojka",
  "Tenis",
  "Badminton",
  "Tek",
  "Kolesarjenje",
];

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState(() => storage.get("rf_events", []));
  const existing = useMemo(() => events.find((e) => e.id === id), [events, id]);

  const [sport, setSport] = useState(existing?.sport ?? SPORTS[0]);
  const [location, setLocation] = useState(existing?.location ?? "");
  const [date, setDate] = useState(existing?.date ?? "");
  const [time, setTime] = useState(existing?.time ?? "");
  const [level, setLevel] = useState(existing?.level ?? 1);
  const [ageGroup, setAgeGroup] = useState(existing?.ageGroup ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");

  if (!existing) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 16 }}>
          Dogodek ne obstaja.
        </div>
      </div>
    );
  }

  const isOwner = user?.email === existing.creatorEmail;
  if (!isOwner) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: 16 }}>
          Nimate pravic za urejanje tega dogodka.
        </div>
      </div>
    );
  }

  function save(e) {
    e.preventDefault();
    const updated = events.map((ev) =>
      ev.id === id
        ? {
            ...ev,
            sport,
            location,
            date,
            time,
            level,
            ageGroup,
            description,
          }
        : ev
    );
    setEvents(updated);
    storage.set("rf_events", updated);
    navigate("/events");
  }

  return (
    <div className="container">
      <form className="card grid" style={{ marginTop: 16 }} onSubmit={save}>
        <h2>Uredi dogodek</h2>

        <label>Šport</label>
        <select
          className="input"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label>Lokacija</label>
        <input
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label>Datum</label>
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Čas</label>
        <input
          className="input"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <label>Težavnost (1–5)</label>
        <input
          className="input"
          type="number"
          min="1"
          max="5"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          required
        />

        <label>Starostna skupina</label>
        <input
          className="input"
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
        />

        <label>Opis</label>
        <textarea
          className="input"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn">Shrani</button>
      </form>
    </div>
  );
}
