import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { Uniform } from "three";
import { useRef } from "react";
import * as THREE from "three";

import vertexShader from "../shaders/fullScreenPlane/vertex.glsl";
import fragmentShader from "../shaders/fullScreenPlane/fragment.glsl";
import { useControls } from "leva";

export default function FullScreenQuadMaterial() {
  const self = useRef();

  //   const { uColor1, uColor2 } = useControls({
  //     uColor1: "#ffffff",
  //     uColor2: "#ffe6e6",
  //   });

  const uniforms = {
    uTime: 0,
    uResolution: new Uniform(new THREE.Vector2()),
    uProgress: 0,
    uTransition: -1,
    uMap0: new Uniform(null),
    uMap1: new Uniform(null),
  };

  const FullScreenQuadMaterial = shaderMaterial(
    uniforms,
    vertexShader,
    fragmentShader
  );
  extend({ FullScreenQuadMaterial });

  useFrame((state, delta) => {
    if (self.current) {
      self.current.uniforms.uTime += delta;
    }
  });

  return <fullScreenQuadMaterial ref={self} transparent />;
}
