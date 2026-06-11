'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { api } from '../../../../lib/api';
import { AuthLayout } from '../../../../components/layout/AuthLayout';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const called = useRef(false);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Invalid or missing verification token.');
      return;
    }

    // Prevent double-calling in strict mode
    if (called.current) return;
    called.current = true;

    const verifyEmail = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
        
        // Redirect to dashboard or login after a short delay
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setErrorMsg(error.response?.data?.message || 'Verification failed. This link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="mb-6 h-12 w-12 animate-spin text-brand-600 dark:text-brand-400" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Verifying your email...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Email verified!</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Your account is now active.
            </p>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Redirecting to login...
            </p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              {errorMsg}
            </p>
            <button
              onClick={() => router.push('/register')}
              className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Sign up again
            </button>
          </motion.div>
        )}
      </div>
    </AuthLayout>
  );
}
