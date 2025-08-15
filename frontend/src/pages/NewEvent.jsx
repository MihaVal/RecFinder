import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";
import { useAuth } from "../context/AuthContext.jsx";

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
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState(SPORTS[0]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    
    if (!user) {
      setError('Morate biti prijavljeni za ustvarjanje dogodkov');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const eventData = {
        title,
        sport,
        location,
        date,
        time,
        maxParticipants,
        description,
      };

      await api.events.create(eventData);
      navigate("/events");
    } catch (err) {
      console.error('Failed to create event:', err);
      setError('Napaka pri ustvarjanju dogodka');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Nov dogodek</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={submit} className="form">
          <div className="form-group">
            <label>Naslov dogodka</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="npr. Jutranji tek v Tivoliju"
              required
            />
          </div>

          <div className="form-group">
            <label>Šport</label>
            <select value={sport} onChange={(e) => setSport(e.target.value)}>
              {SPORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Lokacija</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="npr. Ljubljanski grad, Tivoli park"
              required
            />
          </div>

          <div className="form-group">
            <label>Datum</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Čas</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Maksimalno število udeležencev</label>
            <input
              type="number"
              min="2"
              max="100"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Opis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kratek opis dogodka..."
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Ustvarjanje...' : 'Ustvari'}
          </button>
        </form>
      </div>
    </div>
  );
}
