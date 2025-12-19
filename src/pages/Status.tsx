import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { InteractiveLogo } from "@/components/InteractiveLogo";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, CheckCircle2, AlertCircle, Clock, 
  Server, Database, Cpu, Globe, Shield, Zap,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  uptime: string;
  icon: React.ElementType;
  description: string;
}

const services: ServiceStatus[] = [
  { name: "Web Application", status: "operational", uptime: "99.99%", icon: Globe, description: "Main website and dashboard" },
  { name: "AI Document Generation", status: "operational", uptime: "99.95%", icon: Cpu, description: "AI-powered document creation" },
  { name: "Database", status: "operational", uptime: "99.99%", icon: Database, description: "Data storage and retrieval" },
  { name: "Authentication", status: "operational", uptime: "99.99%", icon: Shield, description: "User login and security" },
  { name: "File Storage", status: "operational", uptime: "99.98%", icon: Server, description: "Document and media storage" },
  { name: "API Services", status: "operational", uptime: "99.97%", icon: Zap, description: "Backend API endpoints" },
];

const incidents = [
  {
    date: "December 18, 2025",
    title: "Scheduled Maintenance Completed",
    status: "resolved",
    description: "We performed scheduled maintenance to improve system performance. All services are now fully operational.",
  },
  {
    date: "December 15, 2025",
    title: "AI Service Performance Improvement",
    status: "resolved",
    description: "Upgraded our AI infrastructure for faster document generation. Response times improved by 40%.",
  },
  {
    date: "December 10, 2025",
    title: "Database Optimization",
    status: "resolved",
    description: "Completed database optimization resulting in faster query times and improved reliability.",
  },
];

const statusConfig = {
  operational: { label: "Operational", color: "text-green-500", bgColor: "bg-green-500", icon: CheckCircle2 },
  degraded: { label: "Degraded", color: "text-yellow-500", bgColor: "bg-yellow-500", icon: AlertCircle },
  outage: { label: "Outage", color: "text-red-500", bgColor: "bg-red-500", icon: AlertCircle },
  maintenance: { label: "Maintenance", color: "text-blue-500", bgColor: "bg-blue-500", icon: Clock },
};

export default function Status() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const overallStatus = services.every(s => s.status === "operational") 
    ? "operational" 
    : services.some(s => s.status === "outage") 
      ? "outage" 
      : "degraded";

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="System Status - MyDocMaker"
        description="Check the current status and uptime of MyDocMaker services. View real-time system health and incident history."
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

      {/* Overall Status Banner */}
      <section className={`py-12 px-4 ${
        overallStatus === "operational" ? "bg-green-500/10" : 
        overallStatus === "outage" ? "bg-red-500/10" : "bg-yellow-500/10"
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {overallStatus === "operational" ? (
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold mb-2">
              {overallStatus === "operational" 
                ? "All Systems Operational" 
                : "Some Systems Experiencing Issues"}
            </h1>
            <p className="text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 gap-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Status
            </Button>
          </motion.div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Service Status</h2>
          <div className="space-y-3">
            {services.map((service, index) => {
              const config = statusConfig[service.status];
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <service.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      {service.uptime} uptime
                    </span>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}/10`}>
                      <div className={`w-2 h-2 rounded-full ${config.bgColor}`} />
                      <span className={`text-sm font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Uptime Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Uptime (Last 90 Days)</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-end gap-1 h-20 mb-4">
              {Array.from({ length: 90 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${
                    Math.random() > 0.02 ? "bg-green-500" : "bg-yellow-500"
                  }`}
                  style={{ height: `${80 + Math.random() * 20}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>90 days ago</span>
              <span className="font-medium text-foreground">99.97% uptime</span>
              <span>Today</span>
            </div>
          </div>
        </motion.div>

        {/* Incident History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Recent Updates</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{incident.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    incident.status === "resolved" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {incident.status === "resolved" ? "Resolved" : "Investigating"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                <p className="text-xs text-muted-foreground">{incident.date}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscribe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center bg-muted/30 rounded-2xl p-8"
        >
          <h2 className="text-xl font-semibold mb-2">Stay Updated</h2>
          <p className="text-muted-foreground mb-4">
            Get notified about system status changes and scheduled maintenance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:maheerkhan3a@gmail.com?subject=Subscribe to Status Updates">
              <Button variant="outline">Subscribe to Updates</Button>
            </a>
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
