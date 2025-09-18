import { Link, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NewTournament from './pages/NewTournament';
import TournamentView from './pages/TournamentView';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900">
        <nav className="container mx-auto p-3 flex items-center justify-between text-white">
          <Link className="font-bold" to="/">TTT Orchestrator</Link>
          <div className="flex gap-3">
            <Link className="btn" to="/new">New Tournament</Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewTournament />} />
          <Route path="/tournaments/:id" element={<TournamentView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

