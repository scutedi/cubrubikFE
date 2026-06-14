export const appBackground = {
  background: "radial-gradient(circle at center, #023d49ff, #222E50)",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  fontFamily: "Poppins, sans-serif",
  color: "#ffffff",
  position: "relative",
};

export const canvasWrapper = {
  flex: 5,
  marginTop: 0,
  pointerEvents: "auto",
};

export const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "14px",
  backgroundColor: "transparent",
  color: "#888",
  fontWeight: 500,
  fontSize: 14,
  cursor: "pointer",
  transition: "all 0.1s ease",
  display: "flex",
  alignItems: "center",
  outline: "none",
  boxShadow: "none",
  border: "none",
};

export const buttonHoverStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  boxShadow: "0 0 6px rgba(255, 255, 255, 0.01)",
  color: "#eee",
};

export const buttonActiveStyle = {
  border: "1px solid #555559",
  color: "#039603ff",
};

export const point = {
  width: 7,
  height: 7,
  backgroundColor: "#027002ff",
  borderRadius: "50%",
  marginLeft: "auto",
};

export const sidebarStyle = (open) => ({
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: 260,
  backgroundColor: "#b7c9e200",
  borderRadius: "0 20px 20px 0",
  borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "4px 13px",
  boxShadow: "6px 0 20px rgba(0, 0, 0, 0.6)",
  transform: open ? "translateX(0)" : "translateX(-100%)",
  transition: "transform 0.3s ease-in-out",
  zIndex: 1001,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  color: "#f0f0f0",
  backdropFilter: "blur(17px)",
});

export const connectPointStyle = (connected) => ({
  width: 7,
  height: 7,
  backgroundColor: connected ? "#76ff03" : "#ff5252",
  borderRadius: "50%",
  marginLeft: 15,
  display: "flex",
  alignItems: "center",
});

export const statusStyle = {
  color: "#888",
  paddingLeft: 15,
  fontSize: "0.8rem",
  userSelect: "none",
};

export const dividerStyle = {
  border: "none",
  height: "0.1px",
  backgroundColor: "#3d3d43",
  margin: "13px 0",
};

export const hamburgerStyle = {
  position: "absolute",
  top: 20,
  left: 20,
  fontSize: "1.2rem",
  background: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  zIndex: 1000,
  width: 40,
  height: 40,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "box-shadow 0.2s ease, background-color 0.2s ease",
};

export const hamburgerHoverStyle = {
  background: "#007991",
};

export const XStyle = {
  position: "absolute",
  top: 20,
  left: 20,
  fontSize: "0.9rem",
  background: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  zIndex: 1002,
  width: 35,
  height: 35,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "box-shadow 0.2s ease, background-color 0.2s ease",
  marginLeft: "75%",
};

export const colorPickerStyle = {
  position: "fixed",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 12,
  backgroundColor: "rgba(30,30,47,0.95)",
  padding: 15,
  borderRadius: 15,
  boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  zIndex: 100,
};

export const swatchStyle = (color, selected) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: color,
  border: selected ? "3px solid white" : "1px solid gray",
  cursor: "pointer",
});

export const saveButtonStyle = (enabled) => ({
  ...buttonStyle,
  opacity: enabled ? 1 : 0.5,
});
