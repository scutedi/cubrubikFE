import React, { useState } from "react";

export default function Sidebar({
                                    sidebarOpen,
                                    setSidebarOpen,
                                    status,
                                    connectGoCube,
                                    startNotifications,
                                    stopNotifications,
                                    resetColors,
                                    resetOrientation,
                                    handleCalibrate,
                                    setShowColorPicker,
                                    setActiveButton,
                                    activeButton,
                                    buttonStyle,
                                    buttonHoverStyle,
                                    buttonActiveStyle,
                                }) {
    const [hoveredButton, setHoveredButton] = useState(null);

    const sidebarStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "260px",
        backgroundColor: "#b7c9e200",
        borderRadius: "0 20px 20px 0",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        padding: "10px",
        backdropFilter: "blur(17px)",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "0.3s ease",
        zIndex: 1001,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        color: "#fff",
    };

    const button = (key) => ({
        ...buttonStyle,
        ...(hoveredButton === key ? buttonHoverStyle : {}),
        ...(activeButton === key ? buttonActiveStyle : {}),
    });

    return (
        <div style={sidebarStyle}>
            <h2>RubikWeb</h2>

            <button onClick={() => setSidebarOpen(false)}>✕</button>

            <div style={{ color: status === "Conectat" ? "lime" : "red" }}>
                {status}
            </div>

            {/* CUBE */}
            <button
                onClick={() => {
                    resetColors();
                    setShowColorPicker(false);
                    startNotifications();
                    setActiveButton("cube");
                }}
                onMouseEnter={() => setHoveredButton("cube")}
                onMouseLeave={() => setHoveredButton(null)}
                style={button("cube")}
            >
                Cube
            </button>

            {/* CONFIG */}
            <button
                onClick={() => {
                    resetOrientation();
                    stopNotifications();
                    setShowColorPicker(true);
                    setActiveButton("config");
                }}
                onMouseEnter={() => setHoveredButton("config")}
                onMouseLeave={() => setHoveredButton(null)}
                style={button("config")}
            >
                Configurare
            </button>

            {/* CALIBRATE */}
            <button
                onClick={() => {
                    handleCalibrate();
                    setActiveButton("calibrate");
                }}
                onMouseEnter={() => setHoveredButton("calibrate")}
                onMouseLeave={() => setHoveredButton(null)}
                style={button("calibrate")}
            >
                Calibrare
            </button>

            {/* BLUETOOTH */}
            <button
                onClick={() => {
                    connectGoCube();
                    startNotifications();
                    setActiveButton("bluetooth");
                }}
                onMouseEnter={() => setHoveredButton("bluetooth")}
                onMouseLeave={() => setHoveredButton(null)}
                style={button("bluetooth")}
            >
                Bluetooth
            </button>
        </div>
    );
}