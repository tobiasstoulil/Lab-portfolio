import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";

import assets from "../../assets/index";
import useStats from "../../stores/useStats";
import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(TextPlugin);

CustomEase.create("hop", "0.8, 0., 0.3, 1.");

const Index = () => {
  // console.log("loader r");

  const handleScopeAnim = useStats.getState().handleScopeAnim;

  const loaderRef = useRef(null);

  const textContainerRef = useRef(null);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      gsap.delayedCall(0.125, () => {
        gsap.to(textContainerRef.current, {
          opacity: 0,
          duration: 1,
          delay: 0.75,
          ease: "hop",
          onStart: () => {
            // gsap.set(".paragraph .line span", { y: "-100%" });

            gsap.delayedCall(1.2, () => {
              handleScopeAnim();
            });
          },
        });

        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 1,
          delay: 1.9,
          ease: "hop",

          onComplete: () => {
            gsap.delayedCall(1, () => {
              loaderRef.current.remove();
            });
          },
        });
      });
    }
  }, [progress]);

  return (
    <div
      ref={loaderRef}
      // style={{ opacity: 0.98 }}
      className="fixed z-[60] inset-0 h-[100svh] w-full flex justify-center items-center bg-white"
    >
      <div
        ref={textContainerRef}
        className="flex flex-row items-center justify-between gap-3 overflow-hidden"
      >
        <span>{progress.toFixed(0)}</span>
      </div>
    </div>
  );
};

export default Index;
