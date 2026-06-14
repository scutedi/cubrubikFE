import { useState } from "react";

import BluetoothLogo from "../assets/bluetooth.png";
import BluetoothGreyLogo from "../assets/bluetoothGrey.png";
import BluetoothGreenLogo from "../assets/bluetoothGreen.png";
import SettingsLogo from "../assets/settings.png";
import SettingsGreyLogo from "../assets/settingsGrey.png";
import SettingsGreenLogo from "../assets/settingsGreen.png";
import CompasLogo from "../assets/compas.png";
import CompasGreyLogo from "../assets/compasGrey.png";
import CompasGreenLogo from "../assets/compasGreen.png";

import {
  buttonStyle,
  buttonHoverStyle,
  buttonActiveStyle,
  point,
  sidebarStyle,
  connectPointStyle,
  statusStyle,
  dividerStyle,
  hamburgerStyle,
  hamburgerHoverStyle,
  XStyle,
} from "../ui/styles";

export function HamburgerButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...hamburgerStyle, ...(hovered ? hamburgerHoverStyle : {}) }}
    >
      ☰
    </button>
  );
}

function NavButton({ label, description, icons, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const icon = active ? icons.active : hovered ? icons.hover : icons.idle;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...buttonStyle,
        ...(hovered ? buttonHoverStyle : {}),
        ...(active ? buttonActiveStyle : {}),
      }}
    >
      <img src={icon} alt="" style={{ width: 15, height: 15, marginRight: 12 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontSize: 14 }}>{label}</span>
        <span style={{ fontSize: 10, marginTop: 2, color: "#888", textAlign: "left" }}>
          {description}
        </span>
      </div>
      {active && <div style={point} />}
    </button>
  );
}

export default function Sidebar({
  open,
  status,
  active,
  onClose,
  onCube,
  onConfig,
  onCalibrate,
  onBluetooth,
}) {
  return (
    <div style={sidebarStyle(open)}>
      <h1>RubikWeb</h1>

      <button onClick={onClose} style={XStyle}>
        ✕
      </button>

      <div style={connectPointStyle(status === "Conectat")}>
        <span style={statusStyle}>{status}</span>
      </div>

      <hr style={dividerStyle} />

      <NavButton
        label="Cube"
        description="Configurarea orientarii si preciziei"
        icons={{ active: CompasGreenLogo, hover: CompasLogo, idle: CompasGreyLogo }}
        active={active === "cube"}
        onClick={onCube}
      />

      <NavButton
        label="Configurare Cub"
        description="Personalizarea aspectului și comportamentului"
        icons={{ active: SettingsGreenLogo, hover: SettingsLogo, idle: SettingsGreyLogo }}
        active={active === "config"}
        onClick={onConfig}
      />

      <NavButton
        label="Calibrare"
        description="Configurarea orientarii si preciziei"
        icons={{ active: CompasGreenLogo, hover: CompasLogo, idle: CompasGreyLogo }}
        active={active === "calibrate"}
        onClick={onCalibrate}
      />

      <NavButton
        label="Conectare Bluetooth"
        description="Configurarea conexiunii cu dispozitivul"
        icons={{ active: BluetoothGreenLogo, hover: BluetoothLogo, idle: BluetoothGreyLogo }}
        active={active === "bluetooth"}
        onClick={onBluetooth}
      />
    </div>
  );
}
