import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback, useEffect } from 'react';
import { WordEditorToolbar } from './WordEditorToolbar';
import { AIImageDialog } from './AIImageDialog';
import { TemplateSelector } from './TemplateSelector';
import { CommentsPanel, Comment, CommentReply } from './CommentsPanel';
import { CollaboratorsCursors } from './CollaboratorsCursors';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentTemplate } from '@/data/wordEditorTemplates';
import './word-editor.css';

interface WordEditorProps {
  documentId?: string;
  initialContent?: string;
  onChange?: (html: string) => void;
  onExportDocx: (html: string) => void;
  className?: string;
}

export function WordEditor({ 
  documentId = 'default-doc',
  initialContent = '', 
  onChange,
  onExportDocx,
  className 
}: WordEditorProps) {
  const { user } = useAuth();
  const [showAIImageDialog, setShowAIImageDialog] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  
  // Real-time collaboration
  const { collaborators, updateCursorPosition } = useRealtimeCollaboration(documentId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      FontFamily,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-border w-full',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-muted font-semibold border border-border px-3 py-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border px-3 py-2',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: 'Start typing your document...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[800px] px-12 py-10',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      
      // Update word/character count
      const text = editor.getText();
      const words = text.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharacterCount(text.length);
    },
    onSelectionUpdate: ({ editor }) => {
      // Track cursor position for collaboration
      const pos = editor.state.selection.anchor;
      updateCursorPosition(pos);
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      const text = editor.getText();
      const words = text.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharacterCount(text.length);
    }
  }, [editor, initialContent]);

  const handleInsertAIImage = useCallback((imageUrl: string, caption: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl, alt: caption }).run();
    }
  }, [editor]);

  const handleSelectTemplate = useCallback((template: DocumentTemplate) => {
    if (editor) {
      editor.commands.setContent(template.content);
    }
  }, [editor]);

  const handleExportDocx = useCallback(() => {
    if (editor) {
      onExportDocx(editor.getHTML());
    }
  }, [editor, onExportDocx]);

  const handleExportPdf = useCallback(() => {
    if (editor) {
      const html = editor.getHTML();
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Document</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              padding: 40px; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
            }
            h1 { font-size: 28px; font-weight: bold; margin-top: 24px; }
            h2 { font-size: 24px; font-weight: bold; margin-top: 20px; }
            h3 { font-size: 20px; font-weight: bold; margin-top: 16px; }
            h4 { font-size: 16px; font-weight: bold; margin-top: 12px; }
            p { margin-bottom: 12px; }
            ul, ol { padding-left: 24px; margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; margin: 16px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            img { max-width: 100%; height: auto; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${html}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [editor]);

  const handlePrint = useCallback(() => {
    handleExportPdf();
  }, [handleExportPdf]);

  // Comments handlers
  const handleAddComment = useCallback((content: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: user?.displayName || user?.email?.split('@')[0] || 'User',
      authorEmail: user?.email || '',
      content,
      createdAt: new Date(),
      resolved: false,
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
  }, [user]);

  const handleResolveComment = useCallback((id: string) => {
    setComments(prev => 
      prev.map(c => c.id === id ? { ...c, resolved: true } : c)
    );
  }, []);

  const handleDeleteComment = useCallback((id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  }, []);

  const handleReplyToComment = useCallback((id: string, content: string) => {
    const reply: CommentReply = {
      id: crypto.randomUUID(),
      author: user?.displayName || user?.email?.split('@')[0] || 'User',
      authorEmail: user?.email || '',
      content,
      createdAt: new Date(),
    };
    setComments(prev =>
      prev.map(c => c.id === id ? { ...c, replies: [...c.replies, reply] } : c)
    );
  }, [user]);

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <WordEditorToolbar
        editor={editor}
        onInsertAIImage={() => setShowAIImageDialog(true)}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        onOpenTemplates={() => setShowTemplateSelector(true)}
        onToggleComments={() => setShowComments(!showComments)}
        wordCount={wordCount}
        characterCount={characterCount}
        collaborators={<CollaboratorsCursors collaborators={collaborators} />}
        commentsCount={comments.filter(c => !c.resolved).length}
      />

      <div className="flex-1 flex overflow-hidden">
        <ScrollArea className="flex-1 bg-muted/30">
          <div className="py-8 px-4 flex justify-center">
            <div className="bg-white dark:bg-slate-50 shadow-lg rounded-sm w-full max-w-[816px] min-h-[1056px] text-slate-900">
              <EditorContent editor={editor} />
            </div>
          </div>
        </ScrollArea>

        <CommentsPanel
          open={showComments}
          onClose={() => setShowComments(false)}
          comments={comments}
          onAddComment={handleAddComment}
          onResolveComment={handleResolveComment}
          onDeleteComment={handleDeleteComment}
          onReplyToComment={handleReplyToComment}
          currentUserEmail={user?.email || ''}
        />
      </div>

      <AIImageDialog
        open={showAIImageDialog}
        onOpenChange={setShowAIImageDialog}
        onImageGenerated={handleInsertAIImage}
      />

      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
