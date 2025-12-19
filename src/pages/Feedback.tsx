import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { InteractiveLogo } from "@/components/InteractiveLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Send, Lightbulb, Bug, Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  type: z.enum(["feature", "bug", "improvement", "other"], { required_error: "Please select a feedback type" }),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  rating: z.string().optional(),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

const feedbackTypes = [
  { id: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggest a new feature" },
  { id: "bug", label: "Bug Report", icon: Bug, description: "Report an issue" },
  { id: "improvement", label: "Improvement", icon: Star, description: "Suggest an improvement" },
  { id: "other", label: "Other", icon: MessageSquare, description: "General feedback" },
];

export default function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackForm, string>>>({});
  const [formData, setFormData] = useState<FeedbackForm>({
    name: "",
    email: "",
    type: "feature",
    subject: "",
    message: "",
    rating: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = feedbackSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FeedbackForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FeedbackForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Thank you for your feedback! We appreciate your input and will review it carefully.");
    setFormData({ name: "", email: "", type: "feature", subject: "", message: "", rating: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Feedback - MyDocMaker"
        description="Share your feedback, suggestions, and feature requests to help us improve MyDocMaker."
      />

      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <InteractiveLogo size="md" />
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Share Your Feedback</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your feedback helps us improve MyDocMaker. Tell us about features you'd like to see, issues you've encountered, or any suggestions you have.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Feedback Type */}
            <div className="space-y-4">
              <Label className="text-base font-medium">What type of feedback do you have?</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id as FeedbackForm["type"] })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      formData.type === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <type.icon className={`h-6 w-6 mx-auto mb-2 ${formData.type === type.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
            </div>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief summary of your feedback"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={errors.subject ? "border-destructive" : ""}
              />
              {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Your Feedback</Label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible..."
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={errors.message ? "border-destructive" : ""}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                {errors.message ? (
                  <p className="text-destructive">{errors.message}</p>
                ) : (
                  <span>Minimum 10 characters</span>
                )}
                <span>{formData.message.length}/2000</span>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How would you rate your experience? (Optional)</Label>
              <RadioGroup
                value={formData.rating}
                onValueChange={(value) => setFormData({ ...formData, rating: value })}
                className="flex gap-4"
              >
                {["1", "2", "3", "4", "5"].map((rating) => (
                  <div key={rating} className="flex flex-col items-center gap-2">
                    <RadioGroupItem value={rating} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="text-2xl cursor-pointer">
                      {rating === "1" ? "😞" : rating === "2" ? "😐" : rating === "3" ? "🙂" : rating === "4" ? "😊" : "🤩"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>
            For urgent issues, please contact us at{" "}
            <a href="mailto:maheerkhan3a@gmail.com" className="text-primary hover:underline">
              maheerkhan3a@gmail.com
            </a>{" "}
            or call{" "}
            <a href="tel:+923369183893" className="text-primary hover:underline">
              +92 336 9183893
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
