import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'active';
  size?: 'small' | 'medium';
  onClick?: () => void;
}

export default function Tag({ 
  children, 
  variant = 'default',
  size = 'medium',
  onClick 
}: TagProps): JSX.Element {
  const Component = onClick ? 'button' : 'span';
  
  return (
    <Component
      className={clsx(
        styles.tag,
        styles[variant],
        styles[size],
        onClick && styles.clickable
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
