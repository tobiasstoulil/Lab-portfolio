import { motion, useAnimation } from "framer-motion";
import React, { useImperativeHandle, useRef, forwardRef } from "react";

const arrowVariants = {
  normal: {
    rotate: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  },
  scale: {
    scale: 0.875,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 30,
    },
  },
};

const ArrowStraight = forwardRef(({ fill = "#fff", className = "" }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      scaleInAnimation: () => controls.start("scale"),
      scaleOutAnimation: () => controls.start("normal"),
    };
  });

  return (
    <motion.div
      ref={ref}
      className="realative h-full w-full flex justify-center items-center pointer-events-none"
      style={{ willChange: "transform" }}
      variants={arrowVariants}
      animate={controls}
    >
      <motion.svg
        className={className}
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.7071 8.70711C14.0976 8.31658 14.0976 7.68342 13.7071 7.29289L7.34315 0.928932C6.95262 0.538408 6.31946 0.538408 5.92893 0.928932C5.53841 1.31946 5.53841 1.95262 5.92893 2.34315L11.5858 8L5.92893 13.6569C5.53841 14.0474 5.53841 14.6805 5.92893 15.0711C6.31946 15.4616 6.95262 15.4616 7.34315 15.0711L13.7071 8.70711ZM0 8L0 9L13 9V8V7L0 7L0 8Z"
          fill={fill}
        />
      </motion.svg>
    </motion.div>
  );
});

export default ArrowStraight;
