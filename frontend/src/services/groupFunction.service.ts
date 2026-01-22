import axios from 'axios';

const API_URL = 'http://localhost:3001/api/group-functions'; // Adjust if your backend URL is different

export interface GroupFunction {
  _id: string;
  name: string;
  description?: string;
  displayOrder?: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

const getAllGroupFunctions = async (): Promise<GroupFunction[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createGroupFunction = async (groupFunctionData: Omit<GroupFunction, '_id' | 'createdAt' | 'updatedAt'>): Promise<GroupFunction> => {
  const response = await axios.post(API_URL, groupFunctionData);
  return response.data;
};

const getGroupFunctionById = async (id: string): Promise<GroupFunction> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updateGroupFunction = async (id: string, groupFunctionData: Partial<GroupFunction>): Promise<GroupFunction> => {
  const response = await axios.patch(`${API_URL}/${id}`, groupFunctionData);
  return response.data;
};

const deleteGroupFunction = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const groupFunctionService = {
  getAllGroupFunctions,
  createGroupFunction,
  getGroupFunctionById,
  updateGroupFunction,
  deleteGroupFunction,
};
