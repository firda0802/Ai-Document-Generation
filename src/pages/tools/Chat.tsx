import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Brain, Loader2, MessageSquare, Bot, Paperclip, X, FileText, Image as ImageIcon, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders } from "@/hooks/useFirebaseAuth";
import { SEO } from "@/components/SEO";
import { ToolHero, ToolSuggestionCards } from "@/components/tools";
import { SEOArticle } from "@/components/seo/SEOArticle";
import { aiChatArticle } from "@/data/toolSEOArticles";
import { useTierCredits } from "@/hooks/useTierCredits";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

type Message = { role: "user" | "assistant"; content: string; attachments?: { name: string; type: string }[] };

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    creditLimit,
    creditsUsed,
    isPremium,
    loading: creditsLoading,
    getUpgradeMessage,
    refetch
  } = useTierCredits('chat_messages');
  
  const canSendMessage = creditsUsed < creditLimit;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (userMessage: Message) => {
    try {
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: [...messages, userMessage] },
        headers
      });

      if (error) {
        if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Daily chat limit reached. Please upgrade to premium for higher limits.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      const assistantContent = data?.choices?.[0]?.message?.content;
      if (assistantContent) {
        setMessages((prev) => [...prev, { role: "assistant", content: assistantContent }]);
        refetch(); // Refresh credits
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the AI chat.",
        variant: "destructive",
      });
      return;
    }

    if (!canSendMessage) {
      toast({
        title: "Credit Limit Reached",
        description: "You've used all your chat credits for today.",
        variant: "destructive",
      });
      return;
    }

    let content = input;
    if (attachments.length > 0) {
      content += `\n\n[Attached files: ${attachments.map(f => f.name).join(', ')}]`;
    }

    const userMsg: Message = { 
      role: "user", 
      content,
      attachments: attachments.map(f => ({ name: f.name, type: f.type }))
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    try {
      await sendMessage(userMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    "Help me write a professional email",
    "Explain this concept in simple terms",
    "Generate ideas for my project",
  ];

  return (
    <DashboardLayout>
      <SEO
        title="AI Chat - Free AI Assistant | mydocmaker"
        description="Chat with our advanced AI assistant. Get help with writing, research, and more."
        keywords="ai chat, free ai assistant, chatbot, writing assistant"
        canonical="/tools/chat"
      />
      
      <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-8rem)] flex flex-col">
        <ToolHero
          icon={MessageSquare}
          iconColor="text-cyan-500"
          title="AI Chat Assistant"
          subtitle="Ask anything, get instant answers"
          className="py-4"
        />

        {/* Credits Display */}
        {user && (
          <div className="mb-4 px-4 py-3 rounded-xl border border-border/50 bg-card/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-500" />
                Daily Chat Credits
              </span>
              <span className="text-sm text-muted-foreground">
                {creditsUsed} / {creditLimit === 999 ? '∞' : creditLimit} used
              </span>
            </div>
            {creditLimit !== 999 && (
              <>
                <Progress value={(creditsUsed / creditLimit) * 100} className="h-2" />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    {creditLimit - creditsUsed} messages remaining today
                  </p>
                  {!isPremium && (
                    <Link to="/dashboard/subscription" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {getUpgradeMessage()}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-border/50 bg-card overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-1">How can I help you today?</h2>
                <p className="text-muted-foreground text-sm">Ask me anything or upload files to analyze</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium">
                  <Brain className="w-3 h-3" />
                  Advanced AI
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                  <Paperclip className="w-3 h-3" />
                  File Upload
                </div>
              </div>

              <div className="w-full max-w-sm space-y-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2.5 px-4 text-sm hover:bg-cyan-500/10 hover:border-cyan-500/30"
                    onClick={() => setInput(prompt)}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-cyan-500" />
                    <span className="truncate">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-cyan-600 to-blue-500 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {message.attachments.map((att, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 text-xs">
                              {att.type.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                              {att.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border/50 p-4 bg-background/50">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
                    {file.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-cyan-500" /> : <FileText className="w-4 h-4 text-cyan-500" />}
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <button onClick={() => removeAttachment(index)} className="hover:text-destructive">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-11 w-11 shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="resize-none text-sm min-h-[44px] max-h-[120px]"
                rows={1}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0) || isLoading || !canSendMessage}
                size="icon"
                className="h-11 w-11 shrink-0 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600"
                title={!canSendMessage ? "No credits remaining" : "Send message"}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* SEO Article */}
        <div className="mt-6">
          <SEOArticle article={aiChatArticle} />
        </div>
      </div>
    </DashboardLayout>
  );
}
