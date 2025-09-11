import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ExamPrep from "@/pages/exam-prep";
import PracticeTest from "@/pages/practice-test";
import Colleges from "@/pages/colleges";
import StudyMaterials from "@/pages/study-materials";
import News from "@/pages/news";
import AuthPage from "@/pages/auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/exam-prep" component={ExamPrep} />
          <Route path="/practice-test/:examType" component={PracticeTest} />
          <Route path="/colleges" component={Colleges} />
          <Route path="/study-materials" component={StudyMaterials} />
          <Route path="/news" component={News} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
