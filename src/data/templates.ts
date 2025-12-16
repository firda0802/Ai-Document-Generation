export interface Template {
  id: string;
  title: string;
  description: string;
  category: "document" | "presentation" | "report" | "creative";
  icon: string;
  prompt: string;
  previewImage?: string;
}

export const templates: Template[] = [
  {
    id: "business-proposal",
    title: "Business Proposal",
    description: "Professional business proposal template with executive summary, objectives, and financials",
    category: "document",
    icon: "📄",
    prompt: "Create a comprehensive business proposal including: Executive Summary, Company Overview, Problem Statement, Proposed Solution, Implementation Timeline, Budget and Pricing, Terms and Conditions, and Conclusion. Format professionally with clear sections."
  },
  {
    id: "marketing-plan",
    title: "Marketing Strategy Plan",
    description: "Complete marketing strategy with market analysis, target audience, and tactics",
    category: "document",
    icon: "📊",
    prompt: "Develop a detailed marketing strategy plan covering: Market Analysis, Target Audience Definition, Competitive Analysis, Marketing Objectives, Strategy and Tactics, Budget Allocation, Success Metrics, and Timeline. Include actionable steps and KPIs."
  },
  {
    id: "technical-documentation",
    title: "Technical Documentation",
    description: "Structured technical documentation for software or product features",
    category: "document",
    icon: "⚙️",
    prompt: "Create technical documentation including: Overview, System Requirements, Architecture, Features and Functionality, API Documentation, Configuration Guide, Troubleshooting, and FAQs. Use clear technical language with code examples where appropriate."
  },
  {
    id: "pitch-deck",
    title: "Investor Pitch Deck",
    description: "Compelling pitch deck presentation for investors and stakeholders",
    category: "presentation",
    icon: "🎯",
    prompt: "Create a 10-slide pitch deck with: Problem, Solution, Market Opportunity, Business Model, Competitive Advantage, Traction, Team, Financial Projections, Funding Ask, and Vision. Make it compelling and data-driven."
  },
  {
    id: "project-report",
    title: "Project Status Report",
    description: "Comprehensive project status report with milestones and metrics",
    category: "report",
    icon: "📈",
    prompt: "Generate a project status report including: Executive Summary, Project Overview, Current Status, Milestones Achieved, Challenges and Risks, Resource Utilization, Budget Status, Next Steps, and Recommendations."
  },
  {
    id: "research-paper",
    title: "Research Paper",
    description: "Academic research paper with proper structure and citations",
    category: "document",
    icon: "🔬",
    prompt: "Write an academic research paper with: Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion, and References. Follow academic writing standards with proper structure and scholarly tone."
  },
  {
    id: "content-calendar",
    title: "Content Calendar",
    description: "Monthly content calendar for social media and blog planning",
    category: "document",
    icon: "📅",
    prompt: "Create a monthly content calendar with daily content ideas for blog posts, social media posts, email campaigns, and video content. Include post titles, descriptions, platforms, and optimal posting times."
  },
  {
    id: "case-study",
    title: "Case Study",
    description: "Detailed case study showcasing client success and results",
    category: "document",
    icon: "📖",
    prompt: "Develop a comprehensive case study including: Client Background, Challenge/Problem, Solution Implemented, Implementation Process, Results and Outcomes, Testimonials, Key Takeaways, and Conclusion. Include specific metrics and data."
  },
  {
    id: "white-paper",
    title: "White Paper",
    description: "Authoritative white paper on industry trends and insights",
    category: "document",
    icon: "📋",
    prompt: "Create an authoritative white paper covering: Executive Summary, Industry Overview, Problem Analysis, Research Findings, Best Practices, Solutions and Recommendations, Implementation Guide, and Conclusion. Use data and expert insights."
  },
  {
    id: "creative-brief",
    title: "Creative Brief",
    description: "Creative brief for marketing campaigns and projects",
    category: "creative",
    icon: "🎨",
    prompt: "Write a creative brief including: Project Overview, Objectives, Target Audience, Key Message, Tone and Style, Deliverables, Timeline, Budget, and Success Criteria. Make it inspiring yet practical."
  },
  {
    id: "sop-document",
    title: "Standard Operating Procedure",
    description: "Detailed SOP document for business processes",
    category: "document",
    icon: "📑",
    prompt: "Create a Standard Operating Procedure document with: Purpose, Scope, Responsibilities, Procedure Steps, Safety Guidelines, Quality Standards, Documentation Requirements, and Review Process. Be specific and actionable."
  },
  {
    id: "press-release",
    title: "Press Release",
    description: "Professional press release for news and announcements",
    category: "document",
    icon: "📰",
    prompt: "Write a professional press release with: Headline, Subheadline, Dateline, Lead Paragraph, Body (who, what, when, where, why, how), Quotes, Boilerplate, and Contact Information. Follow AP style guidelines."
  }
];

export const getTemplatesByCategory = (category: string) => {
  return templates.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find(t => t.id === id);
};
