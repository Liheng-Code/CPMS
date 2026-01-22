// frontend/src/services/discipline.service.ts

export interface DisciplineData {
  _id: string; // Add _id for existing disciplines
  name: string;
  code?: string;
  description?: string;
  color?: string;
  displayOrder?: number;
  createdAt: string; // Add timestamp fields
  updatedAt: string; // Add timestamp fields
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

export const disciplineService = {
  createDiscipline: async (disciplineData: Omit<DisciplineData, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disciplines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add authorization if needed
        },
        body: JSON.stringify(disciplineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create discipline');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating discipline:', error);
      throw error;
    }
  },

  getAllDisciplines: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/disciplines`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add authorization if needed
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch disciplines');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      throw error;
    }
  },

  getDisciplineById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disciplines/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch discipline');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching discipline:', error);
      throw error;
    }
  },

  updateDiscipline: async (id: string, disciplineData: Partial<DisciplineData>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disciplines/${id}`, {
        method: 'PATCH', // Using PATCH for partial updates
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(disciplineData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update discipline');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating discipline:', error);
      throw error;
    }
  },

  deleteDiscipline: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disciplines/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete discipline');
      }
      // No content on successful delete, just confirm status
    } catch (error) {
      console.error('Error deleting discipline:', error);
      throw error;
    }
  },
};
