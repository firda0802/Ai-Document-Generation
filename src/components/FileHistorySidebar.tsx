import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Presentation, FileSpreadsheet, Clock, Mic, File } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { fileHistoryDb } from "@/lib/databaseProxy";

interface FileHistoryItem {
  id: string;
  title: string;
  file_type: string;
  created_at: string;
  thumbnail_url?: string;
}

export function FileHistorySidebar() {
  const [files, setFiles] = useState<FileHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFiles = async () => {
      try {
        const { data } = await fileHistoryDb.getAll({ 
          order: { column: 'created_at', ascending: false } 
        });
        if (data) {
          setFiles(data.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching file history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();

    // Refresh every 30 seconds
    const interval = setInterval(fetchFiles, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'document':
      case 'pdf':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'presentation':
        return <Presentation className="h-4 w-4 text-orange-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case 'voiceover':
        return <Mic className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground px-3 py-2 font-medium flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Recent Files
        </div>
        <div className="px-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-md bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground px-3 py-2 font-medium flex items-center gap-2">
        <Clock className="h-3 w-3" />
        Recent Files
      </div>
      <ScrollArea className="h-[300px]">
        {files.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <File className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">No recent files</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">
              Generated files will appear here
            </p>
          </div>
        ) : (
          files.map((file) => (
            <button
              key={file.id}
              className={cn(
                "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left group",
                "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-muted/50 group-hover:bg-background transition-colors">
                {getFileIcon(file.file_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground/80 group-hover:text-foreground">
                  {file.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                </p>
              </div>
            </button>
          ))
        )}
      </ScrollArea>
    </div>
  );
}