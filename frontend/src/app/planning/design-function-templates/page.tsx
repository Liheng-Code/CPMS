"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { designFunctionTemplateService, DesignFunctionTemplateData } from '../../../services/designFunctionTemplate.service';
import CreateDesignFunctionTemplateModal from '../../../components/modals/CreateDesignFunctionTemplateModal';
import DesignFunctionTemplateCard from './_components/DesignFunctionTemplateCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface DesignFunctionTemplate extends DesignFunctionTemplateData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'list' | 'card';

export default function DesignFunctionTemplatesPage() {
  const [templates, setTemplates] = useState<DesignFunctionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DesignFunctionTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<DesignFunctionTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const router = useRouter();

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await designFunctionTemplateService.getAllDesignFunctionTemplates();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch design function templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSave = (savedTemplate: DesignFunctionTemplate) => {
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) => (t._id === savedTemplate._id ? savedTemplate : t))
      );
    } else {
      setTemplates((prev) => [...prev, savedTemplate]);
    }
    setIsModalOpen(false);
    setEditingTemplate(null);
    setViewingTemplate(null);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedTemplates = Array.from(templates);
    const [removed] = reorderedTemplates.splice(result.source.index, 1);
    reorderedTemplates.splice(result.destination.index, 0, removed);

    setTemplates(reorderedTemplates);

    // Update displayOrder in backend
    try {
      const originalTemplatesMap = new Map(templates.map(t => [t._id, t]));
      
      const updates = reorderedTemplates.map(async (template, index) => {
        const originalTemplate = originalTemplatesMap.get(template._id);
        if (originalTemplate && originalTemplate.displayOrder !== index) {
          return designFunctionTemplateService.updateDesignFunctionTemplate(template._id, { displayOrder: index });
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    } catch (err: any) {
      console.error('Failed to update template display order:', err);
      setError('Failed to update display order.');
      fetchTemplates(); 
    }
  };

  const filteredTemplates = useMemo(() => {
    let currentFilteredTemplates = templates;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredTemplates = currentFilteredTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (template.code && template.code.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (template.description && template.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Sort by displayOrder
    currentFilteredTemplates.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return currentFilteredTemplates;
  }, [templates, searchTerm]);

  const handleViewTemplate = (template: DesignFunctionTemplate) => {
    setViewingTemplate(template);
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template: DesignFunctionTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = async (template: DesignFunctionTemplate) => {
    setError(null);
    if (!window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
        return;
    }
    try {
        await designFunctionTemplateService.deleteDesignFunctionTemplate(template._id);
        setTemplates((prev) => prev.filter((t) => t._id !== template._id));
    } catch (err: any) {
        setError(err.message || 'Failed to delete design function template');
    }
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setViewingTemplate(null);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            &larr; Back
          </button>
        </div>
        <div className="w-1/3 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Design Function Templates</h2>
        </div>
        <div className="w-1/3 flex justify-end">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span className="text-xl font-bold">+</span>
            <span>Add Template</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search templates..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'card' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Card View
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-600">Loading templates...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-lg text-gray-700 mb-2">No templates found.</p>
          <p className="text-gray-500">Click "+ Add Template" to create your first design function template.</p>
        </div>
      )}

      {!loading && !error && filteredTemplates.length > 0 && (
        viewMode === 'list' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group Function
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manpower Factor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Display Order
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <Droppable droppableId="templates-list">
                  {(provided) => (
                    <tbody
                      className="bg-white divide-y divide-gray-200"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredTemplates.map((template, index) => (
                        <Draggable key={template._id} draggableId={template._id} index={index}>
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {template.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {template.code || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {typeof template.groupFunction === 'object' && template.groupFunction?.name ? template.groupFunction.name : 'No Group Function Assigned'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {template.manpowerFactor || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {template.displayOrder !== undefined ? template.displayOrder : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleViewTemplate(template)} className="text-blue-600 hover:text-blue-900">View</button>
                                <button onClick={() => handleEditTemplate(template)} className="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                                <button onClick={() => handleDeleteTemplate(template)} className="text-red-600 hover:text-red-900 ml-2">Delete</button>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </table>
            </div>
          </DragDropContext>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="templates-card-grid">
              {(provided) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredTemplates.map((template, index) => (
                    <Draggable key={template._id} draggableId={template._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DesignFunctionTemplateCard
                            template={template}
                            onView={handleViewTemplate}
                            onEdit={handleEditTemplate}
                            onDelete={handleDeleteTemplate}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )
      )}

      {isModalOpen && (
        <CreateDesignFunctionTemplateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTemplate(null);
            setViewingTemplate(null);
          }}
          onSave={handleSave}
          templateToEdit={editingTemplate || viewingTemplate}
          readOnly={!!viewingTemplate}
        />
      )}
    </div>
  );
}