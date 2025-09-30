import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { SquareArrowLeftIcon } from "../arrowIcon.jsx";
import useStats from "../../stores/useStats.jsx";
import assets from "../../assets/index.js";
import gsap from "gsap";
import { splitTextElements } from "../../utils/gsapUtils.js";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowStraight from "./ArrowStraight.jsx";
import useClickTrigger from "../../utils/useClickTrig.js";

const Swapper = () => {
  console.log("swapper r");

  const index = useStats((state) => state.index);
  const increaseIndex = useStats.getState().increaseIndex;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useClickTrigger(() => setIsMenuOpen(() => false));

  const dataPages = useMemo(() => {
    return assets.filter((asset) => asset.name === "experiments");
  });

  const liveRef = useRef(null);
  const liveTextRef = useRef(null);
  const swapperRef = useRef(null);
  const titleRef1 = useRef(null);
  const titleRef2 = useRef(null);
  const arrowIconRef = useRef(null);

  const pages = dataPages[0].items;
  const countRef = useRef(0);
  const delayRef = useRef(false);
  const isTransitioning = useRef(false);
  const clickingHelper = useRef(false);

  const setIndex = useStats((state) => state.setIndex);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const indexInterval = setInterval(() => {
      if (!isTransitioning.current) {
        // console.log(index, pages.length);
        if (index === pages.length - 1) {
          // console.log(index);
          setIndex(0);
          return;
        }
        increaseIndex();
      }
    }, 5000);

    return () => {
      clearInterval(indexInterval);
    };
  }, [index]);

  useEffect(() => {
    // console.log("swapper mounted");

    titleRef1.current.textContent = pages[0].swapperContent[0];
    titleRef2.current.textContent = pages[0].swapperContent[0];

    splitTextElements(titleRef1.current, "chars");
    splitTextElements(titleRef2.current, "chars");
    splitTextElements(liveTextRef.current, "chars");

    gsap.set(titleRef1.current.querySelectorAll(".char span"), {
      y: "-100%",
      opacity: 0,
    });
    gsap.set(titleRef2.current.querySelectorAll(".char span"), {
      y: "-100%",
      opacity: 0,
    });
    gsap.set(liveTextRef.current.querySelectorAll(".char span"), {
      y: "-100%",
      opacity: 0,
    });

    gsap.set(swapperRef.current, {
      opacity: 0,
    });

    gsap.set(liveRef.current, {
      opacity: 0,
    });
    const unsubscribe = useStats.subscribe(
      (state) => state.scopeAnim,
      (value, prevValue) => {
        isTransitioning.current = true;
        const tl = gsap.timeline({
          defaults: {
            ease: "hop",
            delay: 2,
            onComplete: () => {
              isTransitioning.current = false;
            },
          },
        });

        tl.to(
          swapperRef.current,
          {
            opacity: 1,
            duration: 0.75,
          },
          0.125
        );
        tl.to(
          liveRef.current,
          {
            opacity: 1,
            duration: 0.75,
          },
          0.3
        );

        tl.to(
          titleRef1.current.querySelectorAll(".char span"),
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.05,
          },
          0
        );

        tl.to(
          liveTextRef.current.querySelectorAll(".char span"),
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.05,
          },
          0.175
        );
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    delayRef.current = true;
    setTimeout(() => {
      delayRef.current = false;
    }, 1500);

    const unsubscribe = useStats.subscribe(
      (state) => state.index,
      (value, prevValue) => {
        // console.log(value);

        clickingHelper.current = !clickingHelper.current;

        delayRef.current = true;
        setTimeout(() => {
          delayRef.current = false;
        }, 1500);
        countRef.current = value;
        // console.log(value);

        if (clickingHelper.current) {
          titleRef2.current.textContent = pages[value].swapperContent[0];
          splitTextElements(titleRef2.current, "chars");
        } else {
          titleRef1.current.textContent = pages[value].swapperContent[0];
          splitTextElements(titleRef1.current, "chars");
        }

        // setTimeout(() => {
        clickingHelper.current ? inTransition() : endTransition();
        // }, 0);
      }
    );

    return () => unsubscribe();
  }, []);

  const inTransition = () => {
    const titleTl = gsap.timeline({
      defaults: {
        ease: "hop",
        onComplete: () => {
          isTransitioning.current = false;
        },
      },
    });
    titleTl.to(
      titleRef1.current.querySelectorAll(".char span"),
      {
        y: "100%",
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "hop",
      },
      0
    );
    titleTl.to(
      titleRef2.current.querySelectorAll(".char span"),
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "hop",
      },
      0
    );
  };

  const endTransition = () => {
    const titileTl = gsap.timeline({
      defaults: {
        ease: "hop",
        onComplete: () => {
          isTransitioning.current = false;
        },
      },
    });
    titileTl.to(
      titleRef1.current.querySelectorAll(".char span"),
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "hop",
      },
      0
    );
    titileTl.to(
      titleRef2.current.querySelectorAll(".char span"),
      {
        y: "100%",
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "hop",
      },
      0
    );
  };

  return (
    <div
      style={{ transformOrigin: "right bottom" }}
      className="absolute right-0 bottom-0 z-40 min-w-fit max-w-fit scale-[0.75] md:scale-100 flex flex-col gap-3 md:gap-3 items-end justify-center"
    >
      <motion.div
        style={{
          opacity: 1,
          willChange: "transform, opacity",
          transformOrigin: "center center",
          cursor: "default",
          overscrollBehavior: "none",
        }}
        animate={{
          width: isMenuOpen ? "232px" : "0px",
          height: isMenuOpen ? "100%" : "0px",
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          delay: isMenuOpen ? 0.25 : 0.625,
          ease: "easeInOut",
        }}
        className="scale-100 md:scale-100 pointer-events-auto font-main bg-white rounded-[16px] px-2 py-2 flex flex-col gap-0 border-[4px] border-[#b1b1b141]"
      >
        {pages.map((page, i) => {
          return (
            <motion.div
              key={i}
              onClick={() => {
                if (delayRef.current) {
                  return;
                }

                delayRef.current = true;
                isTransitioning.current = true;
                setIndex(i);

                setTimeout(() => {
                  delayRef.current = false;
                }, 1500);
              }}
              className="select-none cursor-pointer bg-transparent hover:!bg-[#b1b1b12a] transition duration-100 ease-in-out px-2 py-2 rounded-[8px] text-black w-full flex flex-row justify-between items-center"
              animate={{
                background:
                  i === index
                    ? isMenuOpen
                      ? "rgba(121,121,121,0.16)"
                      : "rgba(0,0,0,0)"
                    : "rgba(0,0,0,0)",
                opacity: isMenuOpen ? 1 : 0,
              }}
              transition={{
                background: {
                  duration: 0.125,
                  ease: "easeOut",
                },
                opacity: {
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: isMenuOpen
                    ? 0.625 + i * 0.05
                    : (pages.length - i) * 0.05,
                },
              }}
            >
              <h1 className="min-w-fit text-nowrap pointer-events-none antialiased text-[14px] !font-[500]">
                {page.swapperContent}
              </h1>
            </motion.div>
          );
        })}
      </motion.div>

      {/*  */}
      <div className="w-fit flex flex-row justify-end gap-2.5 items-center">
        <motion.div
          style={{
            opacity: 1,
            willChange: "transform",
            transformOrigin: "center center",
            cursor: "default",
            filter: "invert(0)",
            overscrollBehavior: "none",
          }}
          className="h-[64px] w-[64px] flex flex-col items-center justify-center scale-100 md:scale-100 pointer-events-auto font-main"
        >
          <div
            ref={liveRef}
            style={{
              opacity: 0,
              willChange: "transform, opacity",
              transformOrigin: "center center",
              cursor: "default",
              overscrollBehavior: "none",
            }}
            className="absolute right-0 bottom-0 pointer-events-auto bg-[#fff] rounded-[330px] flex flex-row justify-end items-center gap-3 pl-5 pr-0 py-0 overflow-hidden
      border-[4px] border-[#b1b1b141] shadow-2xl 
      "
          >
            {/*  */}
            <div className="w-fit h-full flex flex-col gap-[4px] items-start justify-center">
              <div className="flex items-start justify-center relative min-w-fit w-fit text-nowrap select-none pointer-events-auto text-[0.775rem] md:text-[0.875rem] text-black !font-[700] uppercase">
                <p
                  ref={liveTextRef}
                  className="relative h-full w-full min-w-fit flex items-start justify-center text-nowrap"
                >
                  live
                </p>
              </div>
            </div>

            {/*  */}
            <div className="relative cursor-pointer h-[44px] aspect-square bg-transparent rounded-full flex justify-center items-center">
              <motion.div
                style={{
                  willChange: "transform",
                  // boxShadow: "0 2px 12px rgba(0, 0, 0, 0.175)",
                }}
                onClick={() => {
                  pages[index].pageUrl && window.open(pages[index].pageUrl);
                }}
                whileHover={{ scale: 0.925 }}
                // onHoverStart={() => arrowIconRef.current?.scaleInAnimation()}
                // onHoverEnd={() => {
                //   arrowIconRef.current?.scaleOutAnimation();
                // }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                className="absolute inset-0 h-[44px] aspect-square bg-black rounded-full"
              ></motion.div>
              <ArrowStraight
                ref={arrowIconRef}
                fill="#fff"
                className="pointer-events-none -rotate-45"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/*  */}

      <motion.div
        ref={swapperRef}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          // hoverEndTransition();
        }}
        style={{
          opacity: 0,
          willChange: "transform",
          transformOrigin: "center center",
          cursor: "default",
          filter: "invert(0)",
          overscrollBehavior: "none",
        }}
        initial={{
          width: "232px",
          // scaleX: 0.925,
          // scaleY: 0.925,
        }}
        animate={{
          width: isHovered ? (isMobile ? "232px" : "264px") : "232px",
          // scaleX: isHovered ? 1 : 0.925,
          // scaleY: isHovered ? 1 : 0.925,
        }}
        transition={{
          duration: isHovered ? 0.4 : 0.525,
          delay: isHovered ? 0 : 0.05,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="scale-100 md:scale-100 pointer-events-auto font-main w-[232px] md:w-[264px]"
      >
        <div
          className="pointer-events-none bg-[#fff] rounded-[330px] flex flex-row justify-between items-center gap-3 pl-0 pr-8 py-0 overflow-hidden
      border-[4px] border-[#b1b1b141] shadow-2xl 
      "
        >
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rotate-[90deg]"
          >
            <motion.div
              whileHover={{ scale: 0.925 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              className="cursor-pointer pointer-events-auto relative h-[44px] aspect-square rounded-full bg-[#000]"
            >
              <motion.div
                style={{
                  willChange: "transform",
                  transformOrigin: "center center",
                  y: "-50%",
                }}
                animate={{
                  x: isMenuOpen ? "calc(-50% + 2px)" : "-50%",
                }}
                transition={{
                  duration: isMenuOpen ? 0.5 : 0.3,
                  delay: isMenuOpen ? 0.125 : 0.125,
                  ease: [0.55, 0, 0.3, 1],
                }}
                className="absolute h-[4px] top-[calc(50%-7px)] left-1/2 aspect-square bg-[#fff] rounded-full"
              />
              <motion.div
                style={{
                  willChange: "transform",
                  transformOrigin: "center center",
                  y: "-50%",
                }}
                animate={{
                  x: isMenuOpen ? "calc(-50% - 4px)" : "-50%",
                }}
                transition={{
                  duration: isMenuOpen ? 0.5 : 0.3,
                  delay: isMenuOpen ? 0.125 : 0.125,
                  ease: [0.55, 0, 0.3, 1],
                }}
                className="absolute h-[4px] top-1/2 left-1/2 aspect-square bg-[#fff] rounded-full"
              />
              <motion.div
                style={{
                  willChange: "transform",
                  transformOrigin: "center center",
                  y: "-50%",
                }}
                animate={{
                  x: isMenuOpen ? "calc(-50% + 2px)" : "-50%",
                }}
                transition={{
                  duration: isMenuOpen ? 0.5 : 0.3,
                  delay: isMenuOpen ? 0.125 : 0.125,
                  ease: [0.55, 0, 0.3, 1],
                }}
                className="absolute h-[4px] top-[calc(50%+7px)] left-1/2 aspect-square bg-[#fff] rounded-full"
              />
            </motion.div>
          </div>

          <motion.div
            onClick={() => {
              // console.log(countRef.current, pages.length);

              if (delayRef.current) {
                return;
              }

              delayRef.current = true;
              isTransitioning.current = true;
              countRef.current = countRef.current + 1;
              // console.log(countRef.current, pages.length);

              if (countRef.current < pages.length) {
                increaseIndex();

                setTimeout(() => {
                  //
                }, 1500);
              } else {
                setIndex(0);

                setTimeout(() => {
                  //
                }, 1500);
                countRef.current = 0;
              }

              setTimeout(() => {
                delayRef.current = false;
              }, 1500);
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: isHovered ? 1 : isMobile ? 1 : 0,
            }}
            transition={{
              duration: isHovered ? 0.5 : 0.25,
              delay: isHovered ? 0.175 : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="scale-[0.8] rotate-[-90deg] pointer-events-auto z-10 cursor-pointer absolute top-1/2 right-2 -translate-x-1/2 -translate-y-1/2"
          >
            <SquareArrowLeftIcon />
          </motion.div>

          {/*  */}
          <div className="w-full h-full flex flex-col gap-[4px] min-w-fit items-start justify-center">
            <div className="flex items-start justify-center relative min-w-fit w-fit text-nowrap select-none pointer-events-auto text-[0.775rem] md:text-[0.875rem] text-black !font-[700] uppercase">
              <p
                ref={titleRef1}
                className="relative h-full w-full min-w-fit flex items-start justify-center text-nowrap"
              >
                TobiasStoulil
              </p>
              <p
                ref={titleRef2}
                className="absolute top-[0%] left-0 min-w-fit text-nowrap"
              >
                TobiasStoulil
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Swapper;
