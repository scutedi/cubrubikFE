export const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
export const RX_CHAR_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
export const TX_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

export const FACE_COLORS = {
    U: "#2775B6",
    D: "#32CD32",
    F: "#FFFFFF",
    B: "#FFD32C",
    L: "#FA6800",
    R: "#FF0000",
};

export const GREY = "#606060";

export const PRESET_COLORS = ["#32CD32", "#2775B6", "#FA6800", "red", "white", "#FFD32C"];

export const FACE_INDEX_TO_NAME = ["R", "L", "U", "D", "F", "B"];

export const AXIS_INDEX = { x: 0, y: 1, z: 2 };

export const faceToAxis = {
  U: { axis: "y", value: 1 },  U1: { axis: "y", value: 1 },
  D: { axis: "y", value: -1 }, D1: { axis: "y", value: -1 },
  F: { axis: "z", value: 1 },  F1: { axis: "z", value: 1 },
  B: { axis: "z", value: -1 }, B1: { axis: "z", value: -1 },
  L: { axis: "x", value: -1 }, L1: { axis: "x", value: -1 },
  R: { axis: "x", value: 1 },  R1: { axis: "x", value: 1 },
};
