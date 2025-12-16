import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy | MyDocMaker"
        description="Learn how MyDocMaker protects your privacy. Read our comprehensive privacy policy covering data collection, usage, and your rights."
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
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 15, 2025</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to MyDocMaker. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, disclose, and safeguard your information when you 
                  use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-medium mb-3">2.1 Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Name and email address</li>
                  <li>Phone number (if using phone authentication)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Profile information and preferences</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">2.2 Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We automatically collect certain information when you use the Service:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and features used</li>
                  <li>Time and date of visits</li>
                  <li>Documents and content you create (to provide the Service)</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">2.3 Cookies and Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our Service and hold certain 
                  information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions</li>
                  <li>Personalize and improve your experience</li>
                  <li>Send promotional communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. AI Processing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Service uses artificial intelligence to generate content. When you use AI features:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Your prompts and inputs are processed by AI models to generate outputs</li>
                  <li>We do not use your content to train our AI models without explicit consent</li>
                  <li>Generated content may be temporarily stored to provide the Service</li>
                  <li>You retain ownership of content you create</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (payment processing, hosting, analytics)</li>
                  <li><strong>Legal Requirements:</strong> If required by law or to respond to valid legal processes</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> For any other purpose with your explicit consent</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                  policy, unless a longer retention period is required by law. When you delete your account, we will 
                  delete or anonymize your personal information within 30 days, except where we need to retain it for 
                  legal purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to processing of your personal data</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us at privacy@mydocmaker.com.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure 
                  appropriate safeguards are in place to protect your information in accordance with this privacy policy 
                  and applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Children&apos;s Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect personal 
                  information from children under 13. If we discover that a child under 13 has provided us with personal 
                  information, we will delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the 
                  new policy on this page and updating the "Last updated" date. You are advised to review this policy 
                  periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="mt-4 text-muted-foreground space-y-1">
                  <p><strong>Email:</strong> privacy@mydocmaker.com</p>
                  <p><strong>Legal Inquiries:</strong> legal@mydocmaker.com</p>
                </div>
              </section>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
