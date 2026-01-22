"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { designFunctionTemplateService, DesignFunctionTemplateData, GroupFunction } from '../../services/designFunctionTemplate.service';
import { groupFunctionService, GroupFunction } from '../../services/groupFunction.service';

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0B37E', '#8A2BE2'
];

interface CreateDesignFunctionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: DesignFunctionTemplateData) => void;
  templateToEdit?: DesignFunctionTemplateData | null;
  readOnly?: boolean;
}

export default function CreateDesignFunctionTemplateModal({
  isOpen,
  onClose,
  onSave,
  templateToEdit,
  readOnly = false,
}: CreateDesignFunctionTemplateModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [groupFunction, setGroupFunction] = useState('');
  const [manpowerFactor, setManpowerFactor] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [groupFunctions, setGroupFunctions] = useState<GroupFunction[]>([]);
  const [groupFunctionsLoading, setGroupFunctionsLoading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isEditMode = !!templateToEdit && !readOnly;

  useEffect(() => {
    if (isOpen) {
      // Load group functions for dropdown
      const loadGroupFunctions = async () => {
        setGroupFunctionsLoading(true);
        try {
          const functions = await groupFunctionService.getAllGroupFunctions();
          setGroupFunctions(functions);
        } catch (err: any) {
          console.error('Failed to load group functions:', err);
        } finally {
          setGroupFunctionsLoading(false);
        }
      };
      loadGroupFunctions();

      // Form initialization
      if (isEditMode || readOnly) {
        setName(templateToEdit?.name || '');
        setCode(templateToEdit?.code || '');
        setDescription(templateToEdit?.description || '');
        setManpowerFactor(templateToEdit?.manpowerFactor?.toString() || '');
        setDisplayOrder(templateToEdit?.displayOrder?.toString() || '');
        setColor(templateToEdit?.color || '#FFFFFF');
        
        // Handle group function
        if (typeof templateToEdit?.groupFunction === 'object') {
          setGroupFunction(templateToEdit.groupFunction._id);
        } else {
          setGroupFunction(templateToEdit?.groupFunction?.toString() || '');
        }
      } else {
        setName('');
        setCode('');
        setDescription('');
        setManpowerFactor('');
        setDisplayOrder('');
        setColor('#FFFFFF');
        setGroupFunction('');
      }
      setError(null);

      // Modal positioning
      if (modalRef.current) {
        const modalWidth = modalRef.current.offsetWidth;
        const modalHeight = modalRef.current.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        setPosition({
          x: (viewportWidth - modalWidth) / 2,
          y: (viewportHeight - modalHeight) / 2,
        });
      }
    } else if (!isOpen) {
      setPosition({ x: -1, y: -1 });
    }
  }, [isOpen, templateToEdit, isEditMode, readOnly]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
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
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (readOnly) {
      onClose();
      return;
    }

    const submitTemplateData = {
      name,
      code: code || undefined,
      description: description || undefined,
      groupFunction: groupFunction,
      manpowerFactor: manpowerFactor ? parseFloat(manpowerFactor) : 1,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      color: color || '#FFFFFF',
    };

    try {
      let savedTemplate;
      if (isEditMode && templateToEdit) {
        savedTemplate = await designFunctionTemplateService.updateDesignFunctionTemplate(templateToEdit._id, submitTemplateData);
      } else {
        savedTemplate = await designFunctionTemplateService.createDesignFunctionTemplate(submitTemplateData);
      }
      console.log('Design Function Template saved successfully:', savedTemplate);
      onSave(savedTemplate);
      onClose();
    } catch (err: any) {
      setError(err.message || `An unknown error occurred during template ${isEditMode ? 'update' : 'creation'}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col absolute"
        style={position.x !== -1 ? { left: position.x, top: position.y } : undefined}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 border-b border-gray-200 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {readOnly ? 'View Design Function Template' : (isEditMode ? 'Edit Design Function Template' : 'Add New Design Function Template')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-y-auto">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Foundation Design"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  readOnly={readOnly}
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  id="code"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., FDN"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  readOnly={readOnly}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="groupFunction" className="block text-sm font-medium text-gray-700 mb-1">
                Group Function *
              </label>
              <select
                id="groupFunction"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                value={groupFunction}
                onChange={(e) => setGroupFunction(e.target.value)}
                required
                disabled={readOnly || groupFunctionsLoading}
              >
                <option value="">
                  {groupFunctionsLoading ? 'Loading...' : 'Select a Group Function'}
                </option>
                {groupFunctions.map((gf) => (
                  <option key={gf._id} value={gf._id}>
                    {gf.name}
                  </option>
                ))}
              </select>
              {groupFunctionsLoading && (
                <p className="mt-1 text-sm text-gray-500">Loading Group Functions...</p>
              )}
              {!groupFunctionsLoading && groupFunctions.length === 0 && (
                <p className="mt-1 text-sm text-orange-600">No Group Functions available. Please create a Group Function first.</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Provide a brief description of the design function template."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={readOnly}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="manpowerFactor" className="block text-sm font-medium text-gray-700 mb-1">
                  Manpower Factor
                </label>
                <input
                  type="number"
                  id="manpowerFactor"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 1.5"
                  value={manpowerFactor}
                  onChange={(e) => setManpowerFactor(e.target.value)}
                  min="0"
                  step="0.1"
                  readOnly={readOnly}
                />
              </div>
              <div>
                <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  id="displayOrder"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  min="0"
                  readOnly={readOnly}
                />
              </div>
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  id="color"
                  className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {readOnly ? 'Close' : 'Cancel'}
            </button>
            {!readOnly && (
                <button
                  type="submit"
                  disabled={loading || groupFunctionsLoading || groupFunctions.length === 0}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  title={groupFunctions.length === 0 ? 'Please create a Group Function first' : ''}
                >
                  {loading ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add New')}
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}