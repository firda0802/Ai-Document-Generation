// Spreadsheet JSON Schema - Structured format for Excel generation
// Supports formulas, styling, and multiple sheets

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontColor?: string; // Hex color like "FF0000"
  bgColor?: string; // Hex color for background
  align?: 'left' | 'center' | 'right';
  numberFormat?: string; // e.g., "$#,##0.00", "0%", "yyyy-mm-dd"
  wrapText?: boolean;
}

export interface CellData {
  value: string | number | null;
  formula?: string; // Excel formula starting with "="
  style?: CellStyle;
}

export interface RowData {
  cells: (string | number | CellData | null)[];
  isHeader?: boolean;
  height?: number; // Row height in pixels
}

export interface ColumnConfig {
  width?: number; // Column width in characters
  hidden?: boolean;
}

export interface StyleRange {
  range: string; // e.g., "A1:D1", "B2:B10"
  style: CellStyle;
}

export interface SheetData {
  name: string;
  data: RowData[];
  columns?: ColumnConfig[];
  styles?: StyleRange[];
  freezeRow?: number; // Freeze rows above this index
  freezeColumn?: number; // Freeze columns left of this index
}

export interface SpreadsheetSchema {
  type: 'spreadsheet';
  filename: string;
  author?: string;
  sheets: SheetData[];
}

// Default spreadsheet theme
export const SPREADSHEET_HEADER_STYLE: CellStyle = {
  bold: true,
  bgColor: 'DDEBF7',
  align: 'center',
};

