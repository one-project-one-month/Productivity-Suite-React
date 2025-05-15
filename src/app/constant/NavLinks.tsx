import type { ReactNode } from "react";
import { Clock, DollarSign,  ListChecks, NotebookText } from 'lucide-react'; 

export interface INavLink {
  name: string;
  href: string;
  icon: ReactNode;
}

export const list: INavLink[] = [
  {
    name: 'Pomodoro Timer',
    href: 'pomodoro-timer',
    icon: <span className="bg-red-400 text-white p-1.5 items-center rounded-sm"><Clock size={20} className=""/></span>,
  },
  {
    name: 'To-do list',
    href: 'todo-list',
    icon: <span className="bg-emerald-500 text-white p-1.5 items-center rounded-sm"><ListChecks size={20} /></span>,
  },
  {
    name: 'Notes',
    href: 'notes',
    icon: <span className="bg-blue-400 text-white p-1.5 items-center rounded-sm"><NotebookText size={20} /></span>,
  },
  {
    name: 'Budget tracker',
    href: 'budget-tracker',
    icon: <span className="bg-amber-500 text-white p-1.5 items-center rounded-sm"><DollarSign size={20} /></span>,
  },
];