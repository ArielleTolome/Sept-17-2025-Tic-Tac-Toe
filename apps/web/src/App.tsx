import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './routes/Home';
import { SinglePlayerGame } from './routes/SinglePlayerGame';
import { LocalMultiplayerGame } from './routes/LocalMultiplayerGame';
import { OnlineLobby } from './routes/OnlineLobby';
import { OnlineRoom } from './routes/OnlineRoom';

const App: React.FC = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play/single" element={<SinglePlayerGame />} />
      <Route path="/play/local" element={<LocalMultiplayerGame />} />
      <Route path="/online" element={<OnlineLobby />} />
      <Route path="/online/room/:roomId" element={<OnlineRoom />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);

export default App;
