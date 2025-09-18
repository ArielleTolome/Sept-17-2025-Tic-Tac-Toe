import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard } from '../components/GameBoard';
import { MoveHistory } from '../components/MoveHistory';
import { OutcomeModal } from '../components/OutcomeModal';
import { Scoreboard } from '../components/Scoreboard';
import { RecentResults } from '../components/RecentResults';
import { t } from '../i18n';
import { useLocalGameStore } from '../state/local-game';

export const LocalMultiplayerGame: React.FC = () => {
  const navigate = useNavigate();
  const {
    board,
    turn,
    winningLine,
    moves,
    history,
    pointer,
    winner,
    status,
    scoreboard,
    results,
    startLocal,
    makeMove,
    jumpTo,
  } = useLocalGameStore((store) => ({
    board: store.board,
    turn: store.turn,
    winningLine: store.winningLine,
    moves: store.moves,
    history: store.history,
    pointer: store.pointer,
    winner: store.winner,
    status: store.status,
    scoreboard: store.scoreboard.local,
    results: store.results,
    startLocal: store.startLocal,
    makeMove: store.makeMove,
    jumpTo: store.jumpTo,
  }));

  useEffect(() => {
    startLocal();
  }, [startLocal]);

  const outcome = useMemo(() => {
    if (status !== 'finished') return null;
    if (winner === 'X') return { title: t('outcome.youWin'), celebrate: true };
    if (winner === 'O') return { title: t('outcome.opponentWins', { name: 'Player O' }), celebrate: false };
    return { title: t('outcome.draw'), celebrate: false };
  }, [status, winner]);

  const statusMessage = status === 'finished' ? outcome?.title ?? '' : `Player ${turn} — ${t('game.yourTurn')}`;

  const handleRematch = () => startLocal();
  const handleHome = () => navigate('/');

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <header className="mb-4">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('home.localMultiplayer')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">Pass-and-play fun for two players.</p>
          </header>
          <GameBoard
            board={board}
            turn={turn}
            winningLine={winningLine}
            disabled={status === 'finished'}
            onSelect={makeMove}
            statusMessage={statusMessage}
          />
        </div>
        <MoveHistory moves={moves} history={history} pointer={pointer} onSelect={jumpTo} />
      </div>
      <aside className="space-y-4">
        <Scoreboard record={scoreboard} />
        <RecentResults results={results} />
      </aside>
      <OutcomeModal
        open={status === 'finished'}
        title={outcome?.title ?? ''}
        celebrate={outcome?.celebrate}
        onRematch={handleRematch}
        onHome={handleHome}
      />
    </div>
  );
};
