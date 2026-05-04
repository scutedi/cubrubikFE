import { PRESET_COLORS } from '../../constants/colors';

export default function ColorPicker({ show, selectedColor, setSelectedColor, onClose, onSave, disabled }) {
    if (!show) return null;

    return (
        <div style={{ position: 'fixed', bottom: 20, left: '50%' }}>
            {PRESET_COLORS.map(c => (
                <div
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                        background: c,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        border: selectedColor === c ? '3px solid white' : '1px solid gray'
                    }}
                />
            ))}

            <button disabled={disabled} onClick={onSave}>
                Salvare
            </button>

            <button onClick={onClose}>Close</button>
        </div>
    );
}