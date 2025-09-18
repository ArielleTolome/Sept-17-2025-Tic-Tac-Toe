import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Difficulty } from '@tic-tac-toe/shared';
import { GameBoard } from '../components/GameBoard';
import { MoveHistory } from '../components/MoveHistory';
import { OutcomeModal } from '../components/OutcomeModal';
import { Scoreboard } from '../components/Scoreboard';
import { useAiController } from '../hooks/use-ai-controller';
import { t } from '../i18n';
import { useLocalGameStore } from '../state/local-game';

interface LocationState {
  difficulty?: Difficulty;
}

export const SinglePlayerGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const [seedInput, setSeedInput] = useState('');

  const {
    board,
    turn,
    winningLine,
    moves,
    history,
    pointer,
    winner,
    status,
    aiThinking,
    scoreboard,
    difficulty,
    startSingle,
    makeMove,
    jumpTo,
    setSeed,
  } = useLocalGameStore((store) => ({
    board: store.board,
    turn: store.turn,
    winningLine: store.winningLine,
    moves: store.moves,
    history: store.history,
    pointer: store.pointer,
    winner: store.winner,
    status: store.status,
    aiThinking: store.aiThinking,
    scoreboard: store.scoreboard.single,
    difficulty: store.difficulty,
    startSingle: store.startSingle,
    makeMove: store.makeMove,
    jumpTo: store.jumpTo,
    setSeed: store.setSeed,
  }));

  useEffect(() => {
    const selectedDifficulty = state.difficulty ?? difficulty;
    startSingle(selectedDifficulty);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useAiController();

  const outcome = useMemo(() => {
    if (status !== 'finished') return null;
    if (winner === 'X') return { title: t('outcome.youWin'), celebrate: true };
    if (winner === 'O') return { title: t('outcome.youLose'), celebrate: false };
    return { title: t('outcome.draw'), celebrate: false };
  }, [status, winner]);

  const statusMessage = status === 'finished'
    ? outcome?.title ?? ''
    : turn === 'X'
    ? t('game.yourTurn')
    : aiThinking
    ? t('game.aiTurn')
    : t('game.opponentTurn');

  const handleRematch = () => {
    startSingle(difficulty);
  };

  const handleHome = () => navigate('/');

  const applySeed = () => {
    setSeed(seedInput);
    startSingle(difficulty, seedInput);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('home.singlePlayer')}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {t('difficulty.' + difficulty)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={seedInput}
                onChange={(event) => setSeedInput(event.target.value)}
                placeholder="Seed"
                className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={applySeed}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {t('game.seedLabel')}
              </button>
            </div>
          </header>
          <GameBoard
            board={board}
            turn={turn}
            winningLine={winningLine}
            disabled={status === 'finished'}
            onSelect={makeMove}
            aiThinking={aiThinking && turn === 'O'}
            statusMessage={statusMessage}
          />
        </div>

        <MoveHistory moves={moves} history={history} pointer={pointer} onSelect={jumpTo} />
      </div>

      <aside className="space-y-4">
        <Scoreboard record={scoreboard} />
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
