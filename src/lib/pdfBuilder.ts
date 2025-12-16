// PDF Builder - Converts JSON Schema to PDF using jsPDF
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import type { 
  DocumentSchema, 
  AnyDocumentElement, 
  ParagraphElement,
  HeadingElement,
  ListElement,
  TableElement,
  ImageElement,
  DocumentTheme,
} from "./documentSchema";

// Extend jsPDF type for autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

// Convert hex color to RGB array
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
}

// Main PDF builder function
export async function buildPdfFromSchema(schema: DocumentSchema): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const theme = schema.theme;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set default font
  doc.setFont("helvetica");

  // Helper to check if we need a new page
  const checkNewPage = (requiredHeight: number = 20) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Helper to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  // Process each section
  for (const section of schema.sections) {
    for (const element of section.elements) {
      await renderElement(doc, element, theme, {
        margin,
        contentWidth,
        pageHeight,
        getY: () => yPosition,
        setY: (y: number) => { yPosition = y; },
        checkNewPage,
        wrapText,
      });
    }
  }

  // Add metadata
  doc.setProperties({
    title: schema.metadata.title,
    subject: schema.metadata.subject || "",
    author: schema.metadata.author || "mydocmaker.com",
    creator: "mydocmaker.com",
  });

  return doc.output("blob");
}

interface RenderContext {
  margin: number;
  contentWidth: number;
  pageHeight: number;
  getY: () => number;
  setY: (y: number) => void;
  checkNewPage: (height?: number) => void;
  wrapText: (text: string, maxWidth: number, fontSize: number) => string[];
}

async function renderElement(
  doc: jsPDF,
  element: AnyDocumentElement,
  theme: DocumentTheme,
  ctx: RenderContext
): Promise<void> {
  switch (element.type) {
    case "heading1":
      renderHeading(doc, element as HeadingElement, theme, ctx, 24);
      break;
    case "heading2":
      renderHeading(doc, element as HeadingElement, theme, ctx, 18);
      break;
    case "heading3":
      renderHeading(doc, element as HeadingElement, theme, ctx, 14);
      break;
    case "heading4":
      renderHeading(doc, element as HeadingElement, theme, ctx, 12);
      break;
    case "paragraph":
      renderParagraph(doc, element as ParagraphElement, theme, ctx);
      break;
    case "bullet_list":
    case "numbered_list":
      renderList(doc, element as ListElement, theme, ctx);
      break;
    case "table":
      renderTable(doc, element as TableElement, theme, ctx);
      break;
    case "image":
      await renderImage(doc, element as ImageElement, ctx);
      break;
    case "divider":
      renderDivider(doc, ctx);
      break;
  }
}

function renderHeading(
  doc: jsPDF,
  element: HeadingElement,
  theme: DocumentTheme,
  ctx: RenderContext,
  fontSize: number
): void {
  ctx.checkNewPage(fontSize + 10);
  
  const primaryColor = hexToRgb(theme.primary_color);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);

  const lines = ctx.wrapText(element.text, ctx.contentWidth, fontSize);
  const lineHeight = fontSize * 0.5;

  for (const line of lines) {
    doc.text(line, ctx.margin, ctx.getY());
    ctx.setY(ctx.getY() + lineHeight);
  }

  ctx.setY(ctx.getY() + 4);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
}

function renderParagraph(
  doc: jsPDF,
  element: ParagraphElement,
  theme: DocumentTheme,
  ctx: RenderContext
): void {
  const fontSize = theme.font_size || 11;
  ctx.checkNewPage(fontSize + 5);

  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const text = element.text || 
    (element.text_runs?.map(r => r.text).join("") || "");
  
  if (!text.trim()) return;

  const lines = ctx.wrapText(text, ctx.contentWidth, fontSize);
  const lineHeight = fontSize * 0.45;

  for (const line of lines) {
    ctx.checkNewPage(lineHeight);
    doc.text(line, ctx.margin, ctx.getY());
    ctx.setY(ctx.getY() + lineHeight);
  }

  ctx.setY(ctx.getY() + 3);
}

function renderList(
  doc: jsPDF,
  element: ListElement,
  theme: DocumentTheme,
  ctx: RenderContext
): void {
  const fontSize = theme.font_size || 11;
  const lineHeight = fontSize * 0.45;
  const isBullet = element.type === "bullet_list";

  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  element.items.forEach((item, index) => {
    ctx.checkNewPage(lineHeight);
    
    const prefix = isBullet ? "•  " : `${index + 1}. `;
    const prefixWidth = doc.getTextWidth(prefix);
    const itemWidth = ctx.contentWidth - prefixWidth - 5;
    
    const lines = ctx.wrapText(item, itemWidth, fontSize);
    
    lines.forEach((line, lineIndex) => {
      ctx.checkNewPage(lineHeight);
      if (lineIndex === 0) {
        doc.text(prefix, ctx.margin + 5, ctx.getY());
      }
      doc.text(line, ctx.margin + 5 + prefixWidth, ctx.getY());
      ctx.setY(ctx.getY() + lineHeight);
    });
  });

  ctx.setY(ctx.getY() + 3);
}

