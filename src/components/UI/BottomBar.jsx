import React, { useState } from "react";

export default function BottomBar({
                                      resetColors,
                                      startNotifications,
                                      setShowColorPicker,
                                      isCubeFullyColored,
                                  }) {
    const [activeButton, setActiveButton] = useState("home");

    const barStyle = {
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "400px",
        height: "45px",
        background: "rgba(0,0,0,0.4)",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        backdropFilter: "blur(10px)",
        color: "#fff",
    };

    return (
        <div style={barStyle}>
            <button
                onClick={() => {
                    if (!isCubeFullyColored) resetColors();
                    setShowColorPicker(false);
                    startNotifications();
                    setActiveButton("cube");
                }}
            >
                🏠 Cube
            </button>

            <button onClick={() => setActiveButton("settings")}>
                ⚙️ Settings
            </button>
        </div>
    );
}