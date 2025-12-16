import { X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

interface InsightCardProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  dismissible?: boolean;
}

export function InsightCard({
  title,
  description,
  actionText,
  actionLink,
  onAction,
  dismissible = true,
}: InsightCardProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-muted/30 border border-border/50 rounded-xl p-5"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" />
            Insight
          </div>
          {dismissible && (
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <h3 className="font-semibold text-base mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        {actionText && (
          actionLink ? (
            <Link to={actionLink}>
              <Button className="w-full bg-primary hover:bg-primary/90">
                {actionText}
              </Button>
            </Link>
          ) : onAction ? (
            <Button onClick={onAction} className="w-full bg-primary hover:bg-primary/90">
              {actionText}
            </Button>
          ) : null
        )}
      </motion.div>
    </AnimatePresence>
  );
}
