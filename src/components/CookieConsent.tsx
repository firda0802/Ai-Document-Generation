import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "mydocmaker_cookie_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ 
      accepted: true, 
      preferences: { essential: true, analytics: true, marketing: true },
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ 
      accepted: true, 
      preferences: { essential: true, analytics: false, marketing: false },
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ 
      accepted: false, 
      preferences: { essential: true, analytics: false, marketing: false },
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-sm overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">We value your privacy</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                          By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>{" "}
                          for more information.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 -mt-1 -mr-2"
                        onClick={handleDecline}
                        aria-label="Close cookie banner"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleAcceptAll}
                        className="gradient-primary"
                      >
                        Accept All
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleAcceptEssential}
                      >
                        Essential Only
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={handleDecline}
                        className="text-muted-foreground"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
