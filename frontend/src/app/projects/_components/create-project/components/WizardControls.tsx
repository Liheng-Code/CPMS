"use client";

import React from 'react';
import { useWizard } from '../WizardProvider';
import { useProjectCreate } from '../form/useProjectCreate';
import { useFormContext } from 'react-hook-form';

interface WizardControlsProps {
  onClose: () => void;
  onSuccess: () => void; // Callback for successful submission
}

export default function WizardControls({ onClose, onSuccess }: WizardControlsProps) {
  const { currentStep, totalSteps, goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = useWizard();
  const { handleSubmit: submitForm } = useProjectCreate();
  const { trigger } = useFormContext();

  const handleNext = async () => {
    // Validate current step before going to the next
    const isValid = await trigger(); // Validates all fields registered with RHF
    if (isValid) {
      goToNextStep();
    } else {
      // Optionally scroll to errors or show a message
      console.log("Validation failed for current step.");
    }
  };

  const handleFinalSubmit = async () => {
    await submitForm(onSuccess);
  };

  return (
    <div className="mt-4 flex justify-end space-x-2">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
      >
        Cancel
      </button>

      {!isFirstStep && (
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
      )}

      {isLastStep ? (
        <button
          type="button"
          onClick={handleFinalSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Submit Project
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      )}
    </div>
  );
}