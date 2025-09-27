import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import NotFoundPage from "./pages/NotFoundPage";

import Experience from "./components/Experience/Experience";
import HomePage from "./pages/Home/Index";
import { cloneElement, useEffect, useMemo } from "react";
import assets from "./assets";
import Swapper from "./components/Swapper/Swapper";
import gsap from "gsap";

import { CustomEase } from "gsap/CustomEase";
import { Leva } from "leva";

gsap.registerPlugin(CustomEase);

CustomEase.create("hop", "0.55, 0., 0.3, 1.");
// CustomEase.create("hop", "0.25, 1, 0.5, 1");
// CustomEase.create("hop", "M0,0 C0.2,0.6 0.4,1.1 0.6,1 S1,1 1,1");

const App = () => {
  console.log("app r");

  return (
    <>
      {/* <Loader /> */}

      <div
        style={{ overscrollBehavior: "none" }}
        className="fixed z-[0] inset-0 h-[100svh] w-full overflow-hidden"
      >
        <Experience />
      </div>

      {/* swapper */}
      {/* <Swapper /> */}

      <Leva collapsed hidden />

      <div
        style={{
          overscrollBehavior: "none",
        }}
        className="overflow-hidden pointer-events-auto relative z-0 inset-0 h-[100svh] w-full
    "
      >
        {/*  */}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route index element={<HomePage></HomePage>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
};

export default App;
