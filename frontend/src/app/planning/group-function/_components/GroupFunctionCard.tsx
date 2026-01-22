"use client";

import React from 'react';
import { GroupFunction } from '@/services/groupFunction.service';

interface GroupFunctionCardProps {
  groupFunction: GroupFunction;
  onView: (groupFunction: GroupFunction) => void;
  onEdit: (groupFunction: GroupFunction) => void;
  onDelete: (groupFunction: GroupFunction) => void;
}

const GroupFunctionCard: React.FC<GroupFunctionCardProps> = ({ groupFunction, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between" style={{ borderTop: `5px solid ${groupFunction.color}` }}>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{groupFunction.name}</h3>
        <p className="text-sm text-gray-600 mt-2">{groupFunction.description || 'No description available.'}</p>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={() => onView(groupFunction)}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </button>
        <button
          onClick={() => onEdit(groupFunction)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(groupFunction)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GroupFunctionCard;
