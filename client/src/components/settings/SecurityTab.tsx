'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Shield, Smartphone, Laptop, Loader2 } from 'lucide-react';
import { PasswordInput } from '../ui/PasswordInput';
import toast from 'react-hot-toast';

export const SecurityTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password updated successfully');
    }, 1000);
  };

  return (
    <div className="max-w-2xl">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
      
      {/* Password Change (only for local users) */}
      {user?.provider === 'local' && (
        <div className="mb-10">
          <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Change Password</h4>
          <form onSubmit={handlePasswordChange} className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <div className="mt-1">
                <PasswordInput placeholder="Enter current password" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <div className="mt-1">
                <PasswordInput placeholder="Enter new password" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <div className="mt-1">
                <PasswordInput placeholder="Confirm new password" required />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Two-Factor Auth Placeholder */}
      <div className="mb-10">
        <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Protect your account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Coming soon
          </span>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Active Sessions</h4>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            <li className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Laptop className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Mac OS • Chrome <span className="ml-2 text-xs font-normal text-green-600 dark:text-green-400">(Current Session)</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">San Francisco, USA • IP: 192.168.1.***</p>
                </div>
              </div>
            </li>
            <li className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Smartphone className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">iOS • Safari</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">San Francisco, USA • Last used 2 hours ago</p>
                </div>
              </div>
              <button className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400">
                Revoke
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
