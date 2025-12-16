import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Image as ImageIcon } from "lucide-react";
import type { DocumentSchema, AnyDocumentElement, ImageElement } from "@/lib/documentSchema";

interface DocumentJsonPreviewProps {
  schema: DocumentSchema | null;
  className?: string;
  processingImages?: boolean;
}

// Render a single element to HTML-like preview
function asPlainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "text" in (value as any)) {
    const t = (value as any).text;
    return typeof t === "string" ? t : String(t ?? "");
  }
  if (value == null) return "";
  return String(value);
}

function renderElement(element: AnyDocumentElement, index: number): React.ReactNode {
  const key = `element-${index}`;

  switch (element.type) {
    case 'heading1':
      return (
        <h1
          key={key}
          className="text-3xl font-bold text-primary mb-4 mt-6"
          style={{ textAlign: element.alignment || 'left' }}
        >
          {asPlainText((element as any).text)}
        </h1>
      );

    case 'heading2':
      return (
        <h2
          key={key}
          className="text-2xl font-semibold text-foreground mb-3 mt-5"
          style={{ textAlign: element.alignment || 'left' }}
        >
          {asPlainText((element as any).text)}
        </h2>
      );

    case 'heading3':
      return (
        <h3
          key={key}
          className="text-xl font-medium text-foreground mb-2 mt-4"
          style={{ textAlign: element.alignment || 'left' }}
        >
          {asPlainText((element as any).text)}
        </h3>
      );

    case 'heading4':
      return (
        <h4
          key={key}
          className="text-lg font-medium text-foreground/90 mb-2 mt-3"
          style={{ textAlign: element.alignment || 'left' }}
        >
          {asPlainText((element as any).text)}
        </h4>
      );

    case 'paragraph':
      if ((element as any).text_runs) {
        return (
          <p key={key} className="mb-3 leading-relaxed" style={{ textAlign: element.alignment || 'left' }}>
            {(element as any).text_runs.map((run: any, i: number) => (
              <span
                key={i}
                className={`${run?.bold ? 'font-bold' : ''} ${run?.italic ? 'italic' : ''} ${run?.underline ? 'underline' : ''}`}
                style={{ color: run?.color ? `#${String(run.color)}` : undefined }}
              >
                {asPlainText(run?.text)}
              </span>
            ))}
          </p>
        );
      }
      return (
        <p
          key={key}
          className="mb-3 leading-relaxed whitespace-pre-wrap"
          style={{ textAlign: element.alignment || 'left' }}
        >
          {asPlainText((element as any).text)}
        </p>
      );

    case 'bullet_list':
      return (
        <ul key={key} className="list-disc list-inside mb-4 space-y-1 pl-4">
          {(element as any).items.map((item: any, i: number) => (
            <li key={i} className="text-foreground/90">{asPlainText(item)}</li>
          ))}
        </ul>
      );

    case 'numbered_list':
      return (
        <ol key={key} className="list-decimal list-inside mb-4 space-y-1 pl-4">
          {(element as any).items.map((item: any, i: number) => (
            <li key={i} className="text-foreground/90">{asPlainText(item)}</li>
          ))}
        </ol>
      );

    case 'table':
      return (
        <div key={key} className="mb-4 overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <tbody>
              {(element as any).rows.map((row: any, rowIdx: number) => (
                <tr
                  key={rowIdx}
                  className={row.isHeader || rowIdx === 0 ? 'bg-muted' : rowIdx % 2 === 0 && (element as any).style === 'striped' ? 'bg-muted/50' : ''}
                >
                  {row.cells.map((cell: any, cellIdx: number) => {
                    const CellTag = row.isHeader || rowIdx === 0 ? 'th' : 'td';
                    return (
                      <CellTag
                        key={cellIdx}
                        className="border border-border px-3 py-2 text-sm text-left"
                      >
                        {asPlainText(cell)}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'divider':
      return <hr key={key} className="my-4 border-border" />;

    case 'image':
      const imgElement = element as ImageElement;
      if (imgElement.url) {
        return (
          <figure key={key} className="my-4">
            <img
              src={imgElement.url}
              alt={imgElement.caption || imgElement.ai_prompt || 'Document image'}
              className="max-w-full h-auto rounded-lg border border-border mx-auto"
              style={{
                width: imgElement.width_inches ? `${imgElement.width_inches}in` : 'auto',
                maxWidth: '100%'
              }}
            />
            {imgElement.caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
                {asPlainText(imgElement.caption)}
              </figcaption>
            )}
          </figure>
        );
      } else if (imgElement.ai_prompt) {
        // Show placeholder for unprocessed images
        return (
          <div
            key={key}
            className="my-4 p-8 border-2 border-dashed border-border rounded-lg bg-muted/30 flex flex-col items-center justify-center gap-2"
          >
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground text-center">
              Generating: {asPlainText(imgElement.ai_prompt).substring(0, 50)}...
            </p>
          </div>
        );
      }
      return (
        <div key={key} className="my-4 p-8 border border-dashed border-border rounded-lg bg-muted/30 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      );

    default:
      return null;
  }
}

export function DocumentJsonPreview({ schema, className, processingImages }: DocumentJsonPreviewProps) {
  const content = useMemo(() => {
    if (!schema || !schema.sections) return null;

    return schema.sections.map((section, sectionIdx) => (
      <div key={`section-${sectionIdx}`} className="mb-8">
        {section.header?.text && (
          <div 
            className="text-xs text-muted-foreground mb-4 pb-2 border-b border-border"
            style={{ textAlign: section.header.align || 'left' }}
          >
            {section.header.text}
          </div>
        )}
        
        {section.elements.map((element, elementIdx) => 
          renderElement(element, elementIdx)
        )}
        
        {section.footer?.text && (
          <div className="text-xs text-muted-foreground mt-4 pt-2 border-t border-border text-center">
            {section.footer.text}
          </div>
        )}
      </div>
    ));
  }, [schema]);

  if (!schema) {
    return (
      <Card className={`p-8 flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No document to preview</p>
      </Card>
    );
  }

  // Get theme colors for the preview
  const primaryColor = schema.theme?.primary_color ? `#${schema.theme.primary_color}` : undefined;

  return (
    <Card className={`bg-white dark:bg-slate-50 ${className}`}>
      {processingImages && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Generating images...</span>
          </div>
        </div>
      )}
      <ScrollArea className="h-full">
        <div 
          className="p-8 min-h-full text-slate-900"
          style={{ 
            fontFamily: schema.theme?.font_name || 'Calibri, sans-serif',
            fontSize: `${schema.theme?.font_size || 11}pt`,
            '--primary-doc-color': primaryColor,
          } as React.CSSProperties}
        >
          {/* Document Title from metadata */}
          {schema.metadata?.title && !schema.sections[0]?.elements.some(e => e.type === 'heading1') && (
            <h1 
              className="text-3xl font-bold mb-6 text-center"
              style={{ color: primaryColor }}
            >
              {schema.metadata.title}
            </h1>
          )}
          
          {content}
        </div>
      </ScrollArea>
    </Card>
  );
}
