import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Frown, Meh, Smile } from "lucide-react";
import { Session } from "@shared/schema";
import { format } from "date-fns";

interface SessionCardProps {
  session: Session;
  onClick?: () => void;
}

const moodIcons = {
  productive: <Smile className="h-4 w-4" />,
  mixed: <Meh className="h-4 w-4" />,
  distracted: <Frown className="h-4 w-4" />,
};

const moodColors = {
  productive: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  mixed: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  distracted: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export function SessionCard({ session, onClick }: SessionCardProps) {
  const duration = session.durationSec ? Math.round(session.durationSec / 60) : 0;
  const date = format(new Date(session.startedAt), "MMM d, yyyy");
  const time = format(new Date(session.startedAt), "h:mm a");

  return (
    <Card 
      className="hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-session-${session.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {session.taskTitle || "Untitled Session"}
          </CardTitle>
          {session.mood && (
            <Badge variant="outline" className={moodColors[session.mood]}>
              {moodIcons[session.mood]}
              <span className="ml-1 capitalize">{session.mood}</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{date}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{duration} minutes</span>
          </div>
          {session.distractedCount > 0 && (
            <Badge variant="secondary" data-testid={`badge-distractions-${session.id}`}>
              {session.distractedCount} distraction{session.distractedCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {session.reflection && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {session.reflection}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
