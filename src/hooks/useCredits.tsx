import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FREE_LIMITS, STANDARD_LIMITS, PREMIUM_LIMITS, CreditLimits } from "@/data/pricing";

const GUEST_CREDIT_KEY = "mydocmaker_guest_credit_used";
const GUEST_MAX_CREDITS = 1;

export type ToolCategory = "document" | "voice" | "other";

interface CreditInfo {
  remainingCredits: number;
  maxCredits: number;
  wordLimit: number;
  isGuest: boolean;
  isPremium: boolean;
  isStandard: boolean;
  limits: CreditLimits;
  documentCreditsRemaining: number;
  voiceCreditsRemaining: number;
  otherCreditsRemaining: number;
}

export function useCredits() {
  const { user } = useAuth();
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    remainingCredits: GUEST_MAX_CREDITS,
    maxCredits: GUEST_MAX_CREDITS,
    wordLimit: FREE_LIMITS.wordLimit,
    isGuest: true,
    isPremium: false,
    isStandard: false,
    limits: FREE_LIMITS,
    documentCreditsRemaining: FREE_LIMITS.documentCredits,
    voiceCreditsRemaining: FREE_LIMITS.voiceCredits,
    otherCreditsRemaining: FREE_LIMITS.otherCredits,
  });
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    setLoading(true);
    
    if (!user) {
      // Guest user - check localStorage
      const guestUsed = localStorage.getItem(GUEST_CREDIT_KEY) === "true";
      setCreditInfo({
        remainingCredits: guestUsed ? 0 : GUEST_MAX_CREDITS,
        maxCredits: GUEST_MAX_CREDITS,
        wordLimit: FREE_LIMITS.wordLimit,
        isGuest: true,
        isPremium: false,
        isStandard: false,
        limits: FREE_LIMITS,
        documentCreditsRemaining: guestUsed ? 0 : 1,
        voiceCreditsRemaining: guestUsed ? 0 : 1,
        otherCreditsRemaining: guestUsed ? 0 : 1,
      });
      setLoading(false);
      return;
    }

    try {
      // Check user role/subscription
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.uid)
        .single();

      const role = roleData?.role;
      const isPremium = role === "premium";
      const isStandard = role === "premium" || role === "free"; // Standard is between free and premium
      
      // Check subscription for more accurate tier
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("plan_type, status")
        .eq("user_id", user.uid)
        .single();

      let limits = FREE_LIMITS;
      let actualIsPremium = false;
      let actualIsStandard = false;

      if (subData && (subData.status === "active" || subData.status === "trialing")) {
        if (subData.plan_type === "premium") {
          limits = PREMIUM_LIMITS;
          actualIsPremium = true;
        } else if (subData.plan_type === "standard") {
          limits = STANDARD_LIMITS;
          actualIsStandard = true;
        }
      }

      // Get this month's usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: usageData } = await supabase
        .from("usage_tracking")
        .select("documents_generated, presentations_generated, spreadsheets_generated, voiceovers_generated, chat_messages, images_generated")
        .eq("user_id", user.uid)
        .gte("date", startOfMonth.toISOString().split("T")[0]);

      // Sum up monthly usage
      let totalDocuments = 0;
      let totalVoice = 0;
      let totalOther = 0;

      if (usageData) {
        usageData.forEach(day => {
          totalDocuments += (day.documents_generated || 0) + (day.presentations_generated || 0) + (day.spreadsheets_generated || 0);
          totalVoice += day.voiceovers_generated || 0;
          totalOther += (day.chat_messages || 0) + (day.images_generated || 0);
        });
      }

      // Calculate remaining credits (-1 means unlimited)
      const documentCreditsRemaining = limits.documentCredits === -1 ? -1 : Math.max(0, limits.documentCredits - totalDocuments);
      const voiceCreditsRemaining = limits.voiceCredits === -1 ? -1 : Math.max(0, limits.voiceCredits - totalVoice);
      const otherCreditsRemaining = limits.otherCredits === -1 ? -1 : Math.max(0, limits.otherCredits - totalOther);

      // Total remaining for display
      const totalRemaining = 
        (documentCreditsRemaining === -1 ? 999 : documentCreditsRemaining) +
        (voiceCreditsRemaining === -1 ? 999 : voiceCreditsRemaining) +
        (otherCreditsRemaining === -1 ? 999 : otherCreditsRemaining);

      setCreditInfo({
        remainingCredits: totalRemaining,
        maxCredits: actualIsPremium ? 500 : actualIsStandard ? 250 : 225,
        wordLimit: limits.wordLimit,
        isGuest: false,
        isPremium: actualIsPremium,
        isStandard: actualIsStandard,
        limits,
        documentCreditsRemaining,
        voiceCreditsRemaining,
        otherCreditsRemaining,
      });
    } catch (error) {
      console.error("Error fetching credits:", error);
      // Default to free user
      setCreditInfo({
        remainingCredits: FREE_LIMITS.documentCredits + FREE_LIMITS.voiceCredits + FREE_LIMITS.otherCredits,
        maxCredits: 225,
        wordLimit: FREE_LIMITS.wordLimit,
        isGuest: false,
        isPremium: false,
        isStandard: false,
        limits: FREE_LIMITS,
        documentCreditsRemaining: FREE_LIMITS.documentCredits,
        voiceCreditsRemaining: FREE_LIMITS.voiceCredits,
        otherCreditsRemaining: FREE_LIMITS.otherCredits,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const canGenerate = useCallback((category: ToolCategory = "document"): boolean => {
    if (creditInfo.isGuest) {
      return creditInfo.remainingCredits > 0;
    }

    switch (category) {
      case "document":
        return creditInfo.documentCreditsRemaining === -1 || creditInfo.documentCreditsRemaining > 0;
      case "voice":
        return creditInfo.voiceCreditsRemaining === -1 || creditInfo.voiceCreditsRemaining > 0;
      case "other":
        return creditInfo.otherCreditsRemaining === -1 || creditInfo.otherCreditsRemaining > 0;
      default:
        return creditInfo.remainingCredits > 0;
    }
  }, [creditInfo]);

  const useCredit = useCallback(async (category: ToolCategory = "document"): Promise<boolean> => {
    if (!canGenerate(category)) {
      return false;
    }

    if (!user) {
      // Guest user - mark credit as used
      localStorage.setItem(GUEST_CREDIT_KEY, "true");
      setCreditInfo((prev) => ({
        ...prev,
        remainingCredits: 0,
        documentCreditsRemaining: 0,
        voiceCreditsRemaining: 0,
        otherCreditsRemaining: 0,
      }));
      return true;
    }

    // For signed-in users, the credit is deducted server-side
    // Just update local state optimistically
    setCreditInfo((prev) => {
      const newInfo = { ...prev };
      switch (category) {
        case "document":
          if (prev.documentCreditsRemaining !== -1) {
            newInfo.documentCreditsRemaining = Math.max(0, prev.documentCreditsRemaining - 1);
          }
          break;
        case "voice":
          if (prev.voiceCreditsRemaining !== -1) {
            newInfo.voiceCreditsRemaining = Math.max(0, prev.voiceCreditsRemaining - 1);
          }
          break;
        case "other":
          if (prev.otherCreditsRemaining !== -1) {
            newInfo.otherCreditsRemaining = Math.max(0, prev.otherCreditsRemaining - 1);
          }
          break;
      }
      return newInfo;
    });
    return true;
  }, [user, canGenerate]);

  const getRemainingForCategory = useCallback((category: ToolCategory): number | "unlimited" => {
    switch (category) {
      case "document":
        return creditInfo.documentCreditsRemaining === -1 ? "unlimited" : creditInfo.documentCreditsRemaining;
      case "voice":
        return creditInfo.voiceCreditsRemaining === -1 ? "unlimited" : creditInfo.voiceCreditsRemaining;
      case "other":
        return creditInfo.otherCreditsRemaining === -1 ? "unlimited" : creditInfo.otherCreditsRemaining;
    }
  }, [creditInfo]);

  return {
    ...creditInfo,
    loading,
    canGenerate,
    useCredit,
    refetchCredits: fetchCredits,
    getRemainingForCategory,
  };
}
