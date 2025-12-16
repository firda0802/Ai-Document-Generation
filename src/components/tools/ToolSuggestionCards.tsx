import { LucideIcon, FileText, Presentation, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ToolCard {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
}

const defaultCards: ToolCard[] = [
  {
    icon: FileText,
    title: "AI Document Generator",
    description: "Turn an idea into a polished DOCX or PDF in seconds. Describe what you want and the AI document generator drafts the structure, headings, and content — ready to download or continue editing in chat.",
    link: "/tools/document-creator",
  },
  {
    icon: FileText,
    title: "AI PDF Maker",
    description: "Create clean, share-ready PDFs without manual formatting. Attach source files or paste instructions, and our AI PDF maker compiles neatly formatted pages with consistent typography and spacing.",
    link: "/tools/pdf-generator",
  },
  {
    icon: Presentation,
    title: "AI Word Generator",
    description: "Write faster with high-quality paragraphs, summaries, and outlines. The AI word generator adapts tone and length, adds sections, and supports citations or data snippets you attach.",
    link: "/tools/word-editor",
  },
];

interface ToolSuggestionCardsProps {
  cards?: ToolCard[];
  excludeLinks?: string[];
}

export function ToolSuggestionCards({ cards = defaultCards, excludeLinks = [] }: ToolSuggestionCardsProps) {
  const filteredCards = cards.filter(card => !excludeLinks.includes(card.link));

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      {filteredCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <Link to={card.link}>
            <div className="group p-5 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all h-full">
              <div className="flex items-center gap-2 mb-3">
                <card.icon className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">{card.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                {card.description}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
