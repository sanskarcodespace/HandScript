import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';

interface PasswordStrengthIndicatorProps {
  password?: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = '',
  className,
}) => {
  const strength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  }, [password]);

  const strengthLabel = ['Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength];
  const strengthColor = [
    'bg-gray-200 dark:bg-gray-800',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
  ][strength];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 w-full rounded-full transition-colors duration-300',
              strength >= level ? strengthColor : 'bg-gray-200 dark:bg-gray-800'
            )}
          />
        ))}
      </div>
      <div className="text-xs text-right text-gray-500 dark:text-gray-400">
        {password ? strengthLabel : ''}
      </div>
    </div>
  );
};
