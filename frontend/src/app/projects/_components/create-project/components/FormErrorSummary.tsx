"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from '../form/ProjectFormSchema';

export default function FormErrorSummary() {
  const { formState: { errors } } = useFormContext<ProjectFormData>();
  const errorMessages = Object.values(errors).map(error => error?.message).filter(Boolean);

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">Please correct the following errors:</strong>
      <ul className="mt-2 list-disc list-inside">
        {errorMessages.map((message, index) => (
          <li key={index}>{message as string}</li>
        ))}
      </ul>
    </div>
  );
}
