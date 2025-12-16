import { Collaborator } from '@/hooks/useRealtimeCollaboration';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CollaboratorsCursorsProps {
  collaborators: Collaborator[];
}

const colors = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
];

export function CollaboratorsCursors({ collaborators }: CollaboratorsCursorsProps) {
  if (collaborators.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        {collaborators.slice(0, 5).map((collaborator, index) => {
          const initials = collaborator.email
            .split('@')[0]
            .slice(0, 2)
            .toUpperCase();
          const color = colors[index % colors.length];

          return (
            <Tooltip key={collaborator.user_id}>
              <TooltipTrigger asChild>
                <Avatar className={`h-6 w-6 border-2 border-background ${color}`}>
                  <AvatarFallback className={`text-[10px] text-white ${color}`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{collaborator.email}</p>
                <p className="text-xs text-muted-foreground">Editing now</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {collaborators.length > 5 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-background bg-muted">
                <AvatarFallback className="text-[10px]">
                  +{collaborators.length - 5}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{collaborators.length - 5} more editing</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
      <span className="text-xs text-muted-foreground ml-1">
        {collaborators.length} online
      </span>
    </div>
  );
}
