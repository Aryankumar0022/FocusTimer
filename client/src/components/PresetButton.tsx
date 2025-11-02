import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PresetButtonProps {
  duration: number;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export function PresetButton({ duration, label, isActive, onClick }: PresetButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={cn(
        "h-20 flex flex-col items-center justify-center gap-1",
        isActive && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onClick}
      data-testid={`button-preset-${duration}`}
    >
      <span className="text-3xl font-bold font-mono tabular-nums">{duration}</span>
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </Button>
  );
}
