import { OnboardingDialog } from "../OnboardingDialog";

export default function OnboardingDialogExample() {
  return (
    <OnboardingDialog
      open={true}
      onClose={() => console.log('Onboarding closed')}
    />
  );
}
