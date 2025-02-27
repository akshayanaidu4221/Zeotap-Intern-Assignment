import React, { useEffect, useState } from 'react';
import { useSpreadsheetStore } from '../store/spreadsheetStore';
import { getCellAddress } from '../utils/helpers';

const FormulaBar: React.FC = () => {
  const { 
    activeCell, 
    formulaBarValue, 
    setCellValue,
    applyFormulaToCell  } = useSpreadsheetStore();
  
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    setInputValue(formulaBarValue);
  }, [formulaBarValue]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    if (activeCell) {
      if (inputValue.startsWith('=')) {
        applyFormulaToCell(activeCell, inputValue);
      } else {
        // Try to convert to number if possible
        const numValue = !isNaN(Number(inputValue)) && inputValue !== '' 
          ? Number(inputValue) 
          : inputValue;
        setCellValue(activeCell, numValue);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };
  
  const activeCellAddress = activeCell 
    ? getCellAddress(...activeCell.split(':').map(Number)) 
    : '';
  
  return (
    <div className="bg-white border-b border-gray-300 p-1 flex items-center">
      <div className="bg-[#f1f3f4] rounded px-2 py-1 mr-2 w-10 text-center font-medium">
        {activeCellAddress}
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border border-gray-300 rounded"
          placeholder="Enter a value or formula (e.g., =SUM(A1:A5))"
        />
      </div>
    </div>
  );
};

export default FormulaBar;