"use client";

import React from 'react';

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

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView, onEdit }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.projectName}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Code:</span> {project.projectCode || 'N/A'}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Location:</span> {project.projectLocation || 'N/A'}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Client:</span> {project.client || 'N/A'}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}
      </p>
      {project.dueDate && (
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Due Date:</span> {new Date(project.dueDate).toLocaleDateString()}
        </p>
      )}
      <p className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Status:</span>
        <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          project.status === 'Active' ? 'bg-green-100 text-green-800' :
          project.status === 'Planned' ? 'bg-blue-100 text-blue-800' :
          project.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status}
        </span>
      </p>

      <div className="flex justify-end items-center space-x-2 border-t pt-3 mt-3 border-gray-100">
        <button
          onClick={() => onView(project)}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          View
        </button>
        <button
          onClick={() => onEdit(project)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;