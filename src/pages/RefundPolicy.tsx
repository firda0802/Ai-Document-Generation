import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { InteractiveLogo } from "@/components/InteractiveLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Refund Policy - MyDocMaker"
        description="Learn about MyDocMaker's refund policy for subscription plans. Understand our cancellation and refund process."
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
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 19, 2025</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-muted-foreground">
                At MyDocMaker, we want you to be completely satisfied with your subscription. This refund policy outlines the terms and conditions for refunds on our subscription plans.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Subscription Plans</h2>
              <p className="text-muted-foreground mb-4">
                MyDocMaker offers monthly and annual subscription plans. Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Monthly Plans:</strong> Billed monthly, can be cancelled anytime</li>
                <li><strong>Annual Plans:</strong> Billed yearly at a discounted rate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
              <h3 className="text-xl font-medium mb-3">Full Refunds</h3>
              <p className="text-muted-foreground mb-4">You may be eligible for a full refund if:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You request a refund within 7 days of your initial subscription purchase</li>
                <li>You have not exceeded 50% of your monthly credit allocation</li>
                <li>This is your first refund request with MyDocMaker</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">Partial Refunds</h3>
              <p className="text-muted-foreground mb-4">Partial refunds may be considered if:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You experience significant technical issues that prevent you from using the service</li>
                <li>The service was unavailable for an extended period during your billing cycle</li>
                <li>You were incorrectly charged due to a billing error</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Non-Refundable Situations</h2>
              <p className="text-muted-foreground mb-4">Refunds will not be provided in the following cases:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Requests made after the 7-day refund window</li>
                <li>If you have used a significant portion of your credits</li>
                <li>For unused portions of annual subscriptions after the 7-day period</li>
                <li>If your account was terminated due to violation of our Terms of Service</li>
                <li>For promotional or discounted subscriptions (unless otherwise stated)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
              <p className="text-muted-foreground mb-4">To request a refund:</p>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                <li>Email our support team at <a href="mailto:support@mydocmaker.com" className="text-primary hover:underline">support@mydocmaker.com</a></li>
                <li>Include your account email and the reason for your refund request</li>
                <li>Provide your order or transaction ID if available</li>
                <li>Our team will review your request within 3-5 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Processing</h2>
              <p className="text-muted-foreground mb-4">
                Once your refund is approved:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Refunds will be processed to the original payment method</li>
                <li>Credit card refunds may take 5-10 business days to appear on your statement</li>
                <li>You will receive an email confirmation once the refund is processed</li>
                <li>Your subscription will be cancelled immediately upon refund approval</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cancellation vs. Refund</h2>
              <p className="text-muted-foreground mb-4">
                Cancelling your subscription and requesting a refund are different:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Cancellation:</strong> Stops future billing but allows you to use the service until the end of your current billing period</li>
                <li><strong>Refund:</strong> Returns your payment and immediately terminates access to premium features</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can cancel your subscription anytime from your account settings without requesting a refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Free Trial</h2>
              <p className="text-muted-foreground">
                If you signed up for a free trial, you will not be charged until the trial period ends. You can cancel your trial at any time before it expires to avoid being charged.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our refund policy, please contact us at{" "}
                <a href="mailto:support@mydocmaker.com" className="text-primary hover:underline">support@mydocmaker.com</a>{" "}
                or visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
