import { Component } from 'react';
import { Button } from '@/shared/ui/Button';
import './ErrorBoundary.scss';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false, error: null };
        this.handleReset = () => {
            this.setState({ hasError: false, error: null });
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary:', error, info.componentStack);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return (React.createElement("div", { className: "error-boundary" },
                React.createElement("h2", null, "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A"),
                React.createElement("p", null, this.state.error?.message ?? 'Неизвестная ошибка'),
                React.createElement(Button, { onClick: this.handleReset }, "\u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430")));
        }
        return this.props.children;
    }
}
