import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CharacterLimitInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  rows?: number;
  helpText?: string;
  className?: string;
}

export function CharacterLimitInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  maxLength,
  rows = 8,
  helpText,
  className
}: CharacterLimitInputProps) {
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        <span
          className={cn(
            "text-xs transition-colors",
            isAtLimit
              ? "text-destructive font-medium"
              : isNearLimit
              ? "text-warning font-medium"
              : "text-muted-foreground"
          )}
        >
          {charCount.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        rows={rows}
        className={cn(
          "resize-none bg-background/50 focus:bg-background transition-colors",
          isAtLimit && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}