import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'gold' | 'purple' | 'cyan';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'sismo-card',
    interactive: 'sismo-card-interactive cursor-pointer hover:border-brand-cyan/40',
    gold: 'sismo-card border-brand-gold/30 bg-gradient-to-br from-navy-850 via-navy-900 to-amber-950/20 shadow-glow-gold/10',
    purple: 'sismo-card border-brand-purple/40 bg-gradient-to-br from-navy-850 via-navy-900 to-purple-950/25',
    cyan: 'sismo-card border-brand-cyan/40 bg-gradient-to-br from-navy-850 via-navy-900 to-sky-950/25',
  };

  return (
    <div
      className={`${variantStyles[variant]} p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
