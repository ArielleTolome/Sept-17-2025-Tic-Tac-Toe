import { FormEvent, useEffect, useRef, useState } from 'react';
import type { ChatEventPayload } from '@tic-tac-toe/shared';
import { t } from '../i18n';

interface ChatPanelProps {
  messages: readonly ChatEventPayload[];
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSend, disabled = false }) => {
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-200">
        {t('game.chatTitle')}
        <span className="text-xs text-slate-400">{messages.length}</span>
      </header>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        {messages.map((message) => (
          <article key={message.id} className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <header className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
              <span className="font-semibold text-slate-700 dark:text-slate-100">{message.name}</span>
              <time dateTime={new Date(message.ts).toISOString()}>{new Date(message.ts).toLocaleTimeString()}</time>
            </header>
            <p>{message.text}</p>
          </article>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-3 dark:border-slate-700">
        <label htmlFor="chat-input" className="sr-only">
          {t('game.chatPlaceholder')}
        </label>
        <div className="flex gap-2">
          <input
            id="chat-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t('game.chatPlaceholder')}
            disabled={disabled}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={disabled}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t('game.send')}
          </button>
        </div>
      </form>
    </section>
  );
};
