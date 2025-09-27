import {
  Effects,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  useFBO,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { extend, useThree, useFrame, createPortal } from "@react-three/fiber";
import { Pass } from "postprocessing";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FullScreenQuad } from "three-stdlib";
import { useControls } from "leva";

import Lab from "./components/Lab/scene";
import { useScreenCursor } from "../../utils/useScreenCursor";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { CustomEfComponent } from "./CustomEf";

export default function Scene() {
  console.log("scene r");
  const cameraRef = useRef(null);

  useEffect(() => {
    const resize = () => {
      cameraRef.current.zoom = 120;

      const width = window.innerWidth;
      // console.log(width);
      if (width > 768) {
        {
          cameraRef.current.zoom = 200;
          if (width > 1280) {
            cameraRef.current.zoom = 200;
          }
          if (width > 1920) {
            cameraRef.current.zoom = 280;
          }
        }
      }

      cameraRef.current.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* <ambientLight intensity={0} color="#FFFFFF" />
      <directionalLight
        castShadow
        position={lightPosition}
        intensity={13}
        color="#fff"
      /> */}
      {/* <Effects key={"moebius"}>
        <moebiusPass
          args={[
            {
              depthRenderTarget,
              normalRenderTarget,
              camera,
            },
          ]}
        />
      </Effects> */}

      {/* <mesh ref={fullScreenQuadRef}>
        <planeGeometry args={[2, 2]} />
        <FullScreenQuadMaterial />
      </mesh> */}

      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        near={0.1}
        far={50}
        zoom={200}
      />

      <EffectComposer multisampling={2} autoClear={false}>
        <CustomEfComponent />
        <Bloom
          luminanceThreshold={5}
          luminanceSmoothing={60}
          intensity={0.275}
          levels={10}
          mipmapBlur
        />
      </EffectComposer>

      <Lab />

      {/* <PerspectiveCamera makeDefault ref={cameraRef} fov={90} zoom={10.375} /> */}
    </>
  );
}
