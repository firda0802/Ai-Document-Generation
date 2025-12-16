import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings, Sliders } from "lucide-react";

export interface ChatSettings {
  responseLength: "short" | "medium" | "long";
  tone: "professional" | "casual" | "friendly" | "formal";
  language: string;
}

interface ChatSettingsPanelProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "ru", label: "Russian" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
];

const RESPONSE_LENGTHS = [
  { value: "short", label: "Short", desc: "Brief responses" },
  { value: "medium", label: "Medium", desc: "Balanced detail" },
  { value: "long", label: "Long", desc: "Comprehensive" },
];

export function ChatSettingsPanel({ settings, onSettingsChange }: ChatSettingsPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Sliders className="h-3 w-3" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Settings className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">AI Chat Settings</span>
          </div>

          {/* Response Length */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Response Length</Label>
            <Select
              value={settings.responseLength}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, responseLength: value as ChatSettings["responseLength"] })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESPONSE_LENGTHS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tone</Label>
            <Select
              value={settings.tone}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, tone: value as ChatSettings["tone"] })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, language: value })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  responseLength: "medium",
  tone: "professional",
  language: "en",
};
