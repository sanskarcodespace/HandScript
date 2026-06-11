'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Loader2, MailCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../../../hooks/useAuth';
import { registerSchema } from '../../../../lib/validators';
import { AuthLayout } from '../../../../components/layout/AuthLayout';
import { PasswordInput } from '../../../../components/ui/PasswordInput';
import { PasswordStrengthIndicator } from '../../../../components/ui/PasswordStrengthIndicator';
import { GoogleSignInButton } from '../../../../components/ui/GoogleSignInButton';
import { cn } from '../../../../lib/utils';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, loginWithGoogle } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await registerUser(data);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setErrorMsg(result.error || 'Registration failed');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      const mockIdToken = "mock_google_id_token";
      const result = await loginWithGoogle(mockIdToken);
      
      if (result.success) {
        toast.success(result.isNewUser ? 'Account created via Google!' : 'Welcome back!');
        router.push('/dashboard');
      } else {
        setErrorMsg(result.error || 'Google login failed');
        setGoogleLoading(false);
      }
    } catch (err) {
      setErrorMsg('Google login failed');
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
            <MailCheck className="h-10 w-10 text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
          >
            Resend verification email
          </button>
          <Link
            href="/login"
            className="mt-8 flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Join thousands of students using HandNote AI
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={cn(
                'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:ring-brand-500',
                errors.name && 'border-red-500 focus:ring-red-500'
              )}
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
        </div>

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
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <PasswordInput
              id="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrengthIndicator password={passwordValue} className="mt-2" />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="mt-1">
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex items-start pt-2">
          <div className="flex h-5 items-center">
            <input
              id="agreeTerms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
              {...register('agreeTerms')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeTerms" className="text-gray-600 dark:text-gray-400">
              I agree to the{' '}
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </label>
            {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || googleLoading}
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
          Sign in
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
