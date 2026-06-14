import { FACE_COLORS, GREY } from "../constants/cube";

export function isFaceCenter([x, y, z]) {
  return [x, y, z].filter((v) => v !== 0).length === 1;
}

export function solvedColors([x, y, z], faceColors = FACE_COLORS) {
  const colors = {};
  if (x === 1) colors.R = faceColors.R;
  if (x === -1) colors.L = faceColors.L;
  if (y === 1) colors.U = faceColors.U;
  if (y === -1) colors.D = faceColors.D;
  if (z === 1) colors.F = faceColors.F;
  if (z === -1) colors.B = faceColors.B;
  return colors;
}

export function centersOnlyColors(position, faceColors = FACE_COLORS, grey = GREY) {
  const greyed = {};
  for (const face of Object.keys(solvedColors(position, faceColors))) greyed[face] = grey;
  if (isFaceCenter(position)) Object.assign(greyed, solvedColors(position, faceColors));
  return greyed;
}

export function createSolvedCubies(faceColors = FACE_COLORS) {
  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const position = [x, y, z];
        cubies.push({ key: `${x}${y}${z}`, position, colors: solvedColors(position, faceColors) });
      }
    }
  }
  return cubies;
}

export function rotatePosition([x, y, z], axis, cw) {
  switch (axis) {
    case "x": return cw ? [x, -z, y] : [x, z, -y];
    case "y": return cw ? [z, y, -x] : [-z, y, x];
    case "z": return cw ? [-y, x, z] : [y, -x, z];
    default:  return [x, y, z];
  }
}

export function rotateColors(colors, axis, cw) {
  switch (axis) {
    case "x":
      return cw
        ? { ...colors, U: colors.B, B: colors.D, D: colors.F, F: colors.U }
        : { ...colors, U: colors.F, F: colors.D, D: colors.B, B: colors.U };
    case "y":
      return cw
        ? { ...colors, F: colors.L, L: colors.B, B: colors.R, R: colors.F }
        : { ...colors, F: colors.R, R: colors.B, B: colors.L, L: colors.F };
    case "z":
      return cw
        ? { ...colors, U: colors.R, R: colors.D, D: colors.L, L: colors.U }
        : { ...colors, U: colors.L, L: colors.D, D: colors.R, R: colors.U };
    default:
      return colors;
  }
}
