import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { SkeletonLoader } from '../ui/SkeletonLoader';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
  };
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-10 w-10 rounded-lg" />
        </div>
        <div className="mt-4">
          <SkeletonLoader className="h-8 w-16" />
          {trend && <SkeletonLoader className="mt-2 h-4 w-32" />}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center text-sm">
            <span
              className={cn(
                'font-medium',
                trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">{trend.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
