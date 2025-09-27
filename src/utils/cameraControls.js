import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function useCameraControls({
  camera,
  cameraPosition,
  cameraLookAt,
  mouse,
  hasKeyboard,
  isTransitioning,
}) {
  console.log(
    camera,
    cameraPosition,
    cameraLookAt,
    mouse,
    hasKeyboard,
    isTransitioning
  );

  useFrame((state, delta) => {
    if (cameraPosition === null || isTransitioning || hasKeyboard === false)
      return;
    // console.log(delta);
    //

    delta = Math.min(delta, 0.1);

    const direction = new THREE.Vector3().subVectors(cameraPosition, origin);
    const directionXZ = direction.clone();
    directionXZ.y = 0;
    directionXZ.normalize();

    const perpendicular = new THREE.Vector3(-directionXZ.z, 0, directionXZ.x);

    const amountX = 1;
    const amountY = 0.75;

    const offsetX = amountX * -mouse.x;
    const offsetY = amountY * mouse.y;

    const lerpFactor = delta * 2;
    const g = perpendicular.clone().multiplyScalar(offsetX);
    const targetPosition = cameraPosition.clone().add(g);

    camera.position.lerp(targetPosition, lerpFactor);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      cameraPosition.y + offsetY,
      lerpFactor
    );

    camera.lookAt(cameraLookAt);

    camera.up.set(0, 1, 0);

    camera.updateProjectionMatrix();
  });
}
