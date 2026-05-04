import React, {useState, useRef, useEffect, useCallback} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import BluetoothLogo from './assets/bluetooth.png';
import SettingsLogo from './assets/settings.png';
import CompasLogo from './assets/compas.png';
import CompasGreenLogo from './assets/compasGreen.png';
import CompasGreyLogo from './assets/compasGrey.png';
import BluetoothGreyLogo from './assets/bluetoothGrey.png';
import BluetoothGreenLogo from './assets/bluetoothGreen.png';
import SettingsGreyLogo from './assets/settingsGrey.png';
import SettingsGreenLogo from './assets/settingsGreen.png';
import HomePage from './assets/house.png';
import {AuthButtons} from "./Auth/AuthButtons";
import {FloatingMenu} from "./Tutorial/TutorialMenu";
import Logo from "./components/UI/Logo";
import {applyFaceletStringToCubies} from "./components/Cube/cubeUtils";
import SolutionViewer from "./components/Cube/SolutionViewer";

const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const RX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const TX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

const FACE_COLORS = {
    U: '#2775B6',   // albastru
    D: '#32CD32',   // verde
    F: '#FFFFFF',   // alb
    B: '#FFD32C',   // galben
    L: '#FA6800',   // portocaliu
    R: 'red'        // roșu
};

const PRESET_COLORS = [
  '#32CD32', '#2775B6', '#FA6800', 'red', 'white', '#FFD32C'
];


function createCubies() {
  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({ position: [x, y, z], key: `${x}${y}${z}` });
      }
    }
  }
  return cubies;
}

const testLedComenzi = async (server) => {
  const services = await server.getPrimaryServices();

  for (const service of services) {
    const characteristics = await service.getCharacteristics();

    for (const char of characteristics) {
      if (char.properties.write) {
        console.log(`Încearcă LED la characteristic ${char.uuid}`);

        try {
          await char.writeValue(new Uint8Array([0x01]));  // test aprindere
          console.log(`Trimis 0x01 la ${char.uuid}`);
          await new Promise(r => setTimeout(r, 1000));

          await char.writeValue(new Uint8Array([0x00]));  // test stingere
          console.log(`Trimis 0x00 la ${char.uuid}`);
        } catch (e) {
          console.warn(`Eroare la ${char.uuid}`, e);
        }
      }
    }
  }
};

function Cubie({ position, colors, onFaceClick }) {
  const meshRef = useRef();
  const edgesRef = useRef();

  const materials = [
    new THREE.MeshBasicMaterial({ color: colors.R || 'black' }),
    new THREE.MeshBasicMaterial({ color: colors.L || 'black' }),
    new THREE.MeshBasicMaterial({ color: colors.U || 'black' }),
    new THREE.MeshBasicMaterial({ color: colors.D || 'black' }),
    new THREE.MeshBasicMaterial({ color: colors.F || 'black' }),
    new THREE.MeshBasicMaterial({ color: colors.B || 'black' }),
  ];

  const FACE_INDEX_TO_NAME = ['R', 'L', 'U', 'D', 'F', 'B'];

  const handleClick = (event) => {
    event.stopPropagation();
    const faceIdx = Math.floor(event.faceIndex / 2);
    const faceName = FACE_INDEX_TO_NAME[faceIdx];
    if (onFaceClick) onFaceClick(position, faceName);
  };



  return (
    <group position={position}>
      <mesh ref={meshRef} material={materials} onClick={handleClick}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <lineSegments
        ref={edgesRef}
        geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005, 1.005, 1.005))}
      >
        <lineBasicMaterial color="black" />
      </lineSegments>
    </group>
  );
}

function rotatePosAroundX([x, y, z], cw) {
  return cw ? [x, -z, y] : [x, z, -y];
}
function rotatePosAroundY([x, y, z], cw) {
  return cw ? [z, y, -x] : [-z, y, x];
}
function rotatePosAroundZ([x, y, z], cw) {
    return cw ? [-y, x, z] : [y, -x, z];
}

function rotateColorsAroundX(colors, cw) {
  return cw ? { U: colors.B, B: colors.D, D: colors.F, F: colors.U, L: colors.L, R: colors.R } :
              { U: colors.F, F: colors.D, D: colors.B, B: colors.U, L: colors.L, R: colors.R };
}
function rotateColorsAroundY(colors, cw) {
  return cw ? { F: colors.L, L: colors.B, B: colors.R, R: colors.F, U: colors.U, D: colors.D } :
              { F: colors.R, R: colors.B, B: colors.L, L: colors.F, U: colors.U, D: colors.D };
}
function rotateColorsAroundZ(colors, cw) {
  return cw ? { U: colors.R, R: colors.D, D: colors.L, L: colors.U, F: colors.F, B: colors.B } :
              { U: colors.L, L: colors.D, D: colors.R, R: colors.U, F: colors.F, B: colors.B };
}

