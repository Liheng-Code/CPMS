import { z } from 'zod';

export const ProjectFormSchema = z.object({
  projectName: z.string().min(1, 'Project Name is required'),
  projectCode: z.string().min(1, 'Project Code is required'),
  projectType: z.enum(['Building', 'Road', 'Bridge', 'Industrial']),
  projectCategory: z.enum(['Residential', 'Commercial', 'Infrastructure']),
  projectStatus: z.enum(['Planning', 'Active', 'On Hold']),
  clientOwner: z.string().min(1, 'Client / Owner is required'),
  description: z.string().optional(),
  plannedStartDate: z.string().min(1, 'Planned Start Date is required'),
  plannedEndDate: z.string().min(1, 'Planned End Date is required'),
  estimatedBudget: z.string().optional(),
  currency: z.string().min(1, 'Currency is required'),
});

export type ProjectFormData = z.infer<typeof ProjectFormSchema>;