// Predefined spreadsheet templates
export const SPREADSHEET_TEMPLATES: Record<string, SpreadsheetSchema> = {
  budget: {
    type: 'spreadsheet',
    filename: 'budget.xlsx',
    sheets: [{
      name: 'Monthly Budget',
      data: [
        { cells: ['Category', 'Budget', 'Actual', 'Variance'], isHeader: true },
        { cells: ['Housing', 1500, 1450, '=B2-C2'] },
        { cells: ['Utilities', 200, 180, '=B3-C3'] },
        { cells: ['Groceries', 400, 450, '=B4-C4'] },
        { cells: ['Transportation', 300, 280, '=B5-C5'] },
        { cells: ['Entertainment', 200, 220, '=B6-C6'] },
        { cells: ['Savings', 500, 500, '=B7-C7'] },
        { cells: ['Total', '=SUM(B2:B7)', '=SUM(C2:C7)', '=B8-C8'], isHeader: true },
      ],
      styles: [
        { range: 'A1:D1', style: SPREADSHEET_HEADER_STYLE },
        { range: 'A8:D8', style: { bold: true, bgColor: 'E2EFDA' } },
        { range: 'B2:D8', style: { numberFormat: '$#,##0.00' } },
      ],
      freezeRow: 1,
    }],
  },
  invoice: {
    type: 'spreadsheet',
    filename: 'invoice.xlsx',
    sheets: [{
      name: 'Invoice',
      data: [
        { cells: ['INVOICE', '', '', ''] },
        { cells: ['Invoice #:', 'INV-001', '', ''] },
        { cells: ['Date:', '2025-01-01', '', ''] },
        { cells: ['', '', '', ''] },
        { cells: ['Description', 'Quantity', 'Rate', 'Amount'], isHeader: true },
        { cells: ['Consulting Services', 10, 150, '=B6*C6'] },
        { cells: ['Development Work', 20, 125, '=B7*C7'] },
        { cells: ['Design Services', 5, 100, '=B8*C8'] },
        { cells: ['', '', '', ''] },
        { cells: ['', '', 'Subtotal:', '=SUM(D6:D8)'] },
        { cells: ['', '', 'Tax (10%):', '=D10*0.1'] },
        { cells: ['', '', 'Total:', '=D10+D11'] },
      ],
      styles: [
        { range: 'A1', style: { bold: true, fontSize: 20 } },
        { range: 'A5:D5', style: SPREADSHEET_HEADER_STYLE },
        { range: 'C6:D12', style: { numberFormat: '$#,##0.00' } },
        { range: 'C10:D12', style: { bold: true } },
      ],
    }],
  },
  schedule: {
    type: 'spreadsheet',
    filename: 'schedule.xlsx',
    sheets: [{
      name: 'Weekly Schedule',
      data: [
        { cells: ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], isHeader: true },
        { cells: ['9:00 AM', '', '', '', '', ''] },
        { cells: ['10:00 AM', '', '', '', '', ''] },
        { cells: ['11:00 AM', '', '', '', '', ''] },
        { cells: ['12:00 PM', 'Lunch', 'Lunch', 'Lunch', 'Lunch', 'Lunch'] },
        { cells: ['1:00 PM', '', '', '', '', ''] },
        { cells: ['2:00 PM', '', '', '', '', ''] },
        { cells: ['3:00 PM', '', '', '', '', ''] },
        { cells: ['4:00 PM', '', '', '', '', ''] },
        { cells: ['5:00 PM', '', '', '', '', ''] },
      ],
      styles: [
        { range: 'A1:F1', style: SPREADSHEET_HEADER_STYLE },
        { range: 'A2:A10', style: { bold: true, bgColor: 'F3F4F6' } },
        { range: 'B5:F5', style: { bgColor: 'FEF3C7', align: 'center' } },
      ],
      columns: [
        { width: 12 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
      ],
      freezeRow: 1,
      freezeColumn: 1,
    }],
  },
  tracker: {
    type: 'spreadsheet',
    filename: 'expense_tracker.xlsx',
    sheets: [{
      name: 'Expenses',
      data: [
        { cells: ['Date', 'Description', 'Category', 'Amount', 'Payment Method'], isHeader: true },
        { cells: ['2025-01-01', 'Groceries', 'Food', 85.50, 'Credit Card'] },
        { cells: ['2025-01-02', 'Gas', 'Transportation', 45.00, 'Debit Card'] },
        { cells: ['2025-01-03', 'Restaurant', 'Food', 35.00, 'Cash'] },
        { cells: ['', '', '', '', ''] },
        { cells: ['', '', 'Total:', '=SUM(D2:D4)', ''] },
      ],
      styles: [
        { range: 'A1:E1', style: SPREADSHEET_HEADER_STYLE },
        { range: 'D2:D6', style: { numberFormat: '$#,##0.00' } },
        { range: 'C6:D6', style: { bold: true } },
      ],
      freezeRow: 1,
    }],
  },
  dataAnalysis: {
    type: 'spreadsheet',
    filename: 'data_analysis.xlsx',
    sheets: [{
      name: 'Sales Data',
      data: [
        { cells: ['Product', 'Q1', 'Q2', 'Q3', 'Q4', 'Total', 'Avg'], isHeader: true },
        { cells: ['Product A', 10000, 12000, 15000, 18000, '=SUM(B2:E2)', '=AVERAGE(B2:E2)'] },
        { cells: ['Product B', 8000, 9500, 11000, 13000, '=SUM(B3:E3)', '=AVERAGE(B3:E3)'] },
        { cells: ['Product C', 5000, 6000, 7500, 9000, '=SUM(B4:E4)', '=AVERAGE(B4:E4)'] },
        { cells: ['Total', '=SUM(B2:B4)', '=SUM(C2:C4)', '=SUM(D2:D4)', '=SUM(E2:E4)', '=SUM(F2:F4)', '=AVERAGE(G2:G4)'], isHeader: true },
      ],
      styles: [
        { range: 'A1:G1', style: SPREADSHEET_HEADER_STYLE },
        { range: 'A5:G5', style: { bold: true, bgColor: 'E2EFDA' } },
        { range: 'B2:G5', style: { numberFormat: '$#,##0' } },
      ],
      freezeRow: 1,
      freezeColumn: 1,
    }],
  },
};

// Helper to validate spreadsheet schema
export function validateSpreadsheetSchema(doc: any): doc is SpreadsheetSchema {
  if (!doc || typeof doc !== 'object') return false;
  if (doc.type !== 'spreadsheet') return false;
  if (!doc.sheets || !Array.isArray(doc.sheets)) return false;
  return doc.sheets.every((sheet: any) => 
    sheet.name && Array.isArray(sheet.data)
  );
}

// Helper to parse cell value (handles formulas)
export function parseCellValue(cell: string | number | CellData | null): { value: string | number | null; formula?: string } {
  if (cell === null || cell === undefined) {
    return { value: null };
  }
  
  if (typeof cell === 'object' && 'value' in cell) {
    return { value: cell.value, formula: cell.formula };
  }
  
  if (typeof cell === 'string' && cell.startsWith('=')) {
    return { value: null, formula: cell };
  }
  
  return { value: cell };
}
