interface ExamPageSEOProps {
  examName: string;
  examId: string;
  description?: string;
  pageType?: "overview" | "quiz" | "resources" | "progress" | "guide";
}

export function ExamPageSEO({
  examName,
  examId,
  description,
  pageType = "overview",
}: ExamPageSEOProps) {
  const pageTitles: Record<string, string> = {
    overview: `${examName} Exam Preparation - Study Guide & Practice Tests`,
    quiz: `${examName} Practice Quiz - Test Your Knowledge`,
    resources: `${examName} Study Resources - Notes, PDFs & Materials`,
    progress: `${examName} Progress Dashboard - Track Your Learning`,
    guide: `${examName} Complete Study Guide - Tips & Strategies`,
  };

  const pageDescriptions: Record<string, string> = {
    overview: `Comprehensive ${examName} exam preparation with practice questions, study materials, and expert guidance. Master your nursing licensure exam.`,
    quiz: `Take ${examName} practice quizzes with detailed explanations. Track your performance and improve your exam readiness.`,
    resources: `Access ${examName} study resources including notes, PDFs, flashcards, and video tutorials. Everything you need to succeed.`,
    progress: `Track your ${examName} exam preparation progress. Monitor accuracy, study time, and identify areas for improvement.`,
    guide: `Complete ${examName} study guide with exam format, eligibility requirements, passing criteria, and proven study strategies.`,
  };

  const title = pageTitles[pageType] || pageTitles.overview;
  const metaDescription = description || pageDescriptions[pageType] || pageDescriptions.overview;
  const url = `https://nursingeducatorhub.com/exam-prep/${examId}${pageType !== "overview" ? `/${pageType}` : ""}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${examName} Exam Preparation`,
    description: metaDescription,
    provider: {
      "@type": "EducationalOrganization",
      name: "Nursing Educator Hub",
      url: "https://nursingeducatorhub.com",
    },
    courseCode: examId.toUpperCase(),
    educationalLevel: "Professional",
    url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <title>{title} | Nursing Educator Hub</title>
      <meta name="description" content={metaDescription} />
      <meta
        name="keywords"
        content={`${examName} prep, ${examName} exam, nursing licensure, ${examName} practice questions, ${examName} study guide`}
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <link rel="canonical" href={url} />
    </>
  );
}

