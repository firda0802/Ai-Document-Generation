import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Collaborator {
  user_id: string;
  email: string;
  online_at: string;
  cursor_position?: number;
}

export const useRealtimeCollaboration = (documentId: string) => {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const roomChannel = supabase.channel(`document:${documentId}`);

    // Track presence
    roomChannel
      .on("presence", { event: "sync" }, () => {
        const state = roomChannel.presenceState();
        const users: Collaborator[] = [];
        
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            users.push(presence);
          });
        });
        
        setCollaborators(users);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("User joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("User left:", leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await roomChannel.track({
            user_id: user.uid,
            email: user.email || "Anonymous",
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(roomChannel);

    return () => {
      roomChannel.unsubscribe();
    };
  }, [documentId, user?.uid, user?.email]);

  const updateCursorPosition = async (position: number) => {
    if (channel && user?.uid) {
      await channel.track({
        user_id: user.uid,
        email: user.email || "Anonymous",
        online_at: new Date().toISOString(),
        cursor_position: position,
      });
    }
  };

  return {
    collaborators: collaborators.filter((c) => c.user_id !== user?.uid),
    updateCursorPosition,
  };
};
