import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice.js';
import { ErrorBanner } from '../components/StatusStates.jsx';
import { inputClass } from '../components/fields/Field.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, loginPending, loginError } = useSelector((s) => s.auth);

  // Already logged in — no reason to show the login form again
  if (status === 'authenticated') {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/admin', { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-accent mb-2 text-center">./admin</p>
        <h1 className="font-display text-2xl font-semibold text-center mb-8">Admin login</h1>

        <ErrorBanner message={loginError} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loginPending}
            className="w-full px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loginPending ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
