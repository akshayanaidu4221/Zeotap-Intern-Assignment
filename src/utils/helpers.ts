import { CellValue, Selection } from '../types';

// Generate a cell ID from row and column indices
export function generateCellId(row: number, col: number): string {
  return `${row}:${col}`;
}

// Parse a cell ID into row and column indices
export function parseCellId(cellId: string): { row: number; col: number } {
  const [row, col] = cellId.split(':').map(Number);
  return { row, col };
}

// Convert column index to column letter (0 -> A, 1 -> B, etc.)
export function columnIndexToLetter(index: number): string {
  let letter = '';
  let temp = index;
  
  while (temp >= 0) {
    letter = String.fromCharCode(65 + (temp % 26)) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  
  return letter;
}

// Convert column letter to column index (A -> 0, B -> 1, etc.)
export function columnLetterToIndex(letter: string): number {
  let index = 0;
  
  for (let i = 0; i < letter.length; i++) {
    index = index * 26 + letter.charCodeAt(i) - 64;
  }
  
  return index - 1;
}

// Get cell address in A1 notation
export function getCellAddress(row: number, col: number): string {
  return `${columnIndexToLetter(col)}${row + 1}`;
}

// Parse A1 notation to row and column indices
export function parseA1Notation(address: string): { row: number; col: number } {
  const match = address.match(/([A-Z]+)(\d+)/);
  if (!match) throw new Error(`Invalid cell address: ${address}`);
  
  const colLetter = match[1];
  const rowNumber = parseInt(match[2], 10);
  
  return {
    row: rowNumber - 1,
    col: columnLetterToIndex(colLetter)
  };
}

// Check if a value is numeric
export function isNumeric(value: CellValue): boolean {
  if (value === null) return false;
  if (typeof value === 'number') return true;
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}

// Get all cells in a selection
export function getCellsInRange(selection: Selection): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  
  for (let row = selection.start.row; row <= selection.end.row; row++) {
    for (let col = selection.start.col; col <= selection.end.col; col++) {
      cells.push({ row, col });
    }
  }
  
  return cells;
}

// Trim whitespace from a string
export function trim(value: string): string {
  return value.trim();
}

// Convert a string to uppercase
export function toUpper(value: string): string {
  return value.toUpperCase();
}

// Convert a string to lowercase
export function toLower(value: string): string {
  return value.toLowerCase();
}