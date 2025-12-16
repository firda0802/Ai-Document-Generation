import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Presentation,
  Sheet,
  Mic,
  MessageSquare,
  LayoutDashboard,
  Home,
  Settings,
  Search,
  BookOpen,
  Mail,
  CreditCard,
  User,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands: Command[] = useMemo(
    () => [
      // Tools
      {
        id: "document-creator",
        label: "Document Creator",
        icon: FileText,
        action: () => {
          navigate("/tools/document-creator");
          setOpen(false);
        },
        category: "Tools",
      },
      {
        id: "presentation-maker",
        label: "Presentation Maker",
        icon: Presentation,
        action: () => {
          navigate("/tools/presentation-maker");
          setOpen(false);
        },
        category: "Tools",
      },
      {
        id: "spreadsheet",
        label: "Spreadsheet",
        icon: Sheet,
        action: () => {
          navigate("/tools/spreadsheet");
          setOpen(false);
        },
        category: "Tools",
      },
      {
        id: "voiceover",
        label: "Voiceover",
        icon: Mic,
        action: () => {
          navigate("/tools/voiceover");
          setOpen(false);
        },
        category: "Tools",
      },
      {
        id: "chat",
        label: "Chat",
        icon: MessageSquare,
        action: () => {
          navigate("/tools/chat");
          setOpen(false);
        },
        category: "Tools",
      },
      // Navigation
      {
        id: "home",
        label: "Home",
        icon: Home,
        action: () => {
          navigate("/");
          setOpen(false);
        },
        category: "Navigation",
      },
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        action: () => {
          navigate("/dashboard");
          setOpen(false);
        },
        category: "Navigation",
      },
      {
        id: "blog",
        label: "Blog",
        icon: BookOpen,
        action: () => {
          navigate("/blog");
          setOpen(false);
        },
        category: "Navigation",
      },
      {
        id: "pricing",
        label: "Pricing",
        icon: CreditCard,
        action: () => {
          navigate("/pricing");
          setOpen(false);
        },
        category: "Navigation",
      },
      {
        id: "contact",
        label: "Contact",
        icon: Mail,
        action: () => {
          navigate("/contact");
          setOpen(false);
        },
        category: "Navigation",
      },
      // Settings
      {
        id: "profile",
        label: "Profile Settings",
        icon: User,
        action: () => {
          navigate("/profile");
          setOpen(false);
        },
        category: "Settings",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        action: () => {
          navigate("/profile");
          setOpen(false);
        },
        category: "Settings",
      },
    ],
    [navigate]
  );

  const filteredCommands = useMemo(() => {
    if (!search) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(searchLower) ||
        cmd.category.toLowerCase().includes(searchLower)
    );
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for commands, pages, or tools..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-[400px]">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No commands found
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {cmds.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left"
                      >
                        <cmd.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{cmd.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px] font-semibold">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px] font-semibold">
              K
            </kbd>{" "}
            to toggle
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px] font-semibold">
              Esc
            </kbd>{" "}
            to close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
