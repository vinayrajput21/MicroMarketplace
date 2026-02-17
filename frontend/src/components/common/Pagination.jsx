export default function Pagination({ current, total, onChange }) {
  return (
    <div className="pagination">
      {Array.from({ length: total }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          onClick={() => onChange(num)}
          disabled={num === current}
          style={{ fontWeight: num === current ? 'bold' : 'normal' }}
        >
          {num}
        </button>
      ))}
    </div>
  );
}