function renderTable(
  doc: jsPDF,
  element: TableElement,
  theme: DocumentTheme,
  ctx: RenderContext
): void {
  ctx.checkNewPage(30);

  const head = element.rows.length > 0 && element.rows[0].isHeader !== false
    ? [element.rows[0].cells]
    : [];
  
  const body = head.length > 0 
    ? element.rows.slice(1).map(row => row.cells)
    : element.rows.map(row => row.cells);

  const primaryColor = hexToRgb(theme.primary_color);

  doc.autoTable({
    startY: ctx.getY(),
    head: head,
    body: body,
    margin: { left: ctx.margin, right: ctx.margin },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    didDrawPage: () => {
      ctx.setY(doc.lastAutoTable.finalY + 5);
    },
  });

  ctx.setY(doc.lastAutoTable.finalY + 8);
}

async function renderImage(
  doc: jsPDF,
  element: ImageElement,
  ctx: RenderContext
): Promise<void> {
  if (!element.url) return;

  try {
    ctx.checkNewPage(60);

    let imageData: string = element.url;
    
    // If it's not a base64 image, we need to fetch it
    if (!element.url.startsWith("data:image")) {
      try {
        const response = await fetch(element.url);
        const blob = await response.blob();
        imageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error("Failed to fetch image:", e);
        return;
      }
    }

    const imgWidth = Math.min((element.width_inches || 4) * 25.4, ctx.contentWidth);
    const imgHeight = imgWidth * 0.75; // Maintain aspect ratio

    const xPos = ctx.margin + (ctx.contentWidth - imgWidth) / 2;

    doc.addImage(imageData, "PNG", xPos, ctx.getY(), imgWidth, imgHeight);
    ctx.setY(ctx.getY() + imgHeight + 5);

    // Add caption if present
    if (element.caption) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const captionWidth = doc.getTextWidth(element.caption);
      doc.text(element.caption, ctx.margin + (ctx.contentWidth - captionWidth) / 2, ctx.getY());
      ctx.setY(ctx.getY() + 5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
    }
  } catch (error) {
    console.error("Error rendering image:", error);
  }
}

function renderDivider(doc: jsPDF, ctx: RenderContext): void {
  ctx.checkNewPage(10);
  ctx.setY(ctx.getY() + 3);
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(ctx.margin, ctx.getY(), ctx.margin + ctx.contentWidth, ctx.getY());
  
  ctx.setY(ctx.getY() + 6);
}

