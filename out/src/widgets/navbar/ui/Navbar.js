import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/entities/user';
import { ABTestToggle } from '@/features/ab-test-toggle';
import { LanguageSwitcher } from '@/features/language';
import './Navbar.scss';
export const Navbar = () => {
    const { t } = useTranslation();
    const LINKS = [
        { to: '/', label: t('navbar.home') },
        { to: '/content', label: t('navbar.catalog') },
        { to: '/saved', label: t('saved.title') },
        { to: '/dashboard', label: t('navbar.dashboard') },
        { to: '/settings', label: t('navbar.settings') },
    ];
    return (React.createElement("header", { className: "navbar" },
        React.createElement("div", { className: "navbar__inner" },
            React.createElement(NavLink, { to: "/", className: "navbar__logo", "aria-label": t('navbar.logoTooltip') },
                React.createElement("img", { src: "/favicon-64.svg", alt: "", className: "navbar__logo-icon", width: 36, height: 36, "aria-hidden": "true" }),
                React.createElement("img", { src: "/logo-header.svg", alt: "CineMatch", className: "navbar__logo-wordmark", height: 28 })),
            React.createElement("nav", { className: "navbar__nav" }, LINKS.map((link) => (React.createElement(NavLink, { key: link.to, to: link.to, className: ({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`, end: link.to === '/' }, link.label)))),
            React.createElement("div", { className: "navbar__actions" },
                React.createElement(LanguageSwitcher, null),
                React.createElement(ABTestToggle, null),
                React.createElement(UserAvatar, { name: "User" })))));
};
