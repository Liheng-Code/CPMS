"use client";

import React from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormSchema, ProjectFormData } from './ProjectFormSchema';
import { defaultValues } from './defaultValues';

interface ProjectFormProviderProps {
  children: React.ReactNode;
}

export const ProjectFormProvider = ({ children }: ProjectFormProviderProps) => {
  const methods = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
