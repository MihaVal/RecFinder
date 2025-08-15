import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // autofocus first field
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(email.trim(), password);
      if (success) {
        navigate("/events");
      } else {
        setError("Napačen e-poštni naslov ali geslo.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Napaka pri prijavi. Poskusite ponovno.");
    }
  }

  return (
    <div className="container page">
      <div className="card" style={{ maxWidth: 460, margin: "24px auto" }}>
        <h2 style={{ marginTop: 0 }}>Prijava</h2>

        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-pošta</label>
            <input
              id="email"
              ref={emailRef}
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
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn" type="submit">
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}
