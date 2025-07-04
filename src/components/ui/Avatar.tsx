import React from 'react';
import { cn, getInitials, getAvatarColor } from '../../utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      firstName = '',
      lastName = '',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    };

    const initials = getInitials(firstName, lastName);
    const colorClass = getAvatarColor(`${firstName} ${lastName}`);

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden',
          sizes[size],
          !src && colorClass,
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || `${firstName} ${lastName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-white">
            {initials}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
