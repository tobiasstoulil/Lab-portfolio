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
  const { scene: scene2, camera } = useThree();

  const dataPages = useMemo(() => {
    return assets.filter((asset) => asset.name === "experiments");
  });
  const pages = dataPages[0].items;
  const index = useStats((state) => state.index);

  // const imageTextures = useMemo(() => {
  //   return pages.map((page) => {
  //     const texture = new THREE.TextureLoader().load(page.textureUrl);
  //     texture.flipY = false;
  //     texture.encoding = THREE.sRGBEncoding;
  //     return texture;
  //   });
  // }, []);

  const urls = pages.map((page) => page.textureUrl);

  const imageTextures = useTexture(urls);

  imageTextures.forEach((tex) => {
    tex.flipY = false;
    tex.encoding = THREE.sRGBEncoding;
  });

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
  const pivot = useRef(null);

  useEffect(() => {
    scene.traverse((child) => {
      // console.log(child.name);
      if (child.name === "Screen") {
        child.material = screenMaterial;
        const box = new THREE.Box3().setFromObject(child);
        const center = box.getCenter(new THREE.Vector3());

        center.y -= 0.5;

        pivot.current = new THREE.Object3D();
        pivot.current.position.copy(center);

        child.position.sub(center);

        // add mesh into pivot
        pivot.current.add(child);
        scene2.add(pivot.current);

        return;
      }
    });
  }, [scene]);

  useEffect(() => {
    // now scale pivot instead of mesh

    const clickHandler = () => {
      if (isHovering.current) {
        // window.open(pages[index].pageUrl, "_blank");
      }
    };

    const resize = () => {
      // group.current.scale.set(0.2, 0.2, 0.2).multiplyScalar(1);

      // console.log(pivot);

      pivot.current.scale.setScalar(0.675);

      const width = window.innerWidth;
      // console.log(width);

      if (width > 768) {
        {
          pivot.current.scale.setScalar(1);
          if (width > 1280) {
            // group.current.scale.set(1, 1, 1).multiplyScalar(1);
          }
          if (width > 1920) {
            // group.current.scale.set(1, 1, 1).multiplyScalar(1);
          }
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("resize", resize);
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

    const intersects = raycaster.intersectObjects(pivot.current.children, true);
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
