import './Skeleton.scss';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton = ({
  width = '100%',
  height = '200px',
  className = '',
}: SkeletonProps) => (
  <div
    className={`skeleton ${className}`.trim()}
    style={{ width, height }}
    aria-hidden
  />
);
