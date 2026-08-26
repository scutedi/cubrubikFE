import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const RX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const TX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

const FACE_COLORS = {
    U: "#2775B6",
    D: "#32CD32",
    F: "#FFFFFF",
    B: "#FFD32C",
    L: "#FA6800",
    R: "#FF0000",
};

const PRESET_COLORS = [
  { pos: [1, 1, 1], colors: { U: '#2775B6', R: '#FF0000', F: '#FFFFFF' } },
  { pos: [-1, -1, -1], colors: { D: '#32CD32', L: '#FA6800', B: '#FFD32C' } },
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
    <group position={position} rotation={[0, Math.PI, 0]}>
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
  const [dx, dy] = [x, y];
  const [nx, ny] = cw ? [-dy, dx] : [dy, -dx];
  return [nx, ny, z];
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
  L: { axis: 'x', value: -1 }, L2: { axis: 'x', value: -1 },
  R: { axis: 'x', value: 1 }, R2: { axis: 'x', value: 1 }
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
      start.current = null;
    }
  });

  return (
    <group ref={groupRef}>
      {cubies.map(c => <Cubie key={c.key} position={c.position} colors={c.colors} />)}
    </group>
  );
}

export default function App() {
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

  const txCharacteristicRef = useRef(null);
  const [rotationQueue, setRotationQueue] = useState([]);
  const [currentRotation, setCurrentRotation] = useState(null);
  const [showCalibration, setShowCalibration] = useState(false);
  const cubeGroupRef = useRef();
  const [configMode, setConfigMode] = React.useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showColorPicker, setShowColorPicker] = React.useState(false);


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
    if (!selectedColor) return;
  
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

  const handleNotifications = (event) => {
    const value = event.target.value;
    const bytes = [];
    for (let i = 0; i < value.byteLength; i++) bytes.push(value.getUint8(i));
    if (bytes[2] !== 1) return;

    const faceMap = ['D', 'D1', 'U', 'U1', 'L', 'L2', 'R', 'R2', 'B', 'B1', 'F', 'F1'];
    const face = faceMap[bytes[3]];
    const direction = bytes[4];


    setRotationQueue(q => [...q, { face, direction }]);
  };

  useEffect(() => {
    if (currentRotation !== null) return;
    if (rotationQueue.length === 0) return;

    const { face, direction } = rotationQueue[0];
    const { axis, value } = faceToAxis[face];
    let clockwise = direction !== 1;
    if (['L2', 'R', 'U', 'B1', 'F', 'D1'].includes(face)) clockwise = !clockwise;

    const rotatingCubies = cubies.filter(c => Math.round(c.position[['x','y','z'].indexOf(axis)]) === value);
    setCurrentRotation({ face, axis, value, clockwise, cubies: rotatingCubies });
  }, [rotationQueue, currentRotation, cubies]);

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

  const connectGoCube = async () => {
    try {
      setStatus('Se caută dispozitivul...');
      const device = await navigator.bluetooth.requestDevice({ filters: [{ namePrefix: 'GoCube' }], optionalServices: [SERVICE_UUID] });
      setStatus('Se conectează...');
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const rx = await service.getCharacteristic(RX_CHAR_UUID);
      const tx = await service.getCharacteristic(TX_CHAR_UUID);
      txCharacteristicRef.current = tx;
      await tx.startNotifications();
      tx.addEventListener('characteristicvaluechanged', handleNotifications);
      setStatus('Conectat și ascultă notificări');
    } catch (e) {
      console.error(e);
      setStatus('Eroare la conectare');
    }
  };

  return (
    <div style={{ backgroundColor: '#426B69', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          backgroundColor: '#222E50',
          color: 'white',
          padding: '10px 20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>GoCube App</h1>
          <div>
            <button onClick={handleCalibrate} style={{ marginRight: 10 , borderRadius: 20, backgroundColor: '#8BB174'}}>Calibrează</button>
            <button onClick={connectGoCube} style={{ marginRight: 10 , borderRadius: 20 , backgroundColor: '#8BB174'}}>
              Conectează-te
            </button>
            Status: <strong>{status}</strong>
          </div>
        </div>
      </header>

        <div style={{ flex: 5, marginTop: '-70px' }}>
        <Canvas camera={{ position: [7, 7, 7], fov: 50 }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <group ref={cubeGroupRef}>
            {currentRotation ? (
              <>
                {cubies
                  .filter(c => !currentRotation.cubies.includes(c))
                  .map(c => (
                    <Cubie key={c.key} position={c.position} colors={c.colors} />
                  ))}
                <RotatingGroup {...currentRotation} onFinish={onFinishRotation} />
              </>
            ) : (
              cubies.map(c => {
                if (!configMode) {
                  return (
                    <Cubie
                      key={c.key}
                      position={c.position}
                      colors={c.colors}
                      onFaceClick={handleFaceClick}
                    />
                  );
                }

                const [x, y, z] = c.position;
                const isCenter = x === 0 && y === 0 && z === 0;
                const isNeighbor = !isCenter && (Math.abs(x) <= 1 && Math.abs(y) <= 1 && Math.abs(z) <= 1);
  
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
  
                return (
                  <Cubie
                    key={c.key}
                    position={c.position}
                    colors={colorsToUse}
                    onFaceClick={handleFaceClick}
                  />
                );
              })
  
            )}
          </group>
          <OrbitControls />
        </Canvas>
      </div>

      {showColorPicker && (
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          backgroundColor: '#426B69',
          padding: 10,
          borderRadius: 10,
          zIndex: 10,
        }}
      >
        {PRESET_COLORS.map(color => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: color,
              border: selectedColor === color ? '3px solid black' : '1px solid gray',
              cursor: 'pointer',
            }}
            title={color}
          />
        ))}
      </div>
    )}
    </div>
    
  );
}