import type { SVGAttributes, ReactNode } from 'react';
import './Icon.scss';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

const ICONS: Record<string, (p: SVGAttributes<SVGSVGElement>) => ReactNode> = {
  checkmark: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8,12 11,15 16,9" />
    </svg>
  ),
  eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12C5 7 19 7 21 12C19 17 5 17 3 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 8.5C5 5.5 7.5 4 9.5 5.5L12 7.5L14.5 5.5C16.5 4 19 5.5 19 8.5C19 12 12 17 12 17C12 17 5 12 5 8.5Z" />
    </svg>
  ),
  'heart-filled': (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M5 8.5C5 5.5 7.5 4 9.5 5.5L12 7.5L14.5 5.5C16.5 4 19 5.5 19 8.5C19 12 12 17 12 17C12 17 5 12 5 8.5Z" />
    </svg>
  ),
  info: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth={2.5} />
      <line x1="12" y1="11" x2="12" y2="16" />
    </svg>
  ),
  package: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="12,21 3,16 3,8 12,3 21,8 21,16" />
      <polyline points="3,8 12,13 21,8" />
      <line x1="12" y1="13" x2="12" y2="21" />
      <line x1="7.5" y1="5.5" x2="16.5" y2="10.5" strokeDasharray="2 2" />
    </svg>
  ),
  rainbow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" {...p}>
      <path d="M3 19A9 9 0 0 1 21 19" stroke="#e8445a" strokeWidth={1.8} fill="none" />
      <path d="M5 19A7 7 0 0 1 19 19" stroke="#f5a623" strokeWidth={1.8} fill="none" />
      <path d="M7 19A5 5 0 0 1 17 19" stroke="#f5d200" strokeWidth={1.8} fill="none" />
      <path d="M9 19A3 3 0 0 1 15 19" stroke="#4caf50" strokeWidth={1.8} fill="none" />
      <path d="M11 19A1 1 0 0 1 13 19" stroke="#2196f3" strokeWidth={1.8} fill="none" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="12,3 14.9,9 22,9.7 16.8,14.3 18.5,21 12,17.3 5.5,21 7.2,14.3 2,9.7 9.1,9" />
    </svg>
  ),
  'star-filled': (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <polygon points="12,3 14.9,9 22,9.7 16.8,14.3 18.5,21 12,17.3 5.5,21 7.2,14.3 2,9.7 9.1,9" />
    </svg>
  ),
  target: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  'thumbs-down': (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 2V11M3 10H7V2H3V10Z" />
      <path d="M7 11L10 21C11 21 13 20.5 13 18V14H18.5C19.9 14 20.5 13 20.5 12C20.5 11 19.7 10.5 19.2 10.3C19.8 10 20.2 9.3 20.2 8.5C20.2 7.7 19.7 7 19 6.8C19.4 6.5 19.6 5.9 19.6 5.3C19.6 4.2 18.8 3.5 18 3.3C18.3 3 18.5 2.5 18.5 2H10C9 2 8 2.5 7 3V11Z" />
    </svg>
  ),
  'thumbs-up': (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 22V13M3 14H7V22H3V14Z" />
      <path d="M7 13L10 3C11 3 13 3.5 13 6V10H18.5C19.9 10 20.5 11 20.5 12C20.5 13 19.7 13.5 19.2 13.7C19.8 14 20.2 14.7 20.2 15.5C20.2 16.3 19.7 17 19 17.2C19.4 17.5 19.6 18.1 19.6 18.7C19.6 19.8 18.8 20.5 18 20.7C18.3 21 18.5 21.5 18.5 22H10C9 22 8 21.5 7 21V13Z" />
    </svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  ),
};

export const Icon = ({ name, size = 20, className, color }: IconProps) => {
  const render = ICONS[name];
  if (!render) return null;
  return (
    <span
      className={`icon${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, ...(color ? { color } : {}) }}
      aria-hidden="true"
    >
      {render({ width: '100%', height: '100%' })}
    </span>
  );
};