const faceToAxis = {
  U: { axis: 'y', value: 1 }, U1: { axis: 'y', value: 1 },
  D: { axis: 'y', value: -1 }, D1: { axis: 'y', value: -1 },
  F: { axis: 'z', value: 1 }, F1: { axis: 'z', value: 1 },
  B: { axis: 'z', value: -1 }, B1: { axis: 'z', value: -1 },
  L: { axis: 'x', value: -1 }, L1: { axis: 'x', value: -1 },
  R: { axis: 'x', value: 1 }, R1: { axis: 'x', value: 1 }
};

function RotatingGroup({ cubies, axis, clockwise, onFinish }) {
  const groupRef = useRef();
  const start = useRef(null);

  useFrame((state) => {
    if (!start.current) start.current = state.clock.elapsedTime;
    const t = Math.min((state.clock.elapsedTime - start.current) / 0.1, 1);
    const angle = (Math.PI / 2) * (clockwise ? t : -t);

    if (axis === 'x') groupRef.current.rotation.x = angle;
    if (axis === 'y') groupRef.current.rotation.y = angle;
    if (axis === 'z') groupRef.current.rotation.z = angle;

    if (t === 1) {
      onFinish();
      start.current = null; // reset for safety
    }
  });

  return (
    <group ref={groupRef}>
      {cubies.map(c => <Cubie key={c.key} position={c.position} colors={c.colors} />)}
    </group>
  );
}

