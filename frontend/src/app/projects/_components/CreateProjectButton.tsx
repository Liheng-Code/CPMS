"use client";

import { useState } from 'react';
import CreateProjectModal from '../../../components/modals/CreateProjectModal';

interface CreateProjectButtonProps {
  onProjectCreated: (project: any) => void; // Callback to inform parent of new project
}

export default function CreateProjectButton({ onProjectCreated }: CreateProjectButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => setIsModalOpen(true)}
      >
        + New Project
      </button>

      {isModalOpen && (
        <CreateProjectModal
          isOpen={isModalOpen} // ADDED: Pass isModalOpen state to the modal
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={onProjectCreated} // Pass the callback
          onSubmit={(projectData) => { // This onSubmit is no longer used for API call in modal
            console.log('Project Data Submitted (via old onSubmit prop):', projectData);
            // The actual submission is now handled internally by CreateProjectModal
            setIsModalOpen(false); // Close modal after submission
          }}
        />
      )}
    </>
  );
}
