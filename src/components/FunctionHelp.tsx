import React from 'react';

interface FunctionHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const FunctionHelp: React.FC<FunctionHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Function Help</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Mathematical Functions</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">SUM</h4>
                <p className="text-sm text-gray-600">Calculates the sum of a range of cells.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=SUM(A1:A5)</code></p>
              </div>
              
              <div>
                <h4 className="font-medium">AVERAGE</h4>
                <p className="text-sm text-gray-600">Calculates the average of a range of cells.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=AVERAGE(B1:B10)</code></p>
              </div>
              
              <div>
                <h4 className="font-medium">MAX</h4>
                <p className="text-sm text-gray-600">Returns the maximum value from a range of cells.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=MAX(C1:C20)</code></p>
              </div>
              
              <div>
                <h4 className="font-medium">MIN</h4>
                <p className="text-sm text-gray-600">Returns the minimum value from a range of cells.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=MIN(D5:D15)</code></p>
              </div>
              
              <div>
                <h4 className="font-medium">COUNT</h4>
                <p className="text-sm text-gray-600">Counts the number of cells containing numerical values in a range.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=COUNT(E1:E30)</code></p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">Data Quality Functions</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">TRIM</h4>
                <p className="text-sm text-gray-600">Removes leading and trailing whitespace from a cell.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=TRIM(A1)</code></p>
              </div>
              
              <div>
                <h4 className="font-medium">UPPER</h4>
                <p className="text-sm text-gray-600">Converts the text in a cell to uppercase.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=UPPER(B5)</code></p>
              </div>
              
              <div>
                <h4 className="font-medium">LOWER</h4>
                <p className="text-sm text-gray-600">Converts the text in a cell to lowercase.</p>
                <p className="text-sm bg-gray-100 p-1 rounded mt-1">Example: <code>=LOWER(C10)</code></p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">Special Operations</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Find and Replace</h4>
                <p className="text-sm text-gray-600">Find and replace text within a range of cells.</p>
                <p className="text-sm text-gray-600">Access from the toolbar.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Remove Duplicates</h4>
                <p className="text-sm text-gray-600">Removes duplicate rows from a selected range.</p>
                <p className="text-sm text-gray-600">Select a range and use the "Remove Duplicates" option from the Data menu.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">Tips</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>All formulas must start with an equals sign (=)</li>
              <li>Cell references use A1 notation (column letter + row number)</li>
              <li>Ranges are specified with a colon (e.g., A1:A5)</li>
              <li>You can use the fill handle (small blue square in the bottom-right corner of a selected cell) to copy formulas to adjacent cells</li>
              <li>Double-click a cell to edit its contents directly</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FunctionHelp;