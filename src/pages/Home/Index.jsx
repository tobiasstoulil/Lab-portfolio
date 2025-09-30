import React, { useEffect, useMemo, useRef, useState } from "react";
import useIsSmallScreen from "../../utils/useClickTrig";
import gsap from "gsap";
import { splitTextElements } from "../../utils/gsapUtils";
import useStats from "../../stores/useStats";
import { exitAnim, initialAnim } from "./anims";
import { GripIcon } from "./GripIcon";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import assets from "../../assets";
import { Helmet } from "react-helmet-async";
import Swapper from "../../components/Swapper/Swapper";
import useClickTrigger from "../../utils/useClickTrig";

const HomePage = () => {
  console.log("home r");

  const isSmallScreen = useIsSmallScreen();
  const [isMobile, setIsMobile] = useState(false);
  const links = useMemo(() => {
    return assets.find((asset) => asset.name === "links")?.items;
  }, [assets]);
  const icons = useMemo(() => {
    return assets.find((asset) => asset.name === "icons")?.items;
  }, [assets]);

  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    resize();
    window.addEventListener("resize", resize);
  }, []);

  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gripRef = useRef(null);
  const authorRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const delayRef = useRef(false);
  const isClickedRef = useRef(false);
  const isWhite = true;

  useClickTrigger(() => setIsOpen(() => false));

  useEffect(() => {
    splitTextElements(titleRef.current, "chars");
    splitTextElements(subtitleRef.current, "chars");

    gsap.set(titleRef.current.querySelectorAll(".char span"), {
      y: "-100%",
      opacity: 0,
    });
    gsap.set(subtitleRef.current.querySelectorAll(".char span"), {
      y: "-100%",
      opacity: 0,
    });

    gsap.set(authorRef.current, {
      opacity: 0,
    });
    gsap.set(headerRef.current, {
      opacity: 0,
    });

    const unsubscribe = useStats.subscribe(
      (state) => state.scopeAnim,
      (value, prevValue) => {
        // console.log(value);

        const tl = gsap.timeline({
          defaults: {
            ease: "hop",
            delay: 0.375,
            onComplete: () => {},
          },
        });

        tl.to(
          authorRef.current,
          {
            opacity: 1,
            duration: 0.75,
          },
          1.75
        );

        tl.to(
          headerRef.current,
          {
            opacity: 1,
            duration: 0.75,
          },
          1.125
        );

        tl.to(
          titleRef.current.querySelectorAll(".char span"),
          {
            y: 0,
            opacity: 1,
            duration: 1.25,
            stagger: 0.15,
          },
          0
        );
        tl.to(
          subtitleRef.current.querySelectorAll(".char span"),
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.01,
          },
          0.625
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {/* <Helmet>
        <title>Lab - Tobias Stoulil</title>
        <meta
          name="description"
          content="Playground of 3D experiments using webgl, three.js, Blender. Web projects and 3D renders."
        />
        <link rel="canonical" href="https://www.tobiasstoulil.com/" />
      </Helmet> */}

      <div
        ref={pageRef}
        // style={{ pointerEvents: "none" }}
        className="pointer-events-auto absolute z-0 inset-0 h-[100svh] w-full max-w-[1920px] mx-auto bg-transparent font-main
      flex flex-col justify-between items-center pt-6 md:pt-[4rem] pb-6 md:pb-[3rem] px-6 md:px-20"
      >
        <div className="relative mx-auto w-full h-20 flex flex-row justify-between items-start">
          <div className="w-full flex flex-row justify-between items-start">
            <div className="relative flex flex-col gap-0 md:gap-2 font-main">
              <p
                ref={titleRef}
                className="translate-x-[-2px] md:translate-x-[-6px] normal-case text-white text-[4rem] md:text-[8rem] !font-[400] tracking-[-0.0275em] leading-[1.25] md:leading-[0.9]"
              >
                Lab
              </p>
              <p
                ref={subtitleRef}
                className="max-w-[220px] md:max-w-[280px] normal-case text-white text-[0.75rem] md:text-[1rem] leading-[1.1] !font-[400] tracking-[-0.0375em]"
              >
                Showcase of my latest projects, designs and experiments, more on{" "}
                <span
                  onClick={() => window.open("https://x.com/tobias_stoulil")}
                  className="cursor-pointer !font-[500] underline"
                >
                  X
                </span>
              </p>
            </div>

            {/*  */}
            <header
              ref={headerRef}
              style={{ opacity: 0, willChange: "opacity" }}
              className="mt-[18px] mr-2 flex items-center justify-center"
            >
              <div
                id="trigger"
                className="flex flex-col items-center justify-center"
              >
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id="menu"
                      className="z-40 absolute h-[520px] w-[325px] -top-[calc(4px-18px)] -right-[calc(6px-9px)] bg-black 
              flex flex-col items-center justify-between rounded-br-[30px] rounded-tl-[30px] shadow-2xl
              origin-[90% 7.5%] scale-[0] md:scale-100
              "
                      style={{
                        backgroundColor: isWhite ? "white" : "black",
                        transformOrigin: "90% 7.5%",
                      }}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: isMobile ? 0.75 : 0.925,
                        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                      }}
                      exit={{
                        scale: 0,
                        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                      }}
                    >
                      <nav className="relative w-full">
                        <ul className="pl-9 flex flex-col items-start justify-start gap-3 pt-[5rem]">
                          {links.map((link) => {
                            return (
                              <li
                                id="trigger"
                                to={link.route}
                                key={link.text}
                                onClick={(e) => {
                                  // console.log(delayRef.current);
                                  if (delayRef.current) {
                                    e.preventDefault();
                                    return;
                                  }
                                  delayRef.current = true;

                                  window.location.href =
                                    "https://www.tobiasstoulil.com/" +
                                    link.route;
                                  setTimeout(() => {
                                    delayRef.current = false;
                                  }, 1500);
                                }}
                                style={{
                                  willChange: "transform",
                                  color: isWhite
                                    ? link.text === "Lab"
                                      ? "#bbbbbb"
                                      : "black"
                                    : "white",
                                }}
                                className="cursor-pointer group relative font-main uppercase text-[3.375rem] leading-[1]
                      hover:translate-x-3 transition-transform duration-[500ms] ease-[cubic-bezier(0.1,0,0.3,1)]
                      "
                              >
                                {link.text}
                              </li>
                            );
                          })}
                        </ul>
                      </nav>

                      <div
                        className="w-full flex flex-row items-center justify-between
            pb-6 pl-[22px]
            "
                      >
                        {/* <Magnetic> */}
                        <div
                          // style={{ willChange: "transform" }}
                          className="py-4 px-4"
                        >
                          <div
                            onClick={() => {
                              window.location.href =
                                "https://www.tobiasstoulil.com/contact";
                            }}
                            style={{
                              willChange: "transform",
                              borderColor: isWhite ? "black" : "white",
                            }}
                            className="cursor-pointer flex flex-row items-center justify-between
              pl-4 pr-3 py-1.5 text-base border-2 rounded-3xl border-white
              font-inter-black gap-2 hover:translate-y-[-3px] transition-transform duration-[400ms] ease-[cubic-bezier(0.1,0,0.3,1)]
              "
                          >
                            <button
                              style={{ color: isWhite ? "black" : "white" }}
                              className="select-none font-inter-black text-nowrap text-base !font-[500]"
                            >
                              Get in touch
                            </button>

                            <svg
                              style={{
                                filter: isWhite ? "invert(0)" : "invert(1)",
                              }}
                              className="scale-[0.85]"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                            >
                              <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
                            </svg>
                          </div>
                        </div>

                        <div
                          className="relative h-fit flex flex-row justify-center items-center
                gap-1.5 mr-[30px] 
              "
                        >
                          {icons.map((icon, index) => {
                            if (!icon.src.includes("github")) {
                              return (
                                <img
                                  onClick={() =>
                                    window.open(icon.link, "_blank")
                                  }
                                  style={{
                                    willChange: "transform",
                                    scale: icon.src.includes("github")
                                      ? "0.9"
                                      : "1",
                                    filter: isWhite ? "invert(0)" : "invert(1)",
                                  }}
                                  key={index}
                                  src={icon.src}
                                  alt={`${icon.src} icon`}
                                  className="select-none hover:translate-y-[-3px] transition-transform duration-[400ms] ease-[cubic-bezier(0.1,0,0.3,1)] cursor-pointer w-9 h-9"
                                />
                              );
                            }
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                onClick={() => {
                  // clickSound.currentTime = 0;
                  isClickedRef.current = !isClickedRef.current;

                  setIsOpen(!isOpen);

                  isClickedRef.current
                    ? gripRef.current?.startAnimation()
                    : gripRef.current?.stopAnimation();
                }}
                style={{ opacity: 1 }}
                animate={{
                  // opacity: isWhite ? 1 : 0,
                  background: isWhite ? "#fff" : "#000",
                  scale: isOpen ? 1.175 : 1,
                  transition: {
                    delay: isOpen ? 0.25 : 0,
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                id="trigger"
                className="z-50 absolute h-[3.5rem] w-[3.25rem] bg-white rounded-[16px] shadow-2xl cursor-pointer"
              ></motion.div>

              <div className="pointer-events-none cursor-pointer z-50 flex justify-center items-center h-10 w-10 gap-[2px]">
                <motion.div
                  style={{
                    willChange: "transform",
                    transformOrigin: "center center",
                    filter: isWhite ? "invert(0)" : "invert(1)",
                  }}
                  animate={{
                    scale: isOpen ? 0.75 : 0.675,
                    transition: {
                      delay: isOpen ? 0.25 : 0,
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                  className="scale-[0.675]"
                >
                  <GripIcon ref={gripRef} />
                </motion.div>
              </div>
            </header>
          </div>
        </div>
        {/*  */}

        <div className="relative w-full h-20 flex flex-row justify-between items-end">
          <p
            ref={authorRef}
            className="origin-bottom-left min-w-fit scale-[0.8275] text-white select-none pointer-events-auto text-[0.875rem] sm:text-[1rem] !font-[500] normal-case"
          >
            Made by
            <span
              onClick={() => {
                window.location.href = "https://www.tobiasstoulil.com/";
              }}
              className="text-white hover:underline select-none cursor-pointer ml-1 text-[0.875rem] sm:text-[1rem] !font-[400] normal-case"
            >
              Tobias Stoulil
            </span>
          </p>
          <Swapper />
        </div>

        {/* trigger */}
        <div
          id="trig"
          className="z-[-1] bg-transparent absolute inset-0 h-screen w-[100%] pointer-events-auto"
        ></div>
      </div>
    </>
  );
};

export default HomePage;
