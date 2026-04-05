import { GearWideConnected } from "react-bootstrap-icons";

interface SettingsIconProps {
  onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsIconProps) {
  return (
    <div
      className="app-settings-icon"
      onClick={onClick}
      aria-label="Open settings"
    >
      <GearWideConnected />
    </div>
  );
}
