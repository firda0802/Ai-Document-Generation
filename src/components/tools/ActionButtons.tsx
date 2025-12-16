import { Button } from "@/components/ui/button";
import { Copy, Download, ChevronDown, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionButtonsProps {
  onCopy: () => void;
  onDownload?: () => void;
  downloadOptions?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  }[];
}

export function ActionButtons({ onCopy, onDownload, downloadOptions }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={onCopy} className="gap-2">
        <Copy className="h-4 w-4" />
        <span className="hidden sm:inline">Copy</span>
      </Button>
      
      {downloadOptions ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {downloadOptions.map((option, index) => (
              <DropdownMenuItem key={index} onClick={option.onClick} className="gap-2">
                <option.icon className="h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : onDownload ? (
        <Button size="sm" variant="outline" onClick={onDownload} className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      ) : null}
    </div>
  );
}