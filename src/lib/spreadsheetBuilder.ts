// Spreadsheet Builder - Converts SpreadsheetSchema to XLSX using ExcelJS
import ExcelJS from 'exceljs';
import type { 
  SpreadsheetSchema, 
  SheetData, 
  RowData, 
  CellData, 
  CellStyle,
  StyleRange,
} from './spreadsheetSchema';
import { parseCellValue } from './spreadsheetSchema';

// Convert hex color to ARGB format for ExcelJS
function hexToArgb(hex: string): string {
  const cleanHex = hex.replace('#', '').toUpperCase();
  return 'FF' + cleanHex; // Add alpha channel
}

// Parse Excel-style range (e.g., "A1:D5") to row/col indices
function parseRange(range: string): { startCol: number; startRow: number; endCol: number; endRow: number } {
  const match = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (!match) {
    // Single cell
    const singleMatch = range.match(/([A-Z]+)(\d+)/);
    if (singleMatch) {
      const col = columnToIndex(singleMatch[1]);
      const row = parseInt(singleMatch[2], 10);
      return { startCol: col, startRow: row, endCol: col, endRow: row };
    }
    return { startCol: 1, startRow: 1, endCol: 1, endRow: 1 };
  }
  
  return {
    startCol: columnToIndex(match[1]),
    startRow: parseInt(match[2], 10),
    endCol: columnToIndex(match[3]),
    endRow: parseInt(match[4], 10),
  };
}

// Convert column letter to index (A=1, B=2, etc.)
function columnToIndex(col: string): number {
  let index = 0;
  for (let i = 0; i < col.length; i++) {
    index = index * 26 + (col.charCodeAt(i) - 64);
  }
  return index;
}

// Apply style to a cell
function applyCellStyle(cell: ExcelJS.Cell, style: CellStyle): void {
  // Font styling
  cell.font = {
    bold: style.bold,
    italic: style.italic,
    underline: style.underline,
    size: style.fontSize,
    color: style.fontColor ? { argb: hexToArgb(style.fontColor) } : undefined,
  };

  // Background fill
  if (style.bgColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: hexToArgb(style.bgColor) },
    };
  }

  // Alignment
  cell.alignment = {
    horizontal: style.align || 'left',
    wrapText: style.wrapText,
    vertical: 'middle',
  };

  // Number format
  if (style.numberFormat) {
    cell.numFmt = style.numberFormat;
  }
}

// Build a single sheet
function buildSheet(workbook: ExcelJS.Workbook, sheetData: SheetData): ExcelJS.Worksheet {
  const worksheet = workbook.addWorksheet(sheetData.name);

  // Add data rows
  sheetData.data.forEach((rowData, rowIndex) => {
    const row = worksheet.addRow([]);
    
    rowData.cells.forEach((cellData, colIndex) => {
      const cell = row.getCell(colIndex + 1);
      const { value, formula } = parseCellValue(cellData);
      
      if (formula) {
        // Set formula (remove leading "=" for ExcelJS)
        cell.value = { formula: formula.startsWith('=') ? formula.substring(1) : formula };
      } else {
        cell.value = value;
      }

      // Apply cell-specific styles from CellData
      if (typeof cellData === 'object' && cellData !== null && 'style' in cellData && cellData.style) {
        applyCellStyle(cell, cellData.style);
      }
    });

    // Apply header row styling
    if (rowData.isHeader) {
      row.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFDDEBF7' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    }

    // Set row height if specified
    if (rowData.height) {
      row.height = rowData.height;
    }
  });

  // Apply column configurations
  if (sheetData.columns) {
    sheetData.columns.forEach((config, index) => {
      const column = worksheet.getColumn(index + 1);
      if (config.width) {
        column.width = config.width;
      }
      if (config.hidden) {
        column.hidden = true;
      }
    });
  }

  // Apply style ranges
  if (sheetData.styles) {
    sheetData.styles.forEach((styleRange) => {
      const { startCol, startRow, endCol, endRow } = parseRange(styleRange.range);
      
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cell = worksheet.getCell(r, c);
          applyCellStyle(cell, styleRange.style);
        }
      }
    });
  }

  // Auto-fit columns if no explicit width
  if (!sheetData.columns) {
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      if (column && column.eachCell) {
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
      }
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });
  }

  // Add borders to all data cells
  const lastRow = sheetData.data.length;
  const maxCols = Math.max(...sheetData.data.map(r => r.cells.length));
  
  for (let r = 1; r <= lastRow; r++) {
    for (let c = 1; c <= maxCols; c++) {
      const cell = worksheet.getCell(r, c);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    }
  }

  // Freeze panes
  if (sheetData.freezeRow || sheetData.freezeColumn) {
    worksheet.views = [{
      state: 'frozen',
      xSplit: sheetData.freezeColumn || 0,
      ySplit: sheetData.freezeRow || 0,
    }];
  }

  return worksheet;
}

// Main builder function - converts SpreadsheetSchema to XLSX Blob
export async function buildXlsxFromSchema(schema: SpreadsheetSchema): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = schema.author || 'MyDocMaker.com';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Build each sheet
  for (const sheetData of schema.sheets) {
    buildSheet(workbook, sheetData);
  }

  // Generate blob
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

// Convert CSV string to SpreadsheetSchema (for backward compatibility)
export function csvToSpreadsheetSchema(csvContent: string, sheetName: string = 'Sheet1'): SpreadsheetSchema {
  const rows = csvContent.split('\n').map(row => 
    row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
  );

  const data: RowData[] = rows
    .filter(row => row.some(cell => cell)) // Filter empty rows
    .map((cells, index) => ({
      cells,
      isHeader: index === 0,
    }));

  return {
    type: 'spreadsheet',
    filename: 'spreadsheet.xlsx',
    sheets: [{
      name: sheetName,
      data,
    }],
  };
}
