'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../../../hooks/useAuth';
import { loginSchema } from '../../../../lib/validators';
import { AuthLayout } from '../../../../components/layout/AuthLayout';
import { PasswordInput } from '../../../../components/ui/PasswordInput';
import { GoogleSignInButton } from '../../../../components/ui/GoogleSignInButton';
import { cn } from '../../../../lib/utils';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get('next') || '/dashboard';
  
  const { login, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await login(data);
    
    if (result.success) {
      toast.success('Welcome back!');
      router.push(nextPath);
    } else {
      setErrorMsg(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // In a real app, this would use Google Identity Services to get an idToken
    // For now, this is a mock implementation
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      // Mock idToken (replace with actual Google Sign-In logic)
      const mockIdToken = "mock_google_id_token";
      const result = await loginWithGoogle(mockIdToken);
      
      if (result.success) {
        toast.success(result.isNewUser ? 'Account created via Google!' : 'Welcome back!');
        router.push(nextPath);
      } else {
        setErrorMsg(result.error || 'Google login failed');
        setGoogleLoading(false);
      }
    } catch (err) {
      setErrorMsg('Google login failed');
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to your HandNote AI account
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={cn(
                'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:ring-brand-500',
                errors.email && 'border-red-500 focus:ring-red-500'
              )}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="mt-1">
            <PasswordInput
              id="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || googleLoading}
          className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
          Create one
        </Link>
      </div>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-6 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
            or continue with
          </span>
        </div>
      </div>

      <div className="mt-6">
        <GoogleSignInButton onClick={handleGoogleLogin} isLoading={googleLoading} disabled={isLoading} />
      </div>
    </AuthLayout>
  );
}
