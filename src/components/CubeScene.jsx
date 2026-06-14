import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Cubie from "./Cubie";
import RotatingGroup from "./RotatingGroup";
import {isFaceCenter} from "../utils/cubeGeometry";



export default function CubeScene({ cubies, currentRotation, onFinishRotation, onFaceClick, isConfigMode  }) {

    const getDisplayColor = (color, position, isConfigMode) => {
        // dacă NU e config → culori reale
        if (!isConfigMode) return color;

        // dacă e centru → NU îl tratăm ca gri, îl lăsăm cum e
        if (isFaceCenter(position)) return color;
        console.log(color)
        // în config mode: null → gri
        return color ?? "#606060";
    };

    return (
    <Canvas camera={{ position: [7, 7, 7], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {currentRotation ? (
        <>
          {cubies
            .filter((c) => !currentRotation.cubies.includes(c))
            .map((c) => (
              <Cubie key={c.key} position={c.position} colors={Object.fromEntries(
                  Object.entries(c.colors).map(([face, col]) => [
                      face,
                      getDisplayColor(col, c.position, isConfigMode)
                  ])
              )}

                     isConfigMode={isConfigMode}/>
            ))}
          <RotatingGroup {...currentRotation} onFinish={onFinishRotation} />
        </>
      ) : (
        cubies.map((c) => (
          <Cubie
            key={c.key}
            position={c.position}
            colors={Object.fromEntries(
                Object.entries(c.colors).map(([face, col]) => [
                    face,
                    getDisplayColor(col, c.position, isConfigMode)
                ])
            )}
            onFaceClick={onFaceClick}
            isConfigMode={isConfigMode}
          />
        ))
      )}

      <OrbitControls />
    </Canvas>
  );
}
