import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'gold' | 'purple' | 'success' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  const variantStyles = {
    cyan: 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30',
    gold: 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30',
    purple: 'bg-brand-purple/20 text-purple-300 border border-brand-purple/40',
    success: 'bg-accent-success/15 text-accent-success border border-accent-success/30',
    danger: 'bg-accent-error/15 text-accent-error border border-accent-error/30',
    neutral: 'bg-navy-800 text-accent-gray border border-white/10',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface ProgressBarProps {
  current: number;
  total: number;
  color?: 'cyan' | 'gold' | 'purple' | 'success';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = 'cyan',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  const colorStyles = {
    cyan: 'bg-gradient-to-r from-brand-blue to-brand-cyan',
    gold: 'bg-gradient-to-r from-brand-gold to-brand-yellow',
    purple: 'bg-gradient-to-r from-brand-blue to-brand-purple',
    success: 'bg-gradient-to-r from-emerald-500 to-accent-success',
  };

  return (
    <div className={`w-full h-2.5 bg-navy-950 rounded-full overflow-hidden p-0.5 border border-white/10 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorStyles[color]}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
