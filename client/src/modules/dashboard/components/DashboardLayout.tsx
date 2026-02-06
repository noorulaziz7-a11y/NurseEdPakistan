import { ReactNode } from "react";
import Seo from "@/shared/seo/Seo";

type DashboardLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function DashboardLayout({
  title,
  description,
  children,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${title} | Nursing Educator Hub`}
        description={description}
        canonicalPath="/exam-prep/dashboard"
        noIndex
      />
      <section className="bg-gradient-to-r from-secondary to-accent text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              {description && (
                <p className="text-secondary-foreground/90 mt-3 text-base md:text-lg">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  );
}
