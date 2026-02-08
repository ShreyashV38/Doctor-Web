"use client";

import { Fragment } from "react";

type ModalType = "success" | "error" | "info";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatusModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  actionLabel = "Okay",
  onAction,
}: StatusModalProps) {
  if (!isOpen) return null;

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Icon Circle */}
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6 ${
          type === "error" ? "bg-red-50" : "bg-blue-50"
        }`}>
          {type === "error" ? (
             <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          ) : (
             <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          )}
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
               type === "error" 
                 ? "bg-red-500 hover:bg-red-600 shadow-red-500/30 focus:ring-red-500" 
                 : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 focus:ring-blue-500"
            }`}
            onClick={handleAction}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}