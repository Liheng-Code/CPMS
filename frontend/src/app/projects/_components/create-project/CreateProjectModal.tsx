"use client";

import React, { useState } from 'react';
import { ProjectFormProvider } from './form/ProjectFormProvider';
import { WizardProvider, useWizard } from './WizardProvider';
import WizardStepper from './components/WizardStepper';
import WizardControls from './components/WizardControls';
import SuccessView from './components/SuccessView';
import FormErrorSummary from './components/FormErrorSummary'; // Import FormErrorSummary

interface CreateProjectModalProps {
  onClose: () => void;
}

import StepBasicInfo from './steps/StepBasicInfo';
import StepLocation from './steps/StepLocation';
import StepStakeholders from './steps/StepStakeholders';
import StepContract from './steps/StepContract';
import StepDocuments from './steps/StepDocuments';
import StepReview from './steps/StepReview';

const steps = [
    StepBasicInfo,
    StepLocation,
    StepStakeholders,
    StepContract,
    StepDocuments,
    StepReview,
];
const totalSteps = steps.length;

function CreateProjectModalContent({ onClose }: CreateProjectModalProps) {
  const { currentStep } = useWizard();
  const [showSuccess, setShowSuccess] = useState(false);
  const CurrentStepComponent = steps[currentStep];

  const handleSuccess = () => {
    setShowSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <WizardStepper />
        {showSuccess ? (
          <SuccessView onClose={onClose} />
        ) : (
          <>
            <FormErrorSummary /> {/* Render FormErrorSummary here */}
            <div>
              <CurrentStepComponent />
            </div>
            <WizardControls onClose={onClose} onSuccess={handleSuccess} />
          </>
        )}
      </div>
    </div>
  );
}

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
    return (
        <ProjectFormProvider>
            <WizardProvider totalSteps={totalSteps}>
                <CreateProjectModalContent onClose={onClose} />
            </WizardProvider>
        </ProjectFormProvider>
    );
}