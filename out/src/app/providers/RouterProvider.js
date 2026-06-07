import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { Spinner } from '@/shared/ui/Spinner';
import { Navbar } from '@/widgets/navbar';
import { HomePage } from '@/pages/home/ui/HomePage';
import { ContentPage } from '@/pages/content/ui/ContentPage';
import { SettingsPage } from '@/pages/settings/ui/SettingsPage';
import { SavedPage } from '@/pages/saved/ui/SavedPage';
const DashboardPage = lazy(() => import('@/pages/dashboard/ui/DashboardPage'));
const PageLoader = () => (React.createElement("div", { style: { display: 'flex', justifyContent: 'center', padding: '4rem' } },
    React.createElement(Spinner, { size: "lg" })));
export const RouterProvider = () => (React.createElement(BrowserRouter, null,
    React.createElement(Navbar, null),
    React.createElement("main", { className: "app-main" },
        React.createElement(ErrorBoundary, null,
            React.createElement(Suspense, { fallback: React.createElement(PageLoader, null) },
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/", element: React.createElement(HomePage, null) }),
                    React.createElement(Route, { path: "/content", element: React.createElement(ContentPage, null) }),
                    React.createElement(Route, { path: "/saved", element: React.createElement(SavedPage, null) }),
                    React.createElement(Route, { path: "/dashboard", element: React.createElement(DashboardPage, null) }),
                    React.createElement(Route, { path: "/settings", element: React.createElement(SettingsPage, null) })))))));
