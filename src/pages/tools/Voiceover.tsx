import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Download, Play, Pause, Loader2, Volume2, Wand2, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { fileHistoryDb } from "@/lib/databaseProxy";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { getAuthHeaders } from "@/hooks/useFirebaseAuth";
import { ToolHero, PromptInput, InsightCard, ToolSuggestionCards } from "@/components/tools";
import { SEOArticle } from "@/components/seo/SEOArticle";
import { aiVoiceGeneratorArticle } from "@/data/toolSEOArticles";
import { useTierCredits } from "@/hooks/useTierCredits";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const MAX_TEXT_LENGTH = 5000;

const VOICE_OPTIONS = [
  { id: "aria-female", name: "Aria", gender: "Female", description: "Natural, warm voice" },
  { id: "roger-male", name: "Roger", gender: "Male", description: "Professional, clear" },
  { id: "sarah-female", name: "Sarah", gender: "Female", description: "Friendly, energetic" },
  { id: "laura-female", name: "Laura", gender: "Female", description: "Calm, soothing" },
  { id: "charlie-male", name: "Charlie", gender: "Male", description: "Casual, friendly" },
  { id: "george-male", name: "George", gender: "Male", description: "Deep, authoritative" },
  { id: "callum-male", name: "Callum", gender: "Male", description: "Young, dynamic" },
  { id: "river-neutral", name: "River", gender: "Neutral", description: "Modern, versatile" },
  { id: "liam-male", name: "Liam", gender: "Male", description: "Warm, engaging" },
  { id: "charlotte-female", name: "Charlotte", gender: "Female", description: "Elegant, refined" },
];

const MODEL_OPTIONS = [
  { id: "eleven_turbo_v2_5", name: "Turbo v2.5", description: "Fast, 32 languages" },
  { id: "eleven_multilingual_v2", name: "Multilingual v2", description: "Best quality, 29 languages" },
  { id: "eleven_turbo_v2", name: "Turbo v2", description: "English only, fastest" },
];

export default function Voiceover() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("aria-female");
  const [model, setModel] = useState("eleven_turbo_v2_5");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const {
    creditLimit,
    creditsUsed,
    isPremium,
    loading: creditsLoading,
    getUpgradeMessage,
    refetch
  } = useTierCredits('voiceovers_generated');

  if (authLoading || creditsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
            <Volume2 className="h-6 w-6 text-primary" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const canGenerate = creditsUsed < creditLimit;

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (!canGenerate) {
      toast({
        title: "Credit Limit Reached",
        description: "You've used all your voiceover credits for today.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAudioUrl("");

    try {
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke('generate-voiceover', {
        body: { text, voice, model },
        headers
      });

      if (error) throw error;
      if (!data?.audio) throw new Error("No audio generated");

      const byteCharacters = atob(data.audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);

      await fileHistoryDb.insert({
        title: text.substring(0, 50),
        content: text,
        file_type: 'voiceover',
      });

      refetch(); // Refresh credits

      toast({
        title: "Success!",
        description: "Your voiceover has been generated.",
      });
    } catch (error: any) {
      console.error("Voice generation error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to generate voiceover. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `voiceover-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Downloaded!",
      description: "Your voiceover has been downloaded.",
    });
  };

  const selectedVoice = VOICE_OPTIONS.find(v => v.id === voice);

  return (
    <DashboardLayout>
      <SEO
        title="AI Voice Generator - Free Text to Speech | mydocmaker"
        description="Convert text to natural-sounding speech with our free AI voice generator. 20+ premium voices, multiple languages, instant download."
        keywords="ai voice generator, text to speech, ai voiceover, free voice generator"
        canonical="/tools/voice-generator"
      />
      
      <div className="max-w-4xl mx-auto px-4">
        <ToolHero
          icon={Volume2}
          iconColor="text-violet-500"
          title="AI Voice Generator"
          subtitle="Convert text to natural-sounding speech in seconds"
        />

        {/* Credits Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-500" />
                  Daily Voiceover Credits
                </span>
                <span className="text-sm text-muted-foreground">
                  {creditsUsed} / {creditLimit} used
                </span>
              </div>
              <Progress value={(creditsUsed / creditLimit) * 100} className="h-2" />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  {creditLimit - creditsUsed} credits remaining today
                </p>
                {!isPremium && (
                  <Link to="/dashboard/subscription" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    {getUpgradeMessage()}
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Main Input Card */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
            <PromptInput
              value={text}
              onChange={setText}
              placeholder="Enter the text you want to convert to speech... For example: Welcome to mydocmaker, your AI-powered document generation solution."
              maxLength={MAX_TEXT_LENGTH}
              rows={5}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Voice</label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger className="h-11 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px]">
                    {VOICE_OPTIONS.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        <div className="flex flex-col">
                          <span>{v.name} ({v.gender})</span>
                          <span className="text-xs text-muted-foreground">{v.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Quality</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-11 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col">
                          <span>{m.name}</span>
                          <span className="text-xs text-muted-foreground">{m.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedVoice && (
              <div className="p-3 bg-violet-500/10 rounded-lg text-sm border border-violet-500/20">
                <span className="text-violet-600 dark:text-violet-400 font-medium">Selected:</span> {selectedVoice.name} - {selectedVoice.description}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white" 
              size="lg"
              disabled={loading || !text.trim() || !canGenerate}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Voice...
                </>
              ) : !canGenerate ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  No Credits Remaining
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Voiceover (1 credit)
                </>
              )}
            </Button>
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-border/50 bg-card p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Voiceover</h3>
                  <p className="text-sm text-muted-foreground">Ready to play and download</p>
                </div>
              </div>
              
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                className="hidden"
              />

              <div className="flex gap-3">
                <Button onClick={handlePlay} variant="outline" className="flex-1 h-11">
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleDownload} 
                  className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download MP3
                </Button>
              </div>
            </motion.div>
          )}

          {/* Insight Card */}
          <InsightCard
            title="20+ Premium Voices"
            description="Choose from a variety of natural-sounding voices in multiple languages. Perfect for podcasts, videos, and presentations."
          />

          {/* Tool Suggestions */}
          <ToolSuggestionCards excludeLinks={["/tools/voice-generator"]} />

          {/* SEO Article */}
          <SEOArticle article={aiVoiceGeneratorArticle} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
