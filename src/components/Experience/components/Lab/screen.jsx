import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useScreenCursor } from "../../../../utils/useScreenCursor.js";

import screenVertexShader from "../../shaders/screen/vertex.glsl";
import screenFragmentShader from "../../shaders/screen/fragment.glsl";
import smileVertexShader from "../../shaders/smile/vertex.glsl";
import smileFragmentShader from "../../shaders/smile/fragment.glsl";
import bgMeshVertexShader from "../../shaders/bgMesh/vertex.glsl";
import bgMeshFragmentShader from "../../shaders/bgMesh/fragment.glsl";
import noisePlaneVertexShader from "../../shaders/noisePlane/vertex.glsl";
import noisePlaneFragmentShader from "../../shaders/noisePlane/fragment.glsl";

import gsap from "gsap";
import useStats from "../../../../stores/useStats.jsx";
import { useControls } from "leva";
import assets from "../../../../assets/index.js";

const modelUrl = "/screen.glb";

const Screen = () => {
  const group = useRef();
  const { scene } = useGLTF(modelUrl);
  const { camera } = useThree();

  const dataPages = useMemo(() => {
    return assets.filter((asset) => asset.name === "experiments");
  });
  const pages = dataPages[0].items;
  const index = useStats((state) => state.index);

  const imageTextures = useMemo(() => {
    return pages.map((page) => {
      const texture = new THREE.TextureLoader().load(page.textureUrl);
      texture.flipY = false;
      texture.encoding = THREE.sRGBEncoding;
      return texture;
    });
  }, []);

  // const image1 = useTexture("/project.png");
  // const image2 = useTexture("/project1.webp");
  // image1.flipY = false;
  // image1.encoding = THREE.sRGBEncoding;

  const screenMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: screenVertexShader,
      fragmentShader: screenFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uProgress: new THREE.Uniform(0),
        uHoverProgress: new THREE.Uniform(0),
        uScreenTexture1: new THREE.Uniform(imageTextures[0]),
        uScreenTexture2: new THREE.Uniform(imageTextures[1]),
      },
      transparent: true,
    });
  }, []);

  const mouse = useScreenCursor();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const isHovering = useRef(false);

  useEffect(() => {
    scene.traverse((child) => {
      // console.log(child.name);
      if (child.name === "Screen") {
        child.material = screenMaterial;
        return;
      }
    });
  }, [scene]);

  useEffect(() => {
    const clickHandler = () => {
      if (isHovering.current) {
        // window.open(pages[index].pageUrl, "_blank");
      }
    };

    window.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
    };
  }, [index]);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    const unsubscribe = useStats.subscribe(
      (state) => state.index,
      (value, prevValue) => {
        screenMaterial.uniforms.uScreenTexture1.value =
          imageTextures[prevValue];
        screenMaterial.uniforms.uScreenTexture2.value = imageTextures[value];

        tl.fromTo(
          screenMaterial.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            delay: 0.425,
            duration: 1,
            ease: "power3.out",
          }
        );

        tl.play();
      }
    );

    return () => {
      unsubscribe();
      tl.kill();
    };
  }, []);

  useFrame((state, delta) => {
    screenMaterial.uniforms.uTime.value += delta;

    //
    raycaster.setFromCamera(mouse.current, camera);

    const intersects = raycaster.intersectObjects(group.current.children, true);
    // console.log(intersects);

    if (intersects.length > 0 && !isHovering.current) {
      // document.body.style.cursor = "pointer";

      isHovering.current = true;
      gsap.to(screenMaterial.uniforms.uHoverProgress, {
        value: 1,
        duration: 0.75,
        delay: 0.05,
        ease: "power3.out",
      });
    } else if (intersects.length === 0 && isHovering.current) {
      // document.body.style.cursor = "default";

      isHovering.current = false;
      gsap.to(screenMaterial.uniforms.uHoverProgress, {
        value: 0,
        duration: 0.75,
        delay: 0.075,
        ease: "power3.out",
      });
    }
  });

  return <primitive ref={group} object={scene} />;
};

export default Screen;

useGLTF.preload(modelUrl);
