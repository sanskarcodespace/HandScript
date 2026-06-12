'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Clock, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { useUploadStore } from '../../store/uploadStore';
import { api } from '../../lib/api';

const STEPS = [
  { id: 'uploading', label: 'Uploading Files' },
  { id: 'ocr_processing', label: 'Extracting Questions' },
  { id: 'ai_processing', label: 'Generating Answers' },
  { id: 'rendering', label: 'Rendering Notebook Pages' },
  { id: 'completed', label: 'Finalizing PDF' }
];

export const UploadProgress = () => {
  const { currentAssignmentId, progressData, updateProgress, setError } = useUploadStore();

  useEffect(() => {
    if (!currentAssignmentId) return;

    // Poll status every 2 seconds
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/upload/assignment/${currentAssignmentId}/status`);
        const data = response.data;
        
        updateProgress({
          status: data.status,
          progress: data.progress,
          currentStep: data.currentStep,
          error: data.error
        });

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err: any) {
        // Handle network/polling error
        console.error('Failed to fetch status', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentAssignmentId, updateProgress]);

  if (!progressData) return null;

  const currentStepIndex = STEPS.findIndex(s => s.id === progressData.status) || 0;
  
  const isFailed = progressData.status === 'failed';
  const isCompleted = progressData.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="p-8 text-center">
        {isFailed ? (
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-10 w-10" />
          </div>
        ) : isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>
        ) : (
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isFailed ? 'Processing Failed' : isCompleted ? 'Your assignment is ready! 🎉' : 'Processing Assignment'}
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {progressData.currentStep}
        </p>

        {!isFailed && !isCompleted && (
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm font-medium">
              <span className="text-brand-600 dark:text-brand-400">Progress</span>
              <span className="text-gray-900 dark:text-white">{progressData.progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <motion.div
                className="h-full bg-brand-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressData.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {isFailed && progressData.error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {progressData.error.message}
          </div>
        )}

        {isCompleted && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700 sm:w-auto">
              <ArrowRight className="h-4 w-4" />
              Preview Notebook
            </button>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        )}
      </div>

      {!isFailed && !isCompleted && (
        <div className="border-t border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950/50">
          <ul className="space-y-6">
            {STEPS.map((step, index) => {
              // Status logic
              const isActive = step.id === progressData.status || 
                (step.id === 'uploading' && ['uploaded'].includes(progressData.status)); // handle middle states
              const isPast = currentStepIndex > index || progressData.status === 'uploaded' && index === 0;

              return (
                <li key={step.id} className="relative flex items-start gap-4">
                  {index !== STEPS.length - 1 && (
                    <div
                      className={`absolute left-3 top-8 -bottom-4 w-px ${
                        isPast ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                  
                  <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                    {isPast ? (
                      <CheckCircle2 className="h-6 w-6 text-brand-500" />
                    ) : isActive ? (
                      <div className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                    )}
                  </div>
                  
                  <div className="pt-0.5">
                    <p className={`text-sm font-medium ${
                      isPast || isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </motion.div>
  );
};
