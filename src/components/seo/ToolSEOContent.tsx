import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Sparkles, Zap, Shield, Globe, Users, Star } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface Feature {
  title: string;
  description: string;
}

interface ToolSEOContentProps {
  toolName: string;
  toolDescription: string;
  features: Feature[];
  faqs: FAQ[];
  benefits: string[];
  useCases: string[];
  keywords: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export function ToolSEOContent({
  toolName,
  toolDescription,
  features,
  faqs,
  benefits,
  useCases,
  keywords
}: ToolSEOContentProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="py-12 md:py-16 space-y-12"
    >
      {/* Main Description */}
      <motion.div variants={itemVariants} className="prose prose-lg max-w-none">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          What is {toolName}?
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {toolDescription}
        </p>
      </motion.div>

      {/* Key Features */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Key Features of Our {toolName}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div variants={itemVariants} className="bg-muted/30 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Benefits of Using {toolName}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-foreground">{benefit}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Use Cases */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Popular Use Cases for {toolName}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-background hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{useCase}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold text-foreground mb-8">
          How to Use {toolName}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Enter Your Prompt</h3>
            <p className="text-muted-foreground text-sm">
              Describe what you want to create in natural language
            </p>
          </div>
          <div className="text-center p-6 border rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">AI Generates Content</h3>
            <p className="text-muted-foreground text-sm">
              Our advanced AI creates high-quality content instantly
            </p>
          </div>
          <div className="text-center p-6 border rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Download & Share</h3>
            <p className="text-muted-foreground text-sm">
              Edit, download, or share your content instantly
            </p>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div variants={itemVariants} className="bg-primary/5 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Why Choose MyDocMaker's {toolName}?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Generate content in seconds</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">Your data is always protected</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-3">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Multi-Language</h3>
            <p className="text-sm text-muted-foreground">Support for 50+ languages</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">1M+ Users</h3>
            <p className="text-sm text-muted-foreground">Trusted by millions worldwide</p>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Frequently Asked Questions About {toolName}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* SEO Keywords Footer */}
      <motion.div variants={itemVariants} className="pt-8 border-t">
        <p className="text-sm text-muted-foreground mb-4">Related searches:</p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
