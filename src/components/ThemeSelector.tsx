import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: "default",
    name: "Professional Blue",
    colors: {
      primary: "217 91% 60%",
      secondary: "220 14% 96%",
      accent: "217 91% 60%",
    },
  },
  {
    id: "elegant",
    name: "Elegant Purple",
    colors: {
      primary: "262 83% 58%",
      secondary: "270 14% 96%",
      accent: "262 83% 58%",
    },
  },
  {
    id: "modern",
    name: "Modern Green",
    colors: {
      primary: "142 76% 36%",
      secondary: "140 14% 96%",
      accent: "142 76% 36%",
    },
  },
  {
    id: "warm",
    name: "Warm Orange",
    colors: {
      primary: "25 95% 53%",
      secondary: "30 14% 96%",
      accent: "25 95% 53%",
    },
  },
  {
    id: "cool",
    name: "Cool Teal",
    colors: {
      primary: "173 80% 40%",
      secondary: "180 14% 96%",
      accent: "173 80% 40%",
    },
  },
];

interface ThemeSelectorProps {
  onThemeChange?: (theme: Theme) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    if (onThemeChange) {
      onThemeChange(theme);
    }

    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--accent', theme.colors.accent);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          {selectedTheme.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
              />
              <span>{theme.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}