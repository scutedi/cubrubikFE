import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cubie from "./Cubie";
import RotatingGroup from "./RotatingGroup";

export default function CubeScene({
                                      cubies,
                                      currentRotation,
                                      onFinishRotation,
                                      configMode,
                                      handleFaceClick,
                                  }) {
    const cubeGroupRef = useRef();

    return (
        <Canvas camera={{ position: [7, 7, 7], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            <group ref={cubeGroupRef}>
                {currentRotation ? (
                    <>
                        {cubies
                            .filter((c) => !currentRotation.cubies.includes(c))
                            .map((c) => (
                                <Cubie key={c.key} {...c} onFaceClick={handleFaceClick} />
                            ))}

                        <RotatingGroup
                            {...currentRotation}
                            onFinish={onFinishRotation}
                        />
                    </>
                ) : (
                    cubies.map((c) => (
                        <Cubie
                            key={c.key}
                            {...c}
                            onFaceClick={handleFaceClick}
                        />
                    ))
                )}
            </group>

            <OrbitControls />
        </Canvas>
    );
}