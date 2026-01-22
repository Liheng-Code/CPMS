// frontend/src/services/planning.service.ts

interface PlanningTemplateData {
  designFunctionTemplate: string;
  tasks?: string[];
  designPhase: string;
  disciplines?: string[];
  groupFunction?: string;
  disciplineCostRates?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

export const planningService = {
  createPlanningTemplate: async (planningTemplateData: PlanningTemplateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/planning-templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add authorization if needed
        },
        body: JSON.stringify(planningTemplateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create planning template');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating planning template:', error);
      throw error;
    }
  },

  getAllPlanningTemplates: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/planning-templates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add authorization if needed
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch planning templates');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching planning templates:', error);
      throw error;
    }
  },
  // Other planning template-related service calls would go here
};