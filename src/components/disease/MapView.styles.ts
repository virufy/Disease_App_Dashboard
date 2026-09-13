import styled from "styled-components";

export const MapWrap = styled.div`
  position: relative;
  flex: 1;
  min-height: 340px;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
`;

export const MapCanvas = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  .leaflet-control-zoom {
    border: 1px solid var(--line) !important;
    box-shadow: none !important;
  }
  .leaflet-control-zoom a {
    background: rgba(26, 28, 31, 0.9) !important;
    color: var(--ink) !important;
    border-color: var(--line) !important;
  }
  .leaflet-control-zoom a:hover {
    background: rgba(77, 141, 246, 0.18) !important;
  }
`;

export const FocusBar = styled.div`
  position: absolute;
  top: 12px;
  left: 52px;
  z-index: 500;
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 11px;
  background: rgba(16, 17, 20, 0.82);
  border: 1px solid var(--line);
  backdrop-filter: blur(8px);

  [dir="rtl"] & {
    left: auto;
    right: 52px;
  }
  @media (max-width: 640px) {
    left: 48px;
    flex-wrap: wrap;
    max-width: 60%;
  }
`;

export const FocusBtn = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 1px solid ${({ $active }) => ($active ? "rgba(77, 141, 246,0.5)" : "transparent")};
  background: ${({ $active }) => ($active ? "rgba(77, 141, 246,0.16)" : "transparent")};
  color: ${({ $active }) => ($active ? "#9dc0ff" : "var(--muted)")};
  font-family: var(--font-ui);
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: var(--ink);
    background: rgba(148, 163, 184, 0.1);
  }
  &:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 1px;
  }
`;

export const PrevalenceToggle = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#9dc0ff" : "var(--muted)")};
  background: rgba(16, 17, 20, 0.82);
  border: 1px solid ${({ $active }) => ($active ? "rgba(77, 141, 246,0.5)" : "var(--line)")};
  backdrop-filter: blur(8px);
  transition: all 0.16s ease;

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(90deg,#4d8df6,#ef4444)"
        : "rgba(148,163,184,0.5)"};
  }
  &:hover {
    color: var(--ink);
    border-color: rgba(77, 141, 246, 0.4);
  }
  [dir="rtl"] & {
    right: auto;
    left: 12px;
  }
`;

export const Legend = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 500;
  padding: 11px 13px;
  border-radius: 12px;
  background: rgba(16, 17, 20, 0.85);
  border: 1px solid var(--line);
  backdrop-filter: blur(10px);
  max-width: 240px;

  .ttl {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--faint);
    margin-bottom: 7px;
  }
  .tiers {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--line);
    span {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      font-weight: 600;
      color: var(--muted);
    }
    i {
      width: 9px;
      height: 9px;
      border-radius: 3px;
      display: inline-block;
    }
  }

  [dir="rtl"] & {
    left: auto;
    right: 12px;
  }
  @media (max-width: 640px) {
    display: none;
  }
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--muted);
  margin: 4px 0;

  span {
    flex-shrink: 0;
    display: inline-block;
  }
  .fill {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4d8df6;
    border: 2px solid #0a0e17;
    box-shadow: 0 0 0 1.5px #4d8df6;
  }
  .ring {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px dashed #4d8df6;
  }
  .pulse {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid #fbbf24;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.25);
  }
  .flow {
    width: 16px;
    height: 0;
    border-top-width: 2px;
    border-top-style: dashed;
  }
  .flow.high {
    border-top-color: #ef4444;
  }
  .flow.alt {
    border-top-color: #22c55e;
  }
`;
