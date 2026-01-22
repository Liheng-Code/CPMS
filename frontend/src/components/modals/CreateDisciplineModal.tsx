import React, { useState, useRef, useEffect, useCallback } from 'react';
import { disciplineService, DisciplineData } from '../../services/discipline.service'; // Import DisciplineData

const PRESET_COLORS = [ // Re-using preset colors for consistency
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0B37E', '#8A2BE2'
];

interface CreateDisciplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discipline: DisciplineData) => void; // Renamed from onDisciplineCreated
  disciplineToEdit?: DisciplineData | null; // New prop for editing
  readOnly?: boolean; // New prop for view-only mode
}

const CreateDisciplineModal: React.FC<CreateDisciplineModalProps> = ({
  isOpen,
  onClose,
  onSave, // Renamed from onDisciplineCreated
  disciplineToEdit,
  readOnly = false, // Default to false
}) => {
  const [disciplineName, setDisciplineName] = useState<string>('');
  const [disciplineCode, setDisciplineCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [color, setColor] = useState<string>('#FFFFFF');
  const [displayOrder, setDisplayOrder] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // State for drag functionality
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isEditMode = !!disciplineToEdit && !readOnly; // Define isEditMode here

  // Effect to set initial centered position and reset on open/close
  useEffect(() => {
    if (isOpen) {
      // Form initialization
      if (isEditMode || readOnly) { // Apply for edit and readOnly modes
        setDisciplineName(disciplineToEdit?.name || '');
        setDisciplineCode(disciplineToEdit?.code || '');
        setDescription(disciplineToEdit?.description || '');
        setColor(disciplineToEdit?.color || '#FFFFFF');
        setDisplayOrder(disciplineToEdit?.displayOrder?.toString() || '');
      } else {
        setDisciplineName('');
        setDisciplineCode('');
        setDescription('');
        setColor('#FFFFFF');
        setDisplayOrder('');
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
      setPosition({ x: -1, y: -1 });
    }
  }, [isOpen, disciplineToEdit, isEditMode, readOnly]);

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (readOnly) { // Prevent submission in readOnly mode
      onClose();
      return;
    }

    const submitDisciplineData = {
      name: disciplineName,
      code: disciplineCode || undefined,
      description: description || undefined,
      color: color || undefined,
      displayOrder: displayOrder ? parseInt(displayOrder) : undefined,
    };

    try {
      let savedDiscipline;
      if (isEditMode && disciplineToEdit) {
        savedDiscipline = await disciplineService.updateDiscipline(disciplineToEdit._id, submitDisciplineData);
      } else {
        savedDiscipline = await disciplineService.createDiscipline(submitDisciplineData);
      }
      console.log('Discipline saved successfully:', savedDiscipline);
      onSave(savedDiscipline); // Notify parent with the saved discipline
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.message || `An unknown error occurred during discipline ${isEditMode ? 'update' : 'creation'}.`);
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
            {readOnly ? 'View Discipline' : (isEditMode ? 'Edit Discipline' : 'Add New Discipline')}
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

            <div className="mb-4">
              <label htmlFor="disciplineCode" className="block text-sm font-medium text-gray-700 mb-1">
                Discipline Code
              </label>
              <input
                type="text"
                id="disciplineCode"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., CVL"
                value={disciplineCode}
                onChange={(e) => setDisciplineCode(e.target.value)}
                readOnly={readOnly}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="disciplineName" className="block text-sm font-medium text-gray-700 mb-1">
                Discipline Name
              </label>
              <input
                type="text"
                id="disciplineName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Civil Engineering"
                value={disciplineName}
                onChange={(e) => setDisciplineName(e.target.value)}
                required
                readOnly={readOnly}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Provide a brief description of the discipline."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={readOnly}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Color
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
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Discipline')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDisciplineModal;