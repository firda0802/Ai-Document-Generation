import { ReactNode } from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { DocumentLoadingSkeleton } from "@/components/LoadingSkeleton";

interface OutputDisplayProps {
  loading: boolean;
  hasContent: boolean;
  loadingText?: string;
  loadingIcon?: LucideIcon;
  loadingIconColorClass?: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
}

export function OutputDisplay({
  loading,
  hasContent,
  loadingText = "AI is generating your content...",
  loadingIcon: LoadingIcon = Loader2,
  loadingIconColorClass = "bg-primary/20 text-primary",
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  children
}: OutputDisplayProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${loadingIconColorClass}`}>
            <LoadingIcon className="h-4 w-4 animate-spin" />
          </div>
          <span className="text-sm text-muted-foreground">{loadingText}</span>
        </div>
        <DocumentLoadingSkeleton />
      </div>
    );
  }

  if (hasContent) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <EmptyIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <p className="text-muted-foreground font-medium">{emptyTitle}</p>
      <p className="text-sm text-muted-foreground/70 mt-1">{emptyDescription}</p>
    </div>
  );
}