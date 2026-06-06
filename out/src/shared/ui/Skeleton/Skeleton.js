import './Skeleton.scss';
export const Skeleton = ({ width = '100%', height = '200px', className = '', }) => (React.createElement("div", { className: `skeleton ${className}`.trim(), style: { width, height }, "aria-hidden": true }));
