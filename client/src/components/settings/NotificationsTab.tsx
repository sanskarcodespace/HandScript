'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export const NotificationsTab = () => {
  const [settings, setSettings] = useState({
    assignmentComplete: true,
    lowCredits: true,
    weeklySummary: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  return (
    <div className="max-w-2xl">
      <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">Email Notifications</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Assignment Completion</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email when your assignment is ready to download.</p>
          </div>
          <button
            type="button"
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
              settings.assignmentComplete ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
            )}
            role="switch"
            aria-checked={settings.assignmentComplete}
            onClick={() => toggleSetting('assignmentComplete')}
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                settings.assignmentComplete ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Low Credit Warning</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you have 2 or fewer credits remaining.</p>
          </div>
          <button
            type="button"
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
              settings.lowCredits ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
            )}
            role="switch"
            aria-checked={settings.lowCredits}
            onClick={() => toggleSetting('lowCredits')}
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                settings.lowCredits ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Weekly Summary</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">A weekly digest of your usage and saved time.</p>
          </div>
          <button
            type="button"
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
              settings.weeklySummary ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
            )}
            role="switch"
            aria-checked={settings.weeklySummary}
            onClick={() => toggleSetting('weeklySummary')}
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                settings.weeklySummary ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
