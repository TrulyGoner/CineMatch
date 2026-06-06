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

export const Navbar = () => (
  <header className="navbar">
    <div className="navbar__inner">
      <NavLink to="/" className="navbar__logo" aria-label="CineMatch — на главную">
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
        <ABTestToggle />
        <UserAvatar name="User" />
      </div>
    </div>
  </header>
);