// Create PDF from HTML content (for PDF Generator tool)
export async function createPdfFromHtml(htmlContent: string, title: string): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Strip HTML tags and convert to plain text blocks
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Helper to check if we need a new page
  const checkNewPage = (requiredHeight: number = 10) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 138); // Blue color
  const titleLines = doc.splitTextToSize(title, contentWidth);
  for (const line of titleLines) {
    checkNewPage(12);
    doc.text(line, margin, yPosition);
    yPosition += 10;
  }
  yPosition += 5;

  // Draw title underline
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, margin + contentWidth, yPosition);
  yPosition += 10;

  // Process HTML elements
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(text, contentWidth);
        for (const line of lines) {
          checkNewPage(6);
          doc.text(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 2;
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tagName = el.tagName.toLowerCase();

    switch (tagName) {
      case 'h1':
        checkNewPage(14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(30, 58, 138);
        yPosition += 4;
        const h1Lines = doc.splitTextToSize(el.textContent || '', contentWidth);
        for (const line of h1Lines) {
          doc.text(line, margin, yPosition);
          yPosition += 9;
        }
        yPosition += 3;
        break;

      case 'h2':
        checkNewPage(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(30, 58, 138);
        yPosition += 3;
        const h2Lines = doc.splitTextToSize(el.textContent || '', contentWidth);
        for (const line of h2Lines) {
          doc.text(line, margin, yPosition);
          yPosition += 7;
        }
        yPosition += 2;
        break;

      case 'h3':
        checkNewPage(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(15, 52, 96);
        yPosition += 2;
        const h3Lines = doc.splitTextToSize(el.textContent || '', contentWidth);
        for (const line of h3Lines) {
          doc.text(line, margin, yPosition);
          yPosition += 6;
        }
        yPosition += 2;
        break;

      case 'h4':
        checkNewPage(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(51, 65, 85);
        yPosition += 2;
        const h4Lines = doc.splitTextToSize(el.textContent || '', contentWidth);
        for (const line of h4Lines) {
          doc.text(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 2;
        break;

      case 'p':
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const pLines = doc.splitTextToSize(el.textContent || '', contentWidth);
        for (const line of pLines) {
          checkNewPage(6);
          doc.text(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 3;
        break;

      case 'ul':
      case 'ol':
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const listItems = el.querySelectorAll(':scope > li');
        listItems.forEach((li, idx) => {
          checkNewPage(6);
          const prefix = tagName === 'ul' ? '•  ' : `${idx + 1}. `;
          const itemText = li.textContent || '';
          const prefixWidth = doc.getTextWidth(prefix);
          const itemLines = doc.splitTextToSize(itemText, contentWidth - prefixWidth - 5);
          
          itemLines.forEach((line: string, lineIdx: number) => {
            checkNewPage(5);
            if (lineIdx === 0) {
              doc.text(prefix, margin + 5, yPosition);
            }
            doc.text(line, margin + 5 + prefixWidth, yPosition);
            yPosition += 5;
          });
        });
        yPosition += 3;
        break;

      case 'strong':
      case 'b':
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const boldLines = doc.splitTextToSize(el.textContent || '', contentWidth);
        for (const line of boldLines) {
          checkNewPage(6);
          doc.text(line, margin, yPosition);
          yPosition += 5;
        }
        break;

      case 'hr':
        checkNewPage(10);
        yPosition += 3;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, yPosition, margin + contentWidth, yPosition);
        yPosition += 6;
        break;

      default:
        // Process child nodes for other elements
        el.childNodes.forEach(child => processNode(child));
    }
  };

  tempDiv.childNodes.forEach(node => processNode(node));

  // Add metadata
  doc.setProperties({
    title: title,
    author: "mydocmaker.com",
    creator: "mydocmaker.com",
  });

  return doc.output("blob");
}

// Create PDF from presentation data
export async function createPdfFromPresentation(presentationData: any): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  presentationData.slides.forEach((slide: any, slideIndex: number) => {
    if (slideIndex > 0) {
      doc.addPage();
    }

    let yPosition = margin;

    if (slide.slide_layout === 'title_slide') {
      // Title slide - centered
      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor(30, 58, 138);
      
      const titleLines = doc.splitTextToSize(slide.title || '', contentWidth);
      const titleHeight = titleLines.length * 15;
      const titleStartY = (pageHeight - titleHeight) / 2;
      
      titleLines.forEach((line: string, idx: number) => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, (pageWidth - textWidth) / 2, titleStartY + idx * 15);
      });

      if (slide.subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(20);
        doc.setTextColor(100, 116, 139);
        const subtitleWidth = doc.getTextWidth(slide.subtitle);
        doc.text(slide.subtitle, (pageWidth - subtitleWidth) / 2, titleStartY + titleHeight + 15);
      }
    } else {
      // Content slide
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(30, 58, 138);
      
      const titleLines = doc.splitTextToSize(slide.title || '', contentWidth);
      titleLines.forEach((line: string) => {
        doc.text(line, margin, yPosition);
        yPosition += 12;
      });

      // Draw underline
      yPosition += 2;
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(1);
      doc.line(margin, yPosition, margin + 80, yPosition);
      yPosition += 15;

      // Bullets
      if (slide.bullets && slide.bullets.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(51, 65, 85);

        slide.bullets.forEach((bullet: any) => {
          const indent = (bullet.level || 0) * 10;
          const bulletText = bullet.content || '';
          const prefix = bullet.level === 1 ? '  ◦  ' : '•  ';
          
          const lines = doc.splitTextToSize(bulletText, contentWidth - indent - 15);
          lines.forEach((line: string, lineIdx: number) => {
            if (lineIdx === 0) {
              doc.text(prefix, margin + indent, yPosition);
            }
            doc.text(line, margin + indent + 10, yPosition);
            yPosition += 8;
          });
        });
      }
    }

    // Page number
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const pageNum = `${slideIndex + 1} / ${presentationData.slides.length}`;
    const pageNumWidth = doc.getTextWidth(pageNum);
    doc.text(pageNum, pageWidth - margin - pageNumWidth, pageHeight - 10);
  });

  // Add metadata
  doc.setProperties({
    title: presentationData.presentation_title || 'Presentation',
    author: "mydocmaker.com",
    creator: "mydocmaker.com",
  });

  return doc.output("blob");
}
