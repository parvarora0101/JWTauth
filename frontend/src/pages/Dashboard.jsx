import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard__card">
        <h1>Welcome, {user?.name || 'friend'} 👋</h1>
        <p>You're signed in as {user?.email}.</p>
        <button className="submit-btn" style={{ maxWidth: 200, margin: '16px auto 0' }} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
