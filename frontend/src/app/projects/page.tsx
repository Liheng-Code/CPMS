"use client";

import { useState, useEffect, useMemo } from 'react';
import CreateProjectButton from './_components/CreateProjectButton';
import EditProjectModal from '../../components/modals/EditProjectModal';
import ViewProjectModal from '../../components/modals/ViewProjectModal';
import ProjectCard from './_components/ProjectCard'; // Import new ProjectCard component
import { projectService } from '../../services/project.service';

interface Project {
  _id: string;
  projectName: string;
  projectCode?: string;
  projectLocation?: string;
  description?: string;
  startDate: string;
  dueDate?: string;
  client?: string;
  budget?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Define possible project statuses for the filter
const projectStatuses = ['All', 'Draft', 'Planned', 'Pending Approval', 'Active', 'Completed', 'Cancelled'];

type ViewMode = 'list' | 'card'; // Define ViewMode type

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [projectToView, setProjectToView] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [filterStatus, setFilterStatus] = useState<string>('All'); // State for status filter
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // State for view mode

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleEditClick = (project: Project) => {
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (project: Project) => {
    setProjectToView(project);
    setIsViewModalOpen(true);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === updatedProject._id ? updatedProject : project
      )
    );
    setProjectToEdit(null);
    setIsEditModalOpen(false);
  };

  // Filter projects based on searchTerm and filterStatus
  const filteredProjects = useMemo(() => {
    let currentFilteredProjects = projects;

    // Apply status filter first
    if (filterStatus !== 'All') {
      currentFilteredProjects = currentFilteredProjects.filter(
        (project) => project.status === filterStatus
      );
    }

    // Apply search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredProjects = currentFilteredProjects.filter(
        (project) =>
          project.projectName.toLowerCase().includes(lowerCaseSearchTerm) ||
          (project.projectCode && project.projectCode.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (project.projectLocation && project.projectLocation.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (project.description && project.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (project.client && project.client.toLowerCase().includes(lowerCaseSearchTerm)) ||
          project.status.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return currentFilteredProjects;
  }, [projects, searchTerm, filterStatus]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Project Portfolio</h2>
        <CreateProjectButton onProjectCreated={handleProjectCreated} />
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search projects..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
        >
          {projectStatuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
        {/* View Toggle Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'card' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Card View
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-600">Loading projects...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {/* No projects found messages */}
      {!loading && !error && filteredProjects.length === 0 && !searchTerm && filterStatus === 'All' && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-lg text-gray-700 mb-2">No projects found.</p>
          <p className="text-gray-500">Click "+ New Project" to add your first project.</p>
        </div>
      )}

      {!loading && !error && filteredProjects.length === 0 && (searchTerm || filterStatus !== 'All') && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-lg text-gray-700 mb-2">No projects match your current criteria.</p>
          <p className="text-gray-500">Try adjusting your search term or filter.</p>
        </div>
      )}

      {/* Project Display Area */}
      {!loading && !error && filteredProjects.length > 0 && (
        viewMode === 'list' ? (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.projectCode || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.projectLocation || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.client || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'Active' ? 'bg-green-100 text-green-800' :
                        project.status === 'Planned' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center space-x-2">
                      <button
                        onClick={() => handleViewClick(project)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(project)}
                        className="text-indigo-600 hover:text-indigo-900 ml-2"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onView={handleViewClick}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )
      )}

      {isEditModalOpen && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          projectData={projectToEdit}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {isViewModalOpen && (
        <ViewProjectModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          projectData={projectToView}
        />
      )}
    </div>
  );
}
