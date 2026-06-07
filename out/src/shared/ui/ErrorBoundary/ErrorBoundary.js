import { Component } from 'react';
import i18n from '@/shared/config/i18n';
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
                React.createElement("h2", null, i18n.t('errors.somethingWrong')),
                React.createElement("p", null, this.state.error?.message ?? i18n.t('errors.unknownError')),
                React.createElement(Button, { onClick: this.handleReset }, i18n.t('errors.retry'))));
        }
        return this.props.children;
    }
}
