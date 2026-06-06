import './UserAvatar.scss';

interface UserAvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ name = 'U', size = 'md' }: UserAvatarProps) => (
  <div className={`user-avatar user-avatar--${size}`} aria-hidden>
    {name.charAt(0).toUpperCase()}
  </div>
);
