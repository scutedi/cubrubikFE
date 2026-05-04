// cubeUtils.js

export const FACE_ORDER = ['U', 'R', 'F', 'D', 'L', 'B'];

// --- parse string în fețe
export const parseFaces = (str) => {
    return {
        U: str.slice(0, 9),
        R: str.slice(9, 18),
        F: str.slice(18, 27),
        D: str.slice(27, 36),
        L: str.slice(36, 45),
        B: str.slice(45, 54),
    };
};

// --- literă -> culoare
export const letterToColor = (letter, FACE_COLORS) => {
    return FACE_COLORS[letter] || '#000';
};

// --- funcția principală
export const applyFaceletStringToCubies = (cubies, faceletString, FACE_COLORS) => {
    const faces = parseFaces(faceletString);

    return cubies.map(cubie => {
        const [x, y, z] = cubie.position;
        let newColors = { ...cubie.colors };

        const setColor = (faceKey, index) => {
            const letter = faces[faceKey][index];
            newColors[faceKey] = letterToColor(letter, FACE_COLORS);
        };

        // --- U
        if (y === 1) {
            const row = 2 - (z + 1);
            const col = x + 1;
            setColor('U', row * 3 + col);
        }

        // --- D
        if (y === -1) {
            const row = z + 1;
            const col = x + 1;
            setColor('D', row * 3 + col);
        }

        // --- F
        if (z === 1) {
            const row = 2 - (y + 1);
            const col = x + 1;
            setColor('F', row * 3 + col);
        }

        // --- B (invers pe X)
        if (z === -1) {
            const row = 2 - (y + 1);
            const col = 2 - (x + 1);
            setColor('B', row * 3 + col);
        }

        // --- R (invers pe Z)
        if (x === 1) {
            const row = 2 - (y + 1);
            const col = 2 - (z + 1);
            setColor('R', row * 3 + col);
        }

        // --- L
        if (x === -1) {
            const row = 2 - (y + 1);
            const col = z + 1;
            setColor('L', row * 3 + col);
        }

        return { ...cubie, colors: newColors };
    });
};