// =====================================================================
// Custom Themed Modal Component
// Replaces ugly native browser window.alert() and window.confirm().
// Matches the website theme (dark mode, glassmorphism, accent amber).
// =====================================================================

'use client';

import React from 'react';
import { Sparkles, AlertTriangle, X } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  featureName?: string;
}

export function ComingSoonModal({
  isOpen,
  onClose,
  title = 'Feature Coming Soon',
  featureName = 'This feature',
}: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-[#141824] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-150 cursor-auto"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-6 h-6 stroke-[2]" />
        </div>

        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
            <strong className="text-zinc-800 dark:text-zinc-200">{featureName}</strong> is currently under active development and will be available in the upcoming release!
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-semibold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-[#141824] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 cursor-auto"
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-amber-400 hover:bg-amber-500 text-zinc-950'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
