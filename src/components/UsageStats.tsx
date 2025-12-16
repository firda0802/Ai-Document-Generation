import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, MessageSquare, Presentation, Table, Mic, Loader2 } from "lucide-react";
import { userRolesDb, usageTrackingDb } from "@/lib/databaseProxy";

interface UsageData {
  documents_generated: number;
  chat_messages: number;
  presentations_generated: number;
  spreadsheets_generated: number;
  voiceovers_generated: number;
}

interface UsageLimits {
  documents: number;
  chat: number;
  presentations: number;
  spreadsheets: number;
  voiceovers: number;
}

export const UsageStats = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [limits, setLimits] = useState<UsageLimits>({
    documents: 5,
    chat: 10,
    presentations: 5,
    spreadsheets: 0,
    voiceovers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchUsageAndRole = async () => {
      if (!user) return;

      try {
        // Check if user is premium via proxy
        const isPremiumUser = await userRolesDb.isPremium();
        setIsPremium(isPremiumUser);

        // Set limits based on role
        if (isPremiumUser) {
          setLimits({
            documents: -1,
            chat: -1,
            presentations: -1,
            spreadsheets: -1,
            voiceovers: -1,
          });
        }

        // Fetch today's usage via proxy
        const { data: usageData, error } = await usageTrackingDb.getToday();

        if (error && !error.message?.includes("PGRST116")) {
          throw error;
        }

        setUsage(usageData || {
          documents_generated: 0,
          chat_messages: 0,
          presentations_generated: 0,
          spreadsheets_generated: 0,
          voiceovers_generated: 0,
        });
      } catch (error) {
        console.error("Error fetching usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageAndRole();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usage) {
    return null;
  }

  const usageItems = [
    {
      icon: FileText,
      label: "Documents",
      value: usage.documents_generated,
      limit: limits.documents,
      color: "text-blue-500",
    },
    {
      icon: MessageSquare,
      label: "Chat Messages",
      value: usage.chat_messages,
      limit: limits.chat,
      color: "text-green-500",
    },
    {
      icon: Presentation,
      label: "Presentations",
      value: usage.presentations_generated,
      limit: limits.presentations,
      color: "text-purple-500",
    },
    {
      icon: Table,
      label: "Spreadsheets",
      value: usage.spreadsheets_generated,
      limit: limits.spreadsheets,
      color: "text-orange-500",
    },
    {
      icon: Mic,
      label: "Voiceovers",
      value: usage.voiceovers_generated,
      limit: limits.voiceovers,
      color: "text-pink-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Usage</CardTitle>
        <CardDescription>
          {isPremium ? "Unlimited usage across all features" : "Track your daily usage limits"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {usageItems.map((item) => {
          const Icon = item.icon;
          const percentage = item.limit === -1 ? 0 : (item.value / item.limit) * 100;
          const isUnlimited = item.limit === -1;
          const isUnavailable = item.limit === 0 && !isPremium;

          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {isUnlimited ? (
                    <span className="text-green-600 font-semibold">Unlimited</span>
                  ) : isUnavailable ? (
                    <span className="text-amber-600">Premium Only</span>
                  ) : (
                    `${item.value} / ${item.limit}`
                  )}
                </span>
              </div>
              {!isUnlimited && !isUnavailable && (
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
              )}
              {isUnavailable && (
                <Progress value={0} className="h-2 opacity-50" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
