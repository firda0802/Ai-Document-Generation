import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service | MyDocMaker"
        description="Read MyDocMaker's Terms of Service. Understand your rights and responsibilities when using our AI-powered document creation platform."
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">MyDocMaker</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link to="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 15, 2025</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using MyDocMaker ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you disagree with any part of these terms, you may not access the Service. These Terms apply to all 
                  visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  MyDocMaker is an AI-powered document creation platform that enables users to generate professional 
                  documents, presentations, spreadsheets, and other content. The Service includes various tools and 
                  features accessible through our web application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account with us, you must provide accurate, complete, and current information. 
                  Failure to do so constitutes a breach of the Terms, which may result in immediate termination of 
                  your account.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You are responsible for safeguarding your account password</li>
                  <li>You agree not to share your account credentials with third parties</li>
                  <li>You must notify us immediately upon becoming aware of any security breach</li>
                  <li>You are responsible for all activities that occur under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Some features of the Service are available on a subscription basis. By subscribing:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You authorize us to charge your payment method on a recurring basis</li>
                  <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                  <li>You may cancel your subscription at any time through your account settings</li>
                  <li>Refunds are provided in accordance with our refund policy (30-day money-back guarantee)</li>
                  <li>We reserve the right to modify pricing with 30 days advance notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Generate content that is illegal, harmful, threatening, or discriminatory</li>
                  <li>Infringe upon intellectual property rights of others</li>
                  <li>Distribute malware, spam, or engage in phishing activities</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Generate false, misleading, or deceptive content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Service and its original content, features, and functionality are owned by MyDocMaker and are 
                  protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Content you create using our Service remains your intellectual property. By using the Service, you 
                  grant us a limited license to process and store your content solely for the purpose of providing 
                  the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. AI-Generated Content</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Service uses artificial intelligence to generate content. You acknowledge that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>AI-generated content may not always be accurate or suitable for your purposes</li>
                  <li>You are responsible for reviewing and verifying all generated content</li>
                  <li>We do not guarantee the accuracy, completeness, or reliability of AI outputs</li>
                  <li>Generated content should not be used as professional legal, medical, or financial advice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall MyDocMaker, its directors, employees, partners, agents, suppliers, or affiliates 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including 
                  without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
                  from your access to or use of or inability to access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. MyDocMaker makes no warranties, 
                  expressed or implied, regarding the Service's operation, availability, or the information, content, 
                  or materials included therein.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any 
                  reason, including without limitation if you breach the Terms. Upon termination, your right to use 
                  the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we 
                  will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes 
                  a material change will be determined at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Email:</strong> legal@mydocmaker.com
                </p>
              </section>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
