"use client";

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from './ProjectFormSchema';

export const useProjectCreate = () => {
  const { getValues, trigger } = useFormContext<ProjectFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (onSuccess: () => void) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Validate all fields before submission
      const isValid = await trigger();
      if (!isValid) {
        throw new Error('Please correct the form errors.');
      }

      const formData = getValues();
      console.log('Submitting project data:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create project.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isSuccess,
    error,
    handleSubmit,
  };
};
