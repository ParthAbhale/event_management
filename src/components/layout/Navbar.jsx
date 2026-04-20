import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CalendarRange, LogOut, MoonStar, PlusCircle, SunMedium } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';
import { useDarkMode } from '../../hooks/useDarkMode';

function Navbar() {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully.');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Unable to log out.');
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link className="brand" to="/">
          <span className="brand__mark">
            <CalendarRange size={18} />
          </span>
          <span>
            <strong>EventSphere</strong>
            <small>Modern event operations</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          {isAuthenticated ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
        </nav>

        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link className="button button--ghost" to="/create-event">
                <PlusCircle size={18} /> Create
              </Link>
              <Link className="profile-chip" to="/profile">
                <img src={profile?.photoURL} alt={profile?.name || 'Profile'} />
                <span>{profile?.name || 'Profile'}</span>
              </Link>
              <button className="button button--secondary" type="button" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link className="button button--primary" to="/auth">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
