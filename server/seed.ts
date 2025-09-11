import { db } from "./db";
import { 
  examQuestions, colleges, studyMaterials, newsArticles,
  type InsertExamQuestion, type InsertCollege, type InsertStudyMaterial, type InsertNewsArticle 
} from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingQuestions = await db.select().from(examQuestions).limit(1);
    if (existingQuestions.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Seed exam questions
    const sampleQuestions: InsertExamQuestion[] = [
      {
        examType: "NCLEX-RN",
        question: "A nurse is caring for a client with chronic kidney disease. Which of the following dietary recommendations would be most appropriate?",
        options: ["Increase protein intake to 2.0 g/kg/day", "Restrict phosphorus and potassium intake", "Encourage high-sodium foods for fluid retention", "Increase fluid intake to 3 liters per day"],
        correctAnswer: "Restrict phosphorus and potassium intake",
        explanation: "Clients with chronic kidney disease need to restrict phosphorus and potassium as the kidneys cannot effectively filter these electrolytes, leading to dangerous accumulation.",
        difficulty: "intermediate",
        category: "Medical-Surgical"
      },
      {
        examType: "MOH",
        question: "What is the most important initial assessment for a patient presenting with chest pain?",
        options: ["Blood pressure measurement", "Cardiac enzyme levels", "Electrocardiogram", "Complete blood count"],
        correctAnswer: "Electrocardiogram",
        explanation: "An ECG is the most important initial assessment as it can quickly identify cardiac arrhythmias or signs of myocardial infarction.",
        difficulty: "beginner",
        category: "Emergency Care"
      },
      {
        examType: "SNLE",
        question: "According to Pakistan Nursing Council guidelines, what is the minimum educational requirement for nursing practice?",
        options: ["Certificate in Nursing", "Diploma in Nursing", "Bachelor of Science in Nursing", "Master of Science in Nursing"],
        correctAnswer: "Bachelor of Science in Nursing",
        explanation: "The Pakistan Nursing Council requires a minimum of BSN degree for professional nursing practice as per current regulations.",
        difficulty: "beginner",
        category: "Professional Standards"
      }
    ];

    await db.insert(examQuestions).values(sampleQuestions);

    // Seed colleges
    const sampleColleges: InsertCollege[] = [
      {
        name: "Aga Khan University School of Nursing",
        city: "Karachi",
        province: "Sindh",
        type: "private",
        programs: ["BSN", "MSN", "PhD"],
        admissionFee: 25000,
        rating: 5,
        reviewCount: 152,
        description: "Leading nursing education institution offering BSN, MSN, and PhD programs with state-of-the-art facilities and clinical partnerships.",
        contact: { phone: "+92-21-3486-4955", email: "nursing@aku.edu", website: "https://www.aku.edu/son" },
        accreditation: ["HEC Recognized", "PNC Approved"]
      },
      {
        name: "Lahore School of Nursing",
        city: "Lahore",
        province: "Punjab",
        type: "government",
        programs: ["BSN", "Post-RN BSN"],
        admissionFee: 8000,
        rating: 4,
        reviewCount: 89,
        description: "Government institution providing affordable nursing education with excellent clinical training facilities and experienced faculty.",
        contact: { phone: "+92-42-9921-1234", email: "info@lsn.edu.pk", website: "https://www.lsn.edu.pk" },
        accreditation: ["PNC Approved", "Government Recognized"]
      }
    ];

    await db.insert(colleges).values(sampleColleges);

    // Seed study materials
    const sampleMaterials: InsertStudyMaterial[] = [
      {
        title: "Fundamentals of Nursing Practice",
        description: "Comprehensive guide covering basic nursing principles, patient care techniques, and fundamental nursing procedures.",
        category: "Fundamentals",
        type: "PDF",
        level: "beginner",
        isPremium: false,
        fileUrl: "/materials/fundamentals-nursing.pdf",
        pageCount: 245,
        rating: 5
      },
      {
        title: "Medical-Surgical Nursing Handbook",
        description: "Advanced reference covering medical-surgical nursing concepts, pathophysiology, and evidence-based practice guidelines.",
        category: "Medical-Surgical",
        type: "EPUB",
        level: "advanced",
        isPremium: true,
        fileUrl: "/materials/medsurg-handbook.epub",
        pageCount: 1200,
        rating: 5
      },
      {
        title: "Clinical Skills Video Series",
        description: "Step-by-step video demonstrations of essential nursing procedures and clinical skills with expert commentary.",
        category: "Clinical Skills",
        type: "Video",
        level: "intermediate",
        isPremium: false,
        fileUrl: "/materials/clinical-skills-videos",
        duration: "8 hours",
        rating: 5
      }
    ];

    await db.insert(studyMaterials).values(sampleMaterials);

    // Seed news articles
    const sampleNews: InsertNewsArticle[] = [
      {
        title: "New Healthcare Standards Announced for Pakistani Nursing Programs",
        excerpt: "The Pakistan Nursing Council has announced updated accreditation standards for nursing education programs, emphasizing clinical competency and evidence-based practice.",
        content: "The Pakistan Nursing Council has announced updated accreditation standards for nursing education programs, emphasizing clinical competency and evidence-based practice. These changes will affect all nursing institutions starting from the academic year 2024-25. The new standards focus on improving patient safety, incorporating technology in healthcare, and strengthening clinical partnerships with hospitals.",
        category: "Healthcare Policy",
        author: "Dr. Sarah Ahmed",
        authorTitle: "Healthcare Editor",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        featured: true
      },
      {
        title: "NCLEX-RN Test Centers Expand in Pakistan",
        excerpt: "New testing facilities in Islamabad and Lahore will make the NCLEX-RN more accessible to Pakistani nursing graduates seeking international opportunities.",
        content: "New testing facilities in Islamabad and Lahore will make the NCLEX-RN more accessible to Pakistani nursing graduates seeking international opportunities. The expansion is part of a broader initiative to help Pakistani nurses meet international standards.",
        category: "Exam Updates",
        author: "Ahmed Hassan",
        authorTitle: "Education Reporter",
        featured: false
      },
      {
        title: "Gulf Countries Increase Nursing Recruitment",
        excerpt: "UAE and Saudi Arabia announce new visa facilitation programs for qualified Pakistani nurses with competitive salary packages.",
        content: "UAE and Saudi Arabia announce new visa facilitation programs for qualified Pakistani nurses with competitive salary packages. The programs aim to address the growing demand for skilled healthcare professionals in the Gulf region.",
        category: "Career Opportunities",
        author: "Fatima Khan",
        authorTitle: "Career Counselor",
        featured: false
      }
    ];

    await db.insert(newsArticles).values(sampleNews);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
    throw error;
  }
}