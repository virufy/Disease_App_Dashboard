import React from "react";
import { useTranslation } from "react-i18next";
import { tokens } from "../../styles/theme";

const HeatmapLegend: React.FC = () => {
  const { t } = useTranslation();
  return (
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
      padding: "8px 12px",
      boxShadow: tokens.shadow.md,
      minWidth: "110px",
    }}
  >
    <div
      style={{
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: tokens.color.muted,
        marginBottom: "6px",
      }}
    >
      {t("dashboard.caseDensity")}
    </div>
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
      <span style={{ fontSize: "9px", color: tokens.color.faint, fontWeight: 500 }}>
        {t("dashboard.low")}
      </span>
      <span style={{ fontSize: "9px", color: tokens.color.faint, fontWeight: 500 }}>
        {t("dashboard.high")}
      </span>
    </div>
  </div>
  );
};

export default HeatmapLegend;
