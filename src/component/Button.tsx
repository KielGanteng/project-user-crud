import React from 'react';
//  This file defines a Button component with customizable styles and attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClass = 'rounded font-semibold focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClass =
    variant === 'primary'
      ? 'bg-blue-500 hover:bg-blue-600 text-black'
      : variant === 'success'
      ? 'bg-green-500 hover:bg-green-600 text-black'
      : 'bg-red-500 hover:bg-red-600 text-black';

  const sizeClass =
    size === 'sm'
      ? 'text-sm px-3 py-1'
      : size === 'lg'
      ? 'text-lg px-6 py-3'
      : 'text-base px-4 py-2';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
