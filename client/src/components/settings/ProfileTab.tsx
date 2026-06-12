'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Camera, Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app we'd use react-hook-form here
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  return (
    <div className="max-w-2xl">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
      
      <div className="mb-8 flex items-center gap-6">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-3xl font-bold text-gray-500 dark:bg-gray-800">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <button className="absolute bottom-0 right-0 rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Picture</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF or PNG. Max size of 2MB.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="block w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
            {user?.provider === 'google' && (
              <span className="absolute right-2 top-2 inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Connected via Google
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="Tell us a little about yourself..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Brief description for your profile. Maximum 200 characters.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </form>

      <div className="mt-10 border-t border-gray-200 pt-10 dark:border-gray-800">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-500">Danger Zone</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          type="button"
          onClick={() => toast.error('This action requires confirmation modal')}
          className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};
