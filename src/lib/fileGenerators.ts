import { Document, Paragraph, HeadingLevel, TextRun, Packer, AlignmentType, Footer, PageNumber, NumberFormat, ExternalHyperlink } from "docx";
import PptxGenJS from "pptxgenjs";
import ExcelJS from "exceljs";
import { buildPptxFromSchema, legacyToPresentationSchema } from "./presentationBuilder";
import { buildXlsxFromSchema, csvToSpreadsheetSchema } from "./spreadsheetBuilder";
import type { PresentationSchema } from "./presentationSchema";
import type { SpreadsheetSchema } from "./spreadsheetSchema";

// Helper to parse markdown/HTML content into proper paragraphs
function parseContentToParagraphs(content: string): any[] {
  const children: any[] = [];
  
  // First, normalize the content - handle both HTML and Markdown
  let normalizedContent = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
  
  // Split by double newlines for paragraphs
  const blocks = normalizedContent.split(/\n{2,}/).filter(b => b.trim());
  
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Handle H1 (# or <h1>)
    const h1Match = trimmed.match(/^#\s+(.+)$/m) || trimmed.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      children.push(
        new Paragraph({
          text: h1Match[1].replace(/<[^>]+>/g, '').trim(),
          heading: HeadingLevel.TITLE,
          spacing: { after: 400, before: 200 },
          alignment: AlignmentType.CENTER,
        })
      );
      continue;
    }

    // Handle H2 (## or <h2>)
    const h2Match = trimmed.match(/^##\s+(.+)$/m) || trimmed.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (h2Match) {
      children.push(
        new Paragraph({
          text: h2Match[1].replace(/<[^>]+>/g, '').trim(),
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300, before: 400 },
        })
      );
      continue;
    }

    // Handle H3 (### or <h3>)
    const h3Match = trimmed.match(/^###\s+(.+)$/m) || trimmed.match(/<h3[^>]*>(.*?)<\/h3>/i);
    if (h3Match) {
      children.push(
        new Paragraph({
          text: h3Match[1].replace(/<[^>]+>/g, '').trim(),
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        })
      );
      continue;
    }

    // Handle H4 (#### or <h4>)
    const h4Match = trimmed.match(/^####\s+(.+)$/m) || trimmed.match(/<h4[^>]*>(.*?)<\/h4>/i);
    if (h4Match) {
      children.push(
        new Paragraph({
          text: h4Match[1].replace(/<[^>]+>/g, '').trim(),
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 150, before: 250 },
        })
      );
      continue;
    }

    // Handle bullet lists (HTML <ul><li> or markdown -)
    if (trimmed.match(/<ul>/i) || trimmed.match(/^[-*]\s+/m)) {
      let listContent = trimmed;
      
      // Extract list items from HTML
      const htmlItems = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      
      if (htmlItems) {
        htmlItems.forEach(item => {
          const text = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/i, '$1')
            .replace(/<[^>]+>/g, '')
            .trim();
          
          if (text) {
            children.push(
              new Paragraph({
                text: text,
                bullet: { level: 0 },
                spacing: { after: 100 },
              })
            );
          }
        });
      } else {
        // Handle markdown list items
        const lines = trimmed.split('\n');
        for (const line of lines) {
          const listMatch = line.match(/^[-*]\s+(.+)$/);
          if (listMatch) {
            const itemText = listMatch[1].replace(/\*\*(.+?)\*\*/g, '$1').replace(/<[^>]+>/g, '').trim();
            children.push(
              new Paragraph({
                text: itemText,
                bullet: { level: 0 },
                spacing: { after: 100 },
              })
            );
          }
        }
      }
      continue;
    }

    // Handle numbered lists
    if (trimmed.match(/<ol>/i) || trimmed.match(/^\d+\.\s+/m)) {
      const htmlItems = trimmed.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      
      if (htmlItems) {
        htmlItems.forEach((item, idx) => {
          const text = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/i, '$1')
            .replace(/<[^>]+>/g, '')
            .trim();
          
          if (text) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: `${idx + 1}. ${text}` })],
                spacing: { after: 100 },
                indent: { left: 720 },
              })
            );
          }
        });
      }
      continue;
    }

    // Handle regular paragraphs - process inline formatting
    const cleanText = trimmed
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .trim();
    
    if (cleanText) {
      // Split by lines and create proper paragraphs
      const lines = cleanText.split('\n').filter(l => l.trim());
      for (const line of lines) {
        const finalText = line.trim();
        if (finalText) {
          children.push(
            new Paragraph({
              text: finalText,
              spacing: { after: 200 },
            })
          );
        }
      }
    }
  }

  return children;
}

export async function createDocxFile(htmlContent: string, title: string, isPremium: boolean = true): Promise<Blob> {
  const children = parseContentToParagraphs(htmlContent);

  const doc = new Document({
    sections: [{
      properties: {},
      children: children.length > 0 ? children : [
        new Paragraph({ 
          text: htmlContent.replace(/<[^>]+>/g, '').trim() || title,
          spacing: { after: 200 },
        })
      ],
    }],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}

/**
 * Create PPTX from structured schema or legacy format
 * @param presentationData - Either PresentationSchema or legacy format
 * @param isPremium - Whether user is premium (unused, kept for compatibility)
 */
export async function createPptxFile(presentationData: PresentationSchema | any, isPremium: boolean = true): Promise<Blob> {
  // Check if it's the new schema format
  if (presentationData.type === 'presentation' && presentationData.metadata && presentationData.theme) {
    return buildPptxFromSchema(presentationData as PresentationSchema);
  }

  // Convert legacy format to new schema and build
  const schema = legacyToPresentationSchema(presentationData);
  return buildPptxFromSchema(schema);
}

/**
 * Create XLSX from structured schema or CSV content
 * @param data - Either SpreadsheetSchema or CSV string
 * @param isPremium - Whether user is premium (unused, kept for compatibility)
 */
export async function createXlsxFile(data: SpreadsheetSchema | string, isPremium: boolean = true): Promise<Blob> {
  // Check if it's the new schema format
  if (typeof data === 'object' && data.type === 'spreadsheet') {
    return buildXlsxFromSchema(data as SpreadsheetSchema);
  }

  // Convert CSV string to schema and build
  const csvContent = typeof data === 'string' ? data : '';
  const schema = csvToSpreadsheetSchema(csvContent);
  return buildXlsxFromSchema(schema);
}
