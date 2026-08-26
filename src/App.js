import { useCallback, useEffect, useState } from "react";

import { AuthButtons } from "./Auth/AuthButtons";
import { FloatingMenu } from "./Tutorial/TutorialMenu";
import Logo from "./components/Logo";
import SolutionControls from "./components/SolutionControls";
import { saveCubeState, loadCubeState } from "./services/apiService";
import { useMemo } from "react";

import CubeScene from "./components/CubeScene";
import Sidebar, { HamburgerButton } from "./components/Sidebar";
import ColorPicker from "./components/ColorPicker";

import { useGoCube } from "./hooks/useGoCube";
import { useRubikCube } from "./hooks/useRubikCube";
import { generateFaceletString } from "./utils/facelet";
import { expandMoves } from "./utils/goCubeProtocol";
import { appBackground, canvasWrapper } from "./ui/styles";
import {createSolvedCubies} from "./utils/cubeGeometry";
import {toast} from "react-toastify";
import {FACE_COLORS, GREY} from "./constants/cube";

const SOLVER_URL = "http://localhost:8080/api/cube/solution";

export default function App() {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isConfigMode, setIsConfigMode] = useState(false);
    const [configCubies, setConfigCubies] = useState(createSolvedCubies());

    const [solutionMoves, setSolutionMoves] = useState([]);
    const [selection, setSelection] = useState(null);
    const [remainingFirstMoves, setRemainingFirstMoves] = useState(0);

    const saveCube = useCallback((facelet) => {
        const stored = JSON.parse(localStorage.getItem("user") || "null");
        const userId = stored?.id;

        if (!userId) return;

        saveCubeState(userId, facelet)
            .then()
            .catch(console.error);
    }, []);

    const {
        cubies,
        currentRotation,
        finishRotation,
        enqueueRotation,
        paintFace,
        resetColors,
        applyFacelet,
        isFullyColored,
    } = useRubikCube({ onRotationComplete: saveCube , isConfigMode, setConfigCubies, configCubies});

    const handleDeviceRotation = useCallback(
        ({ face, direction, move }) => {
            setSolutionMoves((prev) => {
                if (!prev.length) return prev;

                if (prev[0] !== move) {
                    setSelection(null);
                    onCloseSolution();
                    return [];
                }

                if (selection === "first") {
                    setRemainingFirstMoves((n) => {
                        const next = n - 1;
                        if (next <= 0) setSelection(null);
                        return next;
                    });
                }

                return prev.slice(1);
            });
            enqueueRotation({ face, direction });
        },
        [enqueueRotation, selection]
    );

    const isSolved = useMemo(() => {
        return generateFaceletString(cubies) ===
            "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
    }, [cubies]);

    const onCloseSolution = () => {
        setSolutionMoves([]);
    };

    const { status, connect, startNotifications, stopNotifications } =
        useGoCube(handleDeviceRotation);

    useEffect(() => {
        if (!user?.id) return;

        loadCubeState(user.id)
            .then((data) => {
                if (data?.cube) {
                    applyFacelet(data.cube);
                }
            })
            .catch(console.error);
    }, [user, applyFacelet]);

    useEffect(() => {
    }, [cubies]);

    const requestSolution = useCallback(async () => {
        const facelet = generateFaceletString(cubies);
        try {
            const res = await fetch(SOLVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cube: facelet }),
            });
            const data = await res.json();
            const rawMoves = data.solution.trim().split(" ").filter((m) => m && m !== ".");

            if (selection === "first" && rawMoves.length) {
                setRemainingFirstMoves(rawMoves[0].endsWith("2") ? 2 : 1);
            }
            setSolutionMoves(expandMoves(rawMoves));
        } catch (err) {
            console.error("Eroare la generarea soluției:", err);
        }
    }, [cubies, selection]);

    const openCube = async () => {
        setIsConfigMode(false);
        setShowColorPicker(false);
        startNotifications();
        setActiveButton("cube");

        try {
            const data = await loadCubeState(user.id);

            if (data?.cube) {
                applyFacelet(data.cube);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const openConfig = () => {
        setIsConfigMode(true);
        setShowColorPicker(true);
        stopNotifications();
        setSidebarOpen(false);
        setActiveButton("config");

        const base = structuredClone(cubies).map(c => {
            const colors = {
                U: GREY,
                D: GREY,
                L: GREY,
                R: GREY,
                F: GREY,
                B: GREY,
            };

            if (c.position[0] === 0 && c.position[1] === 1 && c.position[2] === 0) colors.U = FACE_COLORS.U;
            if (c.position[0] === 0 && c.position[1] === -1 && c.position[2] === 0) colors.D = FACE_COLORS.D;
            if (c.position[0] === 1 && c.position[1] === 0 && c.position[2] === 0) colors.R = FACE_COLORS.R;
            if (c.position[0] === -1 && c.position[1] === 0 && c.position[2] === 0) colors.L = FACE_COLORS.L;
            if (c.position[0] === 0 && c.position[1] === 0 && c.position[2] === 1) colors.F = FACE_COLORS.F;
            if (c.position[0] === 0 && c.position[1] === 0 && c.position[2] === -1) colors.B = FACE_COLORS.B;

            return { ...c, colors };
        });

        setConfigCubies(base);
    };

    const calibrate = () => setActiveButton("calibrate");

    const connectBluetooth = () => {
        connect();
        if (!isFullyColored) resetColors();
        setShowColorPicker(false);
        setActiveButton("bluetooth");
    };

    const hasNoGrey = (cubies) => {
        return cubies.every(cubie =>
            Object.values(cubie.colors).every(color => color !== "#606060")
        );
    };

    const isConfigComplete = (cubies) => {
        return cubies.every(c => {
            const [x, y, z] = c.position;

            const requiredFaces = [];

            if (y === 1) requiredFaces.push("U");
            if (y === -1) requiredFaces.push("D");
            if (x === 1) requiredFaces.push("R");
            if (x === -1) requiredFaces.push("L");
            if (z === 1) requiredFaces.push("F");
            if (z === -1) requiredFaces.push("B");

            return requiredFaces.every(face =>
                c.colors[face] &&
                c.colors[face] !== GREY
            );
        });
    };

    const saveConfig = async () => {
        if (!user?.id || !configCubies) return;


        console.log(isConfigComplete)
        if (!isConfigComplete) {
            toast.error("Completează toate fețele");
            return;
        }
        setShowColorPicker(false);

        setIsConfigMode(false);

        const facelet = generateFaceletString(configCubies);

        await saveCubeState(user.id, facelet);

        await openCube();
    };

    const resetConfig = async () => {
        if (!user?.id) return;

        setIsConfigMode(false);
        setShowColorPicker(false);
        startNotifications();
        setActiveButton("cube");

        const solved = createSolvedCubies();

        const facelet = generateFaceletString(solved);

        try {
            await saveCubeState(user.id, facelet);
        } catch (err) {
            console.error(err);
        }

        await openCube();
    };

    return (
        <div style={appBackground}>
            {user && <HamburgerButton onClick={() => setSidebarOpen((o) => !o)} />}

            <AuthButtons
                user={user}
                setUser={setUser}
                onOpen={() => setSidebarOpen(false)}
                onLogout={resetColors}
            />
            <FloatingMenu />
            <Logo />

            {user && (
                <Sidebar
                    open={sidebarOpen}
                    status={status}
                    active={activeButton}
                    onClose={() => setSidebarOpen(false)}
                    onCube={openCube}
                    onConfig={openConfig}
                    onCalibrate={calibrate}
                    onBluetooth={connectBluetooth}
                />
            )}

            <div style={canvasWrapper}>
                <CubeScene
                    cubies={isConfigMode ? configCubies : cubies}
                    currentRotation={currentRotation}
                    onFinishRotation={finishRotation}
                    isConfigMode={isConfigMode}
                    onFaceClick={(pos, face) =>
                        paintFace(pos, face, selectedColor, isConfigMode ? configCubies : cubies)
                    }
                />
            </div>

            {user && !showColorPicker && (
                <SolutionControls
                    solutionMoves={solutionMoves}
                    selection={selection}
                    setSelection={setSelection}
                    onCloseSolution={onCloseSolution}
                    onGenerateSolution={requestSolution}
                    isSolved={isSolved}
                />
            )}

            {showColorPicker && (
                <ColorPicker
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                    canSave={
                        configCubies &&
                        configCubies.every(c =>
                            Object.values(c.colors).every(col => col && col !== "#606060")
                        )
                    }
                    onSave={saveConfig}
                    onReset={resetConfig}
                />
            )}
        </div>
    );
}
