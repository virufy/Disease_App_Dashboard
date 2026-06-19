import React from "react";
import { tokens } from "../../styles/theme";

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  color: tokens.color.muted,
  marginBottom: "6px",
};

const CAPTION_STYLE: React.CSSProperties = {
  fontSize: "9px",
  color: tokens.color.faint,
  fontWeight: 500,
};

const ClusterRow: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: color,
        border: `1.5px solid ${tokens.color.white}`,
        boxShadow: `0 0 0 1px ${tokens.color.borderSoft}`,
        flexShrink: 0,
      }}
    />
    <span style={CAPTION_STYLE}>{label}</span>
  </div>
);

const HeatmapLegend: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: "calc(34vh + 28px)",
      left: "24px",
      zIndex: 1001,
      background: "rgba(255, 255, 255, 0.93)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${tokens.color.borderSoft}`,
      borderRadius: tokens.radius.md,
      padding: "10px 12px",
      boxShadow: tokens.shadow.md,
      minWidth: "118px",
    }}
  >
    {/* ── Heatmap: where submissions are concentrated ───────────────────── */}
    <div style={LABEL_STYLE}>Case Density</div>
    <div
      style={{
        width: "86px",
        height: "8px",
        borderRadius: "4px",
        background:
          "linear-gradient(to right, #0d9488, #06b6d4, #fbbf24, #ef4444)",
        marginBottom: "4px",
      }}
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "86px",
      }}
    >
      <span style={CAPTION_STYLE}>Low</span>
      <span style={CAPTION_STYLE}>High</span>
    </div>

    {/* ── Cluster dots: how sick each cluster is ────────────────────────── */}
    <div
      style={{
        height: "1px",
        background: tokens.color.borderSoft,
        margin: "10px 0 8px",
      }}
    />
    <div style={LABEL_STYLE}>Cluster Sick Rate</div>
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <ClusterRow color={tokens.color.success} label="Mostly healthy (<34%)" />
      <ClusterRow color={tokens.color.warning} label="Mixed (34–66%)" />
      <ClusterRow color={tokens.color.danger} label="Mostly sick (67%+)" />
    </div>
    <div
      style={{
        ...CAPTION_STYLE,
        marginTop: "6px",
        fontStyle: "italic",
        lineHeight: 1.3,
      }}
    >
      Dot size = number of cases. Click a dot for details.
    </div>
  </div>
);

export default HeatmapLegend;
