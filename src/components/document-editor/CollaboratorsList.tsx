import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Collaborator {
  user_id: string;
  email: string;
  status: string;
  last_seen: string;
}

interface CollaboratorsListProps {
  documentId: string;
}

export const CollaboratorsList = ({ documentId }: CollaboratorsListProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`document-${documentId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<Collaborator>();
        const users = Object.values(state).flat();
        setCollaborators(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              user_id: user.id,
              email: user.email,
              status: "active",
              last_seen: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Active Collaborators
        </CardTitle>
        <CardDescription>Currently editing this document</CardDescription>
      </CardHeader>
      <CardContent>
        {collaborators.length === 0 ? (
          <p className="text-sm text-muted-foreground">No other collaborators</p>
        ) : (
          <div className="space-y-2">
            {collaborators.map((collab, index) => (
              <div key={index} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {collab.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{collab.email}</p>
                  <p className="text-xs text-muted-foreground">{collab.status}</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
