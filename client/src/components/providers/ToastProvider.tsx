'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          maxWidth: '400px',
          padding: '12px 16px',
        },
        success: {
          className: 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50 border border-green-200 dark:border-green-800',
          iconTheme: {
            primary: '#10B981',
            secondary: '#ECFDF5',
          },
        },
        error: {
          className: 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-50 border border-red-200 dark:border-red-800',
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FEF2F2',
          },
        },
        // We can add custom types for info or loading if we use toast.custom()
      }}
    />
  );
};
