import { NavLink } from 'react-router-dom';
import { UserAvatar } from '@/entities/user';
import { ABTestToggle } from '@/features/ab-test-toggle';
import './Navbar.scss';
const LINKS = [
    { to: '/', label: 'Главная' },
    { to: '/content', label: 'Каталог' },
    { to: '/dashboard', label: 'Дашборд' },
    { to: '/settings', label: 'Настройки' },
];
export const Navbar = () => (React.createElement("header", { className: "navbar" },
    React.createElement("div", { className: "navbar__inner" },
        React.createElement(NavLink, { to: "/", className: "navbar__logo" },
            "Reco",
            React.createElement("span", null, "Flix")),
        React.createElement("nav", { className: "navbar__nav" }, LINKS.map((link) => (React.createElement(NavLink, { key: link.to, to: link.to, className: ({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`, end: link.to === '/' }, link.label)))),
        React.createElement("div", { className: "navbar__actions" },
            React.createElement(ABTestToggle, null),
            React.createElement(UserAvatar, { name: "User" })))));
