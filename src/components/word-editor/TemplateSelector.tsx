import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { wordEditorTemplates, wordEditorTemplateCategories, DocumentTemplate } from '@/data/wordEditorTemplates';

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = selectedCategory === 'all'
    ? wordEditorTemplates
    : wordEditorTemplates.filter(t => t.category === selectedCategory);

  const handleSelect = (template: DocumentTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-[60vh]">
          {/* Categories sidebar */}
          <div className="w-48 border-r pr-4">
            <div className="space-y-1">
              {wordEditorTemplateCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-2",
                    selectedCategory === category.id && "bg-primary/10 text-primary"
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Templates grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pr-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className="group p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all text-left bg-card"
                >
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
