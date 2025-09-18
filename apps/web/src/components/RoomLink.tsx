import { useState } from 'react';
import { t } from '../i18n';

interface RoomLinkProps {
  roomId: string;
}

export const RoomLink: React.FC<RoomLinkProps> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/online/room/${roomId}` : roomId;

  const copy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <header className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
        {t('game.shareRoom')}
      </header>
      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="flex-1 truncate rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-200">
          {shareUrl}
        </code>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {copied ? t('game.copied') : t('game.copyLink')}
        </button>
      </div>
    </div>
  );
};
