


import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon: Modern sleek pulse / dumbbell badge */}
      <div className="w-8 h-8 rounded-full bg-[#181D27] flex items-center justify-center text-white shadow-sm shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-white"
        >
          <path d="M6 8l4-4 4 4" />
          <path d="M18 16l-4 4-4-4" />
          <circle cx="9" cy="9" r="2" fill="currentColor" />
          <circle cx="15" cy="15" r="2" fill="currentColor" />
        </svg>
      </div>
      <span className="text-xl font-extrabold tracking-tight text-[#181D27]">
        GymPulse
      </span>
    </div>
  );
}
