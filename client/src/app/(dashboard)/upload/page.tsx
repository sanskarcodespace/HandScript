'use client';

import React, { useState } from 'react';
import { useUploadStore } from '../../../store/uploadStore';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';
import { FileDropzone } from '../../../components/upload/FileDropzone';
import { UploadProgress } from '../../../components/upload/UploadProgress';
import { api } from '../../../lib/api';
import { PenTool, Fingerprint, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../hooks/useAuth';

export default function UploadPage() {
  const { user } = useAuth();
  const {
    files,
    mode,
    setMode,
    selectedProfileId,
    startUpload,
    setAssignmentId,
    setError,
    isUploading,
    currentAssignmentId,
  } = useUploadStore();

  const [title, setTitle] = useState('');
  const [localIsUploading, setLocalIsUploading] = useState(false);

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file.');
      return;
    }

    if (mode === 'personal' && !selectedProfileId) {
      toast.error('Please select a handwriting profile.');
      return;
    }

    if (!user || user.credits < 1) {
      toast.error("You don't have enough credits.");
      return;
    }

    setLocalIsUploading(true);
    startUpload();

    const formData = new FormData();
    const finalTitle = title.trim() || files[0].name.split('.')[0] || 'Untitled Assignment';
    formData.append('title', finalTitle);
    formData.append('handwritingMode', mode);
    if (selectedProfileId) {
      formData.append('handwritingProfileId', selectedProfileId);
    }
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await api.post('/upload/assignment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAssignmentId(response.data.assignmentId);
      toast.success('Upload successful! Processing started.');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to upload files. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLocalIsUploading(false);
    }
  };

  if (currentAssignmentId) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <UploadProgress />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumb />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">New Assignment</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your files and configure handwriting settings.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Dropzone */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">1. Upload Files</h2>
          <FileDropzone />
        </section>

        {/* Step 2: Handwriting Mode */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">2. Choose Handwriting Mode</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setMode('realistic')}
              className={cn(
                'relative flex flex-col items-start rounded-xl border p-6 text-left transition-all',
                mode === 'realistic'
                  ? 'border-brand-500 bg-brand-50 shadow-sm dark:border-brand-400 dark:bg-brand-900/20'
                  : 'border-gray-200 bg-white hover:border-brand-200 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
              )}
            >
              <div className="mb-4 inline-flex rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <PenTool className={cn('h-6 w-6', mode === 'realistic' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400')} />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Realistic Writing</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-generated handwriting that looks like real pen on paper</p>
              <span className="absolute right-4 top-4 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
                Recommended
              </span>
            </button>

            <button
              onClick={() => setMode('personal')}
              className={cn(
                'relative flex flex-col items-start rounded-xl border p-6 text-left transition-all',
                mode === 'personal'
                  ? 'border-brand-500 bg-brand-50 shadow-sm dark:border-brand-400 dark:bg-brand-900/20'
                  : 'border-gray-200 bg-white hover:border-brand-200 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
              )}
            >
              <div className="mb-4 inline-flex rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <Fingerprint className={cn('h-6 w-6', mode === 'personal' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400')} />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">PersonalWrite™</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Answers written in YOUR unique handwriting style</p>
              
              {/* Profile selector mock */}
              {mode === 'personal' && (
                <div className="mt-4 w-full">
                  <span className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Select Profile</span>
                  <select
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    onChange={(e) => useUploadStore.getState().setProfile(e.target.value)}
                  >
                    <option value="">-- Choose Profile --</option>
                    <option value="profile_1">My Standard Cursive</option>
                    <option value="profile_2">Messy Notes</option>
                  </select>
                </div>
              )}
            </button>
          </div>
        </section>

        {/* Step 3: Title & Submit */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">3. Final Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assignment Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={files.length > 0 ? files[0].name.split('.')[0] : 'Untitled Assignment'}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Cost: </span>
                <span className="font-semibold text-gray-900 dark:text-white">1 Credit</span>
                <span className="text-gray-500 dark:text-gray-400"> ({user?.credits || 0} remaining)</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={files.length === 0 || localIsUploading || isUploading || (mode === 'personal' && !selectedProfileId)}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {localIsUploading || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Magic...
                  </>
                ) : (
                  'Generate Handwritten Assignment'
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
