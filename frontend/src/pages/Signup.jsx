import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <svg className="auth-brand__lines" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
          <g className="drift" fill="none" stroke="#c9a15d" strokeWidth="1" opacity="0.5">
            <path d="M40 620 Q140 560 240 620 T440 620" />
          </g>
          <g className="drift-slow" fill="none" stroke="#5b6b8c" strokeWidth="1" opacity="0.4">
            <circle cx="470" cy="140" r="120" />
            <circle cx="470" cy="140" r="170" />
          </g>
        </svg>
        <div className="auth-brand__mark">
          <span className="dot" />
          Nimbus
        </div>
        <div className="auth-brand__copy">
          <div className="auth-brand__eyebrow">Get started</div>
          <h1 className="auth-brand__headline">Bring your team's work into one calm place.</h1>
          <p className="auth-brand__sub">Create an account in under a minute.</p>
        </div>
        <div className="auth-brand__footer">nimbus.workspace · v1.0</div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <h2 className="auth-card__title">Create your account</h2>
          <p className="auth-card__subtitle">It only takes a minute.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link className="link" to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
