import { Provider } from 'react-redux';
import { store } from '@/app/store';
export const StoreProvider = ({ children }) => (React.createElement(Provider, { store: store }, children));
