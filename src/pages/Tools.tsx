import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { 
  FileText, 
  Presentation, 
  Table, 
  Volume2, 
  MessageSquare, 
  FileSearch,
  PenTool,
  BookOpen,
  FileEdit
} from "lucide-react";

const tools = [
  {
    icon: FileText,
    title: "AI Document Generator",
    description: "Generate professional documents with AI. Create reports, proposals, and more in seconds.",
    link: "/tools/document-creator",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
  {
    icon: Presentation,
    title: "AI Presentation Maker",
    description: "Create stunning presentations automatically. AI generates slides with content and design.",
    link: "/tools/presentation-maker",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
  },
  {
    icon: Table,
    title: "AI Spreadsheet Generator",
    description: "Generate data-driven spreadsheets with formulas and charts. Export to Excel or CSV.",
    link: "/tools/spreadsheet-maker",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
  },
  {
    icon: FileText,
    title: "AI PDF Generator",
    description: "Create clean, professional PDFs without manual formatting. Multiple export options.",
    link: "/tools/pdf-generator",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500",
  },
  {
    icon: Volume2,
    title: "AI Voice Generator",
    description: "Convert text to natural-sounding speech. 20+ premium voices in multiple languages.",
    link: "/tools/voice-generator",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Chat with AI for instant answers. Get help with writing, research, and more.",
    link: "/tools/chat",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-500",
  },
  {
    icon: FileSearch,
    title: "Chat with PDF",
    description: "Upload PDFs and ask questions. AI extracts and analyzes document content.",
    link: "/tools/chat-pdf",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-500",
  },
  {
    icon: PenTool,
    title: "AI Writer",
    description: "Generate high-quality content for any purpose. Blogs, emails, social posts, and more.",
    link: "/tools/writer",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-500",
  },
  {
    icon: BookOpen,
    title: "AI Story Generator",
    description: "Create engaging stories with AI. Perfect for creative writing and storytelling.",
    link: "/tools/story-generator",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-500",
  },
  {
    icon: FileEdit,
    title: "Word Editor",
    description: "Microsoft Word-like editor with AI assistance. Format, edit, and export documents.",
    link: "/tools/word-editor",
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-500",
  },
];

export default function Tools() {
  return (
    <DashboardLayout>
      <SEO
        title="AI Tools - All Document Generation Tools | mydocmaker"
        description="Explore all AI-powered tools for document creation, presentations, spreadsheets, voice generation, and more."
        keywords="ai tools, document generator, presentation maker, spreadsheet generator, voice generator"
        canonical="/tools"
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 md:py-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">AI-Powered Tools</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to create documents, presentations, spreadsheets, and more with AI
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={tool.link}>
                <div className="group h-full rounded-2xl border border-border/50 bg-card p-6 hover:border-border hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`h-6 w-6 ${tool.textColor}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
