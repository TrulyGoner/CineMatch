import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '@/entities/user';
import { ABTestToggle } from '@/features/ab-test-toggle';
import { LanguageSwitcher } from '@/features/language';
import './Navbar.scss';

export const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const LINKS = [
    { to: '/', label: t('navbar.home') },
    { to: '/explorer', label: t('navbar.explorer') },
    { to: '/content', label: t('navbar.catalog') },
    { to: '/saved', label: t('saved.title') },
    { to: '/history', label: t('history.title') },
    { to: '/dashboard', label: t('navbar.dashboard') },
    { to: '/profile', label: t('profile.title') },
    { to: '/settings', label: t('navbar.settings') },
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo" aria-label={t('navbar.logoTooltip')}>
          <img
            src="/favicon-64.svg"
            alt=""
            className="navbar__logo-icon"
            width={36}
            height={36}
            aria-hidden="true"
          />
          <img
            src="/logo-header.svg"
            alt="CineMatch"
            className="navbar__logo-wordmark"
            height={28}
          />
        </NavLink>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <div className="navbar__nav-links">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
                end={link.to === '/'}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="navbar__nav-actions">
            <LanguageSwitcher />
            <ABTestToggle />
            <UserAvatar name="User" />
          </div>
        </nav>

        <div className="navbar__actions">
          <LanguageSwitcher />
          <ABTestToggle />
          <UserAvatar name="User" />
          <button
            type="button"
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="navbar__overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </header>
  );
};
