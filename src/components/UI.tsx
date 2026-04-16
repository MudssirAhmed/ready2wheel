import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
}) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }, (_, i) => (
      <button
        key={i}
        onClick={() => interactive && onChange?.(i + 1)}
        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        type="button"
      >
        <Star
          size={size}
          className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
        />
      </button>
    ))}
  </div>
);

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg className={`animate-spin ${sizes[size]} text-blue-400`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      {text && <p className="text-sm text-white/50">{text}</p>}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    {icon && <div className="text-white/20 text-5xl">{icon}</div>}
    <h3 className="text-lg font-semibold text-white/70">{title}</h3>
    {description && <p className="text-sm text-white/40 max-w-xs">{description}</p>}
    {action}
  </div>
);

interface BadgeProps {
  label: string;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'bg-blue-400/20 text-blue-400 border-blue-400/30' }) => (
  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${color}`}>{label}</span>
);
