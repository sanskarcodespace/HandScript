import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, CheckCircle, Zap, Download } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-gray-950">
      {/* Left side: Brand panel (hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <PenTool className="h-6 w-6 text-white" />
            </div>
            HandNote AI
          </div>
          <h1 className="mt-12 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Upload questions.<br />
            Get handwritten answers.<br />
            <span className="text-brand-200">Instantly.</span>
          </h1>
        </div>

        {/* Animated illustration area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-64 w-full rounded-xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            {/* Placeholder for notebook illustration lines */}
            <div className="h-full w-full bg-[linear-gradient(transparent_95%,#ffffff_95%)] bg-[length:100%_24px]"></div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="h-1.5 w-1/3 rounded-full bg-brand-300 origin-left mb-4"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            className="h-1.5 w-3/4 rounded-full bg-white/60 origin-left mb-4"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 2.2 }}
            className="h-1.5 w-2/3 rounded-full bg-white/60 origin-left mb-4"
          />
        </motion.div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Zap className="h-6 w-6 text-brand-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI-powered answers</h3>
              <p className="text-brand-100">Automatically generate high-quality solutions.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
              <PenTool className="h-6 w-6 text-brand-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Realistic handwriting</h3>
              <p className="text-brand-100">Render text directly onto notebook backgrounds.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Download className="h-6 w-6 text-brand-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Instant PDF export</h3>
              <p className="text-brand-100">Download and print your assignments instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth forms */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 md:px-12 lg:w-1/2 xl:px-24">
        {/* Mobile Header */}
        <div className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
            <PenTool className="h-6 w-6 text-white" />
          </div>
          HandNote AI
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
