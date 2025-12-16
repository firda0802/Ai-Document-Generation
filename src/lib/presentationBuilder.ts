// Presentation Builder - Converts PresentationSchema to PPTX using PptxGenJS
import PptxGenJS from 'pptxgenjs';
import type { 
  PresentationSchema, 
  SlideData, 
  BulletPoint,
  PresentationTheme,
} from './presentationSchema';
import { PRESENTATION_THEMES } from './presentationSchema';

// Convert hex color to PptxGenJS format (without #)
function formatColor(hex: string): string {
  return hex.replace('#', '').toUpperCase();
}

// Build bullet text array for PptxGenJS
function buildBulletText(bullets: BulletPoint[], theme: PresentationTheme): PptxGenJS.TextProps[] {
  return bullets.map(bullet => ({
    text: bullet.content,
    options: {
      bullet: { type: 'bullet' },
      indentLevel: bullet.level || 0,
      fontSize: bullet.style?.fontSize || 18,
      bold: bullet.style?.bold,
      italic: bullet.style?.italic,
      color: bullet.style?.color ? formatColor(bullet.style.color) : formatColor(theme.text_color),
    },
  }));
}

// Build a single slide based on layout
function buildSlide(pptx: PptxGenJS, slideData: SlideData, theme: PresentationTheme): void {
  const slide = pptx.addSlide();

  // Set background color if specified
  if (slideData.background_color) {
    slide.background = { color: formatColor(slideData.background_color) };
  }

  switch (slideData.layout) {
    case 'title_slide':
      buildTitleSlide(slide, slideData, theme);
      break;
    case 'section_header':
      buildSectionHeaderSlide(slide, slideData, theme);
      break;
    case 'title_content':
      buildTitleContentSlide(slide, slideData, theme);
      break;
    case 'two_column':
      buildTwoColumnSlide(slide, slideData, theme);
      break;
    case 'comparison':
      buildComparisonSlide(slide, slideData, theme);
      break;
    case 'image_focus':
      buildImageFocusSlide(slide, slideData, theme);
      break;
    case 'quote':
      buildQuoteSlide(slide, slideData, theme);
      break;
    case 'blank':
      // Blank slide - only add title if present
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 0.6,
          fontSize: 24,
          bold: true,
          color: formatColor(theme.primary_color),
        });
      }
      break;
  }

  // Add speaker notes
  if (slideData.notes) {
    slide.addNotes(slideData.notes);
  }
}

function buildTitleSlide(slide: PptxGenJS.Slide, data: SlideData, theme: PresentationTheme): void {
  // Title
  slide.addText(data.title, {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: formatColor(theme.primary_color),
    align: 'center',
    valign: 'middle',
  });

  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5,
      y: 4,
      w: 9,
      h: 0.8,
      fontSize: 24,
      color: formatColor(theme.secondary_color),
      align: 'center',
      valign: 'top',
    });
  }
}

function buildSectionHeaderSlide(slide: PptxGenJS.Slide, data: SlideData, theme: PresentationTheme): void {
  // Large centered title
  slide.addText(data.title, {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 1.2,
    fontSize: 40,
    bold: true,
    color: formatColor(theme.primary_color),
    align: 'center',
    valign: 'middle',
  });

  // Subtitle below
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5,
      y: 3.4,
      w: 9,
      h: 0.8,
      fontSize: 22,
      color: formatColor(theme.secondary_color),
      align: 'center',
    });
  }

  // Decorative line
  slide.addShape('rect', {
    x: 3.5,
    y: 4.3,
    w: 3,
    h: 0.05,
    fill: { color: formatColor(theme.secondary_color) },
  });
}

function buildTitleContentSlide(slide: PptxGenJS.Slide, data: SlideData, theme: PresentationTheme): void {
  // Title
  slide.addText(data.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: formatColor(theme.primary_color),
  });

  // Bullets
  if (data.bullets && data.bullets.length > 0) {
    const bulletText = buildBulletText(data.bullets, theme);
    slide.addText(bulletText, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4,
      fontSize: 18,
      color: formatColor(theme.text_color),
      valign: 'top',
    });
  }

  // Plain content
  if (data.content) {
    slide.addText(data.content, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4,
      fontSize: 18,
      color: formatColor(theme.text_color),
      valign: 'top',
    });
  }

  // Image if present
  if (data.image?.url) {
    addSlideImage(slide, data.image.url, 'right');
  }
}

function buildTwoColumnSlide(slide: PptxGenJS.Slide, data: SlideData, theme: PresentationTheme): void {
  // Title
  slide.addText(data.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: formatColor(theme.primary_color),
  });

  // Left column
  if (data.left_column && data.left_column.length > 0) {
    const leftText = buildBulletText(data.left_column, theme);
    slide.addText(leftText, {
      x: 0.5,
      y: 1.5,
      w: 4.2,
      h: 4,
      fontSize: 16,
      color: formatColor(theme.text_color),
      valign: 'top',
    });
  }

  // Right column
  if (data.right_column && data.right_column.length > 0) {
    const rightText = buildBulletText(data.right_column, theme);
    slide.addText(rightText, {
      x: 5.2,
      y: 1.5,
      w: 4.2,
      h: 4,
      fontSize: 16,
      color: formatColor(theme.text_color),
      valign: 'top',
    });
  }

  // Vertical divider line
  slide.addShape('rect', {
    x: 4.9,
    y: 1.5,
    w: 0.02,
    h: 3.5,
    fill: { color: formatColor(theme.secondary_color) },
  });
}

