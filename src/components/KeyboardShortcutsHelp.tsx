import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { KeyboardShortcutsSettings } from "./KeyboardShortcutsSettings";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ["Ctrl", "S"], description: "Save document", category: "Document Actions" },
  { keys: ["Ctrl", "N"], description: "Create new document", category: "Document Actions" },
  { keys: ["Ctrl", "H"], description: "Go to Home", category: "Navigation" },
  { keys: ["Ctrl", "D"], description: "Go to Dashboard", category: "Navigation" },
  { keys: ["Ctrl", "1"], description: "Go to Document Creator", category: "Navigation" },
  { keys: ["Ctrl", "2"], description: "Go to Presentation Maker", category: "Navigation" },
  { keys: ["Ctrl", "3"], description: "Go to Spreadsheet", category: "Navigation" },
  { keys: ["Ctrl", "4"], description: "Go to Voiceover", category: "Navigation" },
  { keys: ["Ctrl", "5"], description: "Go to Chat", category: "Navigation" },
  { keys: ["Ctrl", "?"], description: "Show keyboard shortcuts", category: "Help" },
];

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "?") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription>
                Use these keyboard shortcuts to navigate faster and be more productive.
              </DialogDescription>
            </div>
            <KeyboardShortcutsSettings />
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd
                            key={i}
                            className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded shadow-sm"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
          <p>
            Press <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">Ctrl</kbd> +{" "}
            <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">?</kbd> to
            toggle this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
