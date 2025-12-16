import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Loader2, BookOpen, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { saveGeneratedFile } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ToolHero, PromptInput, InsightCard, ToolSuggestionCards } from "@/components/tools";
import { SEOArticle } from "@/components/seo/SEOArticle";
import { aiStoryGeneratorArticle } from "@/data/toolSEOArticles";

const MAX_PROMPT_LENGTH = 5000;

export default function AIStoryGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("creative");
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
      const fullPrompt = `Write a creative story of approximately ${wordCount} words in a ${tone} tone in ${language}. ${prompt}`;
      
      const { getAuthHeaders } = await import('@/hooks/useFirebaseAuth');
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { prompt: fullPrompt, type: 'story' },
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
          "story"
        );
      }
      
      toast({
        title: "Success",
        description: "Story generated and saved!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate story.",
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
      description: "Story copied to clipboard"
    });
  };

  return (
    <DashboardLayout>
      <SEO
        title="AI Story Generator - Create Engaging Stories | mydocmaker"
        description="Generate creative stories, narratives, and fiction with our free AI story generator."
        keywords="AI story generator, story writer, creative writing AI"
        canonical="/tools/story-generator"
      />
      
      <div className="max-w-4xl mx-auto px-4">
        <ToolHero
          icon={BookOpen}
          iconColor="text-teal-500"
          title="AI Story Generator"
          subtitle="Create engaging stories and narratives with AI"
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
              placeholder="Write a story about a happy elephant who discovers a magical forest filled with ancient secrets..."
              maxLength={MAX_PROMPT_LENGTH}
              rows={5}
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tone</label>
                <Input
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Creative, Dramatic..."
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
              className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Writing Story...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Story
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
                <h3 className="font-semibold">Your Story</h3>
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
              <div className="p-6 bg-gradient-to-br from-teal-500/5 to-cyan-500/5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
              </div>
            </motion.div>
          )}

          {/* Insight Card */}
          <InsightCard
            title="Unlimited Creative Writing"
            description="Generate stories in any genre - fantasy, sci-fi, romance, mystery, and more. Perfect for authors, content creators, and storytellers."
          />

          {/* Tool Suggestions */}
          <ToolSuggestionCards excludeLinks={["/tools/story-generator"]} />

          {/* SEO Article */}
          <SEOArticle article={aiStoryGeneratorArticle} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
