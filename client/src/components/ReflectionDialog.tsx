import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Frown, Meh, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReflectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reflection: string, mood: "productive" | "distracted" | "mixed") => void;
}

const moods = [
  { value: "productive" as const, label: "Productive", icon: Smile, color: "text-green-600 dark:text-green-400" },
  { value: "mixed" as const, label: "Mixed", icon: Meh, color: "text-yellow-600 dark:text-yellow-400" },
  { value: "distracted" as const, label: "Distracted", icon: Frown, color: "text-red-600 dark:text-red-400" },
];

export function ReflectionDialog({ open, onClose, onSubmit }: ReflectionDialogProps) {
  const [reflection, setReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState<"productive" | "distracted" | "mixed">("productive");

  const handleSubmit = () => {
    onSubmit(reflection, selectedMood);
    setReflection("");
    setSelectedMood("productive");
  };

  const handleSkip = () => {
    onSubmit("", selectedMood);
    setReflection("");
    setSelectedMood("productive");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" data-testid="dialog-reflection">
        <DialogHeader>
          <DialogTitle className="text-2xl">Session Complete!</DialogTitle>
          <DialogDescription>
            Take a moment to reflect on your focus session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold">How do you feel about this session?</Label>
            <div className="grid grid-cols-3 gap-3">
              {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className={cn(
                      "h-20 flex flex-col gap-2",
                      selectedMood === mood.value && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => setSelectedMood(mood.value)}
                    data-testid={`button-mood-${mood.value}`}
                  >
                    <Icon className={cn("h-6 w-6", selectedMood === mood.value ? "" : mood.color)} />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="reflection" className="text-base font-semibold">
              Reflection (optional)
            </Label>
            <Textarea
              id="reflection"
              placeholder="What did you accomplish? Any insights or challenges?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-32 resize-none"
              data-testid="input-reflection"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleSkip} data-testid="button-skip-reflection">
            Skip
          </Button>
          <Button onClick={handleSubmit} data-testid="button-submit-reflection">
            Save Reflection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
