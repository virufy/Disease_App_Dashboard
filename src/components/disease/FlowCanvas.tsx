import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { CORRIDORS, NODE_MAP } from "../../data/geo";

interface FlowCanvasProps {
  map: L.Map | null;
  active: boolean;
  /** 0..1 intensity that scales dot count/speed with current risk */
  intensity: number;
}

/**
 * Animated transmission-flow overlay: dots travel both directions along real
 * inter-city corridors. High-risk corridors glow red, alternates green.
 * Drawn on a canvas kept aligned with the Leaflet map each frame.
 */
const FlowCanvas: React.FC<FlowCanvasProps> = ({ map, active, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const tRef = useRef(0);

  useEffect(() => {
    if (!map) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const size = map.getSize();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size.x * dpr;
      canvas.height = size.y * dpr;
      canvas.style.width = `${size.x}px`;
      canvas.style.height = `${size.y}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    map.on("resize", resize);

    const draw = () => {
      const size = map.getSize();
      ctx.clearRect(0, 0, size.x, size.y);
      tRef.current += active ? 0.006 : 0;

      CORRIDORS.forEach((c, ci) => {
        const a = NODE_MAP[c.from];
        const b = NODE_MAP[c.to];
        if (!a || !b) return;
        const pa = map.latLngToContainerPoint([a.lat, a.lon]);
        const pb = map.latLngToContainerPoint([b.lat, b.lon]);
        const high = c.risk === "high";
        const color = high ? "239,68,68" : "34,197,94";

        // corridor line (dashed)
        ctx.save();
        ctx.setLineDash(high ? [7, 7] : [3, 8]);
        ctx.lineWidth = high ? 1.6 : 1.2;
        ctx.strokeStyle = `rgba(${color},${high ? 0.4 : 0.28})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
        ctx.restore();

        // travelling dots (both directions)
        const count = 3 + Math.round(intensity * 3);
        for (let d = 0; d < count; d++) {
          for (const dir of [0, 1]) {
            let f = (tRef.current * (0.6 + intensity * 0.7) + d / count + dir * 0.5) % 1;
            if (dir === 1) f = 1 - f;
            const x = pa.x + (pb.x - pa.x) * f;
            const y = pa.y + (pb.y - pa.y) * f;
            const r = high ? 2.6 : 2.1;
            const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
            glow.addColorStop(0, `rgba(${color},0.9)`);
            glow.addColorStop(1, `rgba(${color},0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, r * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(${color},0.95)`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        void ci;
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map.off("resize", resize);
    };
  }, [map, active, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 450,
        pointerEvents: "none",
      }}
    />
  );
};

export default FlowCanvas;
