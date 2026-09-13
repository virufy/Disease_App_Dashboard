import styled, { keyframes } from "styled-components";

export const rise = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

/** Full page shell */
export const Page = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  color: var(--ink);

  @media (max-width: 640px) {
    padding: 10px;
    gap: 10px;
  }
`;

/** Dark glass panel */
export const Panel = styled.section`
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px 8px;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PanelBody = styled.div`
  padding: 4px 14px 14px;
`;

/** Segmented control (season / speed / scenario toggles) */
export const Segmented = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: rgba(9, 12, 20, 0.6);
  border: 1px solid var(--line);
  border-radius: 12px;
  flex-wrap: wrap;
`;

export const SegButton = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 1px solid ${({ $active }) => ($active ? "rgba(34,211,238,0.55)" : "transparent")};
  background: ${({ $active }) =>
    $active ? "rgba(34,211,238,0.16)" : "transparent"};
  color: ${({ $active }) => ($active ? "#a5f3fc" : "var(--muted)")};
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.16s ease;
  white-space: nowrap;

  &:hover {
    color: var(--ink);
    background: rgba(148, 163, 184, 0.1);
  }
  &:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 1px;
  }
`;

/** Small status chip */
export const Chip = styled.span<{ $tone?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${({ $tone }) => $tone || "#a5f3fc"};
  background: ${({ $tone }) =>
    $tone ? "rgba(148,163,184,0.12)" : "rgba(34,211,238,0.12)"};
  border: 1px solid var(--line);
`;

export const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--signal);
  animation: dm-live 1.8s ease-in-out infinite;
`;

export const Num = styled.span`
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
`;

export const IconBtn = styled.button`
  appearance: none;
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: rgba(9, 12, 20, 0.6);
  color: var(--ink);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(34, 211, 238, 0.5);
    color: #a5f3fc;
  }
  &:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 1px;
  }
`;
