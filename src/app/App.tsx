import { StoreProvider } from './providers/StoreProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { RouterProvider } from './providers/RouterProvider';
import { ContentDetailModal } from '@/features/content-detail';
import { ToastContainer } from '@/shared/ui/Toast';
import './styles/index.scss';

const App = () => (
  <StoreProvider>
    <ThemeProvider>
      <RouterProvider />
      <ContentDetailModal />
      <ToastContainer />
    </ThemeProvider>
  </StoreProvider>
);

export default App;
