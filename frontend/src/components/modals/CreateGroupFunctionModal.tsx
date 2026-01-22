"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { groupFunctionService, GroupFunction } from '@/services/groupFunction.service';

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0B37E', '#8A2BE2'
];

interface CreateGroupFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupFunction: GroupFunction) => void;
  groupFunctionToEdit?: GroupFunction | null;
  readOnly?: boolean; // New prop for view-only mode
}

export default function CreateGroupFunctionModal({
  isOpen,
  onClose,
  onSave,
  groupFunctionToEdit,
  readOnly = false, // Default to false
}: CreateGroupFunctionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [color, setColor] = useState('#FFFFFF');
  const [error, setError] = useState<string | null>(null);

  // State for drag functionality
  const [position, setPosition] = useState({ x: -1, y: -1 }); // -1 indicates not yet positioned
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null); // Ref for the draggable modal content

  const isEditMode = !!groupFunctionToEdit;

  useEffect(() => {
    if (isOpen) {
      // Form initialization
      if (isEditMode || readOnly) { // Apply for edit and readOnly modes
        setName(groupFunctionToEdit?.name || '');
        setDescription(groupFunctionToEdit?.description || '');
        setDisplayOrder(groupFunctionToEdit?.displayOrder || 0);
        setColor(groupFunctionToEdit?.color || '#FFFFFF');
      } else {
        setName('');
        setDescription('');
        setDisplayOrder(0);
        setColor('#FFFFFF');
      }
      setError(null); // Clear previous errors

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
      // Reset position when modal closes
      setPosition({ x: -1, y: -1 });
    }
  }, [isOpen, groupFunctionToEdit, isEditMode, readOnly]); // Added readOnly to dependencies

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (modalRef.current) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []); // Removed readOnly from dependencies

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && modalRef.current) { // Removed !readOnly
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
  }, [isDragging, dragOffset]); // Removed readOnly from dependencies

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) { // Removed && !readOnly
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
  }, [isDragging, handleMouseMove, handleMouseUp]); // Removed readOnly from dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (readOnly) { // Prevent submission in readOnly mode
      onClose();
      return;
    }

    try {
      if (isEditMode && groupFunctionToEdit) {
        const updatedGroupFunction = await groupFunctionService.updateGroupFunction(groupFunctionToEdit._id, {
          name,
          description,
          displayOrder,
          color,
        });
        onSave(updatedGroupFunction);
      } else {
        const newGroupFunction = await groupFunctionService.createGroupFunction({
          name,
          description,
          displayOrder,
          color,
        });
        onSave(newGroupFunction);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} group function`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col absolute"
        style={position.x !== -1 ? { left: position.x, top: position.y } : undefined}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 border-b border-gray-200 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-xl font-bold text-gray-800">
            {readOnly ? 'View Group Function' : (isEditMode ? 'Edit Group Function' : 'Create Group Function')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-y-auto">
          <div className="p-6"> {/* Form Body */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Group Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                readOnly={readOnly}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly={readOnly}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700">Display Order</label>
              <input
                type="number"
                id="displayOrder"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly={readOnly}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-14 p-1 border border-gray-300 rounded-md"
                  readOnly={readOnly} // make color input readOnly
                />
                <div className="flex gap-1">
                  {PRESET_COLORS.map((presetColor) => (
                    <div
                      key={presetColor}
                      style={{ backgroundColor: presetColor }}
                      className={`w-8 h-8 rounded-full cursor-pointer border border-gray-200 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !readOnly && setColor(presetColor)} // Disable click in readOnly mode
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-4 p-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {!readOnly && ( // Only show Save/Add button if not in readOnly mode
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditMode ? 'Save Changes' : 'Add New'}
                </button>
              )}
            </div>
        </form>
    </div>
  </div>
);
}