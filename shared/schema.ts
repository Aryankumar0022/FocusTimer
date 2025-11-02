import { z } from "zod";

// Session schema for focus timer sessions
export const sessionSchema = z.object({
  id: z.string(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  durationSec: z.number().nullable(),
  taskTitle: z.string().nullable(),
  distractedCount: z.number(),
  reflection: z.string().nullable(),
  mood: z.enum(["productive", "distracted", "mixed"]).nullable(),
});

export const insertSessionSchema = sessionSchema.omit({ id: true });

export type Session = z.infer<typeof sessionSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;

// Distraction event schema
export const distractionEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  timestamp: z.string(),
  eventType: z.enum(["manual", "tab_switch"]),
});

export const insertDistractionEventSchema = distractionEventSchema.omit({ id: true });

export type DistractionEvent = z.infer<typeof distractionEventSchema>;
export type InsertDistractionEvent = z.infer<typeof insertDistractionEventSchema>;

// Timer state
export const timerStateSchema = z.object({
  isRunning: z.boolean(),
  isPaused: z.boolean(),
  currentSessionId: z.string().nullable(),
  startTime: z.number().nullable(),
  pausedTime: z.number().nullable(),
  duration: z.number(),
  elapsedWhenPaused: z.number(),
});

export type TimerState = z.infer<typeof timerStateSchema>;
