import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { InteractiveLogo } from "@/components/InteractiveLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cookies Policy - MyDocMaker"
        description="Learn how MyDocMaker uses cookies and similar technologies to improve your experience on our platform."
      />

      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <InteractiveLogo size="md" />
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Cookies Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 19, 2025</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your overall experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                MyDocMaker uses cookies and similar technologies for several purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To keep you signed in to your account</li>
                <li>To remember your preferences and settings</li>
                <li>To understand how you use our platform</li>
                <li>To improve our services and user experience</li>
                <li>To provide relevant content and features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium mb-3">Essential Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, account authentication, and session management. You cannot opt out of these cookies.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Session cookies, authentication tokens, security cookies</p>
              </div>

              <h3 className="text-xl font-medium mb-3">Functional Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies enable enhanced functionality and personalization. They remember your preferences like language settings, theme (dark/light mode), and other customizations.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Language preferences, theme settings, recently used features</p>
              </div>

              <h3 className="text-xl font-medium mb-3">Analytics Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Google Analytics, page view tracking, feature usage metrics</p>
              </div>

              <h3 className="text-xl font-medium mb-3">Marketing Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are used to track visitors across websites to display relevant advertisements. They help measure the effectiveness of our marketing campaigns.
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Advertising cookies, conversion tracking, retargeting pixels</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Firebase:</strong> For authentication and user management</li>
                <li><strong>Intercom/Support tools:</strong> For customer support chat functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookie Duration</h2>
              <p className="text-muted-foreground mb-4">
                Cookies can remain on your device for different periods of time:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them (typically 30 days to 2 years)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground mb-4">
                You have several options for managing cookies:
              </p>
              
              <h3 className="text-xl font-medium mb-3">Browser Settings</h3>
              <p className="text-muted-foreground mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>View what cookies are stored on your device</li>
                <li>Delete all or specific cookies</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies (note: this may affect website functionality)</li>
                <li>Clear cookies when you close your browser</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">Cookie Consent Banner</h3>
              <p className="text-muted-foreground">
                When you first visit our website, you'll see a cookie consent banner. You can choose to accept all cookies or customize your preferences. You can change your preferences at any time by clicking the cookie settings link in the footer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground mb-4">
                If you choose to disable cookies, please be aware that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You may not be able to stay logged in to your account</li>
                <li>Your preferences may not be saved between visits</li>
                <li>Some features of our platform may not work correctly</li>
                <li>You may see less relevant content and advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Do Not Track</h2>
              <p className="text-muted-foreground">
                Some browsers have a "Do Not Track" feature that sends a signal to websites requesting that your browsing is not tracked. Our website currently does not respond to "Do Not Track" signals, but you can use browser settings and extensions to limit tracking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookies Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically. The "Last updated" date at the top indicates when this policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@mydocmaker.com" className="text-primary hover:underline">privacy@mydocmaker.com</a>{" "}
                or visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
