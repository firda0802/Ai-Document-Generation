import { useState } from "react";
import { motion } from "framer-motion";
import logoImage from "@/assets/logo.jpg";

interface InteractiveLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const InteractiveLogo = ({ size = "md", showText = true }: InteractiveLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: { box: "w-8 h-8", text: "text-lg" },
    md: { box: "w-10 h-10", text: "text-xl" },
    lg: { box: "w-14 h-14", text: "text-2xl" },
  };

  return (
    <motion.div
      className="flex items-center gap-2 cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className={`${sizes[size].box} rounded-xl overflow-hidden relative`}
        animate={{
          rotate: isHovered ? [0, -5, 5, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
      >
        <img 
          src={logoImage} 
          alt="mydocmaker logo" 
          className="w-full h-full object-contain"
        />
        
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {showText && (
        <span className={`${sizes[size].text} font-semibold tracking-tight text-foreground`}>
          mydocmaker
        </span>
      )}
    </motion.div>
  );
};
