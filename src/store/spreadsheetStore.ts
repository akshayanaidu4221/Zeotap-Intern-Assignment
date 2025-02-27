import { create } from 'zustand';
import { Cell, CellStyle, CellValue, Selection, SpreadsheetData } from '../types';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { generateCellId } from '../utils/helpers';

interface SpreadsheetState {
  data: SpreadsheetData;
  activeCell: string | null;
  selection: Selection | null;
  formulaBarValue: string;
  rowCount: number;
  colCount: number;
  columnWidths: { [key: number]: number };
  rowHeights: { [key: number]: number };
  isDragging: boolean;
  
  // Actions
  setActiveCell: (cellId: string | null) => void;
  setSelection: (selection: Selection | null) => void;
  setCellValue: (cellId: string, value: CellValue, formula?: string) => void;
  setCellStyle: (cellId: string, style: Partial<CellStyle>) => void;
  setFormulaBarValue: (value: string) => void;
  addRow: (afterIndex?: number) => void;
  deleteRow: (index: number) => void;
  addColumn: (afterIndex?: number) => void;
  deleteColumn: (index: number) => void;
  setColumnWidth: (colIndex: number, width: number) => void;
  setRowHeight: (rowIndex: number, height: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  applyFormulaToCell: (cellId: string, formula: string) => void;
  findAndReplace: (find: string, replace: string, selectionOnly?: boolean) => void;
  removeDuplicates: (selection: Selection) => void;
}

// Initialize with default data
const createInitialData = (rows: number, cols: number): SpreadsheetData => {
  const data: SpreadsheetData = {};
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellId = generateCellId(row, col);
      data[cellId] = {
        id: cellId,
        value: null,
        style: {},
      };
    }
  }
  
  return data;
};

