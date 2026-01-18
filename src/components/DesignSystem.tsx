import React from 'react';
import { cn } from '../utils/cn';

// ========================================
// 设计系统常量
// ========================================

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export const RADIUS = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
} as const;

// ========================================
// 统一按钮组件
// ========================================

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 focus:ring-slate-500',
    outline: 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-slate-500',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 focus:ring-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        'interactive-element focus-ring',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
    >
      {loading && <InlineLoader className="mr-2" />}
      {children}
    </button>
  );
}

// ========================================
// 统一卡片组件
// ========================================

interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  rounded?: boolean;
  className?: string;
}

export function Card({
  children,
  padding = 'md',
  shadow = 'sm',
  border = true,
  rounded = true,
  className,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800',
        border && 'border border-slate-200 dark:border-slate-700',
        rounded && 'rounded-lg',
        paddingClasses[padding],
        shadowClasses[shadow],
        'transition-all duration-300 card-hover',
        className
      )}
    >
      {children}
    </div>
  );
}

// ========================================
// 统一输入框组件
// ========================================

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  icon?: string;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
  className,
  icon,
}: InputProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 border rounded-lg transition-colors',
            'bg-white dark:bg-slate-800',
            'border-slate-300 dark:border-slate-600',
            'text-slate-900 dark:text-slate-100',
            'placeholder-slate-400 dark:placeholder-slate-500',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// ========================================
// 统一徽章组件
// ========================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// ========================================
// 统一加载器组件
// ========================================

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function InlineLoader({ size = 'md', className }: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        'animate-spin text-current',
        sizeClasses[size],
        className
      )}
    >
      ⟳
    </div>
  );
}

// ========================================
// 统一间距工具类
// ========================================

export const Spacing = {
  Section: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('space-y-6', className)}>{children}</div>
  ),
  Block: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('space-y-4', className)}>{children}</div>
  ),
  Inline: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('space-x-4', className)}>{children}</div>
  ),
};

// ========================================
// 统一排版组件
// ========================================

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'code';
  className?: string;
}

export function Typography({ children, variant = 'body', className }: TypographyProps) {
  const variantClasses = {
    h1: 'text-4xl font-bold text-slate-900 dark:text-slate-100',
    h2: 'text-3xl font-bold text-slate-900 dark:text-slate-100',
    h3: 'text-2xl font-semibold text-slate-800 dark:text-slate-200',
    h4: 'text-xl font-semibold text-slate-800 dark:text-slate-200',
    body: 'text-base text-slate-700 dark:text-slate-300 leading-relaxed',
    caption: 'text-sm text-slate-500 dark:text-slate-400',
    code: 'font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded',
  };

  const Component = variant.startsWith('h') ? variant : 'div';

  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}

// ========================================
// 本体感按钮组件
// ========================================

interface OntologicalButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function OntologicalButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  type = 'button',
}: OntologicalButtonProps) {
  const baseClasses = 'btn-ontological inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ripple';

  const variantClasses = {
    primary: 'text-white',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
    >
      {loading && <InlineLoader className="mr-2" />}
      {children}
    </button>
  );
}

// ========================================
// 本体感卡片组件
// ========================================

interface OntologicalCardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  rounded?: boolean;
  className?: string;
  onClick?: () => void;
}

export function OntologicalCard({
  children,
  padding = 'md',
  variant = 'default',
  rounded = true,
  className,
  onClick,
}: OntologicalCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'card-ontological',
    elevated: 'card-ontological shadow-xl',
    outlined: 'border-2 border-amber-200 dark:border-amber-700 bg-transparent',
    glass: 'glass backdrop-blur-md border border-white/20 dark:border-white/10',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'interactive-surface',
        variantClasses[variant],
        paddingClasses[padding],
        rounded && 'rounded-xl',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

// ========================================
// 本体感输入框组件
// ========================================

interface OntologicalInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: string;
  label?: string;
}

export function OntologicalInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success = false,
  disabled,
  className,
  icon,
  label,
}: OntologicalInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'input-ontological w-full px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400',
            'focus:text-slate-900 dark:focus:text-slate-100',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            success && 'border-green-500 focus:ring-green-500',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        />
        {success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            ✓
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}

// ========================================
// 本体感徽章组件
// ========================================

interface OntologicalBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function OntologicalBadge({
  children,
  variant = 'default',
  size = 'md',
  animated = false,
  className,
}: OntologicalBadgeProps) {
  const variantClasses = {
    default: 'badge-ontological bg-gradient-to-r from-slate-500 to-slate-600 text-white',
    primary: 'badge-ontological bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    success: 'badge-ontological bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    warning: 'badge-ontological bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    error: 'badge-ontological bg-gradient-to-r from-red-500 to-rose-600 text-white',
    info: 'badge-ontological bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'badge-ontological',
        variantClasses[variant],
        sizeClasses[size],
        animated && 'animate-pulse',
        className
      )}
    >
      {children}
    </span>
  );
}

// ========================================
// 加载状态组件
// ========================================

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export function LoadingState({ size = 'md', variant = 'spinner', className }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'dots') {
    return (
      <div className={cn('loading-dots', className)}>
        <span className="bg-amber-500"></span>
        <span className="bg-amber-500"></span>
        <span className="bg-amber-500"></span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('loading-ontological rounded-full bg-slate-200 dark:bg-slate-700', sizeClasses[size], className)} />
    );
  }

  return (
    <div className={cn('animate-spin text-amber-500', sizeClasses[size], className)}>
      ⟳
    </div>
  );
}

// ========================================
// 工具提示组件
// ========================================

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  delay?: number;
}

export function Tooltip({ content, position = 'top', children, delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isVisible && (
        <div className={cn('tooltip-ontological absolute z-50 whitespace-nowrap', positionClasses[position])}>
          {content}
        </div>
      )}
    </div>
  );
}