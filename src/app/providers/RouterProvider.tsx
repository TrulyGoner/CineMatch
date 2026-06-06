import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { Spinner } from '@/shared/ui/Spinner';
import { Navbar } from '@/widgets/navbar';
import { HomePage } from '@/pages/home/ui/HomePage';
import { ContentPage } from '@/pages/content/ui/ContentPage';
import { SettingsPage } from '@/pages/settings/ui/SettingsPage';

const DashboardPage = lazy(() => import('@/pages/dashboard/ui/DashboardPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
    <Spinner size="lg" />
  </div>
);

export const RouterProvider = () => (
  <BrowserRouter>
    <Navbar />
    <main className="app-main">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>
  </BrowserRouter>
);
