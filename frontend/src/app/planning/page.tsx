"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function PlanningPage() {
  const router = useRouter(); // Initialize useRouter

  const buttonLabels = [
    "Design Function Template",
    "Tasks",
    "Design Phase",
    "Disciplines",
    "Group Function",
    "Discipline Cost Rates",
  ];

  // Placeholder function for button clicks - can be expanded later
  const handleButtonClick = (label: string) => {
    if (label === "Tasks") {
      router.push('/planning/tasks'); // Navigate to tasks management page
    }
    if (label === "Disciplines") {
      router.push('/planning/disciplines'); // Navigate to disciplines management page
    }
    if (label === "Group Function") {
      router.push('/planning/group-function'); // Navigate to group function management page
    }
    if (label === "Design Function Template") {
      router.push('/planning/design-function-templates'); // Navigate to design function templates management page
    }
    // Future: navigate to a new page, open a modal, etc. for other buttons
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Planning Template Selection</h2>
        {/* No "New Planning Template" button as per clarification */}
      </div>

      <div className="flex flex-wrap justify-between items-stretch gap-2 mb-4 p-2 bg-gray-50 rounded-lg shadow-sm">
        {buttonLabels.map((label) => (
          <button
            key={label}
            onClick={() => handleButtonClick(label)}
            className="flex-1 min-w-0 p-3 bg-white rounded-md border border-gray-200 shadow-sm text-center text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200 truncate"
            style={{ maxWidth: `calc(100% / ${buttonLabels.length} - 0.5rem)` }} // Distribute width evenly
          >
            {label}
          </button>
        ))}
      </div>

      {/* No modals or loading/error states initially */}
    </div>
  );
}