import { TimerDisplay } from "../TimerDisplay";

export default function TimerDisplayExample() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center p-8">
      <TimerDisplay remainingSeconds={1500} totalSeconds={1500} isRunning={true} size="lg" />
    </div>
  );
}
