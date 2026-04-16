import React from "react";

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
      border: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "10px",
      padding: "8px 12px",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
      minWidth: "110px",
    }}
  >
    <div
      style={{
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: "#6b7280",
        marginBottom: "6px",
      }}
    >
      Case Density
    </div>
    <div
      style={{
        width: "86px",
        height: "8px",
        borderRadius: "4px",
        background:
          "linear-gradient(to right, #4f46e5, #06b6d4, #fbbf24, #ef4444)",
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
      <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500 }}>
        Low
      </span>
      <span style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500 }}>
        High
      </span>
    </div>
  </div>
);

export default HeatmapLegend;
