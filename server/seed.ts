import { db } from "./db";
import { sql } from "drizzle-orm";
import {
  colleges,
  studyLibrary as studyMaterials,
  newsArticles,
  examQuestions as mcqs,
  ExamQuestion,
} from "@shared/schema";
import { storage, MemStorage } from "./storage";
import { randomUUID } from "crypto";

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    if (process.env.USE_MEMORY_STORAGE === "true") {
      if (storage instanceof MemStorage && storage["examQuestions"].size > 0) {
        console.log("Memory storage already seeded, skipping...");
        return;
      }
    } else {
      const existingQuestions = await db.select().from(mcqs).limit(1);
      if (existingQuestions.length > 0) {
        console.log("Database already seeded, skipping...");
        return;
      }
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

    if (process.env.USE_MEMORY_STORAGE === "true") {
      if (storage instanceof MemStorage) {
        sampleQuestions.forEach((q) => {
          const id = randomUUID();
          const question = {
            id,
            examType: q.examType,
            question: q.question,
            options: q.options as any,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
            difficulty: q.difficulty || "intermediate",
            category: q.category || "Medical-Surgical",
            system: (q as any).system || null,
          };
          if (storage instanceof MemStorage) {
            storage.createExamQuestion(question);
          }
        });
        console.log("✅ MCQs seeded successfully in memory!");
      }
    } else {
      await db.insert(mcqs).values(sampleQuestions as ExamQuestion[]);
      console.log("✅ MCQs seeded successfully!");
    }

    // ✅ Seed colleges
    const sampleColleges = [
      {
        name: "Aga Khan University School of Nursing",
        country: "Pakistan",
        city: "Karachi",
        website: "https://www.aku.edu/son",
      },
      {
        name: "Lahore School of Nursing",
        country: "Pakistan",
        city: "Lahore",
        website: "https://www.lsn.edu.pk",
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
    throw error;
  }
}
