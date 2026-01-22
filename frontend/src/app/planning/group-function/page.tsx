"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { groupFunctionService, GroupFunction } from '../../../services/groupFunction.service';
import CreateGroupFunctionModal from '../../../components/modals/CreateGroupFunctionModal';
import GroupFunctionCard from './_components/GroupFunctionCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type ViewMode = 'list' | 'card';

export default function GroupFunctionsPage() {
  const [groupFunctions, setGroupFunctions] = useState<GroupFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupFunction, setEditingGroupFunction] = useState<GroupFunction | null>(null);
  const [viewingGroupFunction, setViewingGroupFunction] = useState<GroupFunction | null>(null); // New state for viewing
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const router = useRouter();

  const fetchGroupFunctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupFunctionService.getAllGroupFunctions();
      setGroupFunctions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch group functions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupFunctions();
  }, []);

  const handleSave = (savedGroupFunction: GroupFunction) => {
    if (editingGroupFunction) {
      setGroupFunctions((prev) =>
        prev.map((g) => (g._id === savedGroupFunction._id ? savedGroupFunction : g))
      );
    } else {
      setGroupFunctions((prev) => [...prev, savedGroupFunction]);
    }
    setIsModalOpen(false);
    setEditingGroupFunction(null);
    setViewingGroupFunction(null); // Clear viewing state as well
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedGroupFunctions = Array.from(groupFunctions);
    const [removed] = reorderedGroupFunctions.splice(result.source.index, 1);
    reorderedGroupFunctions.splice(result.destination.index, 0, removed);

    setGroupFunctions(reorderedGroupFunctions);

    // Update displayOrder in backend
    try {
      // Create a map for quick lookup of original group functions by ID
      const originalGroupFunctionsMap = new Map(groupFunctions.map(gf => [gf._id, gf]));
      
      const updates = reorderedGroupFunctions.map(async (groupFunction, index) => {
        // Only update if displayOrder has actually changed
        const originalGroupFunction = originalGroupFunctionsMap.get(groupFunction._id);
        if (originalGroupFunction && originalGroupFunction.displayOrder !== index) {
          return groupFunctionService.updateGroupFunction(groupFunction._id, { displayOrder: index });
        }
        return Promise.resolve(); // No update needed for this item
      });
      await Promise.all(updates);
    } catch (err: any) {
      console.error('Failed to update group function display order:', err);
      setError('Failed to update display order.');
      // Optionally revert state if backend update fails
      fetchGroupFunctions(); 
    }
  };

  const filteredGroupFunctions = useMemo(() => {
    let currentFilteredGroupFunctions = groupFunctions;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredGroupFunctions = currentFilteredGroupFunctions.filter(
        (groupFunction) =>
          groupFunction.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (groupFunction.description && groupFunction.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return currentFilteredGroupFunctions;
  }, [groupFunctions, searchTerm]);

  const handleViewGroupFunction = (groupFunction: GroupFunction) => {
    setViewingGroupFunction(groupFunction);
    setIsModalOpen(true);
  };

  const handleEditGroupFunction = (groupFunction: GroupFunction) => {
    setEditingGroupFunction(groupFunction);
    setIsModalOpen(true);
  };

  const handleDeleteGroupFunction = async (groupFunction: GroupFunction) => {
    setError(null);
    if (!window.confirm(`Are you sure you want to delete "${groupFunction.name}"?`)) {
        return;
    }
    try {
        await groupFunctionService.deleteGroupFunction(groupFunction._id);
        setGroupFunctions((prev) => prev.filter((g) => g._id !== groupFunction._id));
    } catch (err: any) {
        setError(err.message || 'Failed to delete group function');
    }
  };

  const openCreateModal = () => {
    setEditingGroupFunction(null);
    setViewingGroupFunction(null); // Ensure viewing state is clear for create
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
          <h2 className="text-2xl font-bold text-gray-800">Group Function Management</h2>
        </div>
        <div className="w-1/3 flex justify-end">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Group Function
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search group functions..."
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

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {viewMode === 'list' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Order</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <Droppable droppableId="group-functions-list">
                {(provided) => (
                  <tbody
                    className="bg-white divide-y divide-gray-200"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {filteredGroupFunctions.map((groupFunction, index) => (
                      <Draggable key={groupFunction._id} draggableId={groupFunction._id} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{groupFunction.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{groupFunction.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{groupFunction.displayOrder}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div style={{ backgroundColor: groupFunction.color, width: '20px', height: '20px', borderRadius: '50%' }}></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleViewGroupFunction(groupFunction)} className="text-blue-600 hover:text-blue-900">View</button>
                              <button onClick={() => handleEditGroupFunction(groupFunction)} className="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                              <button onClick={() => handleDeleteGroupFunction(groupFunction)} className="text-red-600 hover:text-red-900 ml-2">Delete</button>
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
          <Droppable droppableId="group-functions-card-grid">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {filteredGroupFunctions.map((groupFunction, index) => (
                  <Draggable key={groupFunction._id} draggableId={groupFunction._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <GroupFunctionCard
                          groupFunction={groupFunction}
                          onView={handleViewGroupFunction}
                          onEdit={handleEditGroupFunction}
                          onDelete={handleDeleteGroupFunction}
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
      )}

      {isModalOpen && (
        <CreateGroupFunctionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGroupFunction(null);
            setViewingGroupFunction(null); // Clear viewing state as well
          }}
          onSave={handleSave}
          groupFunctionToEdit={editingGroupFunction || viewingGroupFunction} // Pass either for edit or view
          readOnly={!!viewingGroupFunction} // Set readOnly prop based on viewing state
        />
      )}
    </div>
  );
}
