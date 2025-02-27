import React, { useState, useRef, useEffect } from 'react';
import { useSpreadsheetStore } from '../store/spreadsheetStore';
import { parseCellId } from '../utils/helpers';

interface CellProps {
  cellId: string;
  isHeader?: boolean;
  isRowHeader?: boolean;
}

const Cell: React.FC<CellProps> = ({ cellId, isHeader = false, isRowHeader = false }) => {
  const { 
    data, 
    activeCell, 
    selection,
    setActiveCell, 
    setSelection,
    setCellValue,
    applyFormulaToCell,
    setIsDragging
  } = useSpreadsheetStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const cell = data[cellId] || { id: cellId, value: null, style: {} };
  const { row, col } = parseCellId(cellId);
  
  const isActive = activeCell === cellId;
  const isSelected = selection && 
    row >= selection.start.row && row <= selection.end.row &&
    col >= selection.start.col && col <= selection.end.col;
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  const handleClick = (e: React.MouseEvent) => {
    if (isHeader || isRowHeader) return;
    
    if (e.shiftKey && activeCell) {
      // Extend selection
      const activePos = parseCellId(activeCell);
      setSelection({
        start: {
          row: Math.min(activePos.row, row),
          col: Math.min(activePos.col, col)
        },
        end: {
          row: Math.max(activePos.row, row),
          col: Math.max(activePos.col, col)
        }
      });
    } else {
      setActiveCell(cellId);
      setSelection({
        start: { row, col },
        end: { row, col }
      });
    }
  };
  
  const handleDoubleClick = () => {
    if (isHeader || isRowHeader) return;
    
    setIsEditing(true);
    setEditValue(cell.formula || String(cell.value || ''));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    finishEditing();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };
  
  const finishEditing = () => {
    setIsEditing(false);
    
    if (editValue.startsWith('=')) {
      applyFormulaToCell(cellId, editValue);
    } else {
      // Try to convert to number if possible
      const numValue = !isNaN(Number(editValue)) && editValue !== '' 
        ? Number(editValue) 
        : editValue;
      setCellValue(cellId, numValue);
    }
  };
  
  // Drag to fill functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isHeader || isRowHeader || e.button !== 0) return;
    
    if (e.target instanceof HTMLElement && e.target.classList.contains('cell-handle')) {
      setIsDragging(true);
      e.preventDefault();
    }
  };
  
  // Style based on cell properties
  const cellStyle = {
    fontWeight: cell.style.bold ? 'bold' : 'normal',
    fontStyle: cell.style.italic ? 'italic' : 'normal',
    fontSize: cell.style.fontSize ? `${cell.style.fontSize}px` : undefined,
    color: cell.style.color || undefined,
    backgroundColor: cell.style.backgroundColor || undefined,
    textAlign: cell.style.textAlign || 'left',
  };
  
  // Header cell rendering
  if (isHeader) {
    return (
      <div 
        className="bg-[#f1f3f4] border-r border-b border-gray-300 px-2 py-1 text-center font-medium select-none"
      >
        {String.fromCharCode(65 + col)}
      </div>
    );
  }
  
  if (isRowHeader) {
    return (
      <div 
        className="bg-[#f1f3f4] border-r border-b border-gray-300 px-2 py-1 text-center font-medium select-none"
      >
        {row + 1}
      </div>
    );
  }
  
  return (
    <div
      className={`relative border-r border-b border-gray-300 px-2 py-1 min-w-[80px] min-h-[24px] ${
        isActive ? 'outline outline-2 outline-blue-500 z-10' : ''
      } ${
        isSelected && !isActive ? 'bg-blue-100' : ''
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      style={cellStyle}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full px-2 py-1 border-none outline-none"
        />
      ) : (
        <div className="truncate">
          {cell.displayValue || cell.value || ''}
        </div>
      )}
      
      {isActive && (
        <div 
          className="cell-handle absolute w-6 h-6 bottom-0 right-0 cursor-crosshair"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #2563eb 50%)',
            width: '10px',
            height: '10px',
            right: '0',
            bottom: '0'
          }}
        />
      )}
    </div>
  );
};

export default Cell;