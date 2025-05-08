
export interface INavLink {
    name: string;
    href: string;
}

export const list: INavLink[] = [
    {
        name: "Pomodoro Timer",
        href: "pomodoro-timer",
    },
    {
        name: "To-do list",
        href: "todo-list",
    },
    {
        name: "Notes",
        href: "notes",
    },    
    {
        name: "Budget tracker",
        href: "budget-tracker",
    }
]