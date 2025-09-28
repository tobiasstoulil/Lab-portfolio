import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useScreenCursor } from "../../../../utils/useScreenCursor.js";

import floorVertexShader from "../../shaders/floor/vertex.glsl";
import floorFragmentShader from "../../shaders/floor/fragment.glsl";
import pressVertexShader from "../../shaders/press/vertex.glsl";
import pressFragmentShader from "../../shaders/press/fragment.glsl";
import smileVertexShader from "../../shaders/smile/vertex.glsl";
import smileFragmentShader from "../../shaders/smile/fragment.glsl";
import bgMeshVertexShader from "../../shaders/bgMesh/vertex.glsl";
import bgMeshFragmentShader from "../../shaders/bgMesh/fragment.glsl";
import noisePlaneVertexShader from "../../shaders/noisePlane/vertex.glsl";
import noisePlaneFragmentShader from "../../shaders/noisePlane/fragment.glsl";

import gsap from "gsap";
import useStats from "../../../../stores/useStats.jsx";
import { useControls } from "leva";
import { useCameraControls } from "../../../../utils/cameraControls.js";
import assets from "../../../../assets/index.js";

const modelUrl = "/lab1.glb";

// const WireMaterial = new THREE.ShaderMaterial({
//   vertexShader: bakedWireVertexShader,
//   fragmentShader: bakedWireFragmentShader,
//   uniforms: {
//     uTime: new THREE.Uniform(0),
//     uProgress: new THREE.Uniform(1),
//     uColor: new THREE.Uniform(new THREE.Color(0x141414)),
//     uEdgeColor: new THREE.Uniform(new THREE.Color("rgb(120, 120, 120)")),
//   },
// });

