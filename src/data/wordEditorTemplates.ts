export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'business' | 'academic' | 'personal' | 'creative';
  content: string;
}

export const wordEditorTemplates: DocumentTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start with a clean slate',
    icon: '📄',
    category: 'personal',
    content: '<p></p>'
  },
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    description: 'Professional proposal template for clients',
    icon: '💼',
    category: 'business',
    content: `<h1>Business Proposal</h1><p><strong>Prepared for:</strong> [Client Name]</p><p><strong>Prepared by:</strong> [Your Company Name]</p><p><strong>Date:</strong> [Date]</p><hr /><h2>Executive Summary</h2><p>Brief overview of your proposal and its key benefits...</p><h2>Problem Statement</h2><p>Describe the challenge or opportunity your client is facing...</p><h2>Proposed Solution</h2><p>Detail your proposed approach and methodology...</p><h2>Timeline</h2><table><tr><th>Phase</th><th>Duration</th><th>Deliverables</th></tr><tr><td>Phase 1</td><td>2 weeks</td><td>Initial research and planning</td></tr><tr><td>Phase 2</td><td>4 weeks</td><td>Implementation</td></tr><tr><td>Phase 3</td><td>2 weeks</td><td>Testing and refinement</td></tr></table><h2>Investment</h2><p>Detail pricing and payment terms...</p><h2>Next Steps</h2><p>Call to action and contact information...</p>`
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Capture meeting discussions and action items',
    icon: '📝',
    category: 'business',
    content: `<h1>Meeting Notes</h1><p><strong>Date:</strong> [Date]</p><p><strong>Time:</strong> [Time]</p><p><strong>Attendees:</strong> [Names]</p><hr /><h2>Agenda</h2><ol><li>Topic 1</li><li>Topic 2</li><li>Topic 3</li></ol><h2>Discussion Points</h2><h3>Topic 1</h3><p>Summary of discussion...</p><h3>Topic 2</h3><p>Summary of discussion...</p><h2>Action Items</h2><table><tr><th>Action</th><th>Owner</th><th>Due Date</th></tr><tr><td>Action item 1</td><td>[Name]</td><td>[Date]</td></tr><tr><td>Action item 2</td><td>[Name]</td><td>[Date]</td></tr></table><h2>Next Meeting</h2><p>[Date and time for follow-up]</p>`
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    description: 'Academic research paper format',
    icon: '🎓',
    category: 'academic',
    content: `<h1 style="text-align: center">Research Paper Title</h1><p style="text-align: center"><em>Author Name</em></p><p style="text-align: center">[Institution]</p><hr /><h2>Abstract</h2><p>A brief summary of your research, methodology, findings, and conclusions (150-300 words)...</p><p><strong>Keywords:</strong> keyword1, keyword2, keyword3</p><h2>1. Introduction</h2><p>Background information and research context...</p><p>Research question or hypothesis...</p><h2>2. Literature Review</h2><p>Summary of existing research and theoretical framework...</p><h2>3. Methodology</h2><p>Research design, data collection methods, and analysis approach...</p><h2>4. Results</h2><p>Present your findings with supporting data...</p><h2>5. Discussion</h2><p>Interpretation of results and implications...</p><h2>6. Conclusion</h2><p>Summary of key findings and future research directions...</p><h2>References</h2><p>[List of citations in appropriate format]</p>`
  },
  {
    id: 'project-plan',
    name: 'Project Plan',
    description: 'Detailed project planning document',
    icon: '📊',
    category: 'business',
    content: `<h1>Project Plan</h1><p><strong>Project Name:</strong> [Name]</p><p><strong>Project Manager:</strong> [Name]</p><p><strong>Start Date:</strong> [Date]</p><p><strong>End Date:</strong> [Date]</p><hr /><h2>Project Overview</h2><p>Brief description of the project scope and objectives...</p><h2>Goals & Objectives</h2><ul><li>Objective 1</li><li>Objective 2</li><li>Objective 3</li></ul><h2>Scope</h2><h3>In Scope</h3><ul><li>Item 1</li><li>Item 2</li></ul><h3>Out of Scope</h3><ul><li>Item 1</li><li>Item 2</li></ul><h2>Timeline & Milestones</h2><table><tr><th>Milestone</th><th>Date</th><th>Status</th></tr><tr><td>Project Kickoff</td><td>[Date]</td><td>Planned</td></tr><tr><td>Phase 1 Complete</td><td>[Date]</td><td>Planned</td></tr><tr><td>Final Delivery</td><td>[Date]</td><td>Planned</td></tr></table><h2>Team & Responsibilities</h2><table><tr><th>Role</th><th>Name</th><th>Responsibilities</th></tr><tr><td>Project Manager</td><td>[Name]</td><td>Overall coordination</td></tr><tr><td>Developer</td><td>[Name]</td><td>Technical implementation</td></tr></table><h2>Risks & Mitigation</h2><table><tr><th>Risk</th><th>Probability</th><th>Impact</th><th>Mitigation</th></tr><tr><td>Risk 1</td><td>Medium</td><td>High</td><td>Mitigation strategy</td></tr></table>`
  },
  {
    id: 'resume',
    name: 'Resume / CV',
    description: 'Professional resume template',
    icon: '👤',
    category: 'personal',
    content: `<h1 style="text-align: center">[Your Full Name]</h1><p style="text-align: center">[Email] | [Phone] | [Location] | [LinkedIn URL]</p><hr /><h2>Professional Summary</h2><p>A brief 2-3 sentence summary of your experience, skills, and career goals...</p><h2>Work Experience</h2><h3>[Job Title] - [Company Name]</h3><p><em>[Start Date] - [End Date] | [Location]</em></p><ul><li>Key achievement or responsibility</li><li>Key achievement or responsibility</li><li>Key achievement or responsibility</li></ul><h3>[Job Title] - [Company Name]</h3><p><em>[Start Date] - [End Date] | [Location]</em></p><ul><li>Key achievement or responsibility</li><li>Key achievement or responsibility</li></ul><h2>Education</h2><h3>[Degree] - [Institution]</h3><p><em>[Graduation Year]</em></p><h2>Skills</h2><p><strong>Technical:</strong> Skill 1, Skill 2, Skill 3</p><p><strong>Soft Skills:</strong> Skill 1, Skill 2, Skill 3</p><h2>Certifications</h2><ul><li>Certification 1</li><li>Certification 2</li></ul>`
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    description: 'Professional cover letter for job applications',
    icon: '✉️',
    category: 'personal',
    content: `<p>[Your Name]</p><p>[Your Address]</p><p>[City, State ZIP]</p><p>[Your Email]</p><p>[Date]</p><br /><p>[Hiring Manager's Name]</p><p>[Company Name]</p><p>[Company Address]</p><p>[City, State ZIP]</p><br /><p>Dear [Hiring Manager's Name],</p><p>I am writing to express my interest in the [Job Title] position at [Company Name]. With my background in [relevant field/skill], I am confident I would be a valuable addition to your team.</p><p>In my current role at [Current Company], I have [describe relevant achievement]. This experience has equipped me with [relevant skills] that align perfectly with the requirements of this position.</p><p>I am particularly drawn to [Company Name] because [reason]. Your company's commitment to [value/mission] resonates with my professional goals and values.</p><p>I would welcome the opportunity to discuss how my skills and experience can contribute to your team. Thank you for considering my application.</p><p>Sincerely,</p><p>[Your Name]</p>`
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Engaging blog article format',
    icon: '✍️',
    category: 'creative',
    content: `<h1>[Catchy Blog Title]</h1><p><em>By [Author Name] | [Date] | [Reading Time] min read</em></p><hr /><p><strong>Hook:</strong> Start with an engaging opening that captures the reader's attention...</p><h2>Introduction</h2><p>Set the context and explain what the reader will learn from this post...</p><h2>Main Point 1</h2><p>Explain your first key point with supporting details and examples...</p><h2>Main Point 2</h2><p>Continue with your second major insight or argument...</p><h2>Main Point 3</h2><p>Present your third key takeaway...</p><h2>Conclusion</h2><p>Summarize the main points and include a call-to-action for readers...</p><hr /><p><strong>Did you find this helpful?</strong> Share your thoughts in the comments below!</p>`
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Email newsletter template',
    icon: '📧',
    category: 'creative',
    content: `<h1 style="text-align: center">[Newsletter Name]</h1><p style="text-align: center"><em>Issue #[Number] | [Date]</em></p><hr /><h2>Hello [Reader Name]!</h2><p>Welcome to this week's edition of [Newsletter Name]. Here's what we have for you...</p><h2>📰 This Week's Highlights</h2><h3>Story 1: [Headline]</h3><p>Brief summary of the story with a link to read more...</p><h3>Story 2: [Headline]</h3><p>Brief summary of the story with a link to read more...</p><h2>💡 Tip of the Week</h2><p>Share a valuable tip or insight with your readers...</p><h2>📅 Upcoming Events</h2><ul><li>[Event 1] - [Date]</li><li>[Event 2] - [Date]</li></ul><h2>🔗 Quick Links</h2><ul><li>Link 1</li><li>Link 2</li><li>Link 3</li></ul><hr /><p style="text-align: center">Thanks for reading! See you next week.</p><p style="text-align: center"><em>[Unsubscribe] | [Preferences] | [Share]</em></p>`
  },
  {
    id: 'report',
    name: 'Business Report',
    description: 'Formal business report structure',
    icon: '📈',
    category: 'business',
    content: `<h1 style="text-align: center">Business Report</h1><p style="text-align: center">[Report Title]</p><p style="text-align: center"><em>Prepared by: [Author]</em></p><p style="text-align: center"><em>Date: [Date]</em></p><hr /><h2>Table of Contents</h2><ol><li>Executive Summary</li><li>Introduction</li><li>Methodology</li><li>Findings</li><li>Analysis</li><li>Recommendations</li><li>Conclusion</li></ol><h2>1. Executive Summary</h2><p>Brief overview of the report's purpose, key findings, and main recommendations...</p><h2>2. Introduction</h2><p>Background information, objectives, and scope of the report...</p><h2>3. Methodology</h2><p>Describe the research methods and data sources used...</p><h2>4. Findings</h2><p>Present the key data and observations from your research...</p><h2>5. Analysis</h2><p>Interpret the findings and explain their significance...</p><h2>6. Recommendations</h2><ul><li>Recommendation 1</li><li>Recommendation 2</li><li>Recommendation 3</li></ul><h2>7. Conclusion</h2><p>Summary of key points and next steps...</p>`
  }
];

export const wordEditorTemplateCategories = [
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'academic', name: 'Academic', icon: '🎓' },
  { id: 'personal', name: 'Personal', icon: '👤' },
  { id: 'creative', name: 'Creative', icon: '✍️' },
];
