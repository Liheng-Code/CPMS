"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormData } from '../form/ProjectFormSchema';

export default function StepBasicInfo() {
  const { register, formState: { errors } } = useFormContext<ProjectFormData>();

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          type="text"
          id="projectName"
          {...register('projectName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.projectName && <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>}
      </div>

      <div>
        <label htmlFor="projectCode" className="block text-sm font-medium text-gray-700">Project Code</label>
        <input
          type="text"
          id="projectCode"
          {...register('projectCode')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.projectCode && <p className="mt-1 text-sm text-red-600">{errors.projectCode.message}</p>}
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">Project Type</label>
        <select
          id="projectType"
          {...register('projectType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Building">Building</option>
          <option value="Road">Road</option>
          <option value="Bridge">Bridge</option>
          <option value="Industrial">Industrial</option>
        </select>
        {errors.projectType && <p className="mt-1 text-sm text-red-600">{errors.projectType.message}</p>}
      </div>

      <div>
        <label htmlFor="projectCategory" className="block text-sm font-medium text-gray-700">Project Category</label>
        <select
          id="projectCategory"
          {...register('projectCategory')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Infrastructure">Infrastructure</option>
        </select>
        {errors.projectCategory && <p className="mt-1 text-sm text-red-600">{errors.projectCategory.message}</p>}
      </div>

      <div>
        <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700">Project Status</label>
        <select
          id="projectStatus"
          {...register('projectStatus')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
        </select>
        {errors.projectStatus && <p className="mt-1 text-sm text-red-600">{errors.projectStatus.message}</p>}
      </div>

      <div>
        <label htmlFor="clientOwner" className="block text-sm font-medium text-gray-700">Client / Owner</label>
        <input
          type="text"
          id="clientOwner"
          {...register('clientOwner')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.clientOwner && <p className="mt-1 text-sm text-red-600">{errors.clientOwner.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="plannedStartDate" className="block text-sm font-medium text-gray-700">Planned Start Date</label>
        <input
          type="date"
          id="plannedStartDate"
          {...register('plannedStartDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.plannedStartDate && <p className="mt-1 text-sm text-red-600">{errors.plannedStartDate.message}</p>}
      </div>

      <div>
        <label htmlFor="plannedEndDate" className="block text-sm font-medium text-gray-700">Planned End Date</label>
        <input
          type="date"
          id="plannedEndDate"
          {...register('plannedEndDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.plannedEndDate && <p className="mt-1 text-sm text-red-600">{errors.plannedEndDate.message}</p>}
      </div>

      <div>
        <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700">Estimated Budget</label>
        <input
          type="number"
          id="estimatedBudget"
          {...register('estimatedBudget')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.estimatedBudget && <p className="mt-1 text-sm text-red-600">{errors.estimatedBudget.message}</p>}
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
        <input
          type="text"
          id="currency"
          {...register('currency')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
      </div>
    </div>
  );
}