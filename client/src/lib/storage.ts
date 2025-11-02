import { Session, DistractionEvent, TimerState } from '@shared/schema';
import { encryptData, decryptData } from './crypto';

const SESSIONS_KEY = 'focusflow_sessions';
const EVENTS_KEY = 'focusflow_events';
const TIMER_STATE_KEY = 'focusflow_timer_state';

export async function saveSessions(sessions: Session[]): Promise<void> {
  const encrypted = await encryptData(JSON.stringify(sessions));
  localStorage.setItem(SESSIONS_KEY, encrypted);
}

export async function loadSessions(): Promise<Session[]> {
  try {
    const encrypted = localStorage.getItem(SESSIONS_KEY);
    if (!encrypted) return [];
    
    const decrypted = await decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
}

export async function saveEvents(events: DistractionEvent[]): Promise<void> {
  const encrypted = await encryptData(JSON.stringify(events));
  localStorage.setItem(EVENTS_KEY, encrypted);
}

export async function loadEvents(): Promise<DistractionEvent[]> {
  try {
    const encrypted = localStorage.getItem(EVENTS_KEY);
    if (!encrypted) return [];
    
    const decrypted = await decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to load events:', error);
    return [];
  }
}

export function saveTimerState(state: TimerState): void {
  localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
}

export function loadTimerState(): TimerState | null {
  try {
    const stored = localStorage.getItem(TIMER_STATE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load timer state:', error);
    return null;
  }
}

export function clearTimerState(): void {
  localStorage.removeItem(TIMER_STATE_KEY);
}

export async function exportSessionsToCSV(sessions: Session[]): Promise<string> {
  const headers = ['Date', 'Duration (min)', 'Task', 'Distractions', 'Mood', 'Reflection'];
  const rows = sessions.map(session => [
    new Date(session.startedAt).toLocaleDateString(),
    session.durationSec ? Math.round(session.durationSec / 60) : 0,
    session.taskTitle || '',
    session.distractedCount,
    session.mood || '',
    session.reflection || ''
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csv;
}

export async function exportSessionsToJSON(sessions: Session[]): Promise<string> {
  return JSON.stringify(sessions, null, 2);
}
