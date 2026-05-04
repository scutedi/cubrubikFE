import React, { useRef } from 'react';
import * as THREE from 'three';

const FACE_INDEX_TO_NAME = ['R', 'L', 'U', 'D', 'F', 'B'];

export default function Cubie({ position, colors, onFaceClick }) {
    const meshRef = useRef();

    const materials = [
        new THREE.MeshBasicMaterial({ color: colors.R || 'black' }),
        new THREE.MeshBasicMaterial({ color: colors.L || 'black' }),
        new THREE.MeshBasicMaterial({ color: colors.U || 'black' }),
        new THREE.MeshBasicMaterial({ color: colors.D || 'black' }),
        new THREE.MeshBasicMaterial({ color: colors.F || 'black' }),
        new THREE.MeshBasicMaterial({ color: colors.B || 'black' }),
    ];

    const handleClick = (e) => {
        e.stopPropagation();
        const faceIdx = Math.floor(e.faceIndex / 2);
        const faceName = FACE_INDEX_TO_NAME[faceIdx];
        onFaceClick?.(position, faceName);
    };

    return (
        <group position={position}>
            <mesh ref={meshRef} material={materials} onClick={handleClick}>
                <boxGeometry args={[1, 1, 1]} />
            </mesh>
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005, 1.005, 1.005))}>
                <lineBasicMaterial color="black" />
            </lineSegments>
        </group>
    );
}