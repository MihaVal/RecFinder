import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../lib/storage";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const SPORTS = [
  "Nogomet",
  "Košarka",
  "Odbojka",
  "Tenis",
  "Badminton",
  "Tek",
  "Kolesarjenje",
];

export default function NewEvent() {
  const { user } = useAuth();
  const [sport, setSport] = useState(SPORTS[0]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [level, setLevel] = useState(1);
  const [ageGroup, setAgeGroup] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const events = storage.get("rf_events", []);
    events.push({
      id: uuidv4(),
      sport,
      location,
      date,
      time,
      level,
      ageGroup,
      description,
      creatorName: user.name,
      creatorEmail: user.email,
      participants: [],
    });
    storage.set("rf_events", events);
    navigate("/events");
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Nov dogodek</h2>
        <form onSubmit={submit} className="grid">
          <label>Šport</label>
          <select value={sport} onChange={(e) => setSport(e.target.value)}>
            {SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label>Lokacija</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <label>Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Čas</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <label>Težavnost (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />

          <label>Starostna skupina</label>
          <input
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          />

          <label>Opis</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="btn">Ustvari</button>
        </form>
      </div>
    </div>
  );
}
