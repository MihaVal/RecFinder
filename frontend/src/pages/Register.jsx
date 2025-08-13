import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const ok = register(name.trim(), email.trim(), password);
    if (ok) {
      setError("");
      navigate("/"); // or "/events" if you prefer
    } else {
      setError("Uporabnik s tem e-poštnim naslovom že obstaja.");
    }
  }

  return (
    <div className="container page">
      <div className="card" style={{ maxWidth: 460, margin: "24px auto" }}>
        <h2 style={{ marginTop: 0 }}>Registracija</h2>

        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ime</label>
            <input
              id="name"
              ref={nameRef}
              type="text"
              placeholder="npr. Luka Novak"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-pošta</label>
            <input
              id="email"
              type="email"
              placeholder="ime.priimek@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Geslo</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button className="btn" type="submit">
            Registriraj se
          </button>
        </form>
      </div>
    </div>
  );
}
