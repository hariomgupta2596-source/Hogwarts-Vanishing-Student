import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Intro } from "./pages/intro";
import { Hub } from "./pages/hub";
import { Game1 } from "./pages/game1";
import { Game2 } from "./pages/game2";
import { Game3 } from "./pages/game3";
import { Game4 } from "./pages/game4";
import { Verdict } from "./pages/verdict";
import { Leaderboard } from "./pages/leaderboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/hub" component={Hub} />
      <Route path="/game/1" component={Game1} />
      <Route path="/game/2" component={Game2} />
      <Route path="/game/3" component={Game3} />
      <Route path="/game/4" component={Game4} />
      <Route path="/verdict" component={Verdict} />
      <Route path="/leaderboard" component={Leaderboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
