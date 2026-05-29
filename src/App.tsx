import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MouseGlow } from "@/components/MouseGlow";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import FAQ from "@/pages/FAQ";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "p0rtal";

function FakeNotFound() {
  return <NotFound />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/faq" component={FAQ} />
      {/* Real admin at secret slug — /admin shows fake 404 */}
      <Route path={`/${ADMIN_SLUG}`} component={Admin} />
      <Route path="/admin" component={FakeNotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <MouseGlow />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
