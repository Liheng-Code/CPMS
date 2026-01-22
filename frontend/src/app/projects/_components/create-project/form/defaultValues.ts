import { ProjectFormData } from './ProjectFormSchema';

export const defaultValues: ProjectFormData = {
  projectName: '',
  projectCode: '',
  projectType: 'Building', // Default or first option
  projectCategory: 'Residential', // Default or first option
  projectStatus: 'Planning', // Default or first option
  clientOwner: '',
  description: '',
  plannedStartDate: '',
  plannedEndDate: '',
  estimatedBudget: 0,
  currency: 'USD', // Default currency
};