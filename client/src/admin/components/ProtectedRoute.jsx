import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../../store/slices/authSlice.js';

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(checkAuth());
    }
  }, [status, dispatch]);

  // Nothing rendered — and no redirect — until we actually know.
  // This is what prevents a flash of protected content or a flash
  // redirect-then-back-in on refresh.
  if (status === 'idle' || status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <span className="font-mono text-sm text-text-muted">checking session...</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
