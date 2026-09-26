import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';
import Sidebar from './Sidebar.jsx';

export default function AdminLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dispatch = useDispatch();
  const admin = useSelector((s) => s.auth.admin);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-ink-border bg-ink/90 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display font-semibold text-lg">
              <span className="text-accent">~/</span>admin
            </Link>
            <Link to="/" className="hidden sm:inline font-mono text-xs text-text-muted hover:text-accent">
              view live site →
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono text-xs text-text-muted">{admin?.email}</span>
            <button
              onClick={() => dispatch(logout())}
              className="font-mono text-xs text-text-muted hover:text-accent-rose transition-colors"
            >
              logout
            </button>
            <button
              className="md:hidden font-mono text-xs text-text-primary"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle admin navigation"
            >
              {mobileNavOpen ? 'close' : 'menu'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-56 shrink-0 border-r border-ink-border">
          <Sidebar />
        </aside>

        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-ink pt-16">
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        )}

        <main className="flex-1 min-w-0 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
