import { useState, useEffect } from "react";

export default function useClickTrigger(setStateFunc) {
  // console.log(setStateFunc);

  useEffect(() => {
    const clickHandler = (e) => {
      if (e.target.id === "trig") {
        if (setStateFunc) setStateFunc();
        // console.log(e.target.id);
      }
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [setStateFunc]);
}
