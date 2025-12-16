// JSON Schema for structured document generation
// This schema defines the structure that AI outputs and the builder consumes

export interface TextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string; // Hex color like "FF0000"
  fontSize?: number;
}

export interface DocumentElement {
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'bullet_list' | 'numbered_list' | 'table' | 'divider' | 'image';
}

export interface ParagraphElement extends DocumentElement {
  type: 'paragraph';
  text?: string;
  text_runs?: TextRun[];
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

export interface HeadingElement extends DocumentElement {
  type: 'heading1' | 'heading2' | 'heading3' | 'heading4';
  text: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ListElement extends DocumentElement {
  type: 'bullet_list' | 'numbered_list';
  items: string[];
}

export interface TableRow {
  cells: string[];
  isHeader?: boolean;
}

export interface TableElement extends DocumentElement {
  type: 'table';
  rows: TableRow[];
  style?: 'grid' | 'simple' | 'striped';
}

export interface DividerElement extends DocumentElement {
  type: 'divider';
}

export interface ImageElement extends DocumentElement {
  type: 'image';
  ai_prompt?: string;
  url?: string;
  width_inches?: number;
  caption?: string;
}

export type AnyDocumentElement = 
  | ParagraphElement 
  | HeadingElement 
  | ListElement 
  | TableElement 
  | DividerElement
  | ImageElement;

export interface DocumentSection {
  orientation?: 'portrait' | 'landscape';
  header?: {
    text?: string;
    align?: 'left' | 'center' | 'right';
    show_page_numbers?: boolean;
  };
  footer?: {
    text?: string;
    show_page_numbers?: boolean;
  };
  elements: AnyDocumentElement[];
}

export interface DocumentTheme {
  name: string;
  font_name: string;
  font_size: number;
  heading_font?: string;
  primary_color: string;
  secondary_color: string;
}

export interface DocumentMetadata {
  title: string;
  author?: string;
  subject?: string;
  created_at?: string;
}

export interface DocumentSchema {
  metadata: DocumentMetadata;
  theme: DocumentTheme;
  sections: DocumentSection[];
}

// Predefined themes
export const DOCUMENT_THEMES: Record<string, DocumentTheme> = {
  modern: {
    name: 'Modern',
    font_name: 'Calibri',
    font_size: 11,
    heading_font: 'Calibri Light',
    primary_color: '2563EB',
    secondary_color: '64748B',
  },
  classic: {
    name: 'Classic',
    font_name: 'Times New Roman',
    font_size: 12,
    heading_font: 'Times New Roman',
    primary_color: '1E3A5F',
    secondary_color: '4A5568',
  },
  professional: {
    name: 'Professional',
    font_name: 'Arial',
    font_size: 11,
    heading_font: 'Arial',
    primary_color: '1F2937',
    secondary_color: '6B7280',
  },
  creative: {
    name: 'Creative',
    font_name: 'Georgia',
    font_size: 11,
    heading_font: 'Georgia',
    primary_color: '7C3AED',
    secondary_color: 'A78BFA',
  },
  minimal: {
    name: 'Minimal',
    font_name: 'Helvetica',
    font_size: 10,
    heading_font: 'Helvetica',
    primary_color: '000000',
    secondary_color: '9CA3AF',
  },
};

// Predefined templates
export const DOCUMENT_TEMPLATES: Record<string, DocumentSchema> = {
  invoice: {
    metadata: {
      title: 'Invoice',
      subject: 'Invoice Document',
    },
    theme: DOCUMENT_THEMES.professional,
    sections: [{
      elements: [
        { type: 'heading1', text: 'INVOICE', alignment: 'right' },
        { type: 'paragraph', text: 'Invoice #: [NUMBER]', alignment: 'right' },
        { type: 'paragraph', text: 'Date: [DATE]', alignment: 'right' },
        { type: 'divider' },
        { type: 'heading2', text: 'Bill To:' },
        { type: 'paragraph', text: '[Client Name]\n[Client Address]\n[Client Email]' },
        { type: 'divider' },
        { 
          type: 'table',
          style: 'grid',
          rows: [
            { cells: ['Description', 'Quantity', 'Rate', 'Amount'], isHeader: true },
            { cells: ['Service/Product', '1', '$0.00', '$0.00'] },
          ]
        },
        { type: 'divider' },
        { type: 'paragraph', text: 'Total: $0.00', alignment: 'right', text_runs: [{ text: 'Total: $0.00', bold: true, fontSize: 14 }] },
        { type: 'paragraph', text: 'Payment Terms: Due within 30 days' },
      ]
    }]
  },
  resume: {
    metadata: {
      title: 'Professional Resume',
      subject: 'Resume/CV',
    },
    theme: DOCUMENT_THEMES.modern,
    sections: [{
      elements: [
        { type: 'heading1', text: '[Your Name]', alignment: 'center' },
        { type: 'paragraph', text: '[Email] | [Phone] | [Location]', alignment: 'center' },
        { type: 'divider' },
        { type: 'heading2', text: 'Professional Summary' },
        { type: 'paragraph', text: '[Brief professional summary highlighting your key qualifications and career objectives]' },
        { type: 'heading2', text: 'Experience' },
        { type: 'heading3', text: '[Job Title] - [Company Name]' },
        { type: 'paragraph', text: '[Start Date] - [End Date]' },
        { type: 'bullet_list', items: ['[Key achievement or responsibility]', '[Key achievement or responsibility]', '[Key achievement or responsibility]'] },
        { type: 'heading2', text: 'Education' },
        { type: 'heading3', text: '[Degree] - [Institution]' },
        { type: 'paragraph', text: '[Graduation Year]' },
        { type: 'heading2', text: 'Skills' },
        { type: 'bullet_list', items: ['[Skill 1]', '[Skill 2]', '[Skill 3]', '[Skill 4]'] },
      ]
    }]
  },
  report: {
    metadata: {
      title: 'Business Report',
      subject: 'Report',
    },
    theme: DOCUMENT_THEMES.professional,
    sections: [{
      header: { text: 'Confidential Report', align: 'right' },
      footer: { show_page_numbers: true, text: 'Generated by mydocmaker.com' },
      elements: [
        { type: 'heading1', text: '[Report Title]', alignment: 'center' },
        { type: 'paragraph', text: 'Prepared by: [Author]\nDate: [Date]', alignment: 'center' },
        { type: 'divider' },
        { type: 'heading2', text: 'Executive Summary' },
        { type: 'paragraph', text: '[Brief overview of the report\'s key findings and recommendations]' },
        { type: 'heading2', text: '1. Introduction' },
        { type: 'paragraph', text: '[Background information and purpose of the report]' },
        { type: 'heading2', text: '2. Methodology' },
        { type: 'paragraph', text: '[Description of research methods and data collection]' },
        { type: 'heading2', text: '3. Findings' },
        { type: 'paragraph', text: '[Detailed findings from the research]' },
        { 
          type: 'table',
          style: 'striped',
          rows: [
            { cells: ['Metric', 'Value', 'Change'], isHeader: true },
            { cells: ['[Metric 1]', '[Value]', '[+/-]%'] },
            { cells: ['[Metric 2]', '[Value]', '[+/-]%'] },
          ]
        },
        { type: 'heading2', text: '4. Recommendations' },
        { type: 'numbered_list', items: ['[Recommendation 1]', '[Recommendation 2]', '[Recommendation 3]'] },
        { type: 'heading2', text: '5. Conclusion' },
        { type: 'paragraph', text: '[Summary and next steps]' },
      ]
    }]
  },
  letter: {
    metadata: {
      title: 'Business Letter',
      subject: 'Letter',
    },
    theme: DOCUMENT_THEMES.classic,
    sections: [{
      elements: [
        { type: 'paragraph', text: '[Your Name]\n[Your Address]\n[City, State ZIP]\n[Your Email]\n[Date]', alignment: 'left' },
        { type: 'paragraph', text: '' },
        { type: 'paragraph', text: '[Recipient Name]\n[Recipient Title]\n[Company Name]\n[Company Address]\n[City, State ZIP]' },
        { type: 'paragraph', text: '' },
        { type: 'paragraph', text: 'Dear [Recipient Name],' },
        { type: 'paragraph', text: '[Opening paragraph - state the purpose of your letter]' },
        { type: 'paragraph', text: '[Body paragraph 1 - provide details, context, or supporting information]' },
        { type: 'paragraph', text: '[Body paragraph 2 - additional details or call to action]' },
        { type: 'paragraph', text: '[Closing paragraph - summarize and indicate next steps]' },
        { type: 'paragraph', text: '' },
        { type: 'paragraph', text: 'Sincerely,' },
        { type: 'paragraph', text: '' },
        { type: 'paragraph', text: '[Your Name]\n[Your Title]' },
      ]
    }]
  },
  proposal: {
    metadata: {
      title: 'Business Proposal',
      subject: 'Proposal',
    },
    theme: DOCUMENT_THEMES.modern,
    sections: [{
      header: { text: 'Business Proposal', align: 'center' },
      elements: [
        { type: 'heading1', text: '[Project/Proposal Title]', alignment: 'center' },
        { type: 'paragraph', text: 'Prepared for: [Client Name]\nPrepared by: [Your Company]\nDate: [Date]', alignment: 'center' },
        { type: 'divider' },
        { type: 'heading2', text: 'Executive Summary' },
        { type: 'paragraph', text: '[Brief overview of your proposal and value proposition]' },
        { type: 'heading2', text: 'Problem Statement' },
        { type: 'paragraph', text: '[Describe the problem or opportunity you are addressing]' },
        { type: 'heading2', text: 'Proposed Solution' },
        { type: 'paragraph', text: '[Detailed description of your proposed solution]' },
        { type: 'bullet_list', items: ['[Key feature/benefit 1]', '[Key feature/benefit 2]', '[Key feature/benefit 3]'] },
        { type: 'heading2', text: 'Timeline' },
        { 
          type: 'table',
          style: 'grid',
          rows: [
            { cells: ['Phase', 'Duration', 'Deliverables'], isHeader: true },
            { cells: ['Phase 1', '[X weeks]', '[Deliverable]'] },
            { cells: ['Phase 2', '[X weeks]', '[Deliverable]'] },
          ]
        },
        { type: 'heading2', text: 'Investment' },
        { type: 'paragraph', text: '[Pricing and payment terms]' },
        { type: 'heading2', text: 'Next Steps' },
        { type: 'numbered_list', items: ['[Step 1]', '[Step 2]', '[Step 3]'] },
      ]
    }]
  },
  contract: {
    metadata: {
      title: 'Service Agreement',
      subject: 'Contract',
    },
    theme: DOCUMENT_THEMES.classic,
    sections: [{
      header: { text: 'CONFIDENTIAL', align: 'center' },
      footer: { show_page_numbers: true },
      elements: [
        { type: 'heading1', text: 'SERVICE AGREEMENT', alignment: 'center' },
        { type: 'paragraph', text: 'This Service Agreement ("Agreement") is entered into as of [DATE] by and between:', alignment: 'center' },
        { type: 'divider' },
        { type: 'heading2', text: '1. PARTIES' },
        { type: 'paragraph', text: '[Company Name] ("Service Provider")\n[Address]\n[City, State ZIP]' },
        { type: 'paragraph', text: 'AND' },
        { type: 'paragraph', text: '[Client Name] ("Client")\n[Address]\n[City, State ZIP]' },
        { type: 'heading2', text: '2. SERVICES' },
        { type: 'paragraph', text: 'Service Provider agrees to provide the following services:' },
        { type: 'bullet_list', items: ['[Service 1]', '[Service 2]', '[Service 3]'] },
        { type: 'heading2', text: '3. TERM' },
        { type: 'paragraph', text: 'This Agreement shall commence on [START DATE] and continue until [END DATE], unless terminated earlier in accordance with this Agreement.' },
        { type: 'heading2', text: '4. COMPENSATION' },
        { type: 'table', style: 'grid', rows: [
          { cells: ['Service', 'Rate', 'Frequency'], isHeader: true },
          { cells: ['[Service]', '$[Amount]', '[Monthly/Hourly]'] },
        ]},
        { type: 'heading2', text: '5. CONFIDENTIALITY' },
        { type: 'paragraph', text: 'Both parties agree to maintain the confidentiality of any proprietary information disclosed during the term of this Agreement.' },
        { type: 'heading2', text: '6. TERMINATION' },
        { type: 'paragraph', text: 'Either party may terminate this Agreement with [X] days written notice.' },
        { type: 'divider' },
        { type: 'heading2', text: 'SIGNATURES' },
        { type: 'paragraph', text: '\n\n_________________________\n[Service Provider Name]\nDate: _______________' },
        { type: 'paragraph', text: '\n\n_________________________\n[Client Name]\nDate: _______________' },
      ]
    }]
  },
  meeting_notes: {
    metadata: {
      title: 'Meeting Notes',
      subject: 'Meeting Minutes',
    },
    theme: DOCUMENT_THEMES.minimal,
    sections: [{
      elements: [
        { type: 'heading1', text: 'Meeting Notes', alignment: 'left' },
        { type: 'divider' },
        { type: 'table', style: 'simple', rows: [
          { cells: ['Date:', '[DATE]'] },
          { cells: ['Time:', '[START TIME] - [END TIME]'] },
          { cells: ['Location:', '[Location/Virtual Link]'] },
          { cells: ['Facilitator:', '[Name]'] },
        ]},
        { type: 'heading2', text: 'Attendees' },
        { type: 'bullet_list', items: ['[Name] - [Role]', '[Name] - [Role]', '[Name] - [Role]'] },
        { type: 'heading2', text: 'Agenda' },
        { type: 'numbered_list', items: ['[Agenda Item 1]', '[Agenda Item 2]', '[Agenda Item 3]'] },
        { type: 'heading2', text: 'Discussion Summary' },
        { type: 'heading3', text: '[Topic 1]' },
        { type: 'paragraph', text: '[Key points discussed]' },
        { type: 'heading3', text: '[Topic 2]' },
        { type: 'paragraph', text: '[Key points discussed]' },
        { type: 'heading2', text: 'Action Items' },
        { type: 'table', style: 'grid', rows: [
          { cells: ['Action', 'Owner', 'Due Date'], isHeader: true },
          { cells: ['[Action item 1]', '[Name]', '[Date]'] },
          { cells: ['[Action item 2]', '[Name]', '[Date]'] },
        ]},
        { type: 'heading2', text: 'Next Meeting' },
        { type: 'paragraph', text: 'Date: [DATE]\nTime: [TIME]\nAgenda: [Brief description]' },
      ]
    }]
  },
  project_plan: {
    metadata: {
      title: 'Project Plan',
      subject: 'Project Management',
    },
    theme: DOCUMENT_THEMES.modern,
    sections: [{
      header: { text: 'Project Plan', align: 'left' },
      footer: { show_page_numbers: true, text: 'Confidential' },
      elements: [
        { type: 'heading1', text: '[Project Name]', alignment: 'center' },
        { type: 'paragraph', text: 'Version: 1.0 | Last Updated: [DATE]', alignment: 'center' },
        { type: 'divider' },
        { type: 'heading2', text: '1. Project Overview' },
        { type: 'heading3', text: 'Project Description' },
        { type: 'paragraph', text: '[Brief description of the project and its purpose]' },
        { type: 'heading3', text: 'Project Objectives' },
        { type: 'bullet_list', items: ['[Objective 1]', '[Objective 2]', '[Objective 3]'] },
        { type: 'heading3', text: 'Success Criteria' },
        { type: 'bullet_list', items: ['[Criterion 1]', '[Criterion 2]'] },
        { type: 'heading2', text: '2. Scope' },
        { type: 'heading3', text: 'In Scope' },
        { type: 'bullet_list', items: ['[Deliverable 1]', '[Deliverable 2]', '[Deliverable 3]'] },
        { type: 'heading3', text: 'Out of Scope' },
        { type: 'bullet_list', items: ['[Exclusion 1]', '[Exclusion 2]'] },
        { type: 'heading2', text: '3. Timeline & Milestones' },
        { type: 'table', style: 'grid', rows: [
          { cells: ['Phase', 'Start Date', 'End Date', 'Milestone'], isHeader: true },
          { cells: ['Discovery', '[Date]', '[Date]', 'Requirements Complete'] },
          { cells: ['Development', '[Date]', '[Date]', 'MVP Ready'] },
          { cells: ['Testing', '[Date]', '[Date]', 'QA Approved'] },
          { cells: ['Launch', '[Date]', '[Date]', 'Go Live'] },
        ]},
        { type: 'heading2', text: '4. Team & Responsibilities' },
        { type: 'table', style: 'striped', rows: [
          { cells: ['Role', 'Name', 'Responsibilities'], isHeader: true },
          { cells: ['Project Manager', '[Name]', 'Overall coordination'] },
          { cells: ['Lead Developer', '[Name]', 'Technical implementation'] },
          { cells: ['Designer', '[Name]', 'UI/UX design'] },
        ]},
        { type: 'heading2', text: '5. Budget' },
        { type: 'table', style: 'grid', rows: [
          { cells: ['Category', 'Estimated Cost'], isHeader: true },
          { cells: ['Personnel', '$[Amount]'] },
          { cells: ['Software/Tools', '$[Amount]'] },
          { cells: ['Contingency (10%)', '$[Amount]'] },
          { cells: ['Total', '$[Amount]'] },
        ]},
        { type: 'heading2', text: '6. Risks & Mitigation' },
        { type: 'table', style: 'grid', rows: [
          { cells: ['Risk', 'Impact', 'Mitigation'], isHeader: true },
          { cells: ['[Risk 1]', 'High/Medium/Low', '[Strategy]'] },
          { cells: ['[Risk 2]', 'High/Medium/Low', '[Strategy]'] },
        ]},
        { type: 'heading2', text: '7. Approval' },
        { type: 'paragraph', text: '\nApproved by: _________________________\nDate: _______________' },
      ]
    }]
  },
};

// Helper to validate document schema
export function validateDocumentSchema(doc: any): doc is DocumentSchema {
  if (!doc || typeof doc !== 'object') return false;
  if (!doc.metadata || typeof doc.metadata.title !== 'string') return false;
  if (!doc.sections || !Array.isArray(doc.sections)) return false;
  return true;
}

// Helper to merge user edits into existing schema
export function mergeDocumentChanges(
  original: DocumentSchema,
  changes: Partial<DocumentSchema>
): DocumentSchema {
  return {
    metadata: { ...original.metadata, ...changes.metadata },
    theme: { ...original.theme, ...changes.theme },
    sections: changes.sections || original.sections,
  };
}