export const useSpreadsheetStore = create<SpreadsheetState>((set, get) => ({
  data: createInitialData(100, 26), // Default to 100 rows, 26 columns (A-Z)
  activeCell: null,
  selection: null,
  formulaBarValue: '',
  rowCount: 100,
  colCount: 26,
  columnWidths: {},
  rowHeights: {},
  isDragging: false,
  
  setActiveCell: (cellId) => {
    const state = get();
    set({ 
      activeCell: cellId,
      formulaBarValue: cellId ? (state.data[cellId]?.formula || String(state.data[cellId]?.value || '')) : ''
    });
  },
  
  setSelection: (selection) => {
    set({ selection });
  },
  
  setCellValue: (cellId, value, formula) => {
    const state = get();
    const updatedData = { ...state.data };
    
    // Update the cell
    updatedData[cellId] = {
      ...updatedData[cellId],
      value,
      formula: formula || undefined,
      displayValue: String(value || '')
    };
    
    // Update dependent cells if needed
    // This would be more complex in a real implementation
    
    set({ 
      data: updatedData,
      formulaBarValue: formula || String(value || '')
    });
  },
  
  setCellStyle: (cellId, style) => {
    const state = get();
    set({
      data: {
        ...state.data,
        [cellId]: {
          ...state.data[cellId],
          style: {
            ...state.data[cellId].style,
            ...style
          }
        }
      }
    });
  },
  
  setFormulaBarValue: (value) => {
    set({ formulaBarValue: value });
  },
  
  addRow: (afterIndex = -1) => {
    const state = get();
    const newRowIndex = afterIndex + 1;
    const updatedData = { ...state.data };
    
    // Shift existing rows down
    for (let row = state.rowCount - 1; row >= newRowIndex; row--) {
      for (let col = 0; col < state.colCount; col++) {
        const oldCellId = generateCellId(row, col);
        const newCellId = generateCellId(row + 1, col);
        updatedData[newCellId] = { ...updatedData[oldCellId] };
      }
    }
    
    // Create new row
    for (let col = 0; col < state.colCount; col++) {
      const cellId = generateCellId(newRowIndex, col);
      updatedData[cellId] = {
        id: cellId,
        value: null,
        style: {}
      };
    }
    
    set({ 
      data: updatedData,
      rowCount: state.rowCount + 1
    });
  },
  
  deleteRow: (index) => {
    const state = get();
    const updatedData = { ...state.data };
    
    // Shift rows up
    for (let row = index; row < state.rowCount - 1; row++) {
      for (let col = 0; col < state.colCount; col++) {
        const oldCellId = generateCellId(row + 1, col);
        const newCellId = generateCellId(row, col);
        updatedData[newCellId] = { ...updatedData[oldCellId] };
      }
    }
    
    // Remove last row
    for (let col = 0; col < state.colCount; col++) {
      const cellId = generateCellId(state.rowCount - 1, col);
      delete updatedData[cellId];
    }
    
    set({ 
      data: updatedData,
      rowCount: state.rowCount - 1
    });
  },
  
  addColumn: (afterIndex = -1) => {
    const state = get();
    const newColIndex = afterIndex + 1;
    const updatedData = { ...state.data };
    
    // Shift existing columns right
    for (let col = state.colCount - 1; col >= newColIndex; col--) {
      for (let row = 0; row < state.rowCount; row++) {
        const oldCellId = generateCellId(row, col);
        const newCellId = generateCellId(row, col + 1);
        updatedData[newCellId] = { ...updatedData[oldCellId] };
      }
    }
    
    // Create new column
    for (let row = 0; row < state.rowCount; row++) {
      const cellId = generateCellId(row, newColIndex);
      updatedData[cellId] = {
        id: cellId,
        value: null,
        style: {}
      };
    }
    
    set({ 
      data: updatedData,
      colCount: state.colCount + 1
    });
  },
  
  deleteColumn: (index) => {
    const state = get();
    const updatedData = { ...state.data };
    
    // Shift columns left
    for (let col = index; col < state.colCount - 1; col++) {
      for (let row = 0; row < state.rowCount; row++) {
        const oldCellId = generateCellId(row, col + 1);
        const newCellId = generateCellId(row, col);
        updatedData[newCellId] = { ...updatedData[oldCellId] };
      }
    }
    
    // Remove last column
    for (let row = 0; row < state.rowCount; row++) {
      const cellId = generateCellId(row, state.colCount - 1);
      delete updatedData[cellId];
    }
    
    set({ 
      data: updatedData,
      colCount: state.colCount - 1
    });
  },
  
  setColumnWidth: (colIndex, width) => {
    const state = get();
    set({
      columnWidths: {
        ...state.columnWidths,
        [colIndex]: width
      }
    });
  },
  
  setRowHeight: (rowIndex, height) => {
    const state = get();
    set({
      rowHeights: {
        ...state.rowHeights,
        [rowIndex]: height
      }
    });
  },
  
  setIsDragging: (isDragging) => {
    set({ isDragging });
  },
  
  applyFormulaToCell: (cellId, formula) => {
    const state = get();
    try {
      const result = evaluateFormula(formula, state.data);
      get().setCellValue(cellId, result, formula);
    } catch (error) {
      get().setCellValue(cellId, `#ERROR: ${(error as Error).message}`, formula);
    }
  },
  
  findAndReplace: (find, replace, selectionOnly = false) => {
    const state = get();
    const updatedData = { ...state.data };
    
    const cellsToCheck = selectionOnly && state.selection 
      ? getCellsInSelection(state.selection)
      : Object.keys(state.data);
    
    cellsToCheck.forEach(cellId => {
      const cell = updatedData[cellId];
      if (cell.value !== null && typeof cell.value === 'string' && cell.value.includes(find)) {
        const newValue = cell.value.replaceAll(find, replace);
        updatedData[cellId] = {
          ...cell,
          value: newValue,
          displayValue: newValue
        };
      }
    });
    
    set({ data: updatedData });
  },
  
  removeDuplicates: (selection) => {
    const state = get();
    const cellsInSelection = getCellsInSelection(selection);
    
    // Group cells by row
    const rowGroups: { [key: number]: string[] } = {};
    cellsInSelection.forEach(cellId => {
      const [row, col] = cellId.split(':').map(Number);
      if (!rowGroups[row]) rowGroups[row] = [];
      rowGroups[row].push(cellId);
    });
    
    // Get row values for comparison
    const rowValues: { [key: number]: string } = {};
    const rowsToKeep = new Set<number>();
    
    Object.entries(rowGroups).forEach(([rowIndex, cellIds]) => {
      const row = Number(rowIndex);
      const rowValue = cellIds.map(cellId => state.data[cellId]?.value || '').join('|');
      
      // Check if this row value has been seen before
      let isDuplicate = false;
      for (const [existingRow, existingValue] of Object.entries(rowValues)) {
        if (existingValue === rowValue) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        rowValues[row] = rowValue;
        rowsToKeep.add(row);
      }
    });
    
    // Clear values from duplicate rows
    const updatedData = { ...state.data };
    Object.entries(rowGroups).forEach(([rowIndex, cellIds]) => {
      const row = Number(rowIndex);
      if (!rowsToKeep.has(row)) {
        cellIds.forEach(cellId => {
          updatedData[cellId] = {
            ...updatedData[cellId],
            value: null,
            displayValue: '',
            formula: undefined
          };
        });
      }
    });
    
    set({ data: updatedData });
  }
}));

// Helper function to get all cell IDs in a selection
function getCellsInSelection(selection: Selection): string[] {
  const cells: string[] = [];
  
  for (let row = selection.start.row; row <= selection.end.row; row++) {
    for (let col = selection.start.col; col <= selection.end.col; col++) {
      cells.push(generateCellId(row, col));
    }
  }
  
  return cells;
}