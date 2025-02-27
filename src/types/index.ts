export type CellValue = string | number | null;

export type CellStyle = {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
};

export type Cell = {
  id: string;
  value: CellValue;
  displayValue?: string;
  formula?: string;
  style: CellStyle;
};

export type SpreadsheetData = {
  [key: string]: Cell;
};

export type Selection = {
  start: { row: number; col: number };
  end: { row: number; col: number };
};