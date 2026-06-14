import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

import Cubie from "./Cubie";

const TURN_DURATION = 0.1;

export default function RotatingGroup({
                                          cubies,
                                          axis,
                                          clockwise,
                                          onFinish,
                                      }) {
    const groupRef = useRef();
    const startRef = useRef(null);
    const finishedRef = useRef(false);

    // reset la fiecare rotație nouă
    useEffect(() => {
        startRef.current = null;
        finishedRef.current = false;
    }, [axis, clockwise, cubies]);

    useFrame((state) => {
        if (finishedRef.current) return;

        if (startRef.current === null) {
            startRef.current = state.clock.elapsedTime;
        }

        const t = Math.min(
            (state.clock.elapsedTime - startRef.current) / TURN_DURATION,
            1
        );

        const angle = (Math.PI / 2) * (clockwise ? t : -t);

        if (groupRef.current) {
            groupRef.current.rotation[axis] = angle;
        }

        if (t >= 1 && !finishedRef.current) {
            finishedRef.current = true;

            if (groupRef.current) {
                groupRef.current.rotation[axis] = clockwise
                    ? Math.PI / 2
                    : -Math.PI / 2;
            }

            onFinish?.();
        }
    });

    return (
        <group ref={groupRef}>
            {cubies.map((c) => (
                <Cubie key={c.key} position={c.position} colors={c.colors} />
            ))}
        </group>
    );
}