import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Crown, Sparkles, TrendingUp, AlertCircle, FileText, Mic, Layers } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { userRolesDb, usageTrackingDb, subscriptionsDb } from "@/lib/databaseProxy";
import { FREE_LIMITS, STANDARD_LIMITS, PREMIUM_LIMITS, CreditLimits } from "@/data/pricing";

const GUEST_CREDIT_KEY = "mydocmaker_guest_credit_used";
const GUEST_MAX_CREDITS = 1;

interface CreditState {
  documentCredits: number;
  voiceCredits: number;
  otherCredits: number;
  maxDocumentCredits: number;
  maxVoiceCredits: number;
  maxOtherCredits: number;
  isPremium: boolean;
  isStandard: boolean;
  isGuest: boolean;
  wordLimit: number;
}

export function CreditDisplay() {
  const { user } = useAuth();
  const [state, setState] = useState<CreditState>({
    documentCredits: 0,
    voiceCredits: 0,
    otherCredits: 0,
    maxDocumentCredits: GUEST_MAX_CREDITS,
    maxVoiceCredits: GUEST_MAX_CREDITS,
    maxOtherCredits: GUEST_MAX_CREDITS,
    isPremium: false,
    isStandard: false,
    isGuest: true,
    wordLimit: FREE_LIMITS.wordLimit,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!user?.uid) {
        // Guest user - check localStorage
        const guestUsed = localStorage.getItem(GUEST_CREDIT_KEY) === "true";
        setState({
          documentCredits: guestUsed ? 0 : GUEST_MAX_CREDITS,
          voiceCredits: guestUsed ? 0 : GUEST_MAX_CREDITS,
          otherCredits: guestUsed ? 0 : GUEST_MAX_CREDITS,
          maxDocumentCredits: GUEST_MAX_CREDITS,
          maxVoiceCredits: GUEST_MAX_CREDITS,
          maxOtherCredits: GUEST_MAX_CREDITS,
          isPremium: false,
          isStandard: false,
          isGuest: true,
          wordLimit: FREE_LIMITS.wordLimit,
        });
        setLoading(false);
        return;
      }

      try {
        // Check subscription status
        const { data: subData } = await subscriptionsDb.get();
        
        let limits = FREE_LIMITS;
        let isPremium = false;
        let isStandard = false;

        if (subData && (subData.status === "active" || subData.status === "trialing")) {
          if (subData.plan_type === "premium") {
            limits = PREMIUM_LIMITS;
            isPremium = true;
          } else if (subData.plan_type === "standard") {
            limits = STANDARD_LIMITS;
            isStandard = true;
          }
        }

        // Get this month's usage
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { data: todayUsage } = await usageTrackingDb.getToday();

        let totalDocuments = 0;
        let totalVoice = 0;
        let totalOther = 0;

        if (todayUsage) {
          totalDocuments = (todayUsage.documents_generated || 0) + 
                          (todayUsage.presentations_generated || 0) + 
                          (todayUsage.spreadsheets_generated || 0);
          totalVoice = todayUsage.voiceovers_generated || 0;
          totalOther = (todayUsage.chat_messages || 0) + (todayUsage.images_generated || 0);
        }

        // Calculate remaining (-1 = unlimited)
        const docRemaining = limits.documentCredits === -1 ? -1 : Math.max(0, limits.documentCredits - totalDocuments);
        const voiceRemaining = limits.voiceCredits === -1 ? -1 : Math.max(0, limits.voiceCredits - totalVoice);
        const otherRemaining = limits.otherCredits === -1 ? -1 : Math.max(0, limits.otherCredits - totalOther);

        setState({
          documentCredits: docRemaining,
          voiceCredits: voiceRemaining,
          otherCredits: otherRemaining,
          maxDocumentCredits: limits.documentCredits,
          maxVoiceCredits: limits.voiceCredits,
          maxOtherCredits: limits.otherCredits,
          isPremium,
          isStandard,
          isGuest: false,
          wordLimit: limits.wordLimit,
        });
      } catch (error) {
        console.error("Error fetching user status:", error);
        setState(prev => ({
          ...prev,
          documentCredits: FREE_LIMITS.documentCredits,
          voiceCredits: FREE_LIMITS.voiceCredits,
          otherCredits: FREE_LIMITS.otherCredits,
          maxDocumentCredits: FREE_LIMITS.documentCredits,
          maxVoiceCredits: FREE_LIMITS.voiceCredits,
          maxOtherCredits: FREE_LIMITS.otherCredits,
          isGuest: false,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();

    // Refresh credits every 30 seconds
    const interval = setInterval(fetchUserStatus, 30000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="p-3 rounded-xl border border-border/50 bg-muted/30 animate-pulse">
        <div className="h-14" />
      </div>
    );
  }

  const { isPremium, isStandard, isGuest } = state;
  const hasLowCredits = !isPremium && !isStandard && 
    (state.documentCredits <= 5 || state.voiceCredits <= 5 || state.otherCredits <= 10);

  const CreditRow = ({ 
    icon: Icon, 
    label, 
    current, 
    max 
  }: { 
    icon: React.ElementType; 
    label: string; 
    current: number; 
    max: number;
  }) => {
    const isUnlimited = max === -1;
    const percentage = isUnlimited ? 100 : max > 0 ? (current / max) * 100 : 0;
    const isLow = !isUnlimited && current <= 5;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Icon className="h-3 w-3" />
            <span>{label}</span>
          </div>
          <span className={cn("font-medium", isLow && "text-red-500")}>
            {isUnlimited ? "∞" : current}/{isUnlimited ? "∞" : max}
          </span>
        </div>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isLow 
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : "bg-gradient-to-r from-primary to-accent"
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all duration-300",
      isPremium 
        ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10" 
        : isStandard
          ? "border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-indigo-500/10"
          : hasLowCredits
            ? "border-red-500/30 bg-gradient-to-br from-red-500/10 via-red-500/5 to-orange-500/10"
            : "border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          isPremium 
            ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/20" 
            : isStandard
              ? "bg-blue-500/10"
              : hasLowCredits
                ? "bg-red-500/10"
                : "bg-primary/10"
        )}>
          {isPremium ? (
            <Crown className="h-4 w-4 text-yellow-500" />
          ) : isStandard ? (
            <Sparkles className="h-4 w-4 text-blue-500" />
          ) : hasLowCredits ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <Coins className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {isPremium ? "Premium Plan" : isStandard ? "Standard Plan" : isGuest ? "Guest" : "Free Plan"}
          </p>
          <p className="text-sm font-bold leading-tight">
            {isPremium ? (
              <span className="gradient-text">500 Credits/mo</span>
            ) : isStandard ? (
              <span className="text-blue-500">250 Credits/mo</span>
            ) : isGuest ? (
              <span>1 Trial Credit</span>
            ) : (
              <span>Monthly Credits</span>
            )}
          </p>
        </div>
      </div>

      {/* Credit Breakdown */}
      {!isGuest && (
        <div className="space-y-2 mb-3">
          <CreditRow 
            icon={FileText} 
            label="Documents" 
            current={state.documentCredits === -1 ? 999 : state.documentCredits} 
            max={state.maxDocumentCredits} 
          />
          <CreditRow 
            icon={Mic} 
            label="Voice" 
            current={state.voiceCredits === -1 ? 999 : state.voiceCredits} 
            max={state.maxVoiceCredits} 
          />
          <CreditRow 
            icon={Layers} 
            label="Other Tools" 
            current={state.otherCredits === -1 ? 999 : state.otherCredits} 
            max={state.maxOtherCredits} 
          />
        </div>
      )}

      {/* Status text */}
      <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
        {isPremium ? (
          <>
            <TrendingUp className="h-3 w-3" />
            Max Intelligence AI • {state.wordLimit.toLocaleString()} words/file
          </>
        ) : isStandard ? (
          <>
            <TrendingUp className="h-3 w-3" />
            Gemini 3 Access • {state.wordLimit.toLocaleString()} words/file
          </>
        ) : isGuest ? (
          <>
            <Link to="/auth" className="text-primary hover:underline">Sign up</Link>
            {" "}for 225 free credits/month
          </>
        ) : (
          <>Word limit: {state.wordLimit.toLocaleString()} words/file</>
        )}
      </p>

      {/* Action Button */}
      {isGuest ? (
        <div className="space-y-2">
          <Button 
            size="sm" 
            className="w-full h-8 text-xs gap-1.5"
            onClick={() => navigate("/auth")}
          >
            Sign Up Free
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full h-8 text-xs"
            onClick={() => navigate("/auth")}
          >
            Log In
          </Button>
        </div>
      ) : !isPremium && (
        <Button 
          size="sm" 
          className="w-full h-8 text-xs gap-1.5 gradient-primary hover:opacity-90 transition-opacity"
          onClick={() => navigate("/dashboard/subscription")}
        >
          <Sparkles className="h-3 w-3" />
          {isStandard ? "Upgrade to Premium" : "Upgrade Plan"}
        </Button>
      )}
    </div>
  );
}
