import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface DistractionButtonProps {
  count: number;
  onClick: () => void;
  disabled?: boolean;
}

export function DistractionButton({ count, onClick, disabled }: DistractionButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 h-16 px-8 rounded-full shadow-lg border-2"
      onClick={onClick}
      disabled={disabled}
      data-testid="button-distracted"
    >
      <AlertCircle className="h-5 w-5 mr-2" />
      <span className="font-semibold">I'm Distracted</span>
      {count > 0 && (
        <Badge variant="secondary" className="ml-3 rounded-full" data-testid="badge-distraction-count">
          {count}
        </Badge>
      )}
    </Button>
  );
}