const Model = () => {
  const dataPages = useMemo(() => {
    return assets.filter((asset) => asset.name === "experiments");
  });
  const pages = dataPages[0].items;

  const group = useRef();
  const { scene } = useGLTF(modelUrl);
  const { camera } = useThree();

  const { colorStart, colorEnd } = useControls("color", {
    colorStart: {
      value: "#b9bbc2",
      onChange: (v) => {
        bgMaterial.uniforms.uColorStart.value = new THREE.Color(v);
      },
    },
    colorEnd: {
      value: "#e8e8e8",
      onChange: (v) => {
        bgMaterial.uniforms.uColorEnd.value = new THREE.Color(v);
      },
    },
  });

  const bakedProps = useTexture("/baked.jpg");
  bakedProps.flipY = false;
  bakedProps.encoding = THREE.sRGBEncoding;
  // bakedPowerTexture.anisotropy = 16;

  const propsMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ map: bakedProps, toneMapped: false });
  }, []);

  const bakedFloor = useTexture("/bakedFloor.jpg");
  bakedFloor.flipY = false;
  bakedFloor.encoding = THREE.sRGBEncoding;

  const bakedPowerTexture = useTexture("/bakedPower.jpg");
  bakedPowerTexture.flipY = false;
  bakedPowerTexture.encoding = THREE.sRGBEncoding;

  const floorMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: floorVertexShader,
      fragmentShader: floorFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uIndex: new THREE.Uniform(0),
        uProgress: new THREE.Uniform(0),
        uColor1: new THREE.Uniform(new THREE.Color(pages[0].color)),
        uColor2: new THREE.Uniform(new THREE.Color(pages[1].color)),
        uBakedTexture: new THREE.Uniform(bakedFloor),
        uBakedPowerTexture: new THREE.Uniform(bakedPowerTexture),
      },
      // transparent: true,
      // visible: false,
    });
  }, []);

  const pressMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: pressVertexShader,
      fragmentShader: pressFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uIndex: new THREE.Uniform(0),
        uProgress: new THREE.Uniform(0),
        uColor1: new THREE.Uniform(new THREE.Color(pages[0].color)),
        uColor2: new THREE.Uniform(new THREE.Color(pages[1].color)),
        uBakedTexture: new THREE.Uniform(bakedProps),
        uBakedPowerTexture: new THREE.Uniform(bakedPowerTexture),
      },
      // transparent: true,
      // visible: false,
    });
  }, []);

  //3; 6;
  const matcapTexture = useTexture("/matcaps/g (6).png");
  const faceMaterial = useMemo(() => {
    return new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  }, []);

  const smileTexture = useTexture("/faceText.png");
  smileTexture.flipY = false;
  smileTexture.encoding = THREE.sRGBEncoding;

  const smileMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: smileVertexShader,
      fragmentShader: smileFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uIndex: new THREE.Uniform(0),
        uProgress: new THREE.Uniform(0),
        uFaceTexture: new THREE.Uniform(smileTexture),
      },
      transparent: true,
      // visible: false,
    });
  }, []);

  const bgMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: bgMeshVertexShader,
      fragmentShader: bgMeshFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uProgress: new THREE.Uniform(0),
        uColorStart: new THREE.Uniform(new THREE.Color(colorStart)),
        uColorEnd: new THREE.Uniform(new THREE.Color(colorEnd)),
      },
    });
  }, []);

  const noiseTexture = useTexture("/noise5.png");
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;

  const noisePlaneMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: noisePlaneVertexShader,
      fragmentShader: noisePlaneFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uProgress: new THREE.Uniform(0),
        uNoiseTexture: new THREE.Uniform(noiseTexture),
        uColorStart: new THREE.Uniform(new THREE.Color(colorStart)),
        uColorEnd: new THREE.Uniform(new THREE.Color(colorEnd)),
      },
      transparent: true,
    });
  }, []);

  // const index =
  const cameraPosition = useRef(null);
  const cameraLookAt = useRef(null);
  const isTransitioning = useRef(true);
  const hasKeyboard = useRef(true);
  const mouse = useScreenCursor();
  const buttonRef = useRef(null);

  useEffect(() => {
    scene.traverse((child) => {
      // console.log(child.name);
      // setup camera
      if (child.name === "CameraPosition") {
        camera.position.set(
          child.position.x,
          child.position.y,
          child.position.z
        );

        cameraPosition.current = new THREE.Vector3(
          child.position.x,
          child.position.y,
          child.position.z
        );
      }
      if (child.name === "CameraLookAt") {
        camera.lookAt(child.position.x, child.position.y, child.position.z);

        cameraLookAt.current = new THREE.Vector3(
          child.position.x,
          child.position.y,
          child.position.z
        );
      }

      if (child.isMesh) {
        // console.log(child.name);

        if (child.name === "Floor") {
          child.material = floorMaterial;
          return;
        } else if (child.name.includes("Press")) {
          child.material = pressMaterial;
          // console.log(child);
          return;
        } else if (child.name.includes("Face")) {
          child.material = faceMaterial;
          return;
        } else if (child.name.includes("Smile")) {
          // console.log(child.name);
          child.material = smileMaterial;
          return;
        } else if (child.name === "Bg") {
          child.material = bgMaterial;
          return;
        } else if (child.name.includes("NH")) {
          child.material = noisePlaneMaterial;
          return;
        } else if (child.name.includes("Button")) {
          child.material = pressMaterial;
          buttonRef.current = child;
          // console.log(buttonRef.current);
          return;
        } else {
          child.material = propsMaterial;
          return;
        }

        // child.visible = false;
      }
    });

    const cameraTl = gsap.timeline({ paused: true });

    const unsubscribe = useStats.subscribe(
      (state) => state.scopeAnim,
      (value, prevValue) => {
        if (cameraLookAt.current && cameraPosition.current) {
          // console.log(camera);

          gsap.from(camera, {
            zoom: camera.zoom + 15,
            ease: "power2.inOut",
            delay: 0,
            duration: 1.5,

            onUpdate: () => {
              // console.log(cameraRef.current.zoom, initialZoom.current);

              camera.lookAt(cameraLookAt.current);
              camera.updateProjectionMatrix();
            },

            onComplete: () => {
              isTransitioning.current = false;
              // isZoomed.current = true;
            },
          });
        }
      }
    );

    return () => {
      unsubscribe();
      cameraTl.kill();
    };
  }, [scene]);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    const progTl = gsap.timeline({ paused: true });

    const unsubscribe = useStats.subscribe(
      (state) => state.index,
      (value, prevValue) => {
        floorMaterial.uniforms.uColor1.value = new THREE.Color(
          pages[prevValue].color
        );
        floorMaterial.uniforms.uColor2.value = new THREE.Color(
          pages[value].color
        );

        progTl.fromTo(
          floorMaterial.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            delay: 0.425,
            duration: 1,
            ease: "power3.out",
          }
        );

        progTl.play();

        if (buttonRef.current) {
          tl.clear();

          tl.to(buttonRef.current.position, {
            y: "-=0.0275",
            duration: 0.25,
            onComplete: () => {
              smileMaterial.uniforms.uIndex.value = value;
            },
            ease: "power3.in",
          }).to(buttonRef.current.position, {
            y: "+=0.0275",
            duration: 1.375,
            ease: "elastic.out(0.8, 0.2)",
          });

          tl.play(0);
        }
      }
    );

    return () => {
      unsubscribe();
      tl.kill();
      progTl.kill();
    };
  }, []);

  useFrame((state, delta) => {
    // Update uniforms
    noisePlaneMaterial.uniforms.uTime.value += delta;

    if (
      cameraPosition.current === null ||
      cameraLookAt.current === null ||
      isTransitioning.current ||
      hasKeyboard.current === false
    )
      return;
    //
    // console.log(cameraPosition.current, cameraLookAt.current, mouse.current);

    delta = Math.min(delta, 0.1);

    const direction = new THREE.Vector3().subVectors(
      cameraPosition.current,
      cameraLookAt.current
    );
    const directionXZ = direction.clone();
    directionXZ.y = 0;
    directionXZ.normalize();

    const perpendicular = new THREE.Vector3(-directionXZ.z, 0, directionXZ.x);

    const mulFac = 1;
    const amountX = 0.5 * mulFac;
    const amountY = 0.5 * mulFac;

    const offsetX = amountX * mouse.current.x;
    const offsetY = amountY * -mouse.current.y;

    const lerpFactor = delta * 2;
    const g = perpendicular.clone().multiplyScalar(offsetX);
    const targetPosition = cameraPosition.current.clone().add(g);
    // console.log(targetPosition, cameraPosition.current);

    camera.position.lerp(targetPosition, lerpFactor);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      cameraPosition.current.y + offsetY,
      lerpFactor
    );

    camera.lookAt(cameraLookAt.current);

    camera.up.set(0, 1, 0);
  });

  return <primitive ref={group} object={scene} />;
};

export default Model;

useGLTF.preload(modelUrl);
