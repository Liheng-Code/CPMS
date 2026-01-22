import React, { useState, useRef, useEffect, useCallback } from 'react';

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

interface ViewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: Project | null; // Data to display
}

const ViewProjectModal: React.FC<ViewProjectModalProps> = ({ isOpen, onClose, projectData }) => {
  // State for drag functionality - reuse from other modals
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Effect to set initial centered position and reset on open/close
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      setPosition({
        x: (viewportWidth - modalWidth) / 2,
        y: (viewportHeight - modalHeight) / 2,
      });
    } else if (!isOpen) {
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

  if (!isOpen || !projectData) return null;

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
          <h2 className="text-xl font-semibold text-gray-800">Project Details: {projectData.projectName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Details Body */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Project Name:</p>
            <p className="text-gray-900 font-bold">{projectData.projectName}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Project Code:</p>
            <p className="text-gray-900">{projectData.projectCode || 'N/A'}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Project Location:</p>
            <p className="text-gray-900">{projectData.projectLocation || 'N/A'}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Description:</p>
            <p className="text-gray-900">{projectData.description || 'N/A'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Start Date:</p>
              <p className="text-gray-900">{new Date(projectData.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Due Date:</p>
              <p className="text-gray-900">{projectData.dueDate ? new Date(projectData.dueDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Client:</p>
            <p className="text-gray-900">{projectData.client || 'N/A'}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Budget:</p>
            <p className="text-gray-900">{projectData.budget ? `$${projectData.budget.toLocaleString()}` : 'N/A'}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Status:</p>
            <p className="text-gray-900">{projectData.status}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Created At:</p>
            <p className="text-gray-900">{new Date(projectData.createdAt).toLocaleString()}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Last Updated:</p>
            <p className="text-gray-900">{new Date(projectData.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectModal;
