import { createBrowserRouter, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';


// only example for main  , remove it later 
const Main = lazy(()=>import("./LandingPage"))

const AppLayout = lazy(()=>import("./app/app"))
const Pomodoro = lazy(()=>import("./app/features/pomodoro"))
const TodoList = lazy(()=>import("./app/features/todo"))
const Notes = lazy(()=>import("./app/features/notes"))
const BudgetTracker = lazy(()=>import("./app/features/budgetTracker"))

// Wrapper component for lazy loading with suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter ([
    {
        path: "/",
        element: withSuspense(Main),
        index : true
    },
    {
        path : "app",
        element: withSuspense(AppLayout),
        children : [
            {
                path: "pomodoro-timer",  
                element: withSuspense(Pomodoro),
            },            
            {
                path : "todo-list",
                element: withSuspense(TodoList),
            },
            {
                path : "notes",
                element: withSuspense(Notes),
            },
            {
                path : "budget-tracker",
                element: withSuspense(BudgetTracker),
            },
            {
                index: true,             // Default route (e.g., redirect to Pomodoro)
                element: <Navigate to="pomodoro-timer" replace />,
            } 
        ]
    },
])