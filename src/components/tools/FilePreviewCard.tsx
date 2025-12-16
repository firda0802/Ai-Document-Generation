import { motion } from "framer-motion";
import { FileText, Presentation, FileSpreadsheet, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SlideData {
  title: string;
  subtitle?: string;
  slide_layout?: string;
  bullets?: { content: string; level?: number }[];
}

interface FilePreviewCardProps {
  title: string;
  fileType: 'document' | 'presentation' | 'spreadsheet' | 'pdf';
  previewContent?: string;
  slideCount?: number;
  slides?: SlideData[];
  rowCount?: number;
  columnCount?: number;
  onDownload: (format: string) => void;
  downloadOptions: { label: string; format: string; icon: React.ReactNode }[];
  children?: React.ReactNode;
}

export function FilePreviewCard({
  title,
  fileType,
  previewContent,
  slideCount,
  slides,
  rowCount,
  columnCount,
  onDownload,
  downloadOptions,
  children,
}: FilePreviewCardProps) {
  const getFileIcon = () => {
    switch (fileType) {
      case 'document':
      case 'pdf':
        return <FileText className="h-8 w-8" />;
      case 'presentation':
        return <Presentation className="h-8 w-8" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-8 w-8" />;
    }
  };

  const getFileColor = () => {
    switch (fileType) {
      case 'document':
        return 'text-primary bg-primary/10';
      case 'pdf':
        return 'text-destructive bg-destructive/10';
      case 'presentation':
        return 'text-accent bg-accent/10';
      case 'spreadsheet':
        return 'text-success bg-success/10';
    }
  };

  const getGradient = () => {
    switch (fileType) {
      case 'document':
        return 'from-primary to-accent';
      case 'pdf':
        return 'from-destructive to-accent';
      case 'presentation':
        return 'from-accent to-primary';
      case 'spreadsheet':
        return 'from-success to-primary';
    }
  };

  const getFileInfo = () => {
    switch (fileType) {
      case 'presentation':
        return slideCount ? `${slideCount} slides` : '';
      case 'spreadsheet':
        return rowCount && columnCount ? `${rowCount} rows × ${columnCount} columns` : '';
      default:
        return '';
    }
  };

  // Generate preview lines from content
  const getPreviewLines = () => {
    if (!previewContent) return [];
    const text = previewContent.replace(/<[^>]+>/g, '').trim();
    const lines = text.split('\n').filter(l => l.trim()).slice(0, 4);
    return lines.map(l => l.substring(0, 60) + (l.length > 60 ? '...' : ''));
  };

  // Parse CSV content for spreadsheet preview
  const getSpreadsheetPreview = () => {
    if (!previewContent || fileType !== 'spreadsheet') return [];
    const lines = previewContent.split('\n').filter(l => l.trim()).slice(0, 5);
    return lines.map(line => line.split(',').map(cell => cell.trim().substring(0, 12)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg"
    >
      {/* Header with gradient accent */}
      <div className={`h-1.5 bg-gradient-to-r ${getGradient()}`} />
      
      <div className="p-6">
        {/* File info header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${getFileColor()} flex items-center justify-center`}>
              {getFileIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
                {getFileInfo() && (
                  <>
                    <span className="text-border">•</span>
                    <span>{getFileInfo()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={`gap-2 bg-gradient-to-r ${getGradient()} hover:opacity-90 text-white`}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {downloadOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.format}
                  onClick={() => onDownload(option.format)}
                  className="gap-3 py-3"
                >
                  {option.icon}
                  <span>{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Thumbnail preview */}
        <div className="relative rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
          {/* Mini document preview */}
          <div className={`p-4 overflow-hidden ${fileType === 'spreadsheet' && getSpreadsheetPreview().length > 0 ? '' : 'aspect-[16/10]'}`}>
            {fileType === 'spreadsheet' ? (
              <div className="w-full overflow-hidden">
                {/* Mini spreadsheet grid with actual data */}
                {getSpreadsheetPreview().length > 0 ? (
                  <div className="bg-background rounded border border-border/50 overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody>
                        {getSpreadsheetPreview().map((row, rowIdx) => (
                          <tr key={rowIdx} className={rowIdx === 0 ? 'bg-primary/10 font-medium' : ''}>
                            {row.slice(0, 6).map((cell, cellIdx) => (
                              <td 
                                key={cellIdx} 
                                className="border-r border-b border-border/30 px-2 py-1.5 truncate max-w-[100px]"
                              >
                                {cell || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-0.5 aspect-[16/10]">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`${i < 4 ? 'bg-primary/20' : 'bg-background'} rounded-sm border border-border/30`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : fileType === 'presentation' ? (
              <div className="flex gap-2 h-full overflow-hidden">
                {/* Mini slide thumbnails with actual content */}
                {slides && slides.length > 0 ? (
                  <>
                    {slides.slice(0, 4).map((slide, i) => (
                      <div 
                        key={i} 
                        className="flex-shrink-0 w-24 h-full bg-background rounded-lg border border-border/50 p-2 flex flex-col overflow-hidden"
                      >
                        <div className="text-[8px] font-semibold text-foreground truncate leading-tight mb-1">
                          {slide.title}
                        </div>
                        {slide.subtitle && (
                          <div className="text-[6px] text-muted-foreground truncate mb-1">
                            {slide.subtitle}
                          </div>
                        )}
                        {slide.bullets && slide.bullets.length > 0 && (
                          <div className="space-y-0.5 flex-1 overflow-hidden">
                            {slide.bullets.slice(0, 3).map((bullet, idx) => (
                              <div key={idx} className="text-[5px] text-muted-foreground truncate flex items-start gap-0.5">
                                <span className="text-primary">•</span>
                                <span className="truncate">{bullet.content}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-[7px] text-muted-foreground text-center mt-auto pt-1 border-t border-border/30">{i + 1}</div>
                      </div>
                    ))}
                    {slides.length > 4 && (
                      <div className="flex-shrink-0 w-24 h-full bg-muted/50 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{slides.length - 4} more</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {Array.from({ length: Math.min(slideCount || 3, 4) }).map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-shrink-0 w-24 h-full bg-background rounded-lg border border-border/50 p-2 flex flex-col"
                      >
                        <div className="h-2 w-12 bg-primary/30 rounded mb-2" />
                        <div className="space-y-1 flex-1">
                          <div className="h-1 w-full bg-muted-foreground/20 rounded" />
                          <div className="h-1 w-4/5 bg-muted-foreground/20 rounded" />
                          <div className="h-1 w-3/5 bg-muted-foreground/20 rounded" />
                        </div>
                        <div className="text-[8px] text-muted-foreground text-center mt-1">{i + 1}</div>
                      </div>
                    ))}
                    {(slideCount || 0) > 4 && (
                      <div className="flex-shrink-0 w-24 h-full bg-muted/50 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{(slideCount || 0) - 4} more</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-background rounded-lg border border-border/50 p-4 h-full overflow-hidden">
                {/* Mini document preview with lines */}
                <div className="space-y-2">
                  <div className="h-3 w-2/3 bg-primary/30 rounded" />
                  <div className="h-0.5 w-full bg-border/50" />
                  {getPreviewLines().length > 0 ? (
                    getPreviewLines().map((line, i) => (
                      <p key={i} className="text-[9px] text-muted-foreground line-clamp-1">{line}</p>
                    ))
                  ) : (
                    <>
                      <div className="h-1.5 w-full bg-muted-foreground/15 rounded" />
                      <div className="h-1.5 w-11/12 bg-muted-foreground/15 rounded" />
                      <div className="h-1.5 w-4/5 bg-muted-foreground/15 rounded" />
                      <div className="h-1.5 w-full bg-muted-foreground/15 rounded" />
                      <div className="h-1.5 w-3/4 bg-muted-foreground/15 rounded" />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Fade overlay */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Additional content (like full preview) */}
        {children}
      </div>
    </motion.div>
  );
}
