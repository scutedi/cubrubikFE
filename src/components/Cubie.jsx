import { useMemo } from "react";
import * as THREE from "three";

import {FACE_INDEX_TO_NAME, GREY} from "../constants/cube";

export default function Cubie({ position, colors, onFaceClick}) {
    const materials = useMemo(() => {
        return [colors.R, colors.L, colors.U, colors.D, colors.F, colors.B]
            .map((c) => new THREE.MeshBasicMaterial({
                color: c ?? GREY,
            }));
    }, [colors]);



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
