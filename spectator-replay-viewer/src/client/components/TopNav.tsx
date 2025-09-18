import { Link, NavLink } from 'react-router-dom';

export default function TopNav() {
  return (
    <header className="bg-slate-900 text-white shadow">
      <nav className="container mx-auto flex items-center justify-between p-3">
        <Link to="/" className="font-bold tracking-wide focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-600">
          TTT Spectator
        </Link>
        <div className="flex gap-4">
          <NavLink
            to="/spectate"
            className={({ isActive }) =>
              `px-2 py-1 rounded focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-600 ${
                isActive ? 'bg-primary-600' : 'hover:bg-slate-800'
              }`
            }
          >
            Live Spectate
          </NavLink>
          <NavLink
            to="/replay/DEMO?autoPlay=1"
            className={({ isActive }) =>
              `px-2 py-1 rounded focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-600 ${
                isActive ? 'bg-primary-600' : 'hover:bg-slate-800'
              }`
            }
          >
            Demo Replay
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

