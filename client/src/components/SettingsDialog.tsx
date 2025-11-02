import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Trash2, Download } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onClearData: () => void;
  onExport: (format: 'csv' | 'json') => void;
}

export function SettingsDialog({
  open,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
  onClearData,
  onExport,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" data-testid="dialog-settings">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Manage your FocusFlow preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="notifications" className="text-base cursor-pointer">
                  Enable timer completion alerts
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={onToggleNotifications}
                data-testid="switch-notifications"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data Management</h3>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => onExport('csv')}
                data-testid="button-export-csv"
              >
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => onExport('json')}
                data-testid="button-export-json"
              >
                <Download className="mr-2 h-4 w-4" />
                Export to JSON
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={onClearData}
              data-testid="button-clear-data"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
            <p className="text-sm text-muted-foreground">
              This will permanently delete all your sessions and cannot be undone.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
