"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from './form/ProjectFormSchema';

interface WizardContextType {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setStep: (step: number) => void;
  formData: ProjectFormData;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

interface WizardProviderProps {
  children: React.ReactNode;
  totalSteps: number;
}

export const WizardProvider = ({ children, totalSteps }: WizardProviderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { getValues } = useFormContext<ProjectFormData>();

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const setStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  };

  const formData = getValues();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const value = useMemo(() => ({
    currentStep,
    goToNextStep,
    goToPreviousStep,
    setStep,
    formData,
    isFirstStep,
    isLastStep,
    totalSteps,
  }), [currentStep, formData, isFirstStep, isLastStep, totalSteps]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
