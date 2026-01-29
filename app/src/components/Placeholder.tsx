export default function Placeholder({
  label,
  sublabel,
  height = 220,
}: {
  label: string;
  sublabel?: string;
  height?: number;
}) {
  return (
    <div className="ph" style={{ minHeight: height }}>
      <div className="ph-label">{label}</div>
      {sublabel ? <div className="ph-sub">{sublabel}</div> : null}
    </div>
  );
}