export default function App() {
  const defaultOrientationRef = useRef(new THREE.Quaternion());
  const [status, setStatus] = useState('Neconectat');
  const [messages, setMessages] = useState([]);
  const [cubies, setCubies] = useState(() => createCubies().map(c => {
    const [x, y, z] = c.position;
    const colors = {};
    if (x === 1) colors.R = FACE_COLORS.R;
    if (x === -1) colors.L = FACE_COLORS.L;
    if (y === 1) colors.U = FACE_COLORS.U;
    if (y === -1) colors.D = FACE_COLORS.D;
    if (z === 1) colors.F = FACE_COLORS.F;
    if (z === -1) colors.B = FACE_COLORS.B;
    return { ...c, colors };
  }));

  const GREY = '#606060';
  const colorOnlyCenters = () => {
    setCubies(cubies =>
      cubies.map(cubie => {
        const [x, y, z] = cubie.position;
        const colors = {}
        if (x === 1) colors.R = GREY;
        if (x === -1) colors.L = GREY;
        if (y === 1) colors.U = GREY;
        if (y === -1) colors.D = GREY;
        if (z === 1) colors.F = GREY;
        if (z === -1) colors.B = GREY;
        if (x === 1 && y === 0 && z === 0) colors.R = FACE_COLORS.R;
        if (x === -1 && y === 0 && z === 0) colors.L = FACE_COLORS.L;
        if (y === 1 && x === 0 && z === 0) colors.U = FACE_COLORS.U;
        if (y === -1 && x === 0 && z === 0) colors.D = FACE_COLORS.D;
        if (z === 1 && x === 0 && y === 0) colors.F = FACE_COLORS.F;
        if (z === -1 && x === 0 && y === 0) colors.B = FACE_COLORS.B;

        return { ...cubie, colors };
      })
    );
  };

  const resetColors = () => {
    setCubies(cubies =>
      cubies.map(cubie => {
        const [x, y, z] = cubie.position;
        const colors = {};
        if (x === 1) colors.R = FACE_COLORS.R;
        if (x === -1) colors.L = FACE_COLORS.L;
        if (y === 1) colors.U = FACE_COLORS.U;
        if (y === -1) colors.D = FACE_COLORS.D;
        if (z === 1) colors.F = FACE_COLORS.F;
        if (z === -1) colors.B = FACE_COLORS.B;
        return { ...cubie, colors };
      })
    );
  };


  const txCharacteristicRef = useRef(null);
  const [rotationQueue, setRotationQueue] = useState([]);
  const [currentRotation, setCurrentRotation] = useState(null);
  const [showCalibration, setShowCalibration] = useState(false);
  const [baraDeSus, setBaraDeSus] = useState(true);
  const cubeGroupRef = useRef();
  const [configMode, setConfigMode] = React.useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [solution, setSolution] = useState("");
    const [hoveredMove, setHoveredMove] = useState(null);

  const [showButtonConfigurare, setShowButtonConfigurare] = useState(true);
  const [hamburgerButton, setHamburgerButton] = useState(true);
  const notificationHandlerRef = useRef(null);
    const listenerRef = useRef(null);
    const isListeningRef = useRef(false);

    useEffect(() => {
        notificationHandlerRef.current = handleNotifications;
    });

  const [onlyCenters, setOnlyCenters] = useState(false);

  const handleButtonClick = () => {
    setShowColorPicker(true);

     if (!onlyCenters) {
     colorOnlyCenters();
    } else {
     resetColors();
    }

      setOnlyCenters(prev => !prev);; // schimbă starea pentru data viitoare
  };

  const isCubeFullyColored = cubies.every(cubie =>
    Object.values(cubie.colors).every(color => color !== GREY)
  );

  const isMiddleFaceCubie = (pos) => {
    const [x, y, z] = pos;
    if (x === 1 && y === 0 && z === 0) return 1;
    if (x === -1 && y === 0 && z === 0)  return 1;
    if (y === 1 && x === 0 && z === 0)  return 1;
    if (y === -1 && x === 0 && z === 0)  return 1;
    if (z === 1 && x === 0 && y === 0)  return 1;
    if (z === -1 && x === 0 && y === 0)  return 1;
    return 0;
  };

  const handleFaceClick = (pos, face) => {
    if (!selectedColor) return; // Dacă nu avem culoare selectată, nu facem nimic

    if (isMiddleFaceCubie(pos)) return;
    setCubies(oldCubies => {
      return oldCubies.map(c => {
        if (
          c.position[0] === pos[0] &&
          c.position[1] === pos[1] &&
          c.position[2] === pos[2]
        ) {
          return {
            ...c,
            colors: { ...c.colors, [face]: selectedColor },
          };
        }
        return c;
      });
    });
  };

  const initialQuaternionRef = useRef(null);
  const captureNextQuatRef = useRef(false);
  const modelCorrectionRef = useRef(new THREE.Quaternion());

  const handleNotifications = (event) => {
    const value = event.target.value;
    const bytes = [];
    for (let i = 0; i < value.byteLength; i++) bytes.push(value.getUint8(i));

    // -- Orientation quaternion packet
    // if (bytes[2] === 3) {
    //   const text = bytes.slice(3, -3).map(b => String.fromCharCode(b)).join('');
    //   const [x, y, z, w] = text.split('#').map(Number).map(n => n / 16384);

    //   const q = new THREE.Quaternion(x, y, z, w);

    //   if (captureNextQuatRef.current || !initialQuaternionRef.current) {
    //     initialQuaternionRef.current = q.clone().invert();
    //     captureNextQuatRef.current = false;
    //     setStatus('Conectat');
    //   }

    //   let finalQ = q.clone();
    //   if (initialQuaternionRef.current) {
    //     finalQ.premultiply(initialQuaternionRef.current);
    //   }

    //   if (modelCorrectionRef.current) {
    //     finalQ = modelCorrectionRef.current.clone().multiply(finalQ);
    //   }

    //   if (cubeGroupRef.current) {
    //     cubeGroupRef.current.setRotationFromQuaternion(finalQ);
    //   }
    //   return;
    // }

    // -- Rotation move packet
    if (bytes[2] !== 1) return;

      const faceMap = {
          0: 'U',
          1: 'U1',
          2: 'D',
          3: 'D1',
          4: 'F',
          5: 'F1',
          6: 'B',
          7: 'B1',
          8: 'R',
          9: 'R1',
          10: 'L',
          11: 'L1'
      };
    const face = faceMap[bytes[3]];
    const direction = bytes[4];

    setRotationQueue(q => [...q, { face, direction }]);
  };

  const resetOrientation = () => {
    if (!cubeGroupRef.current) return;

    cubeGroupRef.current.setRotationFromQuaternion(new THREE.Quaternion(0,0,0,1));
  };


  useEffect(() => {

    // NU începe rotație nouă dacă există deja una în curs
    if (currentRotation !== null) return;
    if (rotationQueue.length === 0) return;

    const { face, direction } = rotationQueue[0];
    const { axis, value } = faceToAxis[face];
    let clockwise = direction !== 1;
    if (['L1', 'R', 'U', 'B1', 'F', 'D1'].includes(face)) clockwise = !clockwise;

    const rotatingCubies = cubies.filter(c => Math.round(c.position[['x','y','z'].indexOf(axis)]) === value);
    setCurrentRotation({ face, axis, value, clockwise, cubies: rotatingCubies });
  }, [rotationQueue, currentRotation, cubies]);

  const [orientationSaved, setOrientationSaved] = useState(false);

  useEffect(() => {
    if (!orientationSaved && cubeGroupRef.current) {
      // Salvează quaternionul inițial
      defaultOrientationRef.current = cubeGroupRef.current.quaternion.clone();
      console.log('Orientarea inițială salvată:', defaultOrientationRef.current);
      setOrientationSaved(true);
    }
  }, [orientationSaved, cubeGroupRef.current]);


  const onFinishRotation = () => {
    const { axis, clockwise, cubies: rotatingCubies } = currentRotation;
    const newCubies = rotatingCubies.map(c => {
      const newPos = axis === 'x' ? rotatePosAroundX(c.position, clockwise)
                    : axis === 'y' ? rotatePosAroundY(c.position, clockwise)
                    : rotatePosAroundZ(c.position, clockwise);
      const newColors = axis === 'x' ? rotateColorsAroundX(c.colors, clockwise)
                        : axis === 'y' ? rotateColorsAroundY(c.colors, clockwise)
                        : rotateColorsAroundZ(c.colors, clockwise);
      return { ...c, position: newPos, colors: newColors };
    });

    setCubies(prev => {
      const rotatingKeys = new Set(rotatingCubies.map(c => c.key));
      return [...prev.filter(c => !rotatingKeys.has(c.key)), ...newCubies];
    });
    setCurrentRotation(null);
    setRotationQueue(q => q.slice(1));
  };


  const handleCalibrate = () => {
    setShowCalibration(true);
  };

  const LED_SERVICE_UUID = '0000a002-0000-1000-8000-00805f9b34fb';
  const LED_CHARACTERISTIC_UUID = '0000a003-0000-1000-8000-00805f9b34fb';

    const connectGoCube = async () => {
        try {
            setStatus('Se caută dispozitivul...');

            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'GoCube' }],
                optionalServices: [SERVICE_UUID]
            });

            setStatus('Se conectează...');
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(SERVICE_UUID);
            const rx = await service.getCharacteristic(RX_CHAR_UUID);
            const tx = await service.getCharacteristic(TX_CHAR_UUID);

            txCharacteristicRef.current = tx;

            // 🔥 IMPORTANT: evităm dublarea
            await stopNotifications(); // safety
            await startNotifications();

            setStatus('Conectat și ascultă notificări');

        } catch (e) {
            console.error(e);
            setStatus('Eroare la conectare');
        }
    };

    const handlerRef = useRef(null);
    const listenerAttachedRef = useRef(false);

    useEffect(() => {
        handlerRef.current = handleNotifications;
    }, []);
    const onNotify = useCallback((event) => {
        const v = event.target.value;
        const bytes = Array.from(new Uint8Array(v.buffer));
        handleStream(bytes);
    }, []);
    const handleStream = (bytes) => {
        const type = bytes[2];

        // 🔥 DOAR rotații reale
        if (type === 1) {
            parseRotation(bytes);
            return;
        }

        // debug alte date
        // console.log("OTHER:", bytes);
    };
    const parseRotation = (bytes) => {
        const faceMap = {
            0: 'U',
            1: 'U1',
            2: 'D',
            3: 'D1',
            4: 'F',
            5: 'F1',
            6: 'B',
            7: 'B1',
            8: 'R',
            9: 'R1',
            10: 'L',
            11: 'L1'
        };
        let face = faceMap[bytes[3]];
        const direction = bytes[4];

        // transformăm în notație clasică cub
        const move =
            face === 'D1' ? "D'" :
                face === 'U1' ? "U'" :
                    face === 'L1' ? "L'" :
                        face === 'R1' ? "R'" :
                            face === 'B1' ? "B'" :
                                face === 'F1' ? "F'" :
                                    face;

        setSolutionMoves(prev => {
            if (!prev || prev.length === 0) return prev;

            // dacă mutarea făcută este prima din soluție
            if (prev[0] === move) {
                return prev.slice(1); // o eliminăm
            }

            return prev; // altfel nu facem nimic
        });

        setRotationQueue(q => [...q, { face, direction }]);
    };

    const stopNotifications = async () => {
        try {
            const tx = txCharacteristicRef.current;
            if (!tx) return;

            // ACUM removeEventListener va funcționa pentru că onNotify este stabilă
            tx.removeEventListener('characteristicvaluechanged', onNotify);

            try {
                await tx.stopNotifications();
            } catch (err) {
                // Uneori stopNotifications crapă dacă dispozitivul e deconectat, e safe să dăm catch
            }

            listenerAttachedRef.current = false;
            isListeningRef.current = false;
            setStatus('Notificările au fost oprite');
        } catch (e) {
            console.error("Eroare la stop:", e);
        }
    };

    const startNotifications = async () => {
        try {
            const tx = txCharacteristicRef.current;
            if (!tx) return;

            if (listenerAttachedRef.current) return;

            tx.removeEventListener('characteristicvaluechanged', onNotify);

            await tx.startNotifications();
            tx.addEventListener('characteristicvaluechanged', onNotify);

            listenerAttachedRef.current = true;
            isListeningRef.current = true;
            setStatus('Notificările au fost pornite');
        } catch (e) {
            console.error("Eroare la start:", e);
        }
    };

    const expandMoves = (moves) => {
        const result = [];

        moves.forEach(m => {
            if (m.endsWith("2")) {
                const base = m[0];
                result.push(base);
                result.push(base);
            } else {
                result.push(m);
            }
        });

        return result;
    };

  const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '14px',
    backgroundColor: 'transparent',
    color: '#888' ,
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    display: 'flex',
    alignItems: 'center',      // aliniază vertical imaginea și textul
    outline: 'none',
    boxShadow: 'none',
    border: 'none',
  };
    const getFaceGrid = (cubies, axis, value, faceKey) => {
        const faceCubies = cubies.filter(
            c => c.position[['x', 'y', 'z'].indexOf(axis)] === value
        );

        const grid = Array(9).fill(null);

        faceCubies.forEach(c => {
            const [x, y, z] = c.position;
            let row, col;

            // 🔵 U (y = 1) - Sus
            if (axis === 'y' && value === 1) {
                row = 2 - (z + 1);
                col = x + 1;
            }
            // 🟢 D (y = -1) - Jos
            else if (axis === 'y' && value === -1) {
                row = z + 1;
                col = x + 1;
            }
            // 🟠 F (z = 1) - Fata (MODIFICAT)
            else if (axis === 'z' && value === 1) {
                row = 2 - (y + 1); // y=1 e rândul 0, y=-1 e rândul 2
                col = x + 1;       // x=-1 e col 0, x=1 e col 2
            }
            // 🔴 B (z = -1) - Spate (MODIFICAT)
            else if (axis === 'z' && value === -1) {
                row = 2 - (y + 1);
                col = 2 - (x + 1); // Oglindit orizontal pentru fața din spate
            }
            // 🟡 R (x = 1) - Dreapta
            else if (axis === 'x' && value === 1) {
                row = 2 - (y + 1);
                col = 2 - (z + 1);
            }
            // ⚫ L (x = -1) - Stânga
            else if (axis === 'x' && value === -1) {
                row = 2 - (y + 1);
                col = z + 1;
            }

            // Folosim o funcție care detectează culoarea vizibilă, nu cea statică
            grid[row * 3 + col] = getActualColor(c, faceKey);
        });

        return grid;
    };
    const getActualColor = (cubie, faceKey) => {
        // În mod normal, dacă ai rotit culorile piesei când ai făcut mișcarea,
        // piesa ar trebui să aibă culoarea corectă sub cheia feței respective.

        const color = cubie.colors[faceKey];

        // Dacă piesa nu are culoare pe acea față (ex: un cubie de interior sau de altă margine),
        // returnăm ceva să nu crape, dar în mod normal aici va fi culoarea vizibilă.
        return color || "X";
    };


    const colorToLetter = (color) => {
        if (color === FACE_COLORS.U) return "U";
        if (color === FACE_COLORS.R) return "R";
        if (color === FACE_COLORS.F) return "F";
        if (color === FACE_COLORS.D) return "D";
        if (color === FACE_COLORS.L) return "L";
        if (color === FACE_COLORS.B) return "B";
        return "X";
    };

    const generateFaceletString = () => {

        const U = getFaceGrid(cubies, 'y', 1, 'U');
        const D = getFaceGrid(cubies, 'y', -1, 'D');
        const F = getFaceGrid(cubies, 'z', 1, 'F');
        const B = getFaceGrid(cubies, 'z', -1, 'B');
        const R = getFaceGrid(cubies, 'x', 1, 'R');
        const L = getFaceGrid(cubies, 'x', -1, 'L');

        const result =
            U.map(colorToLetter).join("") +
            R.map(colorToLetter).join("") +
            F.map(colorToLetter).join("") +
            D.map(colorToLetter).join("") +
            L.map(colorToLetter).join("") +
            B.map(colorToLetter).join("");

        console.log("Kociemba:", result, result.length);

        return result;
    };

    // const generateFaceletString = () => {
    //     const colorToLetter = (color) => {
    //         if (color === FACE_COLORS.U) return "U";
    //         if (color === FACE_COLORS.R) return "R";
    //         if (color === FACE_COLORS.F) return "F";
    //         if (color === FACE_COLORS.D) return "D";
    //         if (color === FACE_COLORS.L) return "L";
    //         if (color === FACE_COLORS.B) return "B";
    //         return "X";
    //     };
    //
    //     const getFace = (face) => {
    //         let faceCubies = [];
    //
    //         // helper: ia culoarea corectă de pe față
    //         const getColor = (c, face) => c.colors[face];
    //
    //         switch (face) {
    //
    //             // U (y = 1)  → citire: z descrescător, x crescător
    //             case "U":
    //                 faceCubies = cubies
    //                     .filter(c => c.position[1] === 1)
    //                     .sort((a, b) =>
    //                         b.position[2] - a.position[2] ||
    //                         a.position[0] - b.position[0]
    //                     );
    //                 return faceCubies.map(c => colorToLetter(getColor(c, "U"))).join("");
    //
    //             // D (y = -1) → z crescător, x crescător
    //             case "D":
    //                 faceCubies = cubies
    //                     .filter(c => c.position[1] === -1)
    //                     .sort((a, b) =>
    //                         a.position[2] - b.position[2] ||
    //                         a.position[0] - b.position[0]
    //                     );
    //                 return faceCubies.map(c => colorToLetter(getColor(c, "D"))).join("");
    //
    //             // F (z = 1)
    //             case "F":
    //                 faceCubies = cubies
    //                     .filter(c => c.position[2] === 1)
    //                     .sort((a, b) =>
    //                         b.position[1] - a.position[1] ||
    //                         a.position[0] - b.position[0]
    //                     );
    //                 return faceCubies.map(c => colorToLetter(getColor(c, "F"))).join("");
    //
    //             // B (z = -1)
    //             case "B":
    //                 faceCubies = cubies
    //                     .filter(c => c.position[2] === -1)
    //                     .sort((a, b) =>
    //                         b.position[1] - a.position[1] ||
    //                         b.position[0] - a.position[0]
    //                     );
    //                 return faceCubies.map(c => colorToLetter(getColor(c, "B"))).join("");
    //
    //             // R (x = 1)
    //             case "R":
    //                 faceCubies = cubies
    //                     .filter(c => c.position[0] === 1)
    //                     .sort((a, b) =>
    //                         b.position[1] - a.position[1] ||
    //                         a.position[2] - b.position[2]
    //                     );
    //                 return faceCubies.map(c => colorToLetter(getColor(c, "R"))).join("");
    //
    //             // L (x = -1)
    //             case "L":
    //                 faceCubies = cubies
    //                     .filter(c => c.position[0] === -1)
    //                     .sort((a, b) =>
    //                         b.position[1] - a.position[1] ||
    //                         a.position[2] - b.position[2]
    //                     );
    //                 return faceCubies.map(c => colorToLetter(getColor(c, "L"))).join("");
    //         }
    //     };
    //
    //     const result =
    //         getFace("U") +
    //         getFace("R") +
    //         getFace("F") +
    //         getFace("D") +
    //         getFace("L") +
    //         getFace("B");
    //
    //     console.log("Facelet string:", result, result.length);
    //
    //     return result;
    // };

    const handleGenerateSolution = async () => {
        const faceletString = generateFaceletString();

        console.log("CENTRE:", {
            U: faceletString[4],
            R: faceletString[13],
            F: faceletString[22],
            D: faceletString[31],
            L: faceletString[40],
            B: faceletString[49]
        });

        try {
            const response = await fetch("http://localhost:8080/api/cube/colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cube: faceletString })
            });

            const data = await response.json();

            console.log("Soluție primită:", data.solution);

            const rawMoves = data.solution
                .trim()
                .split(" ")
                .filter(m => m !== "." && m !== "");

            const moves = expandMoves(rawMoves);

            setSolutionMoves(moves);

        } catch (error) {
            console.error("Eroare la trimiterea cubului:", error);
        }
    };

  const buttonHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 0 6px rgba(255, 255, 255, 0.01)',
    color: '#eee' // ușor glow
  };

  const buttonActiveStyle = {
    border: '1px solid #555559',
    color: '#039603ff',
    // width: '10px',
    // height: '10px',
    // borderRadius: '50%',
    // backgroundColor: 'limegreen',
    // marginLeft: 'auto', // împinge punctul în extremitatea dreaptă
  };

  const point = {
    width: '7px',
    height: '7px',
    backgroundColor: '#027002ff',
    borderRadius: '50%',
    marginLeft: 'auto'
  }

  const connectPoint = {
    width: '7px',
    height: '7px',
    backgroundColor: status === 'Conectat' ? '#76ff03' : '#ff5252',
    borderRadius: '50%',
    marginLeft: '15px',
    display: 'flex',
    alignItems: 'center',
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [activeHamburger, setActiveHamburger] = useState(null);
    const [uiLocked, setUiLocked] = useState(false);
    const [solutionMoves, setSolutionMoves] = useState([]);

    const handleAuthOpen = (mode) => {
        setSidebarOpen(false);
    };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '260px',
    backgroundColor: '#b7c9e200',// semi-transparent dark
    borderRadius: '0 20px 20px 0',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '4px 13px',
    boxShadow: '6px 0 20px rgba(0, 0, 0, 0.6)',
    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    color: '#f0f0f0',
    backdropFilter: 'blur(17px)', // pentru efect de sticlă mată (Glassmorphism)
  };

  function BottomBar() {

    const [activeButton, setActiveButton] = useState("home");

    const bottomBarStyle = {
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '500px',
      height: '40px',
      backgroundColor: '#b7c9e200',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '4px 13px',
      boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'flex-start', // aliniere la stânga
      alignItems: 'center',
      gap: '20px',
      color: '#f0f0f0',
      backdropFilter: 'blur(17px)',
      zIndex: 1001,
    };

    const highlightStyle = {
      position: 'absolute',
      top: '50%', // îl punem la mijloc pe verticală
      transform: 'translate(-50%, -50%)',
      width: '30px',
      height: '4px',
      backgroundColor: '#00f0ff',
      borderRadius: '2px',
      transition: 'left 0.3s ease',
      left: activeButton === 'home' ? '15%' : activeButton === 'search' ? '50%' : '85%',
    };

    const iconStyle = {
      width: '24px', // dimensiunea iconului
      height: '24px',
      objectFit: 'contain',
    };

    return (
      <div style={bottomBarStyle}>
        <div style={highlightStyle}></div>
        <button
          onClick={() => {
            if (!isCubeFullyColored) {
              resetColors();
            }
            setShowColorPicker(false);
            startNotifications();
            setActiveButton('cube');
          }}
          style={{
            ...buttonStyle,
            ...(hoveredButton === 'cube' ? buttonHoverStyle : {}),
            ...(activeButton === 'cube' ? buttonActiveStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton('cube')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <img src={HomePage} style={iconStyle} alt="Home" />
        </button>
      </div>
    );
  }

  const hamburgerStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '1.2rem',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 1000,
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
  }

  const XStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '0.9rem',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 1002,
    width: '35px',
    height: '35px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
    marginLeft: '75%',
  }

  const hamburgerHoverStyle = {
    background: '#007991',
  };

    const handleApplyString = () => {
        const str = "RBBFULFFDUBRFRUFBFUULFFRDDRLULLDRRRULLBDLDBDBFUULBBDRD";

        setCubies(prev =>
            applyFaceletStringToCubies(prev, str, FACE_COLORS)
        );
    };

  const statusStyle = {
    color: '#888',
    paddingLeft: '15px',
    fontSize: '0.8rem',
    userSelect: 'none'
  };

  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredHamburger, setHoveredHamburger] = useState(null);


  return (

  <div style={{
    background: 'radial-gradient(circle at center, #023d49ff, #222E50)',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Poppins, sans-serif',
    color: '#ffffff',
    position: 'relative',
  }}>
    {/* HAMBURGER MENU */}
    <button
      onClick={() => {
        setSidebarOpen(!sidebarOpen)
        setActiveHamburger('hamburger');
        setHoveredHamburger(null)
      }}
      style = {{
        ...hamburgerStyle,
        ...(hoveredHamburger === 'hamburger' ? hamburgerHoverStyle : {})
      }}
      onMouseEnter={() => setHoveredHamburger('hamburger')}
      onMouseLeave={() => setHoveredHamburger(null)}
    >
      ☰
    </button>
      <button
          onClick={handleGenerateSolution}
          style={{
              ...buttonStyle,
              ...(hoveredButton === 'solve' ? buttonHoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton('solve')}
          onMouseLeave={() => setHoveredButton(null)}
      >
          🧠 Generează Soluția
      </button>
          <AuthButtons
              onOpen={handleAuthOpen}
          />
      <FloatingMenu/>
      <Logo />

    {/* SIDEBAR LATERAL */}
    <div style={sidebarStyle}>
        <h1>RubikWeb</h1>
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen)
            setActiveHamburger('X');
          }}
          style = {{
            ...XStyle,
            ...(hoveredHamburger === 'X' ? hamburgerHoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredHamburger('X')}
          onMouseLeave={() => setHoveredHamburger(null)}
        >
          ✕
        </button>
        <div style={connectPoint}>
          <span style={statusStyle}>{status}</span>
        </div>
        <hr style={{ border: 'none', height: '0.1px', backgroundColor: '#3d3d43', margin: '13px 0' }} />

        <button
          onClick={() => {
            if (!isCubeFullyColored) {
              resetColors();
            }
            setShowColorPicker(false);
            startNotifications();
            setActiveButton('cube');
          }}
          style={{
            ...buttonStyle,
            ...(hoveredButton === 'cube' ? buttonHoverStyle : {}),
            ...(activeButton === 'cube' ? buttonActiveStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton('cube')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <img
              src={
                activeButton === 'cube'
                  ? CompasGreenLogo
                  : hoveredButton === 'cube'
                  ? CompasLogo
                  : CompasGreyLogo
              }
              alt="icon"
              style={{ width: '15px', height: '15px', marginRight: '12px' , color: 'white'}}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '14px' }}>Cube</span>
            <span style={{ fontSize: '10px', marginTop: '2px', color: '#888' , textAlign: 'left',}}>
              Configurarea orientarii si preciziei
            </span>
          </div>
          {activeButton === 'cube' && <div style={point}></div>}
        </button>

        {showButtonConfigurare && (
          <button
            onClick={() => {
              handleButtonClick();
              stopNotifications();
              resetOrientation();
              setSidebarOpen(false);
              setActiveButton('config');
            }}
            style={{
              ...buttonStyle,
              ...(hoveredButton === 'config' ? buttonHoverStyle : {}),
              ...(activeButton === 'config' ? buttonActiveStyle : {}),
            }}
            onMouseEnter={() => setHoveredButton('config')}
            onMouseLeave={() => setHoveredButton(null)}
          >
              <img
                src={
                  activeButton === 'config'
                    ? SettingsGreenLogo
                    : hoveredButton === 'config'
                    ? SettingsLogo
                    : SettingsGreyLogo
                }
                alt="icon"
                style={{ width: '15px', height: '15px', marginRight: '12px' , color: 'white'}}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px' }}>Configurare Cub</span>
              <span style={{ fontSize: '10px', marginTop: '2px', color: '#888' , textAlign: 'left',}}>
                Personalizarea aspectului și comportamentului
              </span>
            </div>
            {activeButton === 'config' && <div style={point}></div>}
          </button>
        )}

        <button
          onClick={() => {
            handleCalibrate();
            setActiveButton('calibrate');
          }}
          style={{
            ...buttonStyle,
            ...(hoveredButton === 'calibrate' ? buttonHoverStyle : {}),
            ...(activeButton === 'calibrate' ? buttonActiveStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton('calibrate')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <img
              src={
                activeButton === 'calibrate'
                  ? CompasGreenLogo
                  : hoveredButton === 'calibrate'
                  ? CompasLogo
                  : CompasGreyLogo
              }
              alt="icon"
              style={{ width: '15px', height: '15px', marginRight: '12px' , color: 'white'}}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '14px' }}>Calibrare</span>
            <span style={{ fontSize: '10px', marginTop: '2px', color: '#888' , textAlign: 'left',}}>
              Configurarea orientarii si preciziei
            </span>
          </div>
          {activeButton === 'calibrate' && <div style={point}></div>}
        </button>

        <button
          onClick={() => {
            connectGoCube();
            if (!isCubeFullyColored) {
              resetColors();
            }
            setShowColorPicker(false);
            startNotifications();
            setActiveButton('bluetooth');
          }}
          style={{
            ...buttonStyle,
            ...(hoveredButton === 'bluetooth' ? buttonHoverStyle : {}),
            ...(activeButton === 'bluetooth' ? buttonActiveStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton('bluetooth')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <img
              src={
                activeButton === 'bluetooth'
                  ? BluetoothGreenLogo
                  : hoveredButton === 'bluetooth'
                  ? BluetoothLogo
                  : BluetoothGreyLogo
              }
              alt="icon"
              style={{ width: '15px', height: '15px', marginRight: '12px' , color: 'white'}}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '14px' }}>Conectare Bluetooth</span>
            <span style={{ fontSize: '10px', marginTop: '2px', color: '#888' , textAlign: 'left',}}>
              Configurarea conexiunii cu dispozitivul
            </span>
          </div>
          {activeButton === 'bluetooth' && <div style={point}></div>}
        </button>

      </div>



      {/* CANVAS 3D */}
      <div style={{ flex: 5, marginTop: '0px', pointerEvents: "auto" }}>
        <Canvas camera={{ position: [7, 7, 7], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <group
            ref={(el) => {
              cubeGroupRef.current = el;
              if (el && !orientationSaved) {
                defaultOrientationRef.current = el.quaternion.clone();
                setOrientationSaved(true);
              }
            }}
          >
            {currentRotation ? (
              <>
                {cubies
                  .filter((c) => !currentRotation.cubies.includes(c))
                  .map((c) => (
                    <Cubie key={c.key} position={c.position} colors={c.colors} />
                  ))}
                <RotatingGroup {...currentRotation} onFinish={onFinishRotation} />
              </>
            ) : (
              cubies.map((c) => {
                if (!configMode) {
                  return <Cubie key={c.key} position={c.position} colors={c.colors} onFaceClick={handleFaceClick} />;
                }

                const [x, y, z] = c.position;
                const isCenter = x === 0 && y === 0 && z === 0;
                const isNeighbor = !isCenter && Math.abs(x) <= 1 && Math.abs(y) <= 1 && Math.abs(z) <= 1;

                const colorsToUse = isCenter
                  ? c.colors
                  : isNeighbor
                  ? {
                      up: 'black',
                      down: 'black',
                      left: 'black',
                      right: 'black',
                      front: 'black',
                      back: 'black',
                    }
                  : c.colors;

                return <Cubie key={c.key} position={c.position} colors={colorsToUse} onFaceClick={handleFaceClick} />;
              })
            )}
          </group>
          <OrbitControls />
        </Canvas>

      </div>

      <SolutionViewer solution={solutionMoves} />

      {/* SELECTOR DE CULORI */}
      {showColorPicker && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
            backgroundColor: 'rgba(30,30,47,0.95)',
            padding: 15,
            borderRadius: 15,
            boxShadow: '0 0 20px rgba(0,0,0,0.4)',
            zIndex: 100,
          }}
        >
          {PRESET_COLORS.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: color,
                border: selectedColor === color ? '3px solid white' : '1px solid gray',
                cursor: 'pointer',
              }}
              title={color}
            />
          ))}
          {/* <button
            onClick={() => {
              resetColors();
              setShowButtonConfigurare(true);
              startNotifications();
            }}
            style={buttonStyle}
          >
            Resetare Cub
          </button> */}
          <button
            onClick={() => {
              setShowColorPicker((prev) => !prev);
              setShowButtonConfigurare(true);
              startNotifications();
            }}
            disabled={!isCubeFullyColored}
            style={{ ...buttonStyle, opacity: isCubeFullyColored ? 1 : 0.5 }}
          >
            Salvare configurare
          </button>
        </div>
      )}
    </div>
  );

}