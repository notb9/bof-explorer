import {
  Modal,
  Button,
  Form,
  InputGroup,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { useUserSettings } from "../contexts/UserSettings";
import { Folder, Terminal } from "react-bootstrap-icons";

type SettingsModalProps = {
  show: boolean;
  onHide: () => void;
};

export function SettingsModal({ show, onHide }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useUserSettings();

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="settingsCoffloaderPath">
            <Form.Label className="fw-bold">CoffLoader Path</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Terminal />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="e.g. C:\Tools\CoffLoader64.exe"
                value={settings.coffloaderPath}
                onChange={(e) =>
                  updateSettings({ coffloaderPath: e.target.value })
                }
              />
            </InputGroup>
            <Form.Text className="text-muted">
              The executable path used when generating the BOF execution
              command.
            </Form.Text>
          </Form.Group>

          <hr />

          <div className="mt-3">
            <Form.Label className="fw-bold">Kit Paths</Form.Label>
            {Object.entries(settings.kitPaths).map(
              ([kitName, kitPathValue]) => (
                <Form.Group
                  className="mb-3"
                  controlId={`settingsKitPath-${kitName}`}
                  key={kitName}
                >
                  <Form.Label>{kitName}</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Folder />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder={`e.g. C:\\Tools\\Kits\\${kitName}`}
                      value={kitPathValue}
                      onChange={(e) =>
                        updateSettings({
                          kitPaths: { [kitName]: e.target.value },
                        })
                      }
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Path to the `{kitName}` kit.
                  </Form.Text>
                </Form.Group>
              ),
            )}
          </div>
          <hr />
          <Form.Label className="fw-bold">Other Settings</Form.Label>
          <Form.Group className="d-flex align-items-center justify-content-between">
            <Form.Label>Always expand usage</Form.Label>
            <ToggleButtonGroup
              type="radio"
              name="alwaysExpandUsage"
              value={settings.alwaysExpandUsage ? "Yes" : "No"}
              onChange={(e) => {
                console.log(e);
                if (e === "Yes") {
                  updateSettings({ alwaysExpandUsage: true });
                } else {
                  updateSettings({ alwaysExpandUsage: false });
                }
              }}
              size="sm"
            >
              {["Yes", "No"].map((mode) => (
                <ToggleButton
                  key={mode}
                  id={`alwaysexpandusage-${mode}`}
                  value={mode}
                  variant="outline-secondary"
                  className="px-4"
                >
                  {mode.toUpperCase()}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={resetSettings}>
          Clear Settings
        </Button>
        <Button variant="primary" onClick={onHide}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
