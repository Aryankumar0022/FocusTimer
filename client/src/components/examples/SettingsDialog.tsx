import { SettingsDialog } from "../SettingsDialog";

export default function SettingsDialogExample() {
  return (
    <SettingsDialog
      open={true}
      onClose={() => console.log('Settings closed')}
      notificationsEnabled={true}
      onToggleNotifications={() => console.log('Toggle notifications')}
      onClearData={() => console.log('Clear data')}
      onExport={(format) => console.log('Export as', format)}
    />
  );
}
