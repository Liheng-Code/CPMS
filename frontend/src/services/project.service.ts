// frontend/src/services/project.service.ts

interface ProjectData {
  projectName: string;
  description?: string;
  startDate: string;
  dueDate?: string;
  client?: string;
  projectCode?: string; // New field
  projectLocation?: string; // New field
  // projectManager?: string; // Removed
  budget?: number;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'; // Corrected backend URL

export const projectService = {
  createProject: async (projectData: ProjectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add authorization if needed
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  getAllProjects: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add authorization if needed
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch projects');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  updateProject: async (id: string, projectData: Partial<ProjectData>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Add authorization if needed
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },
  // Other project-related service calls would go here
};
