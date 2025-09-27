import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const CIRCLES = [
  { cx: 19, cy: 5 }, // Top right
  { cx: 12, cy: 5 }, // Top middle
  { cx: 19, cy: 12 }, // Middle right
  { cx: 5, cy: 5 }, // Top left
  { cx: 12, cy: 12 }, // Center
  { cx: 19, cy: 19 }, // Bottom right
  { cx: 5, cy: 12 }, // Middle left
  { cx: 12, cy: 19 }, // Bottom middle
  { cx: 5, cy: 19 }, // Bottom left
];

const GripIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: async () => setIsHovered(true),
        stopAnimation: () => setIsHovered(false),
      };
    });

    useEffect(() => {
      const animateCircles = async () => {
        if (isHovered) {
          await controls.start((i) => ({
            opacity: 0.3,
            transition: {
              delay: i * 0.1,
              duration: 0.2,
            },
          }));
          await controls.start((i) => ({
            opacity: 1,
            transition: {
              delay: i * 0.1,
              duration: 0.2,
            },
          }));
        }
      };

      animateCircles();
    }, [isHovered, controls]);

    return (
      <div className={className} {...props}>
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
          <AnimatePresence>
            {CIRCLES.map((circle, index) => (
              <motion.circle
                key={`${circle.cx}-${circle.cy}`}
                cx={circle.cx}
                cy={circle.cy}
                r="1"
                initial="initial"
                variants={{
                  initial: {
                    opacity: 1,
                  },
                }}
                animate={controls}
                exit="initial"
                custom={index}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
    );
  }
);

GripIcon.displayName = "GripIcon";

export { GripIcon };
