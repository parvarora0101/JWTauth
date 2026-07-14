import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Brand panel with signature drifting-cloud linework */}
      <div className="auth-brand">
        <svg className="auth-brand__lines" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
          <g className="drift" fill="none" stroke="#c9a15d" strokeWidth="1" opacity="0.5">
            <path d="M40 620 Q140 560 240 620 T440 620" />
            <path d="M60 660 Q160 610 260 660 T460 660" />
          </g>
          <g className="drift-slow" fill="none" stroke="#5b6b8c" strokeWidth="1" opacity="0.4">
            <circle cx="470" cy="140" r="120" />
            <circle cx="470" cy="140" r="170" />
          </g>
          <g className="drift" fill="none" stroke="#ede9e0" strokeWidth="0.75" opacity="0.25">
            <path d="M20 320 Q120 280 220 320 T420 320" />
          </g>
        </svg>

        <div className="auth-brand__mark">
          <span className="dot" />
          Nimbus
        </div>

        <div className="auth-brand__copy">
          <div className="auth-brand__eyebrow">Workspace access</div>
          <h1 className="auth-brand__headline">Everything your team is working on, back in reach.</h1>
          <p className="auth-brand__sub">
            Sign in to pick up your boards, docs, and threads exactly where you left them.
          </p>
        </div>

        <div className="auth-brand__footer">nimbus.workspace · v1.0</div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <h2 className="auth-card__title">Welcome back</h2>
          <p className="auth-card__subtitle">Sign in to continue to your workspace.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="field-password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="form-row-between">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#forgot">Forgot password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="auth-switch">
            New to Nimbus? <Link className="link" to="/signup">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
