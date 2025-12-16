import { Button } from "@/components/ui/button";
import { Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  loadingText: string;
  text: string;
  gradientClass?: string;
  className?: string;
}

export function GenerateButton({
  onClick,
  loading,
  disabled = false,
  icon: Icon,
  loadingText,
  text,
  gradientClass = "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
  className
}: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        "w-full h-12 text-base font-medium shadow-lg",
        gradientClass,
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Icon className="mr-2 h-5 w-5" />
          {text}
        </>
      )}
    </Button>
  );
}