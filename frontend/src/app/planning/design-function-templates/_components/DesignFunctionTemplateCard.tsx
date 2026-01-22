"use client";

import React from 'react';
import { DesignFunctionTemplateData, GroupFunction } from '@/services/designFunctionTemplate.service';

interface DesignFunctionTemplateCardProps {
  template: DesignFunctionTemplateData;
  onView: (template: DesignFunctionTemplateData) => void;
  onEdit: (template: DesignFunctionTemplateData) => void;
  onDelete: (template: DesignFunctionTemplateData) => void;
}

const DesignFunctionTemplateCard: React.FC<DesignFunctionTemplateCardProps> = ({ template, onView, onEdit, onDelete }) => {
  const getGroupFunctionName = () => {
    if (typeof template.groupFunction === 'object' && template.groupFunction?.name) {
      return template.groupFunction.name;
    } else {
      return 'No Group Function Assigned';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between" style={{ borderTop: `5px solid ${template.color || '#FFFFFF'}` }}>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{template.name}</h3>
        {template.code && (
          <p className="text-sm text-gray-600 font-medium">Code: {template.code}</p>
        )}
        <p className="text-sm text-gray-600 mt-2">{template.description || 'No description available.'}</p>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-gray-500">
            <strong>Group Function:</strong> {getGroupFunctionName()}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Manpower Factor:</strong> {template.manpowerFactor || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Display Order:</strong> {template.displayOrder !== undefined ? template.displayOrder : 'N/A'}
          </p>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={() => onView(template)}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </button>
        <button
          onClick={() => onEdit(template)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(template)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DesignFunctionTemplateCard;