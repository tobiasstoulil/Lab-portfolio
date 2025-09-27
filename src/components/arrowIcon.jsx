"use client";

import { motion, useAnimation } from "framer-motion";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const squareVariants = {
  normal: { transition: { duration: 0.4 } },
  animate: { transition: { duration: 0.6, ease: "easeInOut" } },
};

const pathVariants = {
  normal: { d: "m12 8-4 4 4 4", translateX: 0, opacity: 1 },
  animate: {
    d: "m12 8-4 4 4 4",
    translateX: [0, 3, 0],
    transition: { duration: 0.4 },
  },
};

const secondPathVariants = {
  normal: { d: "M16 12H8", opacity: 1 },
  animate: {
    d: ["M16 12H8", "M16 12H13", "M16 12H8"],
    transition: { duration: 0.4 },
  },
};

const SquareArrowLeftIcon = forwardRef(
  (
    { onMouseEnter, onMouseLeave, className, size = 28, isSwapper, ...props },
    ref
  ) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (!isControlledRef.current) controls.start("animate");
        else onMouseEnter?.(e);
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (!isControlledRef.current) controls.start("normal");
        else onMouseLeave?.(e);
      },
      [controls, onMouseLeave]
    );

    return (
      <motion.div
        style={{ filter: isSwapper ? "contrast(8%)" : "none" }}
        whileHover={{ filter: isSwapper ? "contrast(80%)" : "none" }}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.rect
            width="18"
            height="18"
            x="3"
            y="3"
            rx="2"
            variants={squareVariants}
            animate={controls}
            initial="normal"
          />
          <motion.path
            variants={pathVariants}
            animate={controls}
            initial="normal"
            d="m12 8-4 4 4 4"
          />
          <motion.path
            variants={secondPathVariants}
            animate={controls}
            initial="normal"
            d="M16 12H8"
          />
        </svg>
      </motion.div>
    );
  }
);

SquareArrowLeftIcon.displayName = "SquareArrowLeftIcon";

export { SquareArrowLeftIcon };
