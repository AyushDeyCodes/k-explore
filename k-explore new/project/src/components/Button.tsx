import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2, type LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'onDark';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-crimson text-white shadow-glow hover:bg-crimson-hover hover:-translate-y-0.5 active:translate-y-0',
  secondary: 'bg-ink text-base hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0',
  outline: 'border border-line text-ink hover:border-ink hover:bg-elevated',
  ghost: 'text-ink hover:bg-elevated',
  onDark: 'border border-white/40 text-white hover:border-white hover:bg-white/10',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
};

export function buttonClass({ variant = 'primary', size = 'md', fullWidth, className = '' }: ButtonStyleOptions): string {
  return [
    'inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold tracking-wide',
    'transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const iconNode = loading ? (
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
  ) : Icon ? (
    <Icon className="h-4 w-4" aria-hidden="true" />
  ) : null;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClass({ variant, size, fullWidth, className })}
      {...props}
    >
      {iconPosition === 'left' && iconNode}
      {children}
      {iconPosition === 'right' && iconNode}
    </button>
  );
}

interface LinkButtonProps extends LinkProps, ButtonStyleOptions {
  icon?: LucideIcon;
}

export function LinkButton({ variant, size, fullWidth, className, icon: Icon, children, ...props }: LinkButtonProps) {
  return (
    <Link className={buttonClass({ variant, size, fullWidth, className })} {...props}>
      {children}
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
    </Link>
  );
}
