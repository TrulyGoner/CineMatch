import './Card.scss';
export const Card = ({ children, className = '', onClick }) => (React.createElement("div", { className: `card ${className}`.trim(), onClick: onClick, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined, onKeyDown: onClick
        ? (e) => {
            if (e.key === 'Enter' || e.key === ' ')
                onClick();
        }
        : undefined }, children));
