import { Switch, Route } from "wouter";
import { routes } from "@/app/routes";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useLocation } from "wouter";
import Seo from "@/shared/seo/Seo";

const seoMap: Array<{
  match: (path: string) => boolean;
  title: string;
  description?: string;
  canonicalPath?: string;
}> = [
  { match: (path) => path === "/", title: "Nursing Educator Hub" },
  {
    match: (path) => path.startsWith("/exam-prep"),
    title: "Exam Prep | Nursing Educator Hub",
    description: "Practice exams, quizzes, and study resources for nursing certifications.",
    canonicalPath: "/exam-prep",
  },
  { match: (path) => path === "/colleges", title: "Colleges | Nursing Educator Hub" },
  { match: (path) => path === "/news", title: "News | Nursing Educator Hub" },
  { match: (path) => path === "/study-library", title: "Study Library | Nursing Educator Hub" },
  { match: (path) => path === "/about-us", title: "About Us | Nursing Educator Hub" },
  { match: (path) => path === "/contact", title: "Contact | Nursing Educator Hub" },
];

function getSeoConfig(pathname: string) {
  return (
    seoMap.find((entry) => entry.match(pathname)) || {
      title: "Nursing Educator Hub",
    }
  );
}

export default function App() {
  const [location] = useLocation();
  const seo = getSeoConfig(location);

  return (
    <ErrorBoundary>
      <Seo
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
      />
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
