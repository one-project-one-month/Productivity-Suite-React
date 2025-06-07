import type { ReactNode } from 'react';
import { Clock, DollarSign, ListChecks, NotebookText } from 'lucide-react';
import { PRODUCTS } from '.';

export interface INavLink {
  id: number;
  name: string;
  href: string;
  icon: ReactNode;
  textColor: string;
  bgColor: string;
}

export const list: INavLink[] = [
  {
    id: PRODUCTS.POMODORO_TIMER,
    name: 'Pomodoro Timer',
    href: 'pomodoro-timer',
    icon: (
      <span className="bg-red-400 text-white p-1.5 items-center rounded-sm">
        <Clock size={20} className="" />
      </span>
    ),
    textColor: 'text-red-400',
    bgColor: 'bg-red-400/20',
  },
  {
    id: PRODUCTS.TODO_LIST,
    name: 'To-Do list',
    href: 'todo-list',
    icon: (
      <span className="bg-blue-400 text-white p-1.5 items-center rounded-sm">
        <ListChecks size={20} />
      </span>
    ),
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
  },
  {
    id: PRODUCTS.NOTES,
    name: 'Notes',
    href: 'notes',
    icon: (
      <span className="bg-purple-400 text-white p-1.5 items-center rounded-sm">
        <NotebookText size={20} />
      </span>
    ),
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-400/20',
  },
  {
    id: PRODUCTS.BUDGET_TRACKER,
    name: 'Budget tracker',
    href: 'budget-tracker',
    icon: (
      <span className="bg-emerald-500 text-white p-1.5 items-center rounded-sm">
        <DollarSign size={20} />
      </span>
    ),
    textColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/20',
  },
];
