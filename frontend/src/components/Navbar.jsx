import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          RecFinder
        </Link>
        
        <div className="nav-menu">
          <Link to="/events" className="nav-link">
            Dogodki
          </Link>
          
          {user ? (
            <>
              <Link to="/events/new" className="nav-link">
                Nov dogodek
              </Link>
              <span className="nav-user">
                Pozdravljeni, {user.name}
              </span>
              <button onClick={handleLogout} className="nav-button">
                Odjava
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Prijava
              </Link>
              <Link to="/register" className="nav-link">
                Registracija
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}