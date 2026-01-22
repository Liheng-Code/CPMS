// frontend/src/services/designFunctionTemplate.service.ts

export interface GroupFunction {
  _id: string;
  name: string;
  description?: string;
  displayOrder?: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DesignFunctionTemplateData {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  groupFunction: string | GroupFunction;
  manpowerFactor?: number;
  displayOrder?: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

export const designFunctionTemplateService = {
  createDesignFunctionTemplate: async (templateData: Omit<DesignFunctionTemplateData, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/design-function-templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create design function template');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating design function template:', error);
      throw error;
    }
  },

  getAllDesignFunctionTemplates: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/design-function-templates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch design function templates');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching design function templates:', error);
      throw error;
    }
  },

  getDesignFunctionTemplateById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/design-function-templates/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch design function template');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching design function template:', error);
      throw error;
    }
  },

  updateDesignFunctionTemplate: async (id: string, templateData: Partial<DesignFunctionTemplateData>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/design-function-templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update design function template');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating design function template:', error);
      throw error;
    }
  },

  deleteDesignFunctionTemplate: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/design-function-templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete design function template');
      }
    } catch (error) {
      console.error('Error deleting design function template:', error);
      throw error;
    }
  },
};