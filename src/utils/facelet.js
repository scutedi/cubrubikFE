import { AXIS_INDEX, FACE_COLORS } from "../constants/cube";
import {solvedColors} from "./cubeGeometry";


export function colorToLetter(color, faceColors = FACE_COLORS) {
  switch (color) {
    case faceColors.U: return "U";
    case faceColors.R: return "R";
    case faceColors.F: return "F";
    case faceColors.D: return "D";
    case faceColors.L: return "L";
    case faceColors.B: return "B";
    default:           return "X";
  }
}

function getFaceGrid(cubies, axis, value, faceKey) {
    const grid = Array(9).fill("X");

    cubies
        .filter((c) => c.position[AXIS_INDEX[axis]] === value)
        .forEach((c) => {

            const [x, y, z] = c.position;
            let row, col;

            if (axis === "y" && value === 1)        { row = 2 - (z + 1); col = x + 1; }
            else if (axis === "y" && value === -1)  { row = z + 1;       col = x + 1; }
            else if (axis === "z" && value === 1)   { row = 2 - (y + 1); col = x + 1; }
            else if (axis === "z" && value === -1)  { row = 2 - (y + 1); col = 2 - (x + 1); }
            else if (axis === "x" && value === 1)   { row = 2 - (y + 1); col = 2 - (z + 1); }
            else                                    { row = 2 - (y + 1); col = z + 1; }

            grid[row * 3 + col] = c.colors[faceKey] ?? "X";
        });

    return grid;
}

export function generateFaceletString(cubies, faceColors = FACE_COLORS) {
    const faces = [
        getFaceGrid(cubies, "y", 1, "U"),
        getFaceGrid(cubies, "x", 1, "R"),
        getFaceGrid(cubies, "z", 1, "F"),
        getFaceGrid(cubies, "y", -1, "D"),
        getFaceGrid(cubies, "x", -1, "L"),
        getFaceGrid(cubies, "z", -1, "B"),
    ];

    return faces
        .map((grid) =>
            grid.map((color) => colorToLetter(color, faceColors)).join("")
        )
        .join("");
}
