import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Settings, Share2, FileText, Presentation, FileSpreadsheet, Mic, MessageSquare, LayoutDashboard, FolderOpen, Wrench, Bot, Save, Check, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RightSidebar } from "./RightSidebar";
import { FileHistorySidebar } from "./FileHistorySidebar";
import { ThemeSelector } from "./ThemeSelector";
import { CreditDisplay } from "./CreditDisplay";
import logo from "@/assets/logo.png";

interface EditorLayoutProps {
  children: ReactNode;
  title: string;
  onDownload?: () => void;
  showToolbar?: boolean;
  showRightSidebar?: boolean;
  previewContent?: string;
  onAutoSave?: (content: string) => Promise<void>;
  onAIAssist?: (prompt: string) => void;
}

export function EditorLayout({ 
  children, 
  title, 
  onDownload, 
  showToolbar = true,
  showRightSidebar = false,
  previewContent,
  onAutoSave,
  onAIAssist
}: EditorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!onAutoSave) return;

    const autoSaveInterval = setInterval(async () => {
      try {
        setIsSaving(true);
        // Auto-save logic would go here
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [onAutoSave]);

  const createItems = [
    { icon: FileText, label: "Document", path: "/tools/document-creator", color: "text-blue-500" },
    { icon: Presentation, label: "Presentation", path: "/tools/presentation-maker", color: "text-red-500" },
    { icon: FileSpreadsheet, label: "Spreadsheet", path: "/tools/spreadsheet", color: "text-green-500" },
    { icon: Mic, label: "Voiceover", path: "/tools/voiceover", color: "text-orange-500" },
    { icon: MessageSquare, label: "Chat", path: "/tools/chat", color: "text-blue-500" },
  ];

  const dashboardItems = [
    { icon: FolderOpen, label: "All Files", path: "/files" },
    { icon: Wrench, label: "Tools", path: "/tools" },
    { icon: Bot, label: "ChatGPT", path: "/tools/chat" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-lg shadow-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Left Sidebar */}
      <div className={cn(
        "w-56 border-r border-border bg-background flex flex-col transition-transform duration-300",
        "fixed lg:relative inset-y-0 left-0 z-40",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="MyDocMaker" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-lg">MyDocMaker</span>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground px-3 py-2 font-medium">Create</div>
            {createItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", item.color)} />
                {item.label}
              </button>
            ))}

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground px-3 py-2 font-medium">Dashboard</div>
            {dashboardItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}

            <Separator className="my-4" />

            <FileHistorySidebar />

            <Separator className="my-4" />

            <div className="px-3">
              <CreditDisplay />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        {showToolbar && (
          <div className="border-b border-border bg-background">
            <div className="flex items-center justify-between px-4 py-2 overflow-x-auto">
              <div className="flex items-center gap-2 pl-10 lg:pl-0">
                <Button variant="default" size="sm" className="gap-2 whitespace-nowrap" onClick={onDownload}>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
                  {isSaving ? (
                    <>
                      <Save className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="hidden sm:inline">{lastSaved ? `Saved` : 'Synced'}</span>
                    </>
                  )}
                </Button>
                <div className="hidden md:block">
                  <ThemeSelector />
                </div>
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                  <Share2 className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto bg-muted/30">
          {children}
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      {showRightSidebar && (
        <RightSidebar 
          previewContent={previewContent}
          onAIAssist={onAIAssist}
        />
      )}
    </div>
  );
}
