import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getAuthHeaders } from "@/hooks/useFirebaseAuth";
import { 
  ImageIcon, 
  Sparkles, 
  Download, 
  Loader2, 
  Wand2,
  Crown,
  Palette
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const styles = [
  { value: "realistic", label: "Realistic", icon: "📷" },
  { value: "artistic", label: "Artistic", icon: "🎨" },
  { value: "minimalist", label: "Minimalist", icon: "◻️" },
  { value: "cartoon", label: "Cartoon", icon: "🎭" },
  { value: "3d", label: "3D Render", icon: "🧊" },
  { value: "vintage", label: "Vintage", icon: "📜" },
];

const examplePrompts = [
  "A serene mountain landscape at sunset with a crystal clear lake",
  "A futuristic city with flying cars and neon lights",
  "A cozy coffee shop interior with warm lighting and books",
  "An astronaut riding a horse on Mars",
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) {
        setIsPremium(false);
        setCheckingPremium(false);
        return;
      }
      
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.uid)
          .eq('status', 'active')
          .maybeSingle();
        
        setIsPremium(!!data);
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for your image.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, style },
        headers
      });

      if (error) {
        if (error.message?.includes('403') || error.message?.includes('Premium')) {
          toast({
            title: "Premium Feature",
            description: "AI Image Generation is available for premium users only.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setImageDescription(data.description);
        toast({
          title: "Image Generated!",
          description: "Your AI image has been created successfully.",
        });
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your image is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image. Try right-clicking and saving.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <SEO
        title="AI Image Generator - Create Stunning Images | mydocmaker"
        description="Generate beautiful AI images from text descriptions. Create realistic, artistic, or stylized images in seconds."
        keywords="ai image generator, text to image, ai art, image creation"
        canonical="/tools/image-generator"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mb-4">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">AI Image Generator</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with AI-powered image generation
          </p>
        </motion.div>

        {checkingPremium ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !isPremium ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
                <p className="text-muted-foreground mb-6">
                  AI Image Generation is available exclusively for premium subscribers. 
                  Upgrade now to create unlimited AI images!
                </p>
                <Link to="/dashboard/subscription">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Create Your Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Describe your image
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A magical forest with glowing mushrooms and fairy lights..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Style
                    </label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            <span className="flex items-center gap-2">
                              <span>{s.icon}</span>
                              <span>{s.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Try these prompts:
                    </p>
                    <div className="space-y-2">
                      {examplePrompts.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPrompt(example)}
                          className="w-full text-left text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Generated Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center">
                      <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Creating your masterpiece...</p>
                      <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="space-y-4">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={generatedImage}
                          alt={imageDescription || "AI Generated Image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {imageDescription && (
                        <p className="text-sm text-muted-foreground">{imageDescription}</p>
                      )}
                      <Button onClick={handleDownload} className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted/50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">Your generated image will appear here</p>
                      <p className="text-sm text-muted-foreground mt-1">Enter a prompt and click Generate</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
