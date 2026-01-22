import React, { useState, useRef, useEffect, useCallback } from 'react';
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

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: Project | null; // Data to pre-fill the form
  onProjectUpdated: (updatedProject: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, projectData, onProjectUpdated }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectCode, setProjectCode] = useState<string>('');
  const [projectLocation, setProjectLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [client, setClient] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [status, setStatus] = useState<string>('Draft');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for drag functionality
  const [position, setPosition] = useState({ x: -1, y: -1 }); // -1 indicates not yet positioned
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null); // Ref for the draggable modal content

  // Effect to populate form when projectData changes
  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.projectName);
      setProjectCode(projectData.projectCode || '');
      setProjectLocation(projectData.projectLocation || '');
      setDescription(projectData.description || '');
      setStartDate(projectData.startDate.split('T')[0]); // Format date for input type="date"
      setDueDate(projectData.dueDate ? projectData.dueDate.split('T')[0] : '');
      setClient(projectData.client || '');
      setBudget(projectData.budget ? String(projectData.budget) : '');
      setStatus(projectData.status);
      setError(null); // Clear errors when new data is loaded
    }
  }, [projectData]);

  // Effect to set initial centered position and reset on open/close
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate initial centered position
      setPosition({
        x: (viewportWidth - modalWidth) / 2,
        y: (viewportHeight - modalHeight) / 2,
      });
      setError(null); // Clear errors when modal opens
    } else if (!isOpen) {
      // Reset position when modal closes
      setPosition({ x: -1, y: -1 });
    }
  }, [isOpen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain movement within the viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;

      const constrainedX = Math.max(0, Math.min(newX, viewportWidth - modalWidth));
      const constrainedY = Math.max(0, Math.min(newY, viewportHeight - modalHeight));
      
      setPosition({ x: constrainedX, y: constrainedY });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen || !projectData) return null; // Render nothing if not open or no data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updatedProjectData = {
      _id: projectData._id, // Include ID for update
      projectName,
      projectCode,
      projectLocation,
      description,
      startDate,
      dueDate,
      client,
      budget: budget ? parseFloat(budget) : undefined,
      status,
    };

    try {
      const result = await projectService.updateProject(updatedProjectData._id, updatedProjectData);
      console.log('Project updated successfully:', result);
      onProjectUpdated(result); // Notify parent
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during project update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col absolute"
        style={position.x !== -1 ? { left: position.x, top: position.y } : undefined}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 border-b border-gray-200 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-xl font-semibold text-gray-800">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="editProjectName" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="editProjectName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Q4 Marketing Campaign"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editProjectCode" className="block text-sm font-medium text-gray-700 mb-1">
              Project Code
            </label>
            <input
              type="text"
              id="editProjectCode"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., PRJ-001"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editProjectLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Project Location
            </label>
            <input
              type="text"
              id="editProjectLocation"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., New York, NY"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="editDescription"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Provide a brief overview of the project goals and scope."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="editStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="editStartDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="editDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="editDueDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="editClient" className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <input
              type="text"
              id="editClient"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Select or type client name"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editBudget" className="block text-sm font-medium text-gray-700 mb-1">
              Budget (Optional)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="editBudget"
                className="block w-full rounded-md border border-gray-300 pl-7 pr-12 p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="editStatus"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Draft">Draft</option>
              <option value="Planned">Planned</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
