import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Play, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const highlights = [
  "Generate professional documents in seconds",
  "Edit and refine with AI assistance",
  "Collaborate with your team in real-time",
  "Export to any format you need"
];

export const VideoDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See MyDocMaker in <span className="text-primary">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch how easy it is to create professional documents with AI-powered assistance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative aspect-video overflow-hidden bg-muted border-2 hover:border-primary transition-colors group">
              {!isPlaying ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <img
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                  >
                    <div className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-6 transition-all group-hover:scale-110">
                      <Play className="w-12 h-12 ml-1" fill="currentColor" />
                    </div>
                  </button>
                </>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="MyDocMaker Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </Card>
            <p className="text-sm text-muted-foreground text-center mt-4">
              2-minute product demo • No sign-up required
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold mb-6">
              Everything you need to create amazing documents
            </h3>
            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{highlight}</span>
                </motion.li>
              ))}
            </ul>
            <div className="pt-4">
              <Card className="p-6 bg-primary/5 border-primary/20">
                <p className="text-lg font-semibold mb-2">
                  Ready to get started?
                </p>
                <p className="text-muted-foreground">
                  Join thousands of professionals already using MyDocMaker to streamline their document creation workflow.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
