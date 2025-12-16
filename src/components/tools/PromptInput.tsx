import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Paperclip, ArrowUp, X, FileText, Image as ImageIcon, File, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  content?: string;
}

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (files?: UploadedFile[]) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  exampleText?: string;
  onExampleClick?: () => void;
  showExample?: boolean;
  className?: string;
  maxLength?: number;
  rows?: number;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe what you want to create...",
  loading = false,
  disabled = false,
  exampleText,
  onExampleClick,
  showExample = true,
  className,
  maxLength,
  rows = 4,
}: PromptInputProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < Math.min(selectedFiles.length, maxFiles - files.length); i++) {
      const file = selectedFiles[i];

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        uploadedFile.preview = URL.createObjectURL(file);
      }

      // Read text content for text files
      if (file.type.startsWith('text/') || 
          file.name.endsWith('.txt') || 
          file.name.endsWith('.md') ||
          file.name.endsWith('.json') ||
          file.name.endsWith('.csv')) {
        try {
          uploadedFile.content = await file.text();
        } catch {
          // Ignore read errors
        }
      }

      newFiles.push(uploadedFile);
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSubmit = () => {
    if (!onSubmit || disabled || loading || (!value.trim() && files.length === 0)) return;
    onSubmit(files.length > 0 ? files : undefined);
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-xl border-2 bg-card transition-all overflow-hidden",
          isDragOver ? "border-primary bg-primary/5" : "border-border/50",
          "focus-within:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* File Attachments */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border/30"
            >
              <div className="flex gap-2 p-3 flex-wrap">
                {files.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 text-xs group"
                    >
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.name}
                          className="w-5 h-5 rounded object-cover"
                        />
                      ) : (
                        <FileIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="max-w-[100px] truncate">{file.name}</span>
                      <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="ml-1 p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-3">
          {/* Example Button */}
          {showExample && exampleText && (
            <div className="mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExampleClick}
                className="h-7 text-xs border-border/50 hover:bg-muted/50"
              >
                Example
              </Button>
            </div>
          )}

          {/* Textarea */}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || loading}
            maxLength={maxLength}
            rows={rows}
            className="min-h-[80px] resize-none border-0 p-0 focus-visible:ring-0 text-sm bg-transparent"
          />
          {maxLength && (
            <div className="text-xs text-muted-foreground text-right mt-1">
              {value.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.md,.doc,.docx,.csv,.json"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || loading || files.length >= 5}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={disabled || loading || (!value.trim() && files.length === 0)}
            size="icon"
            className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-xl flex items-center justify-center z-10"
          >
            <div className="text-center">
              <Paperclip className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">Drop files here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
