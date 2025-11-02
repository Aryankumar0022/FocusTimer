import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Clock, History as HistoryIcon, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { requestNotificationPermission } from "@/lib/notifications";
import { saveSessions, loadSessions, exportSessionsToCSV, exportSessionsToJSON } from "@/lib/storage";

import Timer from "@/pages/Timer";
import History from "@/pages/History";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Timer} />
      <Route path="/history" component={History} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('focusflow_onboarding_complete');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    const checkNotifications = async () => {
      if ('Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    };
    checkNotifications();
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('focusflow_onboarding_complete', 'true');
  };

  const handleToggleNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    toast({
      title: granted ? "Notifications enabled" : "Notifications disabled",
      description: granted 
        ? "You'll receive alerts when your timer completes" 
        : "Enable notifications in your browser settings",
    });
  };

  const handleClearData = async () => {
    if (confirm("Are you sure you want to delete all your session data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const sessions = await loadSessions();
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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/">
                    <a className="text-xl font-bold flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md">
                      <Clock className="h-5 w-5" />
                      FocusFlow
                    </a>
                  </Link>
                  
                  <nav className="hidden sm:flex items-center gap-2">
                    <Link href="/">
                      <a>
                        <Button
                          variant={location === "/" ? "secondary" : "ghost"}
                          size="sm"
                          data-testid="link-timer"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Timer
                        </Button>
                      </a>
                    </Link>
                    <Link href="/history">
                      <a>
                        <Button
                          variant={location === "/history" ? "secondary" : "ghost"}
                          size="sm"
                          data-testid="link-history"
                        >
                          <HistoryIcon className="mr-2 h-4 w-4" />
                          History
                        </Button>
                      </a>
                    </Link>
                  </nav>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                    data-testid="button-settings"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <main>
              <Router />
            </main>

            <nav className="sm:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center justify-around h-16">
                <Link href="/">
                  <a className="flex-1">
                    <Button
                      variant={location === "/" ? "secondary" : "ghost"}
                      className="w-full h-full rounded-none"
                      data-testid="link-timer-mobile"
                    >
                      <Clock className="h-5 w-5" />
                    </Button>
                  </a>
                </Link>
                <Link href="/history">
                  <a className="flex-1">
                    <Button
                      variant={location === "/history" ? "secondary" : "ghost"}
                      className="w-full h-full rounded-none"
                      data-testid="link-history-mobile"
                    >
                      <HistoryIcon className="h-5 w-5" />
                    </Button>
                  </a>
                </Link>
              </div>
            </nav>
          </div>

          <OnboardingDialog open={showOnboarding} onClose={handleOnboardingClose} />
          <SettingsDialog
            open={showSettings}
            onClose={() => setShowSettings(false)}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={handleToggleNotifications}
            onClearData={handleClearData}
            onExport={handleExport}
          />
          
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
