import type { ReactNode } from "react";

export default function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h2 className="h2">{title}</h2>
        {subtitle ? <p className="p">{subtitle}</p> : null}
      </div>
      {right ? <div className="section-right">{right}</div> : null}
    </div>
  );
}
