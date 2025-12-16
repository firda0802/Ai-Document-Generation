export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  content: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp Inc.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
    content: "MyDocMaker has revolutionized our content creation process. We've cut document preparation time by 70% and the quality is exceptional."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Content Manager",
    company: "Digital Solutions",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 5,
    content: "The AI-powered features are incredibly intuitive. Our team can now focus on strategy rather than formatting and basic writing tasks."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Freelance Writer",
    company: "Self-Employed",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5,
    content: "As a freelancer, this tool has been a game-changer. I can deliver high-quality documents to clients faster than ever before."
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Project Manager",
    company: "Innovate Co.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 4,
    content: "Outstanding tool for creating professional presentations and reports. The templates save us countless hours every week."
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Business Analyst",
    company: "Growth Ventures",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    rating: 5,
    content: "The collaboration features are excellent. Our remote team can work together seamlessly on documents in real-time."
  }
];
