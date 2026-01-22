import { z } from 'zod';

export const ProjectFormSchema = z.object({
  projectName: z.string().min(1, 'Project Name is required'),
  projectCode: z.string().min(1, 'Project Code is required'),
  projectType: z.enum(['Building', 'Road', 'Bridge', 'Industrial'], {
    required_error: 'Project Type is required',
  }),
  projectCategory: z.enum(['Residential', 'Commercial', 'Infrastructure'], {
    required_error: 'Project Category is required',
  }),
  projectStatus: z.enum(['Planning', 'Active', 'On Hold'], {
    required_error: 'Project Status is required',
  }),
  clientOwner: z.string().min(1, 'Client / Owner is required'),
  description: z.string().optional(),
  plannedStartDate: z.string().min(1, 'Planned Start Date is required'),
  plannedEndDate: z.string().min(1, 'Planned End Date is required'),
  estimatedBudget: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Estimated Budget must be a positive number')
  ),
  currency: z.string().min(1, 'Currency is required'),
});

export type ProjectFormData = z.infer<typeof ProjectFormSchema>;