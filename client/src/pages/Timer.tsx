import { useState, useEffect, useRef } from "react";
import { TimerDisplay } from "@/components/TimerDisplay";
import { PresetButton } from "@/components/PresetButton";
import { DistractionButton } from "@/components/DistractionButton";
import { ReflectionDialog } from "@/components/ReflectionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveSessions, loadSessions, saveEvents, loadEvents, saveTimerState, loadTimerState, clearTimerState } from "@/lib/storage";
import { showNotification, requestNotificationPermission } from "@/lib/notifications";
import { Session, DistractionEvent } from "@shared/schema";

const PRESETS = [
  { duration: 25, label: "min" },
  { duration: 50, label: "min" },
  { duration: 90, label: "min" },
];

export default function Timer() {
  const [selectedPreset, setSelectedPreset] = useState(25);
  const [customDuration, setCustomDuration] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [distractionCount, setDistractionCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [showReflection, setShowReflection] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadState = async () => {
      const savedState = loadTimerState();
      if (savedState && savedState.isRunning) {
        const elapsed = Date.now() - (savedState.startTime || 0);
        const elapsedSeconds = Math.floor(elapsed / 1000);
        const remaining = Math.max(0, savedState.duration - elapsedSeconds - savedState.elapsedWhenPaused);
        
        setIsRunning(!savedState.isPaused);
        setIsPaused(savedState.isPaused);
        setRemainingSeconds(remaining);
        setTotalSeconds(savedState.duration);
        setCurrentSessionId(savedState.currentSessionId);
      }
    };
    loadState();

    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const handleStart = () => {
    const duration = customDuration ? parseInt(customDuration) * 60 : selectedPreset * 60;
    const sessionId = crypto.randomUUID();
    
    setCurrentSessionId(sessionId);
    setIsRunning(true);
    setIsPaused(false);
    setRemainingSeconds(duration);
    setTotalSeconds(duration);
    setDistractionCount(0);
    
    saveTimerState({
      isRunning: true,
      isPaused: false,
      currentSessionId: sessionId,
      startTime: Date.now(),
      pausedTime: null,
      duration,
      elapsedWhenPaused: 0,
    });

    toast({
      title: "Timer started",
      description: `Focus for ${Math.round(duration / 60)} minutes!`,
    });
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
    
    const savedState = loadTimerState();
    if (savedState) {
      saveTimerState({
        ...savedState,
        isPaused: true,
        isRunning: false,
        pausedTime: Date.now(),
        elapsedWhenPaused: savedState.elapsedWhenPaused + Math.floor((Date.now() - (savedState.startTime || 0)) / 1000),
      });
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
    
    const savedState = loadTimerState();
    if (savedState) {
      saveTimerState({
        ...savedState,
        isPaused: false,
        isRunning: true,
        startTime: Date.now(),
        pausedTime: null,
      });
    }
  };

  const handleStop = () => {
    setShowReflection(true);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    showNotification("Timer Complete!", "Great work! Time to reflect on your session.");
    setShowReflection(true);
  };

  const handleDistraction = async () => {
    setDistractionCount((prev) => prev + 1);
    
    if (currentSessionId) {
      const events = await loadEvents();
      const newEvent: DistractionEvent = {
        id: crypto.randomUUID(),
        sessionId: currentSessionId,
        timestamp: new Date().toISOString(),
        eventType: "manual",
      };
      await saveEvents([...events, newEvent]);
    }

    toast({
      title: "Distraction logged",
      description: "Refocus and get back to work!",
    });
  };

  const handleReflectionSubmit = async (reflection: string, mood: "productive" | "distracted" | "mixed") => {
    const sessions = await loadSessions();
    const durationSec = totalSeconds - remainingSeconds;
    
    const newSession: Session = {
      id: currentSessionId || crypto.randomUUID(),
      startedAt: new Date(Date.now() - durationSec * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      durationSec,
      taskTitle: taskTitle || null,
      distractedCount: distractionCount,
      reflection: reflection || null,
      mood,
    };

    await saveSessions([...sessions, newSession]);
    
    setShowReflection(false);
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(selectedPreset * 60);
    setTotalSeconds(selectedPreset * 60);
    setDistractionCount(0);
    setCurrentSessionId(null);
    setTaskTitle("");
    clearTimerState();

    toast({
      title: "Session saved",
      description: "Your focus session has been recorded!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto space-y-12">
        {!isRunning && !isPaused && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">FocusFlow</h1>
              <p className="text-muted-foreground">Choose your focus duration</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {PRESETS.map((preset) => (
                <PresetButton
                  key={preset.duration}
                  duration={preset.duration}
                  label={preset.label}
                  isActive={selectedPreset === preset.duration && !customDuration}
                  onClick={() => {
                    setSelectedPreset(preset.duration);
                    setCustomDuration("");
                  }}
                />
              ))}
            </div>

            <div className="space-y-3">
              <Label htmlFor="custom-duration" className="text-base font-semibold">
                Or set custom duration (minutes)
              </Label>
              <Input
                id="custom-duration"
                type="number"
                placeholder="e.g., 60"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                data-testid="input-custom-duration"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="task-title" className="text-base font-semibold">
                What will you work on? (optional)
              </Label>
              <Input
                id="task-title"
                placeholder="e.g., Design review"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                data-testid="input-task-title"
              />
            </div>

            <Button
              size="lg"
              className="w-full h-16 text-lg"
              onClick={handleStart}
              data-testid="button-start"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Focus Session
            </Button>
          </div>
        )}

        {(isRunning || isPaused) && (
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <p className="text-sm uppercase tracking-wide text-muted-foreground font-medium">
                {isPaused ? "Paused" : "Focus Time"}
              </p>
              {taskTitle && (
                <h2 className="text-xl font-semibold">{taskTitle}</h2>
              )}
            </div>

            <TimerDisplay
              remainingSeconds={remainingSeconds}
              totalSeconds={totalSeconds}
              isRunning={isRunning && !isPaused}
            />

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isPaused ? (
                <Button
                  size="lg"
                  className="h-14 px-8"
                  onClick={handleResume}
                  data-testid="button-resume"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Resume
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8"
                  onClick={handlePause}
                  data-testid="button-pause"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8"
                onClick={handleStop}
                data-testid="button-stop"
              >
                <Square className="mr-2 h-5 w-5" />
                End Session
              </Button>
            </div>

            <DistractionButton
              count={distractionCount}
              onClick={handleDistraction}
            />
          </div>
        )}
      </div>

      <ReflectionDialog
        open={showReflection}
        onClose={() => setShowReflection(false)}
        onSubmit={handleReflectionSubmit}
      />
    </div>
  );
}
