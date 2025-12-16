import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Eye, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

interface RightSidebarProps {
  previewContent?: string;
  onAIAssist?: (prompt: string) => void;
}

// Sanitize HTML content to prevent XSS
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'br', 'span', 'div', 'a'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  });
}

export function RightSidebar({ previewContent, onAIAssist }: RightSidebarProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      if (onAIAssist) {
        await onAIAssist(userMessage);
      }
      
      // Simulate AI response for now
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I can help you improve your document. Try asking me to make specific changes!" 
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full hidden lg:flex">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="chat" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Ask AI to help improve your content</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground ml-4" 
                      : "bg-muted mr-4"
                  }`}
                >
                  <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask AI to improve content..."
                className="resize-none text-sm"
                rows={2}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <Button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 overflow-y-auto m-0 p-4">
          {previewContent ? (
            <Card className="p-6">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(previewContent) }}
              />
            </Card>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Preview will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
