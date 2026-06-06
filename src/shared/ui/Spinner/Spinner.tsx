import './Spinner.scss';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ size = 'md' }: SpinnerProps) => (
  <div className={`spinner spinner--${size}`} role="status" aria-label="Загрузка" />
);
