import { CellValue, SpreadsheetData } from '../types';
import { generateCellId, isNumeric, parseA1Notation } from './helpers';

// Main function to evaluate a formula
export function evaluateFormula(formula: string, data: SpreadsheetData): CellValue {
  if (!formula.startsWith('=')) {
    return formula; // Not a formula, return as is
  }
  
  const expression = formula.substring(1).trim();
  
  // Check for built-in functions
  if (expression.includes('(') && expression.includes(')')) {
    const functionMatch = expression.match(/^([A-Z_]+)\((.*)\)$/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      const args = parseArguments(functionMatch[2]);
      
      return evaluateFunction(functionName, args, data);
    }
  }
  
  // If not a function, evaluate as a cell reference or simple expression
  return evaluateCellReference(expression, data);
}

// Parse function arguments, handling commas within ranges
function parseArguments(argsString: string): string[] {
  const args: string[] = [];
  let currentArg = '';
  let inRange = false;
  
  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];
    
    if (char === ':') {
      inRange = !inRange;
      currentArg += char;
    } else if (char === ',' && !inRange) {
      args.push(currentArg.trim());
      currentArg = '';
    } else {
      currentArg += char;
    }
  }
  
  if (currentArg) {
    args.push(currentArg.trim());
  }
  
  return args;
}

// Evaluate a function with its arguments
function evaluateFunction(functionName: string, args: string[], data: SpreadsheetData): CellValue {
  switch (functionName.toUpperCase()) {
    case 'SUM':
      return sum(args, data);
    case 'AVERAGE':
      return average(args, data);
    case 'MAX':
      return max(args, data);
    case 'MIN':
      return min(args, data);
    case 'COUNT':
      return count(args, data);
    case 'TRIM':
      return trim(args, data);
    case 'UPPER':
      return upper(args, data);
    case 'LOWER':
      return lower(args, data);
    default:
      throw new Error(`Unknown function: ${functionName}`);
  }
}

// Evaluate a cell reference or range
function evaluateCellReference(reference: string, data: SpreadsheetData): CellValue {
  // Check if it's a range (contains a colon)
  if (reference.includes(':')) {
    throw new Error('Cell ranges can only be used within functions');
  }
  
  // Single cell reference
  try {
    const { row, col } = parseA1Notation(reference);
    const cellId = generateCellId(row, col);
    const cell = data[cellId];
    
    if (!cell) {
      return null;
    }
    
    // If the cell contains a formula, we would need to evaluate it
    // This is a simplified version; a real implementation would need to handle circular references
    if (cell.formula && cell.formula !== reference) {
      return evaluateFormula(cell.formula, data);
    }
    
    return cell.value;
  } catch (error) {
    // If it's not a valid cell reference, return the reference as is
    return reference;
  }
}

// Get all cell values in a range
function getCellValuesInRange(range: string, data: SpreadsheetData): CellValue[] {
  const [start, end] = range.split(':');
  const startCell = parseA1Notation(start);
  const endCell = parseA1Notation(end);
  
  const values: CellValue[] = [];
  
  for (let row = startCell.row; row <= endCell.row; row++) {
    for (let col = startCell.col; col <= endCell.col; col++) {
      const cellId = generateCellId(row, col);
      const cell = data[cellId];
      
      if (cell && cell.value !== null) {
        values.push(cell.value);
      }
    }
  }
  
  return values;
}

// Process arguments that could be cell references, ranges, or literal values
function processArguments(args: string[], data: SpreadsheetData): CellValue[] {
  const values: CellValue[] = [];
  
  for (const arg of args) {
    if (arg.includes(':')) {
      // It's a range
      values.push(...getCellValuesInRange(arg, data));
    } else if (/^[A-Z]+\d+$/.test(arg)) {
      // It's a cell reference
      const value = evaluateCellReference(arg, data);
      if (value !== null) {
        values.push(value);
      }
    } else {
      // It's a literal value
      values.push(arg);
    }
  }
  
  return values;
}

// Mathematical Functions

function sum(args: string[], data: SpreadsheetData): number {
  const values = processArguments(args, data);
  return values.reduce((sum, value) => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    return isNaN(num) ? sum : sum + num;
  }, 0);
}

function average(args: string[], data: SpreadsheetData): number {
  const values = processArguments(args, data);
  const numericValues = values.filter(value => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    return !isNaN(num);
  });
  
  if (numericValues.length === 0) {
    return 0;
  }
  
  const total = numericValues.reduce((sum, value) => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    return sum + num;
  }, 0);
  
  return total / numericValues.length;
}

function max(args: string[], data: SpreadsheetData): number {
  const values = processArguments(args, data);
  const numericValues = values
    .map(value => typeof value === 'number' ? value : parseFloat(String(value)))
    .filter(num => !isNaN(num));
  
  if (numericValues.length === 0) {
    return 0;
  }
  
  return Math.max(...numericValues);
}

function min(args: string[], data: SpreadsheetData): number {
  const values = processArguments(args, data);
  const numericValues = values
    .map(value => typeof value === 'number' ? value : parseFloat(String(value)))
    .filter(num => !isNaN(num));
  
  if (numericValues.length === 0) {
    return 0;
  }
  
  return Math.min(...numericValues);
}

function count(args: string[], data: SpreadsheetData): number {
  const values = processArguments(args, data);
  return values.filter(value => {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    return !isNaN(num);
  }).length;
}

// Data Quality Functions

function trim(args: string[], data: SpreadsheetData): string {
  if (args.length !== 1) {
    throw new Error('TRIM function requires exactly one argument');
  }
  
  const value = processArguments(args, data)[0];
  return String(value).trim();
}

function upper(args: string[], data: SpreadsheetData): string {
  if (args.length !== 1) {
    throw new Error('UPPER function requires exactly one argument');
  }
  
  const value = processArguments(args, data)[0];
  return String(value).toUpperCase();
}

function lower(args: string[], data: SpreadsheetData): string {
  if (args.length !== 1) {
    throw new Error('LOWER function requires exactly one argument');
  }
  
  const value = processArguments(args, data)[0];
  return String(value).toLowerCase();
}