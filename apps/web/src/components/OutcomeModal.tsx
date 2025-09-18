import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { t } from '../i18n';
import { Confetti } from './Confetti';

interface OutcomeModalProps {
  open: boolean;
  title: string;
  description?: string;
  celebrate?: boolean;
  onRematch?: () => void;
  onNewRoom?: () => void;
  onHome: () => void;
  rematchPending?: boolean;
}

export const OutcomeModal: React.FC<OutcomeModalProps> = ({
  open,
  title,
  description,
  celebrate = false,
  onRematch,
  onNewRoom,
  onHome,
  rematchPending = false,
}) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-40" onClose={() => {}}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              {celebrate ? <Confetti /> : null}
              <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                  {description}
                </Dialog.Description>
              ) : null}

              {rematchPending ? (
                <p className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                  {t('outcome.awaitingRematch')}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                {onRematch ? (
                  <button
                    type="button"
                    onClick={onRematch}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    {t('game.rematch')}
                  </button>
                ) : null}
                {onNewRoom ? (
                  <button
                    type="button"
                    onClick={onNewRoom}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {t('game.newRoom')}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onHome}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t('game.home')}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);
