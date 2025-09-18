import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { GameBoard } from '../components/GameBoard';
import { ChatPanel } from '../components/ChatPanel';
import { OutcomeModal } from '../components/OutcomeModal';
import { PresencePanel } from '../components/PresencePanel';
import { RoomLink } from '../components/RoomLink';
import { TimerBadge } from '../components/TimerBadge';
import { t } from '../i18n';
import { useOnlineGameStore, type Seat } from '../state/online-game';
import { getRoomToken } from '../utils/storage';

interface TokenPayload {
  sub: string;
  roomId: string;
  seat: Seat;
  name?: string;
}

const connectionStatusMessage = (
  connection: 'idle' | 'connecting' | 'ready' | 'error',
  gameStatus: 'pending' | 'active' | 'finished',
  seat: Seat,
  turn: Seat,
  winner: Seat | null,
) => {
  if (connection === 'connecting') return t('game.connecting');
  if (connection === 'error') return t('errors.connectionLost');
  if (gameStatus === 'finished') {
    if (winner === seat) return t('outcome.youWin');
    if (winner) return t('outcome.opponentWins', { name: winner });
    return t('outcome.draw');
  }
  if (turn === seat) return t('game.yourTurn');
  return t('game.opponentTurn');
};

export const OnlineRoom: React.FC = () => {
  const { roomId = '' } = useParams();
  const navigate = useNavigate();
  const [tokenError, setTokenError] = useState<string | null>(null);

  const {
    connection,
    board,
    turn,
    players,
    spectators,
    winner,
    winningLine,
    moves,
    chat,
    timerExpiresAt,
    gameStatus,
    seat,
    rematchPending,
    connect,
    disconnect,
    sendMove,
    sendChat,
    requestRematch,
  } = useOnlineGameStore();

  const storedToken = useMemo(() => (roomId ? getRoomToken(roomId) : undefined), [roomId]);

  const decoded = useMemo(() => {
    if (!storedToken) return null;
    try {
      return jwtDecode<TokenPayload>(storedToken.token);
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }, [storedToken]);

  useEffect(() => {
    if (!roomId) return;
    if (!storedToken || !decoded) {
      setTokenError('Room token missing — join the room again.');
      return;
    }

    connect({
      url: storedToken.wsUrl,
      token: storedToken.token,
      roomId,
      seat: decoded.seat ?? 'spectator',
      selfId: decoded.sub,
    });

    return () => {
      disconnect();
    };
  }, [roomId, storedToken, decoded, connect, disconnect]);

  if (tokenError) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
        <p>{tokenError}</p>
        <button
          type="button"
          onClick={() => navigate('/online')}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
        >
          Back to lobby
        </button>
      </div>
    );
  }

  if (!storedToken || !decoded || connection === 'connecting') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <p>{t('game.connecting')}</p>
      </div>
    );
  }

  const statusLabel = connectionStatusMessage(connection, gameStatus, seat, turn, winner);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Room {roomId}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">{statusLabel}</p>
            </div>
            <TimerBadge expiresAt={timerExpiresAt ?? undefined} />
          </header>
          <GameBoard
            board={board}
            turn={turn}
            winningLine={winningLine}
            disabled={connection !== 'ready' || seat === 'spectator' || turn !== seat || gameStatus === 'finished'}
            onSelect={(index) => sendMove(index)}
            statusMessage={statusLabel}
          />
          <RoomLink roomId={roomId} />
        </div>
        <ChatPanel messages={chat} onSend={sendChat} disabled={connection !== 'ready'} />
      </div>

      <aside className="space-y-4">
        <PresencePanel players={players} spectators={spectators} selfId={decoded.sub} seat={seat} />
      </aside>

      <OutcomeModal
        open={gameStatus === 'finished'}
        title={statusLabel}
        celebrate={winner === seat}
        onRematch={seat === 'spectator' ? undefined : requestRematch}
        rematchPending={rematchPending}
        onHome={() => navigate('/online')}
        onNewRoom={seat === 'spectator' ? undefined : () => navigate('/online')}
      />
    </div>
  );
};
