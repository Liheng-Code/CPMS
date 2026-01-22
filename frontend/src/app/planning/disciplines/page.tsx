"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { disciplineService, DisciplineData } from '@/services/discipline.service'; // Adjust path as needed, import DisciplineData
import CreateDisciplineModal from '../../../components/modals/CreateDisciplineModal'; // Adjust path as needed
import DisciplineCard from './_components/DisciplineCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Discipline extends DisciplineData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'list' | 'card';

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Renamed from isCreateModalOpen
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null); // New state for editing
  const [viewingDiscipline, setViewingDiscipline] = useState<Discipline | null>(null); // New state for viewing
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const router = useRouter();

  const fetchDisciplines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await disciplineService.getAllDisciplines();
      setDisciplines(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch disciplines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const handleSave = (savedDiscipline: Discipline) => {
    if (editingDiscipline) {
      setDisciplines((prev) =>
        prev.map((d) => (d._id === savedDiscipline._id ? savedDiscipline : d))
      );
    } else {
      setDisciplines((prev) => [...prev, savedDiscipline]);
    }
    setIsModalOpen(false);
    setEditingDiscipline(null);
    setViewingDiscipline(null); // Clear viewing state as well
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedDisciplines = Array.from(disciplines);
    const [removed] = reorderedDisciplines.splice(result.source.index, 1);
    reorderedDisciplines.splice(result.destination.index, 0, removed);

    setDisciplines(reorderedDisciplines);

    // Update displayOrder in backend
    try {
      const originalDisciplinesMap = new Map(disciplines.map(d => [d._id, d]));
      
      const updates = reorderedDisciplines.map(async (discipline, index) => {
        const originalDiscipline = originalDisciplinesMap.get(discipline._id);
        if (originalDiscipline && originalDiscipline.displayOrder !== index) {
          return disciplineService.updateDiscipline(discipline._id, { displayOrder: index });
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    } catch (err: any) {
      console.error('Failed to update discipline display order:', err);
      setError('Failed to update display order.');
      fetchDisciplines(); 
    }
  };

  const filteredDisciplines = useMemo(() => {
    let currentFilteredDisciplines = disciplines;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredDisciplines = currentFilteredDisciplines.filter(
        (discipline) =>
          discipline.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (discipline.description && discipline.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return currentFilteredDisciplines;
  }, [disciplines, searchTerm]);

  const handleViewDiscipline = (discipline: Discipline) => {
    setViewingDiscipline(discipline);
    setIsModalOpen(true);
  };

  const handleEditDiscipline = (discipline: Discipline) => {
    setEditingDiscipline(discipline);
    setIsModalOpen(true);
  };

  const handleDeleteDiscipline = async (discipline: Discipline) => {
    setError(null);
    if (!window.confirm(`Are you sure you want to delete "${discipline.name}"?`)) {
        return;
    }
    try {
        await disciplineService.deleteDiscipline(discipline._id);
        setDisciplines((prev) => prev.filter((d) => d._id !== discipline._id));
    } catch (err: any) {
        setError(err.message || 'Failed to delete discipline');
    }
  };

  const openCreateModal = () => {
    setEditingDiscipline(null);
    setViewingDiscipline(null); // Ensure viewing state is clear for create
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
          <h2 className="text-2xl font-bold text-gray-800">Discipline Management</h2>
        </div>
        <div className="w-1/3 flex justify-end">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span className="text-xl font-bold">+</span>
            <span>Add Discipline</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search disciplines..."
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
          <p className="text-gray-600">Loading disciplines...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {!loading && !error && filteredDisciplines.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-lg text-gray-700 mb-2">No disciplines found.</p>
          <p className="text-gray-500">Click "+ Add Discipline" to create your first discipline.</p>
        </div>
      )}

      {!loading && !error && filteredDisciplines.length > 0 && (
        viewMode === 'list' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discipline Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discipline Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Display Order
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <Droppable droppableId="disciplines-list">
                  {(provided) => (
                    <tbody
                      className="bg-white divide-y divide-gray-200"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredDisciplines.map((discipline, index) => (
                        <Draggable key={discipline._id} draggableId={discipline._id} index={index}>
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {discipline.code || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {discipline.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {discipline.description || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {discipline.displayOrder !== undefined ? discipline.displayOrder : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleViewDiscipline(discipline)} className="text-blue-600 hover:text-blue-900">View</button>
                                <button onClick={() => handleEditDiscipline(discipline)} className="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                                <button onClick={() => handleDeleteDiscipline(discipline)} className="text-red-600 hover:text-red-900 ml-2">Delete</button>
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
            <Droppable droppableId="disciplines-card-grid">
              {(provided) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredDisciplines.map((discipline, index) => (
                    <Draggable key={discipline._id} draggableId={discipline._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DisciplineCard
                            discipline={discipline}
                            onView={handleViewDiscipline}
                            onEdit={handleEditDiscipline}
                            onDelete={handleDeleteDiscipline}
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
        <CreateDisciplineModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDiscipline(null);
            setViewingDiscipline(null); // Clear viewing state as well
          }}
          onSave={handleSave}
          disciplineToEdit={editingDiscipline || viewingDiscipline} // Pass either for edit or view
          readOnly={!!viewingDiscipline} // Set readOnly prop based on viewing state
        />
      )}
    </div>
  );
}
