import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { Uniform } from "three";
import { useRef } from "react";
import * as THREE from "three";

import vertexShader from "../shaders/bgMesh/vertex.glsl";
import fragmentShader from "../shaders/bgMesh/fragment.glsl";
import { useControls } from "leva";

export default function BgMaterial() {
  const self = useRef();

  const { colorStart, colorEnd } = useControls("bg", {
    colorStart: {
      // value: "#000",
      value: "#0a0a0a",
      onChange: (v) => {
        self.current.uniforms.uColorStart.value = new THREE.Color(v);
      },
    },
    specularColor: {
      // value: "#171d29",
      value: "#1e1e33",
      onChange: (v) => {
        self.current.uniforms.uColorEnd.value = new THREE.Color(v);
      },
    },
  });

  const uniforms = {
    uTime: 0,
    uResolution: new Uniform(new THREE.Vector2()),
    uProgress: 0,
    uColorStart: new Uniform(new THREE.Color(colorStart)),
    uColorEnd: new Uniform(new THREE.Color(colorEnd)),
  };

  const BgMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);
  extend({ BgMaterial });

  // useFrame((state, delta) => {
  //   if (self.current) {
  //     self.current.uniforms.uTime += delta;
  //   }
  // });

  return <bgMaterial ref={self} />;
}
