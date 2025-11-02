import { useEffect, useState } from "react";

interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  size?: "sm" | "md" | "lg";
}

export function TimerDisplay({ remainingSeconds, totalSeconds, isRunning, size = "lg" }: TimerDisplayProps) {
  const [displayTime, setDisplayTime] = useState(remainingSeconds);

  useEffect(() => {
    setDisplayTime(remainingSeconds);
  }, [remainingSeconds]);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 190;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const sizeClasses = {
    sm: { container: "w-48 h-48", text: "text-5xl", stroke: "8" },
    md: { container: "w-64 h-64", text: "text-6xl", stroke: "10" },
    lg: { container: "w-80 h-80 sm:w-96 sm:h-96", text: "text-7xl sm:text-8xl", stroke: "12" }
  };

  const { container, text, stroke } = sizeClasses[size];

  return (
    <div className={`relative ${container} mx-auto`} data-testid="timer-display">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="190"
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
          fill="none"
          className="opacity-20"
        />
        <circle
          cx="50%"
          cy="50%"
          r="190"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
          style={{
            filter: isRunning ? "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))" : "none"
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`font-mono font-bold ${text} tabular-nums tracking-tight text-foreground`}>
          {timeString}
        </div>
      </div>
    </div>
  );
}
