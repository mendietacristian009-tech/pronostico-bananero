import { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none';
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 disabled:bg-secondary-300',
    success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 disabled:bg-success-300',
    danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 disabled:bg-error-300',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 active:bg-warning-800 disabled:bg-warning-300',
    info: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:text-gray-400',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClasses}
        ${disabled || isLoading ? 'cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;