import React, { useRef, useState, useEffect } from 'react';
import Cell from './Cell';
import { useSpreadsheetStore } from '../store/spreadsheetStore';
import { generateCellId } from '../utils/helpers';

const Grid: React.FC = () => {
  const { 
    rowCount, 
    colCount, 
    columnWidths, 
    rowHeights,
    setColumnWidth,
    setRowHeight,
    isDragging,
    setIsDragging,
    selection,
    setSelection,
    activeCell,
    data,
    setCellValue
  } = useSpreadsheetStore();
  
  const gridRef = useRef<HTMLDivElement>(null);
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const [resizingRow, setResizingRow] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  
  // Handle column resize
  const handleColResizeStart = (colIndex: number, e: React.MouseEvent) => {
    setResizingCol(colIndex);
    setStartX(e.clientX);
    setStartWidth(columnWidths[colIndex] || 80);
    e.preventDefault();
    
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingCol !== null) {
        const width = Math.max(40, startWidth + (e.clientX - startX));
        setColumnWidth(resizingCol, width);
      }
    };
    
    const handleMouseUp = () => {
      setResizingCol(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle row resize
  const handleRowResizeStart = (rowIndex: number, e: React.MouseEvent) => {
    setResizingRow(rowIndex);
    setStartY(e.clientY);
    setStartHeight(rowHeights[rowIndex] || 24);
    e.preventDefault();
    
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingRow !== null) {
        const height = Math.max(20, startHeight + (e.clientY - startY));
        setRowHeight(resizingRow, height);
      }
    };
    
    const handleMouseUp = () => {
      setResizingRow(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle cell drag to fill
  useEffect(() => {
    if (!isDragging || !activeCell) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current || !activeCell) return;
      
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate which cell we're over
      // This is a simplified version; a real implementation would need to account for variable row/column sizes
      const cellWidth = 80;
      const cellHeight = 24;
      const headerWidth = 40;
      const headerHeight = 24;
      
      const col = Math.floor((x - headerWidth) / cellWidth);
      const row = Math.floor((y - headerHeight) / cellHeight);
      
      if (col >= 0 && row >= 0 && col < colCount && row < rowCount) {
        const [activeRow, activeCol] = activeCell.split(':').map(Number);
        
        setSelection({
          start: {
            row: Math.min(activeRow, row),
            col: Math.min(activeCol, col)
          },
          end: {
            row: Math.max(activeRow, row),
            col: Math.max(activeCol, col)
          }
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Fill the selected cells with the value from the active cell
      if (selection && activeCell) {
        const value = data[activeCell]?.value;
        const formula = data[activeCell]?.formula;
        
        for (let row = selection.start.row; row <= selection.end.row; row++) {
          for (let col = selection.start.col; col <= selection.end.col; col++) {
            const cellId = generateCellId(row, col);
            if (cellId !== activeCell) {
              setCellValue(cellId, value, formula);
            }
          }
        }
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeCell]);
  
  // Generate grid cells
  const renderGrid = () => {
    const grid = [];
    
    // Add corner cell (top-left empty cell)
    grid.push(
      <div 
        key="corner" 
        className="sticky top-0 left-0 z-20 bg-[#f1f3f4] border-r border-b border-gray-300 w-10 h-6"
      />
    );
    
    // Add column headers
    for (let col = 0; col < colCount; col++) {
      const width = columnWidths[col] || 80;
      
      grid.push(
        <div 
          key={`header-${col}`} 
          className="sticky top-0 z-10"
          style={{ width: `${width}px` }}
        >
          <Cell cellId={`header-${col}`} isHeader={true} />
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize"
            onMouseDown={(e) => handleColResizeStart(col, e)}
          />
        </div>
      );
    }
    
    // Add rows
    for (let row = 0; row < rowCount; row++) {
      const height = rowHeights[row] || 24;
      
      // Add row header
      grid.push(
        <div 
          key={`row-${row}`} 
          className="sticky left-0 z-10"
          style={{ height: `${height}px` }}
        >
          <Cell cellId={`row-${row}`} isRowHeader={true} />
          <div
            className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize"
            onMouseDown={(e) => handleRowResizeStart(row, e)}
          />
        </div>
      );
      
      // Add cells for this row
      for (let col = 0; col < colCount; col++) {
        const cellId = generateCellId(row, col);
        const width = columnWidths[col] || 80;
        
        grid.push(
          <div 
            key={cellId} 
            style={{ 
              width: `${width}px`,
              height: `${height}px`
            }}
          >
            <Cell cellId={cellId} />
          </div>
        );
      }
    }
    
    return grid;
  };
  
  return (
    <div 
      ref={gridRef}
      className="flex-1 overflow-auto"
    >
      <div 
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `40px repeat(${colCount}, auto)`,
          gridTemplateRows: `24px repeat(${rowCount}, auto)`
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default Grid;