import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function RotatingGroup({ cubies, axis, clockwise, onFinish }) {
    const ref = useRef();
    const start = useRef(null);

    useFrame((state) => {
        if (!start.current) start.current = state.clock.elapsedTime;

        const t = Math.min((state.clock.elapsedTime - start.current) / 0.1, 1);
        const angle = (Math.PI / 2) * (clockwise ? t : -t);

        if (axis === 'x') ref.current.rotation.x = angle;
        if (axis === 'y') ref.current.rotation.y = angle;
        if (axis === 'z') ref.current.rotation.z = angle;

        if (t === 1) {
            onFinish();
            start.current = null;
        }
    });

    return <group ref={ref}>{cubies}</group>;
}