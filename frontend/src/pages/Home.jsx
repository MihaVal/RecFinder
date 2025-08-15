import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <div className="hero">
        <h1>Dobrodošli v RecFinder</h1>
        <p>
          Povežite se z drugimi igralci in poiščite športne dogodke v svoji
          bližini!
        </p>

        {user ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Link to="/events" className="btn">
              Poglej dogodke
            </Link>
            <button onClick={logout} className="btn secondary">
              Odjava
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Link to="/login" className="btn">
              Prijava
            </Link>
            <Link to="/register" className="btn secondary">
              Registracija
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
