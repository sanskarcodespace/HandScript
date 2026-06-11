'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../../../hooks/useAuth';
import { resetPasswordSchema } from '../../../../lib/validators';
import { AuthLayout } from '../../../../components/layout/AuthLayout';
import { PasswordInput } from '../../../../components/ui/PasswordInput';
import { PasswordStrengthIndicator } from '../../../../components/ui/PasswordStrengthIndicator';

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  
  const { resetPassword } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  useEffect(() => {
    if (!token) {
      setErrorMsg('Invalid or missing password reset token.');
    }
  }, [token]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (success && countdown === 0) {
      router.push('/login');
    }
    return () => clearTimeout(timer);
  }, [success, countdown, router]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    const result = await resetPassword(token, data.password);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setErrorMsg(result.error || 'Failed to reset password');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Password reset complete</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Your password has been successfully reset.
          </p>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Redirecting to login in {countdown}s...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Set new password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <div className="mt-1">
            <PasswordInput
              id="password"
              autoComplete="new-password"
              error={errors.password?.message}
              disabled={!token}
              {...register('password')}
            />
            <PasswordStrengthIndicator password={passwordValue} className="mt-2" />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <div className="mt-1">
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              disabled={!token}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
}
