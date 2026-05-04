export const colorToLetter = (color, FACE_COLORS) => {
    if (color === FACE_COLORS.U) return "U";
    if (color === FACE_COLORS.R) return "R";
    if (color === FACE_COLORS.F) return "F";
    if (color === FACE_COLORS.D) return "D";
    if (color === FACE_COLORS.L) return "L";
    if (color === FACE_COLORS.B) return "B";
    return "X";
};