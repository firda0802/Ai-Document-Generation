import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { SEO } from "@/components/SEO";

interface ToolPageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  keywords: string;
  canonical: string;
  icon: LucideIcon;
  iconColorClass: string;
  badges: { label: string; colorClass: string }[];
  children: ReactNode;
}

export function ToolPageLayout({
  title,
  subtitle,
  description,
  keywords,
  canonical,
  icon: Icon,
  iconColorClass,
  badges,
  children
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        canonical={canonical}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="container mx-auto px-4 py-10 md:py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${badge.colorClass}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>

            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${iconColorClass}`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  {title}
                </h1>
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {children}
      </div>
    </div>
  );
}