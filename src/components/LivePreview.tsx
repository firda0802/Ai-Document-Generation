import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle2 } from "lucide-react";

interface LivePreviewProps {
  prompt: string;
  isActive?: boolean;
}

export function LivePreview({ prompt, isActive = true }: LivePreviewProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const sampleDocument = `# ${prompt}

## Executive Summary
This document provides a comprehensive analysis and detailed exploration of the topic at hand. Our research indicates significant opportunities for growth and innovation in this area.

## Introduction
In today's rapidly evolving landscape, it's crucial to understand the key factors that drive success. This report examines the critical elements that contribute to effective implementation and sustainable results.

## Key Findings
1. Market analysis shows strong potential for expansion
2. Competitive advantages identified in multiple sectors
3. Implementation timeline optimized for efficiency
4. Resource allocation aligned with strategic objectives

## Analysis
The comprehensive review of current trends reveals several important insights that inform our strategic approach...`;

  useEffect(() => {
    if (!isActive) {
      setDisplayedText("");
      setIsComplete(false);
      setProgress(0);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    setProgress(0);

    let currentIndex = 0;
    const typingSpeed = 15; // milliseconds per character

    const typingInterval = setInterval(() => {
      if (currentIndex < sampleDocument.length) {
        setDisplayedText(sampleDocument.slice(0, currentIndex + 1));
        setProgress((currentIndex / sampleDocument.length) * 100);
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [isActive, prompt]);

  return (
    <Card className="p-6 bg-muted/30 border-2 relative overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />

      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">Generating Document...</h3>
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            {isComplete ? "Document generated successfully" : "AI is writing your document..."}
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-sm">
        <div className="whitespace-pre-wrap">
          {displayedText}
          {!isComplete && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-primary ml-1"
            />
          )}
        </div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          ✨ Ready to download, edit, or export
        </motion.div>
      )}
    </Card>
  );
}
