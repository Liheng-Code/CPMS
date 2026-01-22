"use client";

import React from 'react';

interface SuccessViewProps {
  onClose: () => void;
}

export default function SuccessView({ onClose }: SuccessViewProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
      <svg
        className="w-16 h-16 text-green-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
        ></path>
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Created Successfully!</h2>
      <p className="text-gray-600 mb-6 text-center">
        Your new project has been successfully created. You can now view its details or continue managing your projects.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Go to Projects
      </button>
    </div>
  );
}