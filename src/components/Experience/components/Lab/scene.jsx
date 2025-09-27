import React, { Suspense, memo, useRef } from "react";
import GameBoyModel from "./model";
import { createPortal } from "@react-three/fiber";
import * as THREE from "three";
import Model from "./model";
import BgMaterial from "../../materials/BgMaterial";
import Screen from "./screen";

const Lab = () => {
  return (
    <Suspense fallback={null}>
      <Model></Model>
      <Screen></Screen>
      {/* <mesh>
        <planeGeometry args={[2, 2]} />
        <BgMaterial />
      </mesh> */}
    </Suspense>
  );
};

export default Lab;
