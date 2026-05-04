export default function SolutionPanel({ solution }) {
    if (!solution) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
        }}>
            {solution.split(" ").map((m, i) => (
                <span key={i} style={{
                    padding: '6px 10px',
                    background: 'red',
                    color: 'white',
                    borderRadius: 4
                }}>
          {m}
        </span>
            ))}
        </div>
    );
}