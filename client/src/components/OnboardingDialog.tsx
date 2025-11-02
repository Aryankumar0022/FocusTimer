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
import { Shield, Lock, Smartphone, Check } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "All your session data is stored locally on your device and encrypted using AES-256-GCM encryption. We never send your data to any server.",
  },
  {
    icon: Lock,
    title: "Local-Only Storage",
    description: "Your reflections, session history, and focus statistics stay on your device. You have complete control over your data.",
  },
  {
    icon: Smartphone,
    title: "Install as an App",
    description: "FocusFlow works as a Progressive Web App. You can install it on your home screen for quick access and offline use.",
  },
];

export function OnboardingDialog({ open, onClose }: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-onboarding">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">{currentStepData.title}</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentStep
                  ? "bg-primary w-8"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="ghost" onClick={handleSkip} data-testid="button-skip-onboarding">
            Skip
          </Button>
          <Button onClick={handleNext} data-testid="button-next-onboarding">
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
            {currentStep === steps.length - 1 && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
