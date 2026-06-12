'use client';

import React from 'react';
import { Breadcrumb } from '../../components/ui/Breadcrumb';

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">New Assignment</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your assignment questions to get started.
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Upload interface coming soon...</p>
      </div>
    </div>
  );
}
