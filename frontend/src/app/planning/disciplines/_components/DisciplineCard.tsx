"use client";

import React from 'react';

interface Discipline {
  _id: string;
  name: string;
  description?: string;
  color?: string;
}

interface DisciplineCardProps {
  discipline: Discipline;
  onView: (discipline: Discipline) => void;
  onEdit: (discipline: Discipline) => void;
  onDelete: (discipline: Discipline) => void;
}

const DisciplineCard: React.FC<DisciplineCardProps> = ({ discipline, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between" style={{ borderTop: `5px solid ${discipline.color || '#FFFFFF'}` }}>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{discipline.name}</h3>
        <p className="text-sm text-gray-600 mt-2">{discipline.description || 'No description available.'}</p>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={() => onView(discipline)}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </button>
        <button
          onClick={() => onEdit(discipline)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(discipline)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DisciplineCard;
