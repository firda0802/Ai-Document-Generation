export interface CompetitorFeature {
  feature: string;
  mydocmaker: boolean | string;
  competitor1: boolean | string;
  competitor2: boolean | string;
  competitor3: boolean | string;
}

export const competitorFeatures: CompetitorFeature[] = [
  {
    feature: "AI-Powered Generation",
    mydocmaker: true,
    competitor1: true,
    competitor2: "Limited",
    competitor3: false
  },
  {
    feature: "Real-time Collaboration",
    mydocmaker: true,
    competitor1: "Paid Only",
    competitor2: true,
    competitor3: false
  },
  {
    feature: "Multiple Export Formats",
    mydocmaker: "PDF, DOCX, PPTX, TXT",
    competitor1: "PDF, DOCX",
    competitor2: "PDF Only",
    competitor3: "PDF, DOCX"
  },
  {
    feature: "Custom Templates",
    mydocmaker: "100+",
    competitor1: "50+",
    competitor2: "20+",
    competitor3: "30+"
  },
  {
    feature: "Document Version History",
    mydocmaker: true,
    competitor1: "Paid Only",
    competitor2: false,
    competitor3: "Limited"
  },
  {
    feature: "API Access",
    mydocmaker: true,
    competitor1: "Enterprise Only",
    competitor2: false,
    competitor3: "Paid Only"
  },
  {
    feature: "Custom Branding",
    mydocmaker: true,
    competitor1: "Enterprise Only",
    competitor2: false,
    competitor3: true
  },
  {
    feature: "Priority Support",
    mydocmaker: true,
    competitor1: "Paid Only",
    competitor2: "Enterprise Only",
    competitor3: false
  },
  {
    feature: "Offline Mode",
    mydocmaker: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "Starting Price",
    mydocmaker: "$0/mo",
    competitor1: "$15/mo",
    competitor2: "$25/mo",
    competitor3: "$12/mo"
  }
];

export const competitors = {
  mydocmaker: {
    name: "MyDocMaker",
    highlighted: true
  },
  competitor1: {
    name: "Competitor A"
  },
  competitor2: {
    name: "Competitor B"
  },
  competitor3: {
    name: "Competitor C"
  }
};
