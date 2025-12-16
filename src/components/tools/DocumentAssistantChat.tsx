import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Loader2, MessageSquare, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ChatSettingsPanel, ChatSettings, DEFAULT_CHAT_SETTINGS } from "./ChatSettingsPanel";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DocumentAssistantChatProps {
  onSendMessage: (message: string, settings?: ChatSettings) => Promise<string>;
  isLoading?: boolean;
  previewContent?: React.ReactNode;
  placeholder?: string;
  suggestions?: string[];
  showSettings?: boolean;
  /**
   * If provided, chat messages are persisted to localStorage under this key.
   * Use a per-document key to restore conversations later.
   */
  persistenceKey?: string;
}

export function DocumentAssistantChat({
  onSendMessage,
  isLoading = false,
  previewContent,
  placeholder = "Type a message or paste a screenshot...",
  suggestions = [
    "Make it more professional",
    "Add more details",
    "Rewrite with a different tone",
    "Add a summary section"
  ],
  showSettings = true,
  persistenceKey,
}: DocumentAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");
  const [sending, setSending] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings>(DEFAULT_CHAT_SETTINGS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore persisted messages
  useEffect(() => {
    if (!persistenceKey) return;
    try {
      const raw = localStorage.getItem(persistenceKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Array<{ role: "user" | "assistant"; content: string; timestamp: string }>;
      setMessages(
        parsed.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : String(m.content ?? ""),
          timestamp: new Date(m.timestamp),
        }))
      );
    } catch (e) {
      console.warn("Failed to restore chat history", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistenceKey]);

  // Persist messages
  useEffect(() => {
    if (!persistenceKey) return;
    try {
      localStorage.setItem(
        persistenceKey,
        JSON.stringify(
          messages.map((m) => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content : String(m.content ?? ""),
            timestamp: m.timestamp.toISOString(),
          }))
        )
      );
    } catch {
      // ignore quota or serialization errors
    }
  }, [messages, persistenceKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const responseRaw = await onSendMessage(userMessage.content, chatSettings);
      const response = typeof responseRaw === "string" ? responseRaw : String(responseRaw ?? "");

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "chat" | "preview")} className="flex flex-col h-full">
        <div className="border-b border-border px-4 py-2">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm">Auto Mode</span>
                  <span className="text-xs">• Ready to help</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ask me to modify your document. Try:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {(sending || isLoading) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyzing...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border space-y-3">
            {showSettings && (
              <div className="flex items-center justify-between">
                <ChatSettingsPanel 
                  settings={chatSettings} 
                  onSettingsChange={setChatSettings} 
                />
                <span className="text-[10px] text-muted-foreground capitalize">
                  {chatSettings.tone} • {chatSettings.responseLength}
                </span>
              </div>
            )}
            
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="min-h-[80px] pr-12 resize-none"
                disabled={sending || isLoading}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || sending || isLoading}
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-foreground hover:bg-foreground/90"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-background" />
                ) : (
                  <Send className="h-4 w-4 text-background" />
                )}
              </Button>
            </div>
            
            <p className="text-[10px] text-muted-foreground text-center">
              AI may make mistakes or be overly agreeable. Check important work.
            </p>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="flex-1 m-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4">
              {previewContent || (
                <div className="text-center text-muted-foreground py-12">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No preview available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
