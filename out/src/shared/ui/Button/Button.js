import './Button.scss';
export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => (React.createElement("button", { type: "button", className: `btn btn--${variant} btn--${size} ${className}`.trim(), ...props }, children));
