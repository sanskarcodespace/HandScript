'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Eye, Trash2, FileText, Grid, List, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { EmptyState, NotebookIllustration } from '../ui/EmptyState';
import { cn } from '../../lib/utils';

export interface Assignment {
  id: string;
  title: string;
  createdAt: string;
  questionsCount: number;
  pages: number;
  status: 'processing' | 'completed' | 'failed';
  thumbnailUrl?: string;
}

interface RecentAssignmentsProps {
  assignments: Assignment[];
  isLoading?: boolean;
}

export const RecentAssignments: React.FC<RecentAssignmentsProps> = ({
  assignments,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
            </span>
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Failed
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <SkeletonLoader className="h-10 w-10 rounded" />
              <div className="space-y-2">
                <SkeletonLoader className="h-4 w-32" />
                <SkeletonLoader className="h-3 w-20" />
              </div>
            </div>
            <SkeletonLoader className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        description="Upload your first assignment to get started with HandNote AI."
        illustration={<NotebookIllustration />}
        action={
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Create New Assignment
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Assignments</h2>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900 sm:flex">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/history"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center"
          >
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{assignment.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>{format(new Date(assignment.createdAt), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{assignment.questionsCount} questions</span>
                      <span>•</span>
                      <span>{assignment.pages} pages</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {getStatusBadge(assignment.status)}
                  <div className="flex items-center gap-2">
                    <button className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800 dark:hover:text-brand-400">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-32 items-center justify-center bg-gray-100 dark:bg-gray-800">
                <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  {getStatusBadge(assignment.status)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(assignment.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <h3 className="mb-1 truncate font-medium text-gray-900 dark:text-white">
                  {assignment.title}
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {assignment.questionsCount} questions • {assignment.pages} pages
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <button className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                    <Eye className="h-4 w-4" /> View
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="rounded p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
