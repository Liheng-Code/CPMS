"use client";

import React from 'react';

interface Task {
  _id: string;
  taskName: string;
  description?: string;
  defaultDurationDays?: number;
  defaultRevision?: string;
  color?: string;
}

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between" style={{ borderTop: `5px solid ${task.color || '#FFFFFF'}` }}>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{task.taskName}</h3>
        <p className="text-sm text-gray-600 mt-2">{task.description || 'No description available.'}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            <strong>Duration:</strong> {task.defaultDurationDays !== undefined ? `${task.defaultDurationDays} days` : 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Revision:</strong> {task.defaultRevision || 'N/A'}
          </p>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={() => onView(task)}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </button>
        <button
          onClick={() => onEdit(task)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
