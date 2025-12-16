import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { FileText, Users, Clock, Award } from "lucide-react";
import { useEffect, useRef } from "react";

interface Stat {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  {
    icon: <FileText className="w-8 h-8" />,
    value: 500000,
    label: "Documents Created",
    suffix: "+",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 50000,
    label: "Active Users",
    suffix: "+",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    value: 99.9,
    label: "Uptime",
    suffix: "%",
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 98,
    label: "Satisfaction Rate",
    suffix: "%",
  },
];

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        const roundedValue = value % 1 !== 0 ? latest.toFixed(1) : Math.round(latest);
        ref.current.textContent = 
          Intl.NumberFormat("en-US").format(Number(roundedValue)) + suffix;
      }
    });
  }, [springValue, suffix, value]);

  return <span ref={ref} />;
};

export const StatsTracker = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the growing community of professionals using MyDocMaker
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
            >
              <div className="text-primary mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
