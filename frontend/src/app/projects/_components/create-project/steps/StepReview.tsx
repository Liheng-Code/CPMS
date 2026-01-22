"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from '../form/ProjectFormSchema';

export default function StepReview() {
  const { getValues } = useFormContext<ProjectFormData>();
  const formData = getValues();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-2">Review Project Details</h3>
      <div className="bg-gray-100 p-4 rounded-md">
        {Object.entries(formData).map(([key, value]) => (
          <p key={key} className="text-sm">
            <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</span> {String(value)}
          </p>
        ))}
      </div>
    </div>
  );
}