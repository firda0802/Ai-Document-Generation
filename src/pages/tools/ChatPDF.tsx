import { useState, useRef } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, FileText, Upload, Trash2, FileSearch, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ToolHero, ToolSuggestionCards } from "@/components/tools";
import { SEOArticle } from "@/components/seo/SEOArticle";
import { chatPDFArticle } from "@/data/toolSEOArticles";
import { getAuthHeaders } from "@/hooks/useFirebaseAuth";

export default function ChatPDF() {
  const { user, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center animate-pulse">
            <FileSearch className="h-6 w-6 text-pink-500" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a PDF smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    setUploadingPdf(true);
    setMessages([]);
    setPdfContent("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setPdfContent(base64);
        
        toast({
          title: "PDF uploaded",
          description: "You can now ask questions about this document.",
        });
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not process the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!file || !pdfContent) {
      toast({
        title: "Upload a PDF first",
        variant: "destructive",
      });
      return;
    }

    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion("");

    try {
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke('chat-pdf', {
        body: { 
          pdfContent,
          question: currentQuestion,
          fileName: file.name
        },
        headers,
      });

      if (error) throw error;

      const aiResponse = {
        role: "assistant",
        content: data?.response || "I couldn't analyze the document. Please try again."
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error: any) {
      console.error("Question error:", error);
      toast({
        title: "Failed to process question",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setFile(null);
    setPdfContent("");
  };

  const suggestedQuestions = [
    "Summarize this document",
    "What are the key points?",
    "Explain the main concepts"
  ];

  return (
    <DashboardLayout>
      <SEO
        title="Chat with PDF - AI Document Q&A | mydocmaker"
        description="Ask questions about your PDF documents with AI. Upload any PDF and get instant answers."
        keywords="chat with pdf, pdf chat ai, ai pdf reader"
        canonical="/tools/chat-pdf"
      />
      
      <div className="max-w-4xl mx-auto px-4">
        <ToolHero
          icon={FileSearch}
          iconColor="text-pink-500"
          title="Chat with PDF"
          subtitle="Ask questions about your documents"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Upload Section */}
          {!file ? (
            <div 
              className="rounded-2xl border-2 border-dashed border-border/50 bg-card p-8 text-center hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadingPdf ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 animate-spin text-pink-500 mb-3" />
                  <p className="text-sm text-muted-foreground">Processing PDF...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Upload a PDF</h3>
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-2">Max 10MB</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* File Info */}
              <div className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClearChat}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4">
                        <FileSearch className="h-7 w-7 text-pink-500" />
                      </div>
                      <p className="font-medium mb-1">Ask about your PDF</p>
                      <p className="text-sm text-muted-foreground mb-4">Try one of these:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {suggestedQuestions.map((q) => (
                          <Button
                            key={q}
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-pink-500/10 hover:border-pink-500/30"
                            onClick={() => setQuestion(q)}
                          >
                            <Sparkles className="h-3 w-3 mr-1 text-pink-500" />
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <AnimatePresence>
                        {messages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                                msg.role === "user"
                                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {loading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-muted px-4 py-3 rounded-2xl flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
                            <span className="text-sm">Analyzing...</span>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-border/50 p-4 bg-background/50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask a question about your PDF..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !loading && handleAskQuestion()}
                      disabled={loading}
                      className="h-11"
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={loading || !question.trim()}
                      size="icon"
                      className="h-11 w-11 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tool Suggestions */}
          <ToolSuggestionCards excludeLinks={["/tools/chat-pdf"]} />

          {/* SEO Article */}
          <SEOArticle article={chatPDFArticle} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
