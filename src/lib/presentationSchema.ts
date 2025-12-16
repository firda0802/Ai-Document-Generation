// Presentation JSON Schema - Structured format for PowerPoint generation
// Supports multiple layouts, themes, and content types

export type SlideLayout = 
  | 'title_slide'
  | 'title_content'
  | 'two_column'
  | 'comparison'
  | 'image_focus'
  | 'quote'
  | 'section_header'
  | 'blank';

export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  color?: string; // Hex color
  align?: 'left' | 'center' | 'right';
}

export interface BulletPoint {
  content: string;
  level?: number; // 0 = top level, 1 = sub-bullet, etc.
  style?: TextStyle;
}

export interface SlideImage {
  url?: string;
  ai_prompt?: string; // For AI image generation
  position?: 'left' | 'right' | 'center' | 'full';
  width_inches?: number;
  caption?: string;
}

export interface SlideData {
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  content?: string; // Plain text content
  bullets?: BulletPoint[];
  left_column?: BulletPoint[]; // For two_column layout
  right_column?: BulletPoint[]; // For two_column layout
  image?: SlideImage;
  quote?: string;
  quote_author?: string;
  notes?: string; // Speaker notes
  background_color?: string;
}

export interface PresentationTheme {
  name: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  background_color: string;
  title_font?: string;
  body_font?: string;
}

export interface PresentationMetadata {
  title: string;
  author?: string;
  company?: string;
  subject?: string;
  created_at?: string;
}

export interface PresentationSchema {
  type: 'presentation';
  metadata: PresentationMetadata;
  theme: PresentationTheme;
  slides: SlideData[];
}

// Predefined presentation themes
export const PRESENTATION_THEMES: Record<string, PresentationTheme> = {
  modern: {
    name: 'Modern',
    primary_color: '2563EB',
    secondary_color: '60A5FA',
    text_color: '1F2937',
    background_color: 'FFFFFF',
  },
  dark: {
    name: 'Dark',
    primary_color: '8B5CF6',
    secondary_color: 'A78BFA',
    text_color: 'F9FAFB',
    background_color: '1F2937',
  },
  corporate: {
    name: 'Corporate',
    primary_color: '1E3A5F',
    secondary_color: '3B82F6',
    text_color: '374151',
    background_color: 'FFFFFF',
  },
  creative: {
    name: 'Creative',
    primary_color: 'EC4899',
    secondary_color: 'F472B6',
    text_color: '1F2937',
    background_color: 'FDF2F8',
  },
  minimal: {
    name: 'Minimal',
    primary_color: '000000',
    secondary_color: '6B7280',
    text_color: '1F2937',
    background_color: 'FFFFFF',
  },
  nature: {
    name: 'Nature',
    primary_color: '059669',
    secondary_color: '34D399',
    text_color: '1F2937',
    background_color: 'ECFDF5',
  },
};

