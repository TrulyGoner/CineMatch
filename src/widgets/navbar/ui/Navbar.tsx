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
    { to: '/dashboard', label: t('navbar.dashboard') },
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

        <nav className="navbar__nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <LanguageSwitcher />
          <ABTestToggle />
          <UserAvatar name="User" />
        </div>
      </div>
    </header>
  );
};
