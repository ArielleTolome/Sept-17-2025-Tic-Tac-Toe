import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ReplayView from './pages/ReplayView';
import LiveSpectate from './pages/LiveSpectate';
import TopNav from './components/TopNav';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spectate" element={<LiveSpectate />} />
          <Route path="/replay/:gameId" element={<ReplayView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

