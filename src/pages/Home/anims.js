import { gsap } from "gsap";

export const initialAnim = ({
  titleRef,
  leftParagraphRef,
  authorRef,
  pageRef,
}) => {
  pageRef.current.style.pointerEvents = "auto";

  const tl = gsap.timeline({
    defaults: { ease: "hop", delay: 0.875 },
  });

  tl.to(
    titleRef.current.querySelectorAll(".char span"),
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.075,
    },
    0
  );

  tl.to(
    leftParagraphRef.current.querySelectorAll(".line span"),
    {
      y: 0,
      opacity: 1,
      duration: 1.75,
      stagger: 0.075,
    },
    0.375
  );

  tl.to(
    authorRef.current,
    {
      opacity: 1,
      duration: 1.5,
    },
    1.5
  );

  tl.timeScale(1.175);
};

export const exitAnim = ({
  titleRef,
  leftParagraphRef,

  authorRef,
  pageRef,
}) => {
  const tl = gsap.timeline({
    defaults: {
      ease: "hop",
      onComplete: () => {
        pageRef.current.style.pointerEvents = "none";
      },
    },
  });

  tl.to(
    titleRef.current.querySelectorAll(".char span"),
    {
      y: "-150%",
      opacity: 0,
      duration: 1.5,
      stagger: 0.075,
    },
    0
  );

  tl.to(
    leftParagraphRef.current.querySelectorAll(".line span"),
    {
      y: "-100%",
      opacity: 0,
      duration: 1.75,
      stagger: 0.075,
    },
    0.375
  );

  tl.to(
    authorRef.current,
    {
      opacity: 0,
      duration: 1.25,
    },
    1.5
  );

  tl.timeScale(2.75);
};
