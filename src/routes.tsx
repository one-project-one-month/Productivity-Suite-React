import { createBrowserRouter, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

// only example for main  , remove it later
const Main = lazy(() => import('./LandingPage'));

const AppLayout = lazy(() => import('./app/app'));
const AuthLayout = lazy(() => import('./app/AuthLayout'));

const Pomodoro = lazy(() => import('./app/features/pomodoro'));
const TodoList = lazy(() => import('./app/features/todo'));
const Notes = lazy(() => import('./app/features/notes'));
const NoteCategories = lazy(
  () => import('./app/features/notes/CategoryNotesList')
);
const NoteUpdate = lazy(() => import('./app/features/notes/NoteUpdate'));
const NoteCreate = lazy(() => import('./app/features/notes/NoteCreate'));
const BudgetTracker = lazy(() => import('./app/features/budgetTracker'));
const Summary = lazy(() => import('./app/features/productivity-summary'));
const Login = lazy(() => import('./app/SignIn'));
const Register = lazy(() => import('./app/Signup'));
const CategoryManagement = lazy(() => import('./app/features/category'));

// Wrapper component for lazy loading with suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: withSuspense(AuthLayout),

    children: [
      {
        path: '/',
        element: withSuspense(Main),
        index: true,
      },
      {
        path: 'signin',
        element: withSuspense(Login),
      },
      {
        path: 'signup',
        element: withSuspense(Register),
      },
    ],
  },
  {
    path: 'app',
    element: <ProtectedRoute>{withSuspense(AppLayout)}</ProtectedRoute>,
    children: [
      {
        path: 'pomodoro-timer',
        element: withSuspense(Pomodoro),
      },
      {
        path: 'todo-list',
        element: withSuspense(TodoList),
      },
      {
        path: 'category',
        element: withSuspense(CategoryManagement),
      },
      {
        path: 'notes',
        element: withSuspense(Notes),
      },
      {
        path: 'notes/:categoryId',
        element: withSuspense(NoteCategories),
      },
      {
        path: 'notes/:categoryId/create',
        element: withSuspense(NoteCreate),
      },
      {
        path: 'notes/:categoryId/edit/:noteId',
        element: withSuspense(NoteUpdate),
      },
      {
        path: 'budget-tracker',
        element: withSuspense(BudgetTracker),
      },
      {
        path: 'productivity-summary',
        element: withSuspense(Summary),
      },
      {
        index: true, // Default route (e.g., redirect to Pomodoro)
        element: <Navigate to="pomodoro-timer" replace />,
      },
    ],
  },
]);
