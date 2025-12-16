import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  { id: 1, title: "How to Create Professional Documents with AI", category: "Tutorial", readTime: "5 min", date: "2024-01-15", excerpt: "Learn how to leverage AI to create stunning professional documents in minutes." },
  { id: 2, title: "10 Tips for Better Presentations", category: "Tips", readTime: "7 min", date: "2024-01-12", excerpt: "Master the art of creating engaging presentations that captivate your audience." },
  { id: 3, title: "AI Writing: The Future of Content Creation", category: "Insights", readTime: "6 min", date: "2024-01-10", excerpt: "Discover how AI is revolutionizing the way we create and consume content." },
  { id: 4, title: "Spreadsheet Automation Made Easy", category: "Tutorial", readTime: "8 min", date: "2024-01-08", excerpt: "Automate your spreadsheet workflows with AI-powered tools." },
  { id: 5, title: "Voice Generation: Text to Speech Guide", category: "Guide", readTime: "4 min", date: "2024-01-05", excerpt: "Transform your text into natural-sounding voice with our AI voice generator." },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg">Tips, tutorials, and insights about AI-powered document creation</p>
        </motion.div>

        <div className="grid gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> MyDocMaker Team</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
