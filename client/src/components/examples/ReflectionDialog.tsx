import { ReflectionDialog } from "../ReflectionDialog";

export default function ReflectionDialogExample() {
  return (
    <ReflectionDialog
      open={true}
      onClose={() => console.log('Dialog closed')}
      onSubmit={(reflection, mood) => console.log('Submitted:', { reflection, mood })}
    />
  );
}
