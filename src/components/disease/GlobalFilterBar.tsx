import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { FOCUS_LOCATIONS } from "../../data/submissions";
import { Panel } from "../../styles/cc";

const SYMPTOMS = ["cold", "influenza", "covid", "sars", "rsv", "heavysmoker"];

const Bar = styled(Panel)`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 9px 14px;
  flex-wrap: wrap;
`;
const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  .lbl {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--faint);
  }
  .chips {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
`;
const Divider = styled.span`
  width: 1px;
  align-self: stretch;
  background: var(--line);
  @media (max-width: 720px) {
    display: none;
  }
`;
const FChip = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 1px solid ${({ $active }) => ($active ? "rgba(77, 141, 246,0.5)" : "var(--line)")};
  background: ${({ $active }) => ($active ? "rgba(77, 141, 246,0.16)" : "rgba(9,12,20,0.5)")};
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
  }
  &:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 1px;
  }
`;

const GlobalFilterBar: React.FC = () => {
  const { t } = useTranslation();
  const { locations, symptoms, toggleLocation, toggleSymptom, clearLocations, clearSymptoms } = useDisease();

  return (
    <Bar>
      <Group>
        <span className="lbl">{t("dm.filter.location")}</span>
        <div className="chips">
          <FChip $active={locations.length === 0} onClick={clearLocations}>
            {t("dm.filter.all")}
          </FChip>
          {FOCUS_LOCATIONS.map((id) => (
            <FChip key={id} $active={locations.includes(id)} onClick={() => toggleLocation(id)}>
              {t(`nodes.${id}`, { defaultValue: id })}
            </FChip>
          ))}
        </div>
      </Group>

      <Divider />

      <Group>
        <span className="lbl">{t("dm.filter.disease")}</span>
        <div className="chips">
          <FChip $active={symptoms.length === 0} onClick={clearSymptoms}>
            {t("dm.filter.all")}
          </FChip>
          {SYMPTOMS.map((id) => (
            <FChip key={id} $active={symptoms.includes(id)} onClick={() => toggleSymptom(id)}>
              {t(`symptoms.${id}`, { defaultValue: id })}
            </FChip>
          ))}
        </div>
      </Group>
    </Bar>
  );
};

export default GlobalFilterBar;
