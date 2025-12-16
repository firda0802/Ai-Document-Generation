import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShortcutSetting {
  id: string;
  label: string;
  defaultKey: string;
  ctrlKey: boolean;
  category: string;
}

const DEFAULT_SHORTCUTS: ShortcutSetting[] = [
  { id: "save", label: "Save Document", defaultKey: "s", ctrlKey: true, category: "Document Actions" },
  { id: "new", label: "New Document", defaultKey: "n", ctrlKey: true, category: "Document Actions" },
  { id: "home", label: "Go to Home", defaultKey: "h", ctrlKey: true, category: "Navigation" },
  { id: "dashboard", label: "Go to Dashboard", defaultKey: "d", ctrlKey: true, category: "Navigation" },
  { id: "tool1", label: "Document Creator", defaultKey: "1", ctrlKey: true, category: "Tools" },
  { id: "tool2", label: "Presentation Maker", defaultKey: "2", ctrlKey: true, category: "Tools" },
  { id: "tool3", label: "Spreadsheet", defaultKey: "3", ctrlKey: true, category: "Tools" },
  { id: "tool4", label: "Voiceover", defaultKey: "4", ctrlKey: true, category: "Tools" },
  { id: "tool5", label: "Chat", defaultKey: "5", ctrlKey: true, category: "Tools" },
  { id: "palette", label: "Command Palette", defaultKey: "k", ctrlKey: true, category: "Other" },
  { id: "help", label: "Keyboard Shortcuts", defaultKey: "?", ctrlKey: true, category: "Help" },
];

export function KeyboardShortcutsSettings() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [shortcuts, setShortcuts] = useState<ShortcutSetting[]>(() => {
    const saved = localStorage.getItem("keyboard-shortcuts");
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState("");

  const handleSave = (id: string) => {
    if (!tempKey) {
      toast({
        title: "Invalid key",
        description: "Please enter a valid key",
        variant: "destructive",
      });
      return;
    }

    const updatedShortcuts = shortcuts.map((s) =>
      s.id === id ? { ...s, defaultKey: tempKey.toLowerCase() } : s
    );
    setShortcuts(updatedShortcuts);
    localStorage.setItem("keyboard-shortcuts", JSON.stringify(updatedShortcuts));
    setEditingId(null);
    setTempKey("");
    toast({
      title: "Shortcut updated",
      description: "Your keyboard shortcut has been saved",
    });
  };

  const handleReset = () => {
    setShortcuts(DEFAULT_SHORTCUTS);
    localStorage.removeItem("keyboard-shortcuts");
    toast({
      title: "Shortcuts reset",
      description: "All keyboard shortcuts have been reset to defaults",
    });
  };

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Customize Shortcuts
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Customize Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Click on any shortcut to edit it. Changes are saved automatically.
            </DialogDescription>
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
                    .map((shortcut) => (
                      <div
                        key={shortcut.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Label className="text-sm cursor-pointer">
                          {shortcut.label}
                        </Label>
                        
                        {editingId === shortcut.id ? (
                          <div className="flex gap-2 items-center">
                            <Input
                              value={tempKey}
                              onChange={(e) => setTempKey(e.target.value)}
                              placeholder="Press key..."
                              className="w-24 h-8 text-xs"
                              maxLength={1}
                              autoFocus
                              onKeyDown={(e) => {
                                e.preventDefault();
                                if (e.key === "Escape") {
                                  setEditingId(null);
                                  setTempKey("");
                                } else if (e.key === "Enter") {
                                  handleSave(shortcut.id);
                                } else if (e.key.length === 1) {
                                  setTempKey(e.key);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSave(shortcut.id)}
                              className="h-8"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(null);
                                setTempKey("");
                              }}
                              className="h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(shortcut.id);
                              setTempKey(shortcut.defaultKey);
                            }}
                            className="flex gap-1 hover:bg-muted px-2 py-1 rounded transition-colors"
                          >
                            {shortcut.ctrlKey && (
                              <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded shadow-sm">
                                Ctrl
                              </kbd>
                            )}
                            <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded shadow-sm">
                              {shortcut.defaultKey.toUpperCase()}
                            </kbd>
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            <p className="text-sm text-muted-foreground">
              Click any shortcut to customize it
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
