import { Card } from "@/components/ui/card";
import { 
  FileText, Receipt, Briefcase, Mail, FileSpreadsheet, Crown, 
  FileCheck, Users, FolderKanban 
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isPremium?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start from scratch',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'report',
    name: 'Business Report',
    description: 'Professional report with sections',
    icon: <FileSpreadsheet className="h-5 w-5" />,
  },
  {
    id: 'resume',
    name: 'Resume / CV',
    description: 'Professional resume template',
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    id: 'invoice',
    name: 'Invoice',
    description: 'Professional invoice with table',
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    id: 'letter',
    name: 'Business Letter',
    description: 'Formal business letter',
    icon: <Mail className="h-5 w-5" />,
  },
  {
    id: 'proposal',
    name: 'Proposal',
    description: 'Business proposal template',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'contract',
    name: 'Contract',
    description: 'Service agreement template',
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    id: 'meeting_notes',
    name: 'Meeting Notes',
    description: 'Meeting minutes & action items',
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 'project_plan',
    name: 'Project Plan',
    description: 'Full project planning doc',
    icon: <FolderKanban className="h-5 w-5" />,
    isPremium: true,
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  onSelect: (templateId: string) => void;
  isPremium?: boolean;
}

export function TemplateSelector({ selectedTemplate, onSelect, isPremium = false }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEMPLATES.map((template) => {
        const isLocked = template.isPremium && !isPremium;
        const isSelected = selectedTemplate === template.id;
        
        return (
          <Card
            key={template.id}
            onClick={() => !isLocked && onSelect(template.id)}
            className={cn(
              "p-4 cursor-pointer transition-all border-2",
              isSelected 
                ? "border-primary bg-primary/5" 
                : "border-transparent hover:border-primary/30 hover:bg-muted/50",
              isLocked && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {template.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm truncate">{template.name}</h4>
                  {template.isPremium && (
                    <Crown className="h-3.5 w-3.5 text-warning shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {template.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export { TEMPLATES };
