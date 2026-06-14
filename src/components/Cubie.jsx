import { useMemo } from "react";
import * as THREE from "three";

import { FACE_INDEX_TO_NAME } from "../constants/cube";

export default function Cubie({ position, colors, onFaceClick, isConfigMode}) {
  // Order matches three.js box material faces: +x, -x, +y, -y, +z, -z.
    const materials = useMemo(() => {
        const displayColors = [colors.R, colors.L, colors.U, colors.D, colors.F, colors.B];

        return displayColors.map((color) => {
            const finalColor =
                isConfigMode && !color ? "#606060" : color;

            return new THREE.MeshBasicMaterial({
                color: finalColor || "black",
            });
        });
    }, [colors, isConfigMode]);



  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005, 1.005, 1.005)),
    []
  );

  const handleClick = (event) => {
    event.stopPropagation();
    const faceName = FACE_INDEX_TO_NAME[Math.floor(event.faceIndex / 2)];
    onFaceClick?.(position, faceName);
  };

  return (
    <group position={position}>
      <mesh material={materials} onClick={handleClick}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="black" />
      </lineSegments>
    </group>
  );
}
