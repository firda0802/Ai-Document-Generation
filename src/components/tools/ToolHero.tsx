import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToolHeroProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle: string;
  className?: string;
}

export function ToolHero({ icon: Icon, iconColor = "text-primary", title, subtitle, className }: ToolHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("text-center py-8", className)}
    >
      <div className={cn(
        "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4",
        "bg-muted/50"
      )}>
        <Icon className={cn("h-7 w-7", iconColor)} />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>
    </motion.div>
  );
}