function buildComparisonSlide(slide: PptxGenJS.Slide, data: SlideData, theme: PresentationTheme): void {
  // Title
  slide.addText(data.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: formatColor(theme.primary_color),
  });

  // Left header
  slide.addText('Before', {
    x: 0.5,
    y: 1.2,
    w: 4.2,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: formatColor(theme.secondary_color),
    align: 'center',
  });

  // Right header
  slide.addText('After', {
    x: 5.2,
    y: 1.2,
    w: 4.2,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: formatColor(theme.secondary_color),
    align: 'center',
  });

  // Left content
  if (data.left_column && data.left_column.length > 0) {
    const leftText = buildBulletText(data.left_column, theme);
    slide.addText(leftText, {
      x: 0.5,
      y: 1.8,
      w: 4.2,
      h: 3.5,
      fontSize: 16,
      color: formatColor(theme.text_color),
      valign: 'top',
    });
  }

  // Right content
  if (data.right_column && data.right_column.length > 0) {
    const rightText = buildBulletText(data.right_column, theme);
    slide.addText(rightText, {
      x: 5.2,
      y: 1.8,
      w: 4.2,
      h: 3.5,
      fontSize: 16,
      color: formatColor(theme.text_color),
      valign: 'top',
    });
  }

  // Arrow between columns
  slide.addText('→', {
    x: 4.5,
    y: 2.8,
    w: 1,
    h: 1,
    fontSize: 36,
    color: formatColor(theme.primary_color),
    align: 'center',
    valign: 'middle',
  });
}

function buildImageFocusSlide(slide: PptxGenJS.Slide, data: SlideData, theme: PresentationTheme): void {
  // Title at top
  slide.addText(data.title, {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: formatColor(theme.primary_color),
    align: 'center',
  });

  // Image placeholder (center)
  if (data.image?.url) {
    addSlideImage(slide, data.image.url, 'center', 6, 4);
  } else {
    slide.addShape('rect', {
      x: 2,
      y: 1.2,
      w: 6,
      h: 4,
      fill: { color: 'F3F4F6' },
      line: { color: 'D1D5DB', pt: 1 },
    });
    slide.addText('[Image]', {
      x: 2,
      y: 2.8,
      w: 6,
      h: 1,
      fontSize: 18,
      color: '9CA3AF',
      align: 'center',
      valign: 'middle',
    });
  }

  // Caption below image
  if (data.image?.caption || data.subtitle) {
    slide.addText(data.image?.caption || data.subtitle || '', {
      x: 0.5,
      y: 5.3,
      w: 9,
      h: 0.4,
      fontSize: 14,
      italic: true,
      color: formatColor(theme.secondary_color),
      align: 'center',
    });
  }
}

function buildQuoteSlide(slide: PptxGenJS.Slide, data: SlideData, theme: PresentationTheme): void {
  // Quote marks
  slide.addText('"', {
    x: 0.5,
    y: 1.5,
    w: 1,
    h: 1.5,
    fontSize: 120,
    color: formatColor(theme.secondary_color),
    fontFace: 'Georgia',
  });

  // Quote text
  if (data.quote) {
    slide.addText(data.quote, {
      x: 1.5,
      y: 2.2,
      w: 7,
      h: 2,
      fontSize: 28,
      italic: true,
      color: formatColor(theme.text_color),
      align: 'center',
      valign: 'middle',
    });
  }

  // Author
  if (data.quote_author) {
    slide.addText(`— ${data.quote_author}`, {
      x: 1.5,
      y: 4.3,
      w: 7,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: formatColor(theme.primary_color),
      align: 'right',
    });
  }
}

function addSlideImage(
  slide: PptxGenJS.Slide, 
  url: string, 
  position: 'left' | 'right' | 'center' | 'full' = 'right',
  width: number = 4,
  height: number = 3
): void {
  let x: number;
  let y: number;
  let w: number = width;
  let h: number = height;

  switch (position) {
    case 'left':
      x = 0.5;
      y = 1.5;
      break;
    case 'right':
      x = 5.5;
      y = 1.5;
      break;
    case 'center':
      x = (10 - w) / 2;
      y = (5.63 - h) / 2 + 0.5;
      break;
    case 'full':
      x = 0;
      y = 0;
      w = 10;
      h = 5.63;
      break;
    default:
      x = 5.5;
      y = 1.5;
  }

  try {
    slide.addImage({
      path: url,
      x,
      y,
      w,
      h,
    });
  } catch (error) {
    console.error('Failed to add image to slide:', error);
  }
}

// Main builder function - converts PresentationSchema to PPTX Blob
export async function buildPptxFromSchema(schema: PresentationSchema): Promise<Blob> {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = schema.metadata.author || 'mydocmaker.com';
  pptx.company = schema.metadata.company || '';
  pptx.title = schema.metadata.title;
  pptx.subject = schema.metadata.subject || '';

  // Get theme
  const theme = schema.theme || PRESENTATION_THEMES.modern;

  // Build each slide
  for (const slideData of schema.slides) {
    buildSlide(pptx, slideData, theme);
  }

  // Generate blob
  const blob = await pptx.write({ outputType: 'blob' });
  return blob as Blob;
}

// Convert legacy presentation data to schema (for backward compatibility)
export function legacyToPresentationSchema(legacyData: any): PresentationSchema {
  const slides: SlideData[] = (legacyData.slides || []).map((slide: any) => ({
    layout: slide.slide_layout || 'title_content',
    title: slide.title || '',
    subtitle: slide.subtitle,
    bullets: slide.bullets?.map((b: any) => ({
      content: typeof b === 'string' ? b : b.content,
      level: typeof b === 'object' ? b.level : 0,
    })),
  }));

  return {
    type: 'presentation',
    metadata: {
      title: legacyData.presentation_title || 'Presentation',
      author: legacyData.author,
    },
    theme: PRESENTATION_THEMES.modern,
    slides,
  };
}
