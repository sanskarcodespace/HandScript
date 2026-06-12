'use client';

import React from 'react';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';

export default function HandwritingPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Handwriting Profiles</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload and manage your custom handwriting styles.
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Handwriting profile interface coming soon...</p>
      </div>
    </div>
  );
}
