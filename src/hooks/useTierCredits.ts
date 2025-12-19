import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ToolCategory = 
  | 'images_generated'
  | 'videos_generated'
  | 'chat_messages'
  | 'voiceovers_generated'
  | 'documents_generated'
  | 'presentations_generated'
  | 'spreadsheets_generated';

export type UserTier = 'free' | 'standard' | 'premium';

// Define limits per tier for each tool
const TIER_LIMITS: Record<ToolCategory, Record<UserTier, number>> = {
  images_generated: { free: 10, standard: 50, premium: 100 },
  videos_generated: { free: 2, standard: 10, premium: 30 },
  chat_messages: { free: 50, standard: 200, premium: 999 }, // 999 = effectively unlimited
  voiceovers_generated: { free: 5, standard: 25, premium: 100 },
  documents_generated: { free: 5, standard: 25, premium: 100 },
  presentations_generated: { free: 3, standard: 15, premium: 50 },
  spreadsheets_generated: { free: 5, standard: 25, premium: 100 },
};

interface UseTierCreditsResult {
  tier: UserTier;
  isPremium: boolean;
  isStandard: boolean;
  creditLimit: number;
  creditsUsed: number;
  creditsRemaining: number;
  loading: boolean;
  refetch: () => Promise<void>;
  getUpgradeMessage: () => string;
}

export function useTierCredits(category: ToolCategory): UseTierCreditsResult {
  const { user } = useAuth();
  const [tier, setTier] = useState<UserTier>('free');
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.uid)
        .maybeSingle();

      const userTier = (roleData?.role as UserTier) || 'free';
      setTier(userTier);

      // Get today's usage
      const today = new Date().toISOString().split('T')[0];
      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select(category)
        .eq('user_id', user.uid)
        .eq('date', today)
        .maybeSingle();

      setCreditsUsed(usageData?.[category] || 0);
    } catch (error) {
      console.error('Error fetching tier credits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user?.uid, category]);

  const creditLimit = TIER_LIMITS[category][tier];
  const creditsRemaining = Math.max(0, creditLimit - creditsUsed);
  const isPremium = tier === 'premium';
  const isStandard = tier === 'standard';

  const getUpgradeMessage = (): string => {
    const standardLimit = TIER_LIMITS[category].standard;
    const premiumLimit = TIER_LIMITS[category].premium;
    
    if (tier === 'free') {
      return `Upgrade for ${standardLimit}/day`;
    } else if (tier === 'standard') {
      return `Upgrade to Premium for ${premiumLimit}/day`;
    }
    return '';
  };

  return {
    tier,
    isPremium,
    isStandard,
    creditLimit,
    creditsUsed,
    creditsRemaining,
    loading,
    refetch: fetchCredits,
    getUpgradeMessage,
  };
}

// Export limits for reference
export { TIER_LIMITS };
