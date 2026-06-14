const ROTATION_PACKET = 1;

const BYTE_TO_FACE = {
  0: "U", 1: "U1", 2: "D", 3: "D1",
  4: "F", 5: "F1", 6: "B", 7: "B1",
  8: "R", 9: "R1", 10: "L", 11: "L1",
};

const PRIME_NOTATION = { U1: "U'", D1: "D'", L1: "L'", R1: "R'", B1: "B'", F1: "F'" };

export const faceToNotation = (face) => PRIME_NOTATION[face] ?? face;

export function decodeRotationPacket(bytes) {
  if (bytes[2] !== ROTATION_PACKET) return null;
  const face = BYTE_TO_FACE[bytes[3]];
  if (!face) return null;
  return { face, direction: bytes[4], move: faceToNotation(face) };
}

export function expandMoves(moves) {
  return moves.flatMap((m) => (m.endsWith("2") ? [m[0], m[0]] : [m]));
}
