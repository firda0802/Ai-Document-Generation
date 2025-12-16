import { cn } from "@/lib/utils";
import { FileText, Download, Printer, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

interface DocumentPreviewProps {
  content: string;
  title: string;
  isPremium?: boolean;
  onDownload?: () => void;
  className?: string;
}

// Clean and prepare content for rendering
function prepareContent(rawContent: string): string {
  if (!rawContent) return '';
  
  let content = rawContent;
  
  // Handle escaped newlines from JSON (convert \n to actual newlines)
  content = content.replace(/\\n/g, '\n');
  
  // Handle escaped quotes
  content = content.replace(/\\"/g, '"');
  
  // Handle any double-escaped characters
  content = content.replace(/\\\\/g, '\\');
  
  // Trim whitespace
  content = content.trim();
  
  return content;
}

export function DocumentPreview({
  content,
  title,
  isPremium = false,
  onDownload,
  className
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);

  // Prepare content for rendering
  const preparedContent = useMemo(() => prepareContent(content), [content]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar - Google Docs style */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm truncate max-w-[200px]">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-2" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
          {onDownload && (
            <Button variant="ghost" size="sm" onClick={onDownload} className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Document Canvas - Google Docs style */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4 md:p-8">
        <div className="flex justify-center">
          <div
            className="bg-white dark:bg-card shadow-lg rounded-sm w-full max-w-[816px] min-h-[1056px] p-12 md:p-16 border"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease'
            }}
          >
            {/* Document Content using ReactMarkdown */}
            <article className="prose prose-sm md:prose-base max-w-none text-foreground
              prose-headings:text-foreground prose-headings:font-bold prose-headings:leading-tight
              prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:text-center prose-h1:pb-4 prose-h1:border-b prose-h1:border-border
              prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-primary prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2
              prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-foreground/90
              prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2 prose-h4:font-semibold
              prose-p:text-foreground prose-p:leading-relaxed prose-p:my-3 prose-p:text-justify
              prose-ul:my-4 prose-ul:pl-6 prose-ul:list-disc
              prose-ol:my-4 prose-ol:pl-6 prose-ol:list-decimal
              prose-li:text-foreground prose-li:my-1 prose-li:leading-relaxed
              prose-strong:text-foreground prose-strong:font-bold
              prose-em:text-foreground prose-em:italic
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:my-4 prose-blockquote:italic
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-hr:my-8 prose-hr:border-border
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            >
              <ReactMarkdown>{preparedContent}</ReactMarkdown>
            </article>
            
            {/* Watermark for free users */}
            {!isPremium && (
              <div className="mt-12 pt-6 border-t border-dashed border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Generated by{" "}
                  <a href="https://mydocmaker.com" className="text-primary hover:underline font-medium">
                    MyDocMaker.com
                  </a>
                  {" • "}
                  <a href="/pricing" className="text-primary hover:underline">
                    Upgrade to Premium
                  </a>
                  {" to remove watermark"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}