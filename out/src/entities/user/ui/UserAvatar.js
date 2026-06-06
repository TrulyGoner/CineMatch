import './UserAvatar.scss';
export const UserAvatar = ({ name = 'U', size = 'md' }) => (React.createElement("div", { className: `user-avatar user-avatar--${size}`, "aria-hidden": true }, name.charAt(0).toUpperCase()));
