import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'purple' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-extrabold rounded-pill transition-all active:scale-[0.98] select-none';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5 min-h-[36px]',
    md: 'px-5 py-3 text-sm gap-2 min-h-[46px]',
    lg: 'px-6 py-4 text-base gap-2.5 min-h-[54px]'
  };

  const variantClasses = {
    primary: 'sismo-btn-primary text-white disabled:opacity-50 disabled:pointer-events-none',
    secondary: 'bg-navy-800 hover:bg-navy-700 text-brand-cyan border border-brand-cyan/40 shadow-sm disabled:opacity-50',
    gold: 'sismo-btn-gold text-navy-950 disabled:opacity-50',
    purple: 'sismo-btn-purple text-white disabled:opacity-50',
    outline: 'bg-transparent hover:bg-white/5 text-slate-200 border border-white/20 disabled:opacity-40',
    danger: 'bg-accent-error hover:brightness-110 text-white shadow-sm disabled:opacity-50'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
