import { db } from "./db";
import { sql } from "drizzle-orm";
import {
  colleges,
  studyLibrary as studyMaterials,
  newsArticles,
  examQuestions as mcqs,
  ExamQuestion,
  exams,
  examSubjects,
} from "@shared/schema";

export async function seedDatabase() {
  try {
    // This seeder is intended for PostgreSQL (Drizzle) only.
    // MemStorage seeds demo data in its constructor; skip DB seed in that mode.
    if (process.env.USE_MEMORY_STORAGE === "true") {
      console.log("USE_MEMORY_STORAGE enabled, skipping DB seed.");
      return;
    }

    // Check if database is already seeded
    const existingQuestions = await db.select().from(mcqs).limit(1);
    if (existingQuestions.length > 0) {
      console.log("MCQs already seeded, skipping MCQ seed...");
    }

    console.log("🌱 Seeding database with initial data...");

    // ✅ Seed MCQs
    const sampleQuestions = [
      {
        examType: "nclex",
        question:
          "A nurse is caring for a client with chronic kidney disease. Which of the following dietary recommendations would be most appropriate?",
        options: [
          "Increase protein intake to 2.0 g/kg/day",
          "Restrict phosphorus and potassium intake",
          "Encourage high-sodium foods for fluid retention",
          "Increase fluid intake to 3 liters per day",
        ],
        correctAnswer: "Restrict phosphorus and potassium intake",
        system: "Renal",
        category: "Medical-Surgical",
        difficulty: "intermediate",
        explanation:
          "Clients with chronic kidney disease need to restrict phosphorus and potassium as the kidneys cannot effectively filter these electrolytes.",
      },
      {
        examType: "moh",
        question:
          "What is the most important initial assessment for a patient presenting with chest pain?",
        options: [
          "Blood pressure measurement",
          "Cardiac enzyme levels",
          "Electrocardiogram",
          "Complete blood count",
        ],
        correctAnswer: "Electrocardiogram",
        category: "Emergency Care",
        difficulty: "beginner",
        explanation:
          "An ECG is the most important initial assessment as it can quickly identify cardiac arrhythmias or signs of myocardial infarction.",
      },
      {
        examType: "snle",
        question:
          "According to Pakistan Nursing Council guidelines, what is the minimum educational requirement for nursing practice?",
        options: [
          "Certificate in Nursing",
          "Diploma in Nursing",
          "Bachelor of Science in Nursing",
          "Master of Science in Nursing",
        ],
        correctAnswer: "Bachelor of Science in Nursing",
        category: "Professional Standards",
        difficulty: "beginner",
        explanation:
          "The Pakistan Nursing Council requires a minimum of BSN degree for professional nursing practice as per current regulations.",
      },
    ];

    if (existingQuestions.length === 0) {
      await db.insert(mcqs).values(sampleQuestions as ExamQuestion[]);
      console.log("✅ MCQs seeded successfully!");
    }

    // ✅ Seed exams
    try {
      const existingExams = await db.select().from(exams).limit(1);
      if (existingExams.length === 0) {
        const seededExams = await db
          .insert(exams)
          .values([
            {
              name: "NCLEX-RN",
              category: "Licensure",
              description: "US/Canada licensure exam",
              badge: "Popular",
              badgeColor: "bg-blue-100 text-blue-700",
              accessLevel: "free",
            },
            {
              name: "SNLE",
              category: "Licensure",
              description: "Saudi licensure exam",
              badge: "KSA",
              badgeColor: "bg-green-100 text-green-700",
              accessLevel: "free",
            },
            {
              name: "MOH",
              category: "Licensure",
              description: "UAE Ministry of Health exam",
              badge: "UAE",
              badgeColor: "bg-yellow-100 text-yellow-700",
              accessLevel: "free",
            },
            {
              name: "DHA",
              category: "Licensure",
              description: "Dubai Health Authority exam",
              badge: "Dubai",
              badgeColor: "bg-red-100 text-red-700",
              accessLevel: "free",
            },
            {
              name: "HAAD",
              category: "Licensure",
              description: "Abu Dhabi DOH exam",
              badge: "Abu Dhabi",
              badgeColor: "bg-purple-100 text-purple-700",
              accessLevel: "free",
            },
            {
              name: "IELTS",
              category: "Language",
              description: "Language proficiency",
              badge: "Language",
              badgeColor: "bg-pink-100 text-pink-700",
              accessLevel: "free",
            },
          ])
          .returning();
        console.log("✅ Exams seeded!");

        const examByName = seededExams.reduce(
          (acc: Record<string, number>, exam: { id?: unknown; name?: unknown }) => {
            const name = typeof exam?.name === "string" ? exam.name.toLowerCase() : "";
            const id = Number(exam?.id);
          if (name && Number.isFinite(id)) {
            acc[name] = id;
          }
          return acc;
          },
          {} as Record<string, number>
        );

        const subjectRows = [
          "Medical-Surgical",
          "Pediatrics",
          "Pharmacology",
          "Mental Health",
          "Maternal-Newborn",
          "Fundamentals",
          "Critical Care",
          "Community Health",
          "Leadership",
          "Emergency",
          "Ethics",
        ].flatMap((name, index) =>
          Object.values(examByName).map((examId) => ({
            examId,
            name,
            sortOrder: index,
          }))
        );

        await db.insert(examSubjects).values(subjectRows);
        console.log("✅ Exam subjects seeded!");
      }
    } catch (error) {
      console.warn("Skipping exam seed due to schema mismatch:", error);
    }

    // ✅ Ensure exam subjects exist (even if exams were already seeded earlier)
    try {
      const existingSubjects = await db.select().from(examSubjects).limit(1);
      if (existingSubjects.length === 0) {
        const allExams = await db.select({ id: exams.id, name: exams.name }).from(exams);
        if (allExams.length > 0) {
          const subjectNames = [
            "Medical-Surgical",
            "Pediatrics",
            "Pharmacology",
            "Mental Health",
            "Maternal-Newborn",
            "Fundamentals",
            "Critical Care",
            "Community Health",
            "Leadership",
            "Emergency",
            "Ethics",
          ];

          const subjectRows = subjectNames.flatMap((name, index) =>
            allExams.map((exam: { id: number }) => ({
              examId: exam.id,
              name,
              sortOrder: index,
            }))
          );

          await db.insert(examSubjects).values(subjectRows);
          console.log("✅ Exam subjects seeded (repair)!");
        }
      }
    } catch (error) {
      console.warn("Skipping exam subject repair seed:", error);
    }

    // ✅ Seed colleges
    const sampleColleges = [
      {
        name: "Aga Khan University School of Nursing",
        city: "Karachi",
        province: "Sindh",
        type: "University",
        programs: ["BSN", "MSN"],
        description: "Comprehensive nursing education with clinical excellence.",
        contact: {
          website: "https://www.aku.edu/son",
          phone: "+92-21-111-911-911",
        },
      },
      {
        name: "Lahore School of Nursing",
        city: "Lahore",
        province: "Punjab",
        type: "College",
        programs: ["BSN", "Post-RN"],
        description: "Career-focused nursing programs with modern labs.",
        contact: {
          website: "https://www.lsn.edu.pk",
          phone: "+92-42-111-111-567",
        },
      },
    ];
    await db.insert(colleges).values(sampleColleges);
    console.log("✅ Colleges seeded!");

    // ✅ Seed study materials
    const sampleMaterials = [
      {
        title: "Fundamentals of Nursing Practice",
        category: "Fundamentals",
        type: "PDF",
        examType: "General",
        description:
          "Comprehensive guide covering basic nursing principles, patient care techniques, and fundamental nursing procedures.",
        level: "beginner",
        isPremium: false,
        fileUrl: "/materials/fundamentals-nursing.pdf",
        rating: 5,
      },
    ];
    await db.insert(studyMaterials).values(sampleMaterials);
    console.log("✅ Study materials seeded!");

    // ✅ Seed news
    const sampleNews = [
      {
        title: "NCLEX-RN Test Centers Expand in Pakistan",
        excerpt:
          "New testing facilities in Islamabad and Lahore will make the NCLEX-RN more accessible.",
        content:
          "New testing facilities in Islamabad and Lahore will make the NCLEX-RN more accessible to Pakistani nursing graduates seeking international opportunities.",
        category: "Exam Updates",
        author: "Ahmed Hassan",
        authorTitle: "Education Reporter",
        featured: true,
      },
    ];
    await db.insert(newsArticles).values(sampleNews);
    console.log("✅ News seeded!");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Failed toseed database:", error);
    // Do not crash the dev server if seeding fails.
    return;
  }
}
