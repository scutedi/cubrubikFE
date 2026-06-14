import { useCallback, useEffect, useState } from "react";

import { AXIS_INDEX, FACE_COLORS, GREY, faceToAxis } from "../constants/cube";
import {
  createSolvedCubies,
  solvedColors,
  centersOnlyColors,
  rotatePosition,
  rotateColors,
  isFaceCenter,
} from "../utils/cubeGeometry";
import { generateFaceletString } from "../utils/facelet";
import { applyFaceletStringToCubies } from "../utils/cubeUtils";
import {toast} from "react-toastify";

const FLIPPED_FACES = new Set(["L1", "R", "U", "B1", "F", "D1"]);

export function useRubikCube({ onRotationComplete, isConfigMode = false , configCubies, setConfigCubies} = {}) {
    const [cubies, setCubies] = useState(createSolvedCubies);
    const [rotationQueue, setRotationQueue] = useState([]);
    const [currentRotation, setCurrentRotation] = useState(null);

    const enqueueRotation = useCallback((move) => {
        setRotationQueue((q) => [...q, move]);
    }, []);

    useEffect(() => {
        if (currentRotation || rotationQueue.length === 0) return;

        const { face, direction } = rotationQueue[0];
        const { axis, value } = faceToAxis[face];

        let clockwise = direction !== 1;
        if (FLIPPED_FACES.has(face)) clockwise = !clockwise;

        const slice = cubies.filter(
            (c) => Math.round(c.position[AXIS_INDEX[axis]]) === value
        );

        setCurrentRotation({ face, axis, value, clockwise, cubies: slice });
    }, [rotationQueue, currentRotation, cubies]);

    const finishRotation = useCallback(() => {
        if (!currentRotation) return;

        const { axis, clockwise, cubies: slice } = currentRotation;
        const sliceKeys = new Set(slice.map((c) => c.key));

        setCubies((prev) => {
            const rotated = slice.map((c) => ({
                ...c,
                position: rotatePosition(c.position, axis, clockwise),
                colors: rotateColors(c.colors, axis, clockwise),
            }));

            const updated = [
                ...prev.filter((c) => !sliceKeys.has(c.key)),
                ...rotated,
            ];

            onRotationComplete?.(generateFaceletString(updated));
            return updated;
        });

        setCurrentRotation(null);
        setRotationQueue((q) => q.slice(1));
    }, [currentRotation, onRotationComplete]);

    const resetColors = useCallback(() => {
        setCubies((prev) =>
            prev.map((c) => ({
                ...c,
                colors: solvedColors(c.position),
            }))
        );
    }, []);

    const replaceCubies = useCallback((newCubies) => {
        setCubies(newCubies);
    }, []);

    // 🔥 CONFIG MODE PAINT
    const paintFace = useCallback((position, face, color, sourceCubies) => {
        if (!isConfigMode) return;
        if (!color) return;

        if (isFaceCenter(position)) return;

        setConfigCubies(prev => {
            if (!prev) return prev;

            const idx = prev.findIndex(
                c =>
                    c.position[0] === position[0] &&
                    c.position[1] === position[1] &&
                    c.position[2] === position[2]
            );

            if (idx === -1) return prev;

            const updated = [...prev];

            const current = updated[idx].colors[face];

            // toggle off → gri
            if (current === color) {
                updated[idx] = {
                    ...updated[idx],
                    colors: {
                        ...updated[idx].colors,
                        [face]: "#606060"
                    }
                };
                return updated;
            }

            updated[idx] = {
                ...updated[idx],
                colors: {
                    ...updated[idx].colors,
                    [face]: color
                }
            };

            return updated;
        });
    }, [isConfigMode, configCubies]);

    const applyFacelet = useCallback((str) => {
        if (!str) return;
        setCubies((prev) =>
            applyFaceletStringToCubies(prev, str, FACE_COLORS)
        );
    }, []);

    // 🔥 IMPORTANT: verifică dacă mai există gri
    const hasUnfilled = cubies.some((c) =>
        Object.values(c.colors).some((col) => col == null)
    );

    const isFullyColored = !hasUnfilled;

    return {
        cubies,
        currentRotation,
        finishRotation,
        enqueueRotation,
        resetColors,
        paintFace,
        applyFacelet,
        isFullyColored,
        replaceCubies
    };
}
