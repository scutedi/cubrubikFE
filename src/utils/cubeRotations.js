export function rotatePosAroundX([x, y, z], cw) {
    return cw ? [x, -z, y] : [x, z, -y];
}

export function rotatePosAroundY([x, y, z], cw) {
    return cw ? [z, y, -x] : [-z, y, x];
}

export function rotatePosAroundZ([x, y, z], cw) {
    const [dx, dy] = [x, y];
    const [nx, ny] = cw ? [-dy, dx] : [dy, -dx];
    return [nx, ny, z];
}

export function rotateColorsAroundX(colors, cw) {
    return cw
        ? { U: colors.B, B: colors.D, D: colors.F, F: colors.U, L: colors.L, R: colors.R }
        : { U: colors.F, F: colors.D, D: colors.B, B: colors.U, L: colors.L, R: colors.R };
}

export function rotateColorsAroundY(colors, cw) {
    return cw
        ? { F: colors.L, L: colors.B, B: colors.R, R: colors.F, U: colors.U, D: colors.D }
        : { F: colors.R, R: colors.B, B: colors.L, L: colors.F, U: colors.U, D: colors.D };
}

export function rotateColorsAroundZ(colors, cw) {
    return cw
        ? { U: colors.R, R: colors.D, D: colors.L, L: colors.U, F: colors.F, B: colors.B }
        : { U: colors.L, L: colors.D, D: colors.R, R: colors.U, F: colors.F, B: colors.B };
}

export const faceToAxis = {
    U: { axis: 'y', value: 1 }, U1: { axis: 'y', value: 1 },
    D: { axis: 'y', value: -1 }, D1: { axis: 'y', value: -1 },
    F: { axis: 'z', value: 1 }, F1: { axis: 'z', value: 1 },
    B: { axis: 'z', value: -1 }, B1: { axis: 'z', value: -1 },
    L: { axis: 'x', value: -1 }, L2: { axis: 'x', value: -1 },
    R: { axis: 'x', value: 1 }, R2: { axis: 'x', value: 1 }
};