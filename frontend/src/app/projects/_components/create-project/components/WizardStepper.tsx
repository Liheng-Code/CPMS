"use client";

import React from 'react';
import { useWizard } from '../WizardProvider';

export default function WizardStepper() {
  const { currentStep, totalSteps, setStep } = useWizard();

  return (
    <nav className="flex justify-center mb-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`px-4 py-2 mx-1 rounded-full cursor-pointer ${
            index === currentStep
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
          }`}
          onClick={() => setStep(index)}
        >
          {index + 1}
        </div>
      ))}
    </nav>
  );
}
