import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Target, List } from "lucide-react";
import { SEOArticle as SEOArticleType } from "@/data/toolSEOArticles";

interface SEOArticleProps {
  article: SEOArticleType;
}

// Helper to create slug from heading
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export function SEOArticle({ article }: SEOArticleProps) {
  // Generate TOC items from sections
  const tocItems = [
    { title: "Introduction", slug: "introduction" },
    ...article.sections.map((section) => ({
      title: section.heading,
      slug: createSlug(section.heading),
    })),
    { title: "Conclusion", slug: "conclusion" },
  ];

  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 space-y-10"
    >
      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-primary">
          <BookOpen className="h-4 w-4" />
          <span>{article.wordCount.toLocaleString()}+ words • Comprehensive Guide</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {article.title}
        </h2>
        <p className="text-lg text-muted-foreground">{article.subtitle}</p>
      </header>

      {/* Table of Contents */}
      <nav className="bg-muted/30 rounded-xl p-6 space-y-4 border border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          Table of Contents
        </h3>
        <ol className="space-y-2 list-decimal list-inside">
          {tocItems.map((item, index) => (
            <li key={index} className="text-muted-foreground hover:text-primary transition-colors">
              <a
                href={`#${item.slug}`}
                className="hover:underline underline-offset-2"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Introduction */}
      <section id="introduction" className="scroll-mt-20">
        <div className="prose prose-lg max-w-none">
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
            {article.introduction}
          </p>
        </div>
      </section>

      {/* Main Sections */}
      {article.sections.map((section, index) => (
        <section 
          key={index} 
          id={createSlug(section.heading)}
          className="space-y-4 scroll-mt-20"
        >
          <h3 className="text-2xl font-semibold text-foreground">
            {section.heading}
          </h3>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
            {section.content}
          </p>
          {section.bulletPoints && (
            <ul className="space-y-2 mt-4">
              {section.bulletPoints.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span className="text-foreground/80">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Conclusion */}
      <section id="conclusion" className="space-y-4 scroll-mt-20">
        <h3 className="text-2xl font-semibold text-foreground">Conclusion</h3>
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
          {article.conclusion}
        </p>
      </section>

      {/* Internal Links */}
      <section className="bg-muted/30 rounded-xl p-6 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Related Tools You Might Like
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {article.internalLinks.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              className="group flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.text}
                </span>
                <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Target Keywords */}
      <section className="pt-6 border-t border-border/50">
        <p className="text-sm text-muted-foreground mb-3">Related searches:</p>
        <div className="flex flex-wrap gap-2">
          {article.targetKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>
    </motion.article>
  );
}
