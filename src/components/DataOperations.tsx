import React, { useState } from 'react';
import { useSpreadsheetStore } from '../store/spreadsheetStore';

interface DataOperationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataOperations: React.FC<DataOperationsProps> = ({ isOpen, onClose }) => {
  const { selection, removeDuplicates } = useSpreadsheetStore();
  const [operation, setOperation] = useState<'remove-duplicates' | null>(null);
  
  if (!isOpen) return null;
  
  const handleRemoveDuplicates = () => {
    if (selection) {
      removeDuplicates(selection);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Data Operations</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {!selection ? (
          <div className="text-center py-4">
            <p className="text-red-500">Please select a range of cells first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {operation === null ? (
              <div className="space-y-2">
                <button
                  onClick={() => setOperation('remove-duplicates')}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Remove Duplicates
                </button>
              </div>
            ) : operation === 'remove-duplicates' ? (
              <div className="space-y-4">
                <p>This will remove duplicate rows from the selected range. The first occurrence of each row will be kept.</p>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setOperation(null)}
                    className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleRemoveDuplicates}
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Remove Duplicates
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataOperations;