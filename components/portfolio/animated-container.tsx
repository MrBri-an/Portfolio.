"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

type AnimatedContainerProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function AnimatedContainer({
  children,
  className,
  delay = 0,
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
