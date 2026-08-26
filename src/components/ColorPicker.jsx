import { PRESET_COLORS } from "../constants/cube";
import { colorPickerStyle, swatchStyle, saveButtonStyle } from "../ui/styles";

export default function ColorPicker({ selectedColor, onSelectColor, canSave, onSave, onReset }) {
  return (
    <div style={colorPickerStyle}>
      {PRESET_COLORS.map((color) => (
        <div
          key={color}
          title={color}
          onClick={() => onSelectColor(color)}
          style={swatchStyle(color, selectedColor === color)}
        />
      ))}

      <button onClick={onSave} style={saveButtonStyle(canSave)}>
        Salvare configurare
      </button>
        <button
            onClick={onReset}
            style={{
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
            }}
        >
            Reset
        </button>
    </div>
  );
}
