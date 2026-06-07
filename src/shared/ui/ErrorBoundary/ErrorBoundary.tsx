import { Component, type ErrorInfo, type ReactNode } from 'react';
import i18n from '@/shared/config/i18n';
import { Button } from '@/shared/ui/Button';
import './ErrorBoundary.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary">
          <h2>{i18n.t('errors.somethingWrong')}</h2>
          <p>{this.state.error?.message ?? i18n.t('errors.unknownError')}</p>
          <Button onClick={this.handleReset}>{i18n.t('errors.retry')}</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
