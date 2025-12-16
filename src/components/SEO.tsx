import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

// Default comprehensive keywords for the homepage
const DEFAULT_KEYWORDS = "mydocmaker, aidocmaker, mydocmaker.com, ai tools free, best free ai generators, ai productivity suite, all-in-one ai tools, ai writer free, ai document generator, ai word document generator free, ai presentation maker, ai ppt maker free, ai spreadsheet generator, free ai excel formula generator, ai chat bot free, ai helper online, chatgpt alternatives, ai voice generator, text to speech ai, ai story writer free, ai pdf file generator free, ai powered tools, best free ai solutions, ai assignment generator";

export function SEO({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  ogType = "website",
}: SEOProps) {
  const fullTitle = title.includes("MyDocMaker") ? title : `${title} | MyDocMaker`;
  const siteUrl = window.location.origin;
  const pageUrl = canonical ? `${siteUrl}${canonical}` : window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "MyDocMaker",
          "description": description,
          "url": siteUrl,
          "applicationCategory": "ProductivityApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
          },
        })}
      </script>
    </Helmet>
  );
}
