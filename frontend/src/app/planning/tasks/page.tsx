"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { taskService, TaskData } from '../../../services/task.service'; // Adjust path as needed, import TaskData
import CreateTaskModal from '../../../components/modals/CreateTaskModal'; // Adjust path as needed
import TaskCard from './_components/TaskCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task extends TaskData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'list' | 'card';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Renamed from isCreateModalOpen
  const [editingTask, setEditingTask] = useState<Task | null>(null); // New state for editing
  const [viewingTask, setViewingTask] = useState<Task | null>(null); // New state for viewing
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = (savedTask: Task) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t._id === savedTask._id ? savedTask : t))
      );
    } else {
      setTasks((prev) => [...prev, savedTask]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
    setViewingTask(null); // Clear viewing state as well
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    setTasks(reorderedTasks);

    // Update displayOrder in backend
    try {
      const originalTasksMap = new Map(tasks.map(t => [t._id, t]));
      
      const updates = reorderedTasks.map(async (task, index) => {
        const originalTask = originalTasksMap.get(task._id);
        if (originalTask && originalTask.displayOrder !== index) {
          return taskService.updateTask(task._id, { displayOrder: index });
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    } catch (err: any) {
      console.error('Failed to update task display order:', err);
      setError('Failed to update display order.');
      fetchTasks(); 
    }
  };

  const filteredTasks = useMemo(() => {
    let currentFilteredTasks = tasks;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredTasks = currentFilteredTasks.filter(
        (task) =>
          task.taskName.toLowerCase().includes(lowerCaseSearchTerm) ||
          (task.description && task.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return currentFilteredTasks;
  }, [tasks, searchTerm]);

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    setError(null);
    if (!window.confirm(`Are you sure you want to delete "${task.taskName}"?`)) {
        return;
    }
    try {
        await taskService.deleteTask(task._id);
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err: any) {
        setError(err.message || 'Failed to delete task');
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setViewingTask(null); // Ensure viewing state is clear for create
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
          <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
        </div>
        <div className="w-1/3 flex justify-end">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search tasks..."
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
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {!loading && !error && filteredTasks.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-lg text-gray-700 mb-2">No tasks found.</p>
          <p className="text-gray-500">Click "+ Add Task" to create your first task.</p>
        </div>
      )}

      {!loading && !error && filteredTasks.length > 0 && (
        viewMode === 'list' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration (Days)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revision
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Display Order
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <Droppable droppableId="tasks-list">
                  {(provided) => (
                    <tbody
                      className="bg-white divide-y divide-gray-200"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {task.taskName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {task.description || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {task.defaultDurationDays !== undefined ? task.defaultDurationDays : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {task.defaultRevision || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {task.displayOrder !== undefined ? task.displayOrder : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleViewTask(task)} className="text-blue-600 hover:text-blue-900">View</button>
                                <button onClick={() => handleEditTask(task)} className="text-indigo-600 hover:text-indigo-900 ml-2">Edit</button>
                                <button onClick={() => handleDeleteTask(task)} className="text-red-600 hover:text-red-900 ml-2">Delete</button>
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
            <Droppable droppableId="tasks-card-grid">
              {(provided) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onView={handleViewTask}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
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
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            setViewingTask(null); // Clear viewing state as well
          }}
          onSave={handleSave}
          taskToEdit={editingTask || viewingTask} // Pass either for edit or view
          readOnly={!!viewingTask} // Set readOnly prop based on viewing state
        />
      )}
    </div>
  );
}
