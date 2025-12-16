import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Editor } from "@tiptap/react";

interface AISuggestionsProps {
  editor: Editor | null;
  currentContent: string;
}

export const AISuggestions = ({ editor, currentContent }: AISuggestionsProps) => {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSuggestion = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe what you need help with",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const enhancedPrompt = `Based on this document context: "${currentContent.substring(0, 500)}..."
      
User request: ${prompt}

Provide a concise, helpful suggestion or content that can be added to the document.`;

      const { getAuthHeaders } = await import('@/hooks/useFirebaseAuth');
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { prompt: enhancedPrompt, type: 'writer' },
        headers
      });

      if (error) throw error;
      if (!data?.content) throw new Error("No content generated");

      setSuggestion(data.content);
      setPrompt("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate suggestion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInsertSuggestion = () => {
    if (editor && suggestion) {
      editor.chain().focus().insertContent(suggestion).run();
      toast({
        title: "Inserted!",
        description: "AI suggestion added to your document",
      });
      setSuggestion("");
      setPrompt("");
    }
  };

  const quickPrompts = [
    "Continue writing from where I left off",
    "Make this paragraph more professional",
    "Add a conclusion to this section",
    "Summarize the main points",
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        <CardDescription>Get real-time writing suggestions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Prompts */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((quickPrompt) => (
              <Button
                key={quickPrompt}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(quickPrompt)}
                className="text-xs"
              >
                {quickPrompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI for help... (e.g., 'Add statistics about climate change' or 'Make this more engaging')"
            className="min-h-[100px]"
          />
          <Button
            onClick={handleGenerateSuggestion}
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Suggestion
              </>
            )}
          </Button>
        </div>

        {/* Suggestion Display */}
        {suggestion && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">AI Suggestion</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuggestion("")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm max-h-[300px] overflow-y-auto">
              {suggestion}
            </div>
            <Button onClick={handleInsertSuggestion} className="w-full">
              Insert into Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
