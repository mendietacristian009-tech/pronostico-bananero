import { ReactNode } from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

const Card = ({ title, subtitle, children, className = '', footer }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          {title && <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">{footer}</div>}
    </div>
  );
};

export default Card;