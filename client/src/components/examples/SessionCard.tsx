import { SessionCard } from "../SessionCard";
import { Session } from "@shared/schema";

export default function SessionCardExample() {
  const mockSession: Session = {
    id: "1",
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    durationSec: 1500,
    taskTitle: "Deep work on FocusFlow design",
    distractedCount: 2,
    reflection: "Great session! Completed the main timer component and started on the history view.",
    mood: "productive",
  };

  return (
    <div className="max-w-md p-8">
      <SessionCard session={mockSession} onClick={() => console.log('Session clicked')} />
    </div>
  );
}
