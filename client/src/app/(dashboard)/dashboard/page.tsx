'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Calendar, Zap, FileOutput, UploadCloud, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../lib/api';
import { StatCard } from '../../../components/dashboard/StatCard';
import { RecentAssignments, Assignment } from '../../../components/dashboard/RecentAssignments';
import { SkeletonLoader } from '../../../components/ui/SkeletonLoader';

interface DashboardStats {
  total: number;
  today: number;
  pagesGenerated: number;
}

interface CreditsInfo {
  remaining: number;
  total: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [showHandwritingBanner, setShowHandwritingBanner] = useState(true);

  // Check localStorage for banner state on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('handnote_dismissed_hw_banner');
    if (dismissed === 'true') {
      setShowHandwritingBanner(false);
    }
  }, []);

  const dismissHandwritingBanner = () => {
    setShowHandwritingBanner(false);
    localStorage.setItem('handnote_dismissed_hw_banner', 'true');
  };

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['stats'],
    queryFn: async () => {
      // Mocking API call for now
      // const res = await api.get('/assignments/stats');
      // return res.data;
      return new Promise((resolve) => setTimeout(() => resolve({ total: 12, today: 2, pagesGenerated: 45 }), 1000));
    },
    staleTime: 30 * 1000,
  });

  // Fetch Credits
  const { data: credits, isLoading: creditsLoading } = useQuery<CreditsInfo>({
    queryKey: ['credits'],
    queryFn: async () => {
      // Mocking API call
      return new Promise((resolve) => setTimeout(() => resolve({ remaining: user?.credits || 0, total: 10 }), 1000));
    },
    staleTime: 60 * 1000,
  });

  // Fetch Recent Assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery<Assignment[]>({
    queryKey: ['assignments', { limit: 5 }],
    queryFn: async () => {
      // Mocking API call
      return new Promise((resolve) => 
        setTimeout(() => resolve([
          { id: '1', title: 'Biology Chapter 4 Questions', createdAt: new Date().toISOString(), questionsCount: 5, pages: 3, status: 'completed' },
          { id: '2', title: 'History Essay Prompt', createdAt: new Date(Date.now() - 86400000).toISOString(), questionsCount: 1, pages: 2, status: 'processing' },
          { id: '3', title: 'Physics Problem Set', createdAt: new Date(Date.now() - 172800000).toISOString(), questionsCount: 10, pages: 5, status: 'failed' },
        ]), 1500)
      );
    },
    staleTime: 60 * 1000,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const isLowCredits = credits && credits.remaining <= 2;

  return (
    <div className="space-y-8">
      {/* Alerts & Banners */}
      <AnimatePresence>
        {isLowCredits && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between rounded-lg bg-orange-50 p-4 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-800"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                ⚠️ You're running low on credits ({credits.remaining} remaining). Upgrade to continue.
              </p>
            </div>
            <Link
              href="/settings/billing"
              className="rounded-md bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-800 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:hover:bg-orange-800/80"
            >
              Upgrade Now
            </Link>
          </motion.div>
        )}

        {showHandwritingBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative flex items-center justify-between rounded-lg bg-gradient-to-r from-brand-600 to-brand-800 p-4 text-white shadow-md"
          >
            <div className="flex items-center gap-3 pr-8">
              <span className="text-xl">✨</span>
              <div>
                <p className="font-semibold">Try PersonalWrite™</p>
                <p className="text-sm text-brand-100">Upload your handwriting to get AI answers in YOUR exact style.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/settings/handwriting"
                className="hidden whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm hover:bg-gray-50 sm:block"
              >
                Upload My Handwriting
              </Link>
              <button
                onClick={dismissHandwritingBanner}
                className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Dismiss banner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your assignments today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Assignments"
          value={stats?.total || 0}
          icon={FileText}
          isLoading={statsLoading}
        />
        <StatCard
          title="Completed Today"
          value={stats?.today || 0}
          icon={Calendar}
          isLoading={statsLoading}
        />
        <StatCard
          title="Credits Remaining"
          value={`${credits?.remaining || 0} / ${credits?.total || 10}`}
          icon={Zap}
          isLoading={creditsLoading}
        />
        <StatCard
          title="Pages Generated"
          value={stats?.pagesGenerated || 0}
          icon={FileOutput}
          isLoading={statsLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/upload"
          className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-brand-600 p-8 text-center text-white transition-all hover:bg-brand-700"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20" />
          <UploadCloud className="mb-3 h-10 w-10" />
          <h3 className="text-lg font-semibold">Create New Assignment</h3>
          <p className="mt-1 text-sm text-brand-100">Upload PDF, DOCX, or image</p>
        </Link>
        
        <Link
          href="/settings/handwriting"
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm dark:bg-gray-800 dark:text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Your Handwriting</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">For personalized results</p>
        </Link>
      </div>

      {/* Recent Assignments */}
      <div>
        <RecentAssignments assignments={assignments || []} isLoading={assignmentsLoading} />
      </div>
    </div>
  );
}
