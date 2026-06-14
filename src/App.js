import { useCallback, useEffect, useState } from "react";

import { AuthButtons } from "./Auth/AuthButtons";
import { FloatingMenu } from "./Tutorial/TutorialMenu";
import Logo from "./components/Logo";
import SolutionControls from "./components/SolutionControls";
import { saveCubeState, loadCubeState } from "./services/apiService";

import CubeScene from "./components/CubeScene";
import Sidebar, { HamburgerButton } from "./components/Sidebar";
import ColorPicker from "./components/ColorPicker";

import { useGoCube } from "./hooks/useGoCube";
import { useRubikCube } from "./hooks/useRubikCube";
import { generateFaceletString } from "./utils/facelet";
import { expandMoves } from "./utils/goCubeProtocol";
import { appBackground, canvasWrapper } from "./ui/styles";
import {createSolvedCubies} from "./utils/cubeGeometry";

const SOLVER_URL = "http://localhost:8080/api/cube/solution";

export default function App() {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isConfigMode, setIsConfigMode] = useState(false);
    const [configCubies, setConfigCubies] = useState(null);

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
                if (!prev.length || prev[0] !== move) return prev;
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

        const base = cubies.map(c => {
            const newColors = {};

            for (const face of Object.keys(c.colors)) {
                const originalColor = c.colors[face];

                if (c.position.includes(0) && Object.values(c.position).filter(v => v === 0).length === 2) {
                    newColors[face] = originalColor;
                }
                else {
                    newColors[face] = "#606060";
                }
            }

            return {
                ...c,
                colors: newColors
            };
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

    const saveConfig = async () => {
        if (!user?.id || !configCubies) return;

        if (!hasNoGrey(configCubies)) {
            return;
        }

        setIsConfigMode(false);
        setShowColorPicker(false);
        startNotifications();

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
                />
            )}

            {showColorPicker && (
                <ColorPicker
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                    canSave={isFullyColored}
                    onSave={saveConfig}
                    onReset={resetConfig}
                />
            )}
        </div>
    );
}
