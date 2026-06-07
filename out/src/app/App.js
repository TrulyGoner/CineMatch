import { StoreProvider } from './providers/StoreProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { RouterProvider } from './providers/RouterProvider';
import { ContentDetailModal } from '@/features/content-detail';
import './styles/index.scss';
const App = () => (React.createElement(StoreProvider, null,
    React.createElement(ThemeProvider, null,
        React.createElement(RouterProvider, null),
        React.createElement(ContentDetailModal, null))));
export default App;
