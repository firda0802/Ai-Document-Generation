export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface CreditLimits {
  documentCredits: number; // doc gen, presentation, spreadsheet
  voiceCredits: number; // voice generator
  otherCredits: number; // chat, story, writer, etc.
  documentsPerDay: number;
  presentationsPerDay: number;
  wordLimit: number;
  hasUnlimitedChat: boolean;
  hasGemini3Access: boolean;
  hasMaxIntelligenceAI: boolean;
  hasAPIAccess: boolean;
}

export const FREE_LIMITS: CreditLimits = {
  documentCredits: 25,
  voiceCredits: 50,
  otherCredits: 150,
  documentsPerDay: 5,
  presentationsPerDay: 5,
  wordLimit: 1000,
  hasUnlimitedChat: false,
  hasGemini3Access: false,
  hasMaxIntelligenceAI: false,
  hasAPIAccess: false,
};

export const STANDARD_LIMITS: CreditLimits = {
  documentCredits: 250,
  voiceCredits: -1, // unlimited
  otherCredits: -1, // unlimited
  documentsPerDay: -1, // unlimited
  presentationsPerDay: -1, // unlimited
  wordLimit: 5000,
  hasUnlimitedChat: true,
  hasGemini3Access: true,
  hasMaxIntelligenceAI: false,
  hasAPIAccess: false,
};

export const PREMIUM_LIMITS: CreditLimits = {
  documentCredits: 500,
  voiceCredits: -1, // unlimited
  otherCredits: -1, // unlimited
  documentsPerDay: -1, // unlimited
  presentationsPerDay: -1, // unlimited
  wordLimit: 10000,
  hasUnlimitedChat: true,
  hasGemini3Access: true,
  hasMaxIntelligenceAI: true,
  hasAPIAccess: true,
};

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with MyDocMaker",
    features: [
      "25 credits/month for documents",
      "50 credits/month for voice",
      "150 credits/month for other tools",
      "5 documents per day",
      "5 presentations per day",
      "Basic AI chat",
      "PDF & DOCX export",
      "1000 words per file"
    ],
    cta: "Get Started"
  },
  {
    id: "standard",
    name: "Standard",
    price: 9,
    period: "month",
    description: "For professionals",
    features: [
      "250 generation credits/month",
      "Unlimited other tools",
      "Unlimited documents",
      "Unlimited AI chat",
      "All export formats",
      "Priority support",
      "5000 words per file",
      "Access to Gemini 3"
    ],
    highlighted: true,
    cta: "Start Free Trial"
  },
  {
    id: "premium",
    name: "Premium",
    price: 12,
    period: "month",
    description: "Maximum power",
    features: [
      "500 generation credits/month",
      "Everything in Standard",
      "Max Intelligence AI",
      "Access to Gemini 3 & Nano Banana",
      "10000 words per file",
      "API access",
      "Dedicated support",
      "Premium documents"
    ],
    cta: "Start Free Trial"
  }
];
