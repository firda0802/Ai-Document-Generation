import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, FileText, Presentation, TableIcon, Play, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const DEMO_PROMPTS = {
  document: "Create a 3-page business proposal for implementing AI in customer service",
  presentation: "Create a 5-slide presentation about renewable energy solutions",
  spreadsheet: "Create a monthly budget tracker with expense categories"
};
const DEMO_RESULTS = {
  document: `# AI-Powered Customer Service Implementation Proposal

## Executive Summary
This proposal outlines the strategic implementation of artificial intelligence technologies to enhance our customer service operations, reduce response times, and improve customer satisfaction scores.

## Current Challenges
- Average response time: 24 hours
- Customer satisfaction: 72%
- Support team capacity: Limited
- Peak hour bottlenecks: Significant

## Proposed AI Solution
### Intelligent Chatbot System
- 24/7 availability
- Instant response to common queries
- Multi-language support
- Seamless handoff to human agents

### Benefits
- Reduce response time by 80%
- Handle 60% of queries automatically
- Increase customer satisfaction to 90%
- Scale support without proportional costs`,
  presentation: `Slide 1: Renewable Energy Solutions
The Future is Green

Slide 2: Why Renewable Energy?
• Climate change mitigation
• Energy independence
• Long-term cost savings
• Job creation

Slide 3: Solar Power
• Photovoltaic technology
• 20+ year lifespan
• Decreasing costs
• Residential & commercial applications

Slide 4: Wind Energy
• Onshore and offshore turbines
• Scalable installations
• Zero emissions
• Consistent energy production

Slide 5: Implementation Roadmap
Q1: Assessment & Planning
Q2: Infrastructure Setup
Q3: Installation & Testing
Q4: Full Deployment & Optimization`,
  spreadsheet: `Monthly Budget Tracker

Income:
Salary: $5,000
Freelance: $1,000
Total Income: $6,000

Fixed Expenses:
Rent: $1,500
Utilities: $200
Insurance: $300
Car Payment: $400
Phone: $80
Internet: $60
Total Fixed: $2,540

Variable Expenses:
Groceries: $600
Dining Out: $300
Entertainment: $200
Transportation: $150
Shopping: $250
Total Variable: $1,500

Savings:
Emergency Fund: $1,000
Retirement: $500
Investments: $460
Total Savings: $1,960

Summary:
Total Income: $6,000
Total Expenses: $4,040
Total Savings: $1,960
Balance: $0`
};
export function InteractiveDemo() {
  const [activeDemo, setActiveDemo] = useState<"document" | "presentation" | "spreadsheet" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const {
    toast
  } = useToast();
  const startDemo = (type: "document" | "presentation" | "spreadsheet") => {
    setActiveDemo(type);
    setPrompt(DEMO_PROMPTS[type]);
    setResult("");
  };
  const generateDemo = async () => {
    if (!activeDemo) return;
    setGenerating(true);
    setResult("");

    // Simulate AI generation with typing effect
    const demoText = DEMO_RESULTS[activeDemo];
    let currentText = "";
    for (let i = 0; i < demoText.length; i++) {
      currentText += demoText[i];
      setResult(currentText);

      // Variable speed for more natural feel
      const delay = demoText[i] === "\n" ? 50 : Math.random() * 20 + 10;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    setGenerating(false);
    toast({
      title: "Demo Complete!",
      description: "This is a preview of our AI capabilities. Sign up to create unlimited content."
    });
  };
  const resetDemo = () => {
    setActiveDemo(null);
    setResult("");
    setPrompt("");
  };
  return <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-primary-foreground">
            Try Our <span className="gradient-primary bg-clip-text text-transparent bg-primary-foreground">AI Tools</span> Now
          </h2>
          <p className="text-xl text-muted-foreground">
            See the power of AI content generation in action
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!activeDemo ? <motion.div key="selector" initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.95
        }} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 cursor-pointer hover-lift hover-glow transition-smooth" onClick={() => startDemo("document")}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Document Generator</h3>
                  <p className="text-muted-foreground">Create professional documents in seconds</p>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                </div>
              </Card>

              <Card className="p-6 cursor-pointer hover-lift hover-glow transition-smooth" onClick={() => startDemo("presentation")}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Presentation className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Presentation Maker</h3>
                  <p className="text-muted-foreground">Generate stunning slide decks instantly</p>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                </div>
              </Card>

              <Card className="p-6 cursor-pointer hover-lift hover-glow transition-smooth" onClick={() => startDemo("spreadsheet")}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <TableIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Spreadsheet Creator</h3>
                  <p className="text-muted-foreground">Build organized spreadsheets with AI</p>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                </div>
              </Card>
            </motion.div> : <motion.div key="demo" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="max-w-5xl mx-auto">
              <Card className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Interactive Demo
                  </h3>
                  <Button variant="outline" size="sm" onClick={resetDemo}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Another
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Prompt</label>
                    <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="resize-none" />
                  </div>

                  <Button onClick={generateDemo} disabled={generating} className="w-full gradient-primary text-white" size="lg">
                    {generating ? <>Generating...</> : <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Content
                      </>}
                  </Button>
                </div>

                {result && <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} className="bg-muted/50 rounded-lg p-6 min-h-[400px]">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {result}
                      {generating && <motion.span animate={{
                  opacity: [1, 0, 1]
                }} transition={{
                  repeat: Infinity,
                  duration: 0.8
                }} className="inline-block w-2 h-4 bg-primary ml-1" />}
                    </pre>
                  </motion.div>}
              </Card>
            </motion.div>}
        </AnimatePresence>
      </div>
    </section>;
}