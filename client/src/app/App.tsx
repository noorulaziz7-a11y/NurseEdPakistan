import { Switch, Route } from "wouter";
import { routes } from "@/app/routes";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Switch>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} component={Component} />
          ))}
        </Switch>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
