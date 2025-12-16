import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, X, Crown } from "lucide-react";
import { competitorFeatures, competitors } from "@/data/competitors";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const renderValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-5 h-5 text-primary mx-auto" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground mx-auto" />
    );
  }
  return <span className="text-sm">{value}</span>;
};

export const CompetitorComparison = () => {
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
            Why Choose <span className="text-primary">MyDocMaker</span>?
          </h2>
          <p className="text-xl text-muted-foreground">
            See how we compare to other document generation tools
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 bg-muted/50">
                    <th className="p-4 text-left font-bold min-w-[200px]">
                      Features
                    </th>
                    <th className="p-4 text-center min-w-[150px] bg-primary/10 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Best Value
                      </div>
                      <div className="pt-4 font-bold text-primary">
                        {competitors.mydocmaker.name}
                      </div>
                    </th>
                    <th className="p-4 text-center min-w-[150px]">
                      <div className="font-semibold text-muted-foreground">
                        {competitors.competitor1.name}
                      </div>
                    </th>
                    <th className="p-4 text-center min-w-[150px]">
                      <div className="font-semibold text-muted-foreground">
                        {competitors.competitor2.name}
                      </div>
                    </th>
                    <th className="p-4 text-center min-w-[150px]">
                      <div className="font-semibold text-muted-foreground">
                        {competitors.competitor3.name}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competitorFeatures.map((feature, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium">{feature.feature}</td>
                      <td className="p-4 text-center bg-primary/5">
                        <div className="flex items-center justify-center font-semibold">
                          {renderValue(feature.mydocmaker)}
                        </div>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {renderValue(feature.competitor1)}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {renderValue(feature.competitor2)}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {renderValue(feature.competitor3)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="text-center mt-12">
            <Link to="/pricing">
              <Button size="lg" className="px-12">
                Get Started with MyDocMaker
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
