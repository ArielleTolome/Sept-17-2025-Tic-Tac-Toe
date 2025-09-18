import { Listbox, Transition } from '@headlessui/react';
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useTheme, usePreferencesStore } from '../state/preferences';

const themeOptions = [
  { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
] as const;

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const current = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];
  const displayName = usePreferencesStore((state) => state.displayName);

  return (
    <Listbox value={theme} onChange={setTheme}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="group flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            <current.icon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{current.label}</span>
            <ChevronUpDownIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">
              Toggle theme for {displayName || 'player'}
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute right-0 z-20 mt-2 w-36 rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {themeOptions.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `flex cursor-pointer items-center gap-2 px-3 py-2 ${
                      active ? 'bg-brand-50 text-brand-600 dark:bg-slate-700 dark:text-slate-100' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <option.icon className="h-4 w-4" aria-hidden="true" />
                      <span className="flex-1">{option.label}</span>
                      {selected ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
