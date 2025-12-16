import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Loader2, PenTool, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { saveGeneratedFile } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ToolHero, PromptInput, InsightCard, ToolSuggestionCards } from "@/components/tools";
import { SEOArticle } from "@/components/seo/SEOArticle";
import { aiWriterArticle } from "@/data/toolSEOArticles";

const MAX_PROMPT_LENGTH = 5000;

export default function AIWriter() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("formal");
  const [wordCount, setWordCount] = useState("500");
  const [language, setLanguage] = useState("english");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const fullPrompt = `Write ${wordCount} words in a ${tone} tone in ${language}. ${prompt}`;
      
      const { getAuthHeaders } = await import('@/hooks/useFirebaseAuth');
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { prompt: fullPrompt, type: 'writer' },
        headers
      });

      if (error) throw error;
      if (!data?.content) throw new Error("No content generated");

      setContent(data.content);
      
      if (user?.uid) {
        await saveGeneratedFile(
          user.uid,
          prompt.substring(0, 50) + "...",
          data.content,
          "writer"
        );
      }
      
      toast({
        title: "Success",
        description: "Content generated and saved!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard"
    });
  };

  return (
    <DashboardLayout>
      <SEO
        title="AI Writer - Free AI Writing Generator | mydocmaker"
        description="Create high-quality, professional content with our free AI writer. Generate blog posts, articles, emails, and more."
        keywords="AI writer, free AI writing, content generator, blog generator"
        canonical="/tools/writer"
      />
      
      <div className="max-w-4xl mx-auto px-4">
        <ToolHero
          icon={PenTool}
          iconColor="text-amber-500"
          title="AI Writer"
          subtitle="Create high-quality content in seconds with AI"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Main Input Card */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              placeholder="Write a professional email to request a meeting with a potential client about our new AI-powered productivity solution."
              maxLength={MAX_PROMPT_LENGTH}
              rows={5}
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tone</label>
                <Input
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Formal"
                  className="h-11 bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Word Count</label>
                <Input
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  placeholder="500"
                  className="h-11 bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-11 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          {/* Output */}
          {content && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-border/50 bg-card overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
                <h3 className="font-semibold">Generated Content</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleGenerate()}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
              </div>
            </motion.div>
          )}

          {/* Insight Card */}
          <InsightCard
            title="Need Longer Content?"
            description="Try our Document Creator for AI-generated documents up to 10,000+ words with professional formatting."
            actionText="Try Document Creator"
            actionLink="/tools/document-creator"
          />

          {/* Tool Suggestions */}
          <ToolSuggestionCards excludeLinks={["/tools/writer"]} />

          {/* SEO Article */}
          <SEOArticle article={aiWriterArticle} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