// Predefined presentation templates
export const PRESENTATION_TEMPLATES: Record<string, PresentationSchema> = {
  pitch_deck: {
    type: 'presentation',
    metadata: {
      title: 'Startup Pitch Deck',
      subject: 'Business Pitch',
    },
    theme: PRESENTATION_THEMES.modern,
    slides: [
      {
        layout: 'title_slide',
        title: '[Company Name]',
        subtitle: '[Tagline or Value Proposition]',
      },
      {
        layout: 'title_content',
        title: 'The Problem',
        bullets: [
          { content: '[Pain point 1 that your target audience faces]' },
          { content: '[Pain point 2 - be specific and relatable]' },
          { content: '[The cost of not solving this problem]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Our Solution',
        bullets: [
          { content: '[How your product/service solves the problem]' },
          { content: '[Key differentiator 1]' },
          { content: '[Key differentiator 2]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Market Opportunity',
        bullets: [
          { content: 'Total Addressable Market: $[X]B' },
          { content: 'Serviceable Market: $[Y]M' },
          { content: 'Target Market: $[Z]M' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Business Model',
        bullets: [
          { content: 'Revenue Model: [Subscription/Transaction/etc.]' },
          { content: 'Pricing: $[X]/month or $[Y]/transaction' },
          { content: 'Unit Economics: [LTV, CAC, margins]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Traction',
        bullets: [
          { content: '[X] users/customers' },
          { content: '$[X] in revenue (MRR/ARR)' },
          { content: '[X]% month-over-month growth' },
        ],
      },
      {
        layout: 'title_content',
        title: 'The Team',
        bullets: [
          { content: 'CEO: [Name] - [Background]' },
          { content: 'CTO: [Name] - [Background]' },
          { content: 'Advisors: [Notable advisors]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'The Ask',
        bullets: [
          { content: 'Raising: $[X]M' },
          { content: 'Use of Funds: [Product, Team, Marketing]' },
          { content: '18-month runway to [milestone]' },
        ],
      },
    ],
  },
  quarterly_review: {
    type: 'presentation',
    metadata: {
      title: 'Quarterly Business Review',
      subject: 'Q[X] Performance',
    },
    theme: PRESENTATION_THEMES.corporate,
    slides: [
      {
        layout: 'title_slide',
        title: 'Q[X] Business Review',
        subtitle: '[Company Name] | [Date]',
      },
      {
        layout: 'section_header',
        title: 'Executive Summary',
        subtitle: 'Key highlights from the quarter',
      },
      {
        layout: 'title_content',
        title: 'Financial Performance',
        bullets: [
          { content: 'Revenue: $[X]M ([+/-X]% vs target)' },
          { content: 'Gross Margin: [X]%' },
          { content: 'Operating Expenses: $[X]M' },
          { content: 'Net Income: $[X]M' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Key Metrics',
        bullets: [
          { content: 'Customer Acquisition: [X] new customers' },
          { content: 'Retention Rate: [X]%' },
          { content: 'NPS Score: [X]' },
          { content: 'Employee Headcount: [X]' },
        ],
      },
      {
        layout: 'two_column',
        title: 'Wins & Challenges',
        left_column: [
          { content: 'Win: [Achievement 1]' },
          { content: 'Win: [Achievement 2]' },
          { content: 'Win: [Achievement 3]' },
        ],
        right_column: [
          { content: 'Challenge: [Issue 1]' },
          { content: 'Challenge: [Issue 2]' },
          { content: 'Challenge: [Issue 3]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Next Quarter Goals',
        bullets: [
          { content: 'Goal 1: [Specific, measurable goal]' },
          { content: 'Goal 2: [Specific, measurable goal]' },
          { content: 'Goal 3: [Specific, measurable goal]' },
        ],
      },
    ],
  },
  training: {
    type: 'presentation',
    metadata: {
      title: 'Training Presentation',
      subject: 'Employee Training',
    },
    theme: PRESENTATION_THEMES.minimal,
    slides: [
      {
        layout: 'title_slide',
        title: '[Training Topic]',
        subtitle: '[Department/Team] Training',
      },
      {
        layout: 'title_content',
        title: 'Learning Objectives',
        bullets: [
          { content: 'By the end, you will understand [concept 1]' },
          { content: 'You will be able to [skill 1]' },
          { content: 'You will know how to [task 1]' },
        ],
      },
      {
        layout: 'section_header',
        title: 'Module 1',
        subtitle: '[Module Topic]',
      },
      {
        layout: 'title_content',
        title: '[Lesson Title]',
        bullets: [
          { content: '[Key point 1]' },
          { content: '[Key point 2]' },
          { content: '[Key point 3]' },
        ],
      },
      {
        layout: 'quote',
        title: 'Key Takeaway',
        quote: '[Important quote or concept to remember]',
        quote_author: '[Source]',
      },
      {
        layout: 'title_content',
        title: 'Practice Exercise',
        bullets: [
          { content: 'Step 1: [Action]' },
          { content: 'Step 2: [Action]' },
          { content: 'Step 3: [Action]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Q&A',
        content: 'Questions?',
      },
    ],
  },
  project_kickoff: {
    type: 'presentation',
    metadata: {
      title: 'Project Kickoff',
      subject: 'Project Management',
    },
    theme: PRESENTATION_THEMES.modern,
    slides: [
      {
        layout: 'title_slide',
        title: '[Project Name]',
        subtitle: 'Project Kickoff Meeting | [Date]',
      },
      {
        layout: 'title_content',
        title: 'Agenda',
        bullets: [
          { content: 'Project Overview & Objectives' },
          { content: 'Team & Roles' },
          { content: 'Timeline & Milestones' },
          { content: 'Success Criteria' },
          { content: 'Next Steps' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Project Overview',
        bullets: [
          { content: 'Background: [Why this project exists]' },
          { content: 'Goal: [What we want to achieve]' },
          { content: 'Scope: [What is included/excluded]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Team & Responsibilities',
        bullets: [
          { content: 'Project Sponsor: [Name]' },
          { content: 'Project Manager: [Name]' },
          { content: 'Team Lead: [Name]' },
          { content: 'Team Members: [Names]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Timeline',
        bullets: [
          { content: 'Phase 1: [Name] - [Dates]' },
          { content: 'Phase 2: [Name] - [Dates]' },
          { content: 'Phase 3: [Name] - [Dates]' },
          { content: 'Go Live: [Date]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Success Criteria',
        bullets: [
          { content: '[Measurable outcome 1]' },
          { content: '[Measurable outcome 2]' },
          { content: '[Measurable outcome 3]' },
        ],
      },
      {
        layout: 'title_content',
        title: 'Next Steps',
        bullets: [
          { content: 'Action 1: [Task] - Owner: [Name] - Due: [Date]' },
          { content: 'Action 2: [Task] - Owner: [Name] - Due: [Date]' },
          { content: 'Next meeting: [Date/Time]' },
        ],
      },
    ],
  },
};

// Helper to validate presentation schema
export function validatePresentationSchema(doc: any): doc is PresentationSchema {
  if (!doc || typeof doc !== 'object') return false;
  if (doc.type !== 'presentation') return false;
  if (!doc.slides || !Array.isArray(doc.slides)) return false;
  return doc.slides.every((slide: any) => 
    slide.layout && slide.title !== undefined
  );
}
