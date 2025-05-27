import React, { useLayoutEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const FollowerPointerCard = ({ children, className, title }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const ref = useRef(null);
  const pointerRef = useRef(null);

  useLayoutEffect(() => {
    const updatePosition = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();

      // Calculate cursor position relative to the element
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update position
      setPosition({ x, y });
    };

    if (isInside) {
      window.addEventListener("mousemove", updatePosition);
    }

    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, [isInside]);

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  const handleMouseLeave = () => {
    setIsInside(false);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", className)}
    >
      <AnimatePresence>
        {isInside && (
          <FollowPointer
            ref={pointerRef}
            x={position.x}
            y={position.y}
            title={title}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export const FollowPointer = React.forwardRef(({ x, y, title }, ref) => {
  const pointerOffsetX = -15;
  const pointerOffsetY = -15;

  return (
    <motion.div
      ref={ref}
      className="absolute z-10 "
      style={{
        top: y - pointerOffsetY,
        left: x - pointerOffsetX,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      
      <motion.div
        style={{ backgroundColor: "black" }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="px-2 py-2 bg-neutral-200 text-white whitespace-nowrap min-w-max text-xs rounded-full"
      >
        {title || "Robert Nicuta"}
      </motion.div>
    </motion.div>
  );
});

// Add display name for React DevTools
FollowPointer.displayName = "FollowPointer";
