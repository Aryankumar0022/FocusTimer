import { useEffect, useState } from "react";
import { SessionCard } from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { loadSessions, exportSessionsToCSV, exportSessionsToJSON } from "@/lib/storage";
import { Session } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function History() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const data = await loadSessions();
      setSessions(data.sort((a, b) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      ));
      setIsLoading(false);
    };
    load();
  }, []);

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const data = format === 'csv' 
        ? await exportSessionsToCSV(sessions)
        : await exportSessionsToJSON(sessions);
      
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-sessions.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Sessions exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export sessions",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Session History</h1>
            <p className="text-muted-foreground mt-2">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
          
          {sessions.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('csv')}
                data-testid="button-export-csv-page"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('json')}
                data-testid="button-export-json-page"
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </div>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No sessions yet. Start your first focus session!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => console.log('Session clicked:', session.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
