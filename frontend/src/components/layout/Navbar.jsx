import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../common/Button.jsx';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-brand-700">
          JobTracer
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-slate-600 hover:text-brand-600">
                Dashboard
              </Link>
              <Link to="/jobs" className="text-slate-600 hover:text-brand-600">
                Jobs
              </Link>
              <Link to="/applications" className="text-slate-600 hover:text-brand-600">
                Applications
              </Link>
              <span className="hidden text-slate-500 sm:inline">{user?.name}</span>
              <Button variant="ghost" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-brand-600">
                Log in
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
