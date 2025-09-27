import {
  OrbitControls,
  PerspectiveCamera,
  PivotControls,
} from "@react-three/drei";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Scene from "./proScene";
import { Suspense, useRef } from "react";
import { Leva, useControls } from "leva";

export default function Experience() {
  console.log("experience r");

  // const { bg } = useControls("bg", {
  //   bg: "#141414",
  // });

  return (
    <>
      <Canvas
        className="webgl"
        flat
        dpr={[1, 2]}
        gl={{
          antialias: true,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <color attach="background" args={["#a3a5ae"]} />
        {/* <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshNormalMaterial />
        </mesh> */}
        {/* <OrbitControls makeDefault /> */}
        {/* <PivotControls /> */}
      </Canvas>
    </>
  );
}
