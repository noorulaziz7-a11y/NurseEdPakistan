import { type User, type InsertUser, type ExamQuestion, type InsertExamQuestion, type College, type InsertCollege, type StudyMaterial, type InsertStudyMaterial, type NewsArticle, type InsertNewsArticle, type PracticeTest, type InsertPracticeTest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Exam Questions
  getExamQuestions(examType: string, limit?: number): Promise<ExamQuestion[]>;
  getExamQuestionById(id: string): Promise<ExamQuestion | undefined>;
  createExamQuestion(question: InsertExamQuestion): Promise<ExamQuestion>;

  // Colleges
  getColleges(filters?: { city?: string; type?: string; programs?: string }): Promise<College[]>;
  getCollegeById(id: string): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;

  // Study Materials
  getStudyMaterials(category?: string): Promise<StudyMaterial[]>;
  getStudyMaterialById(id: string): Promise<StudyMaterial | undefined>;
  createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial>;

  // News Articles
  getNewsArticles(limit?: number, featured?: boolean): Promise<NewsArticle[]>;
  getNewsArticleById(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;

  // Practice Tests
  getPracticeTests(userId: string): Promise<PracticeTest[]>;
  createPracticeTest(test: InsertPracticeTest): Promise<PracticeTest>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private examQuestions: Map<string, ExamQuestion>;
  private colleges: Map<string, College>;
  private studyMaterials: Map<string, StudyMaterial>;
  private newsArticles: Map<string, NewsArticle>;
  private practiceTests: Map<string, PracticeTest>;

  constructor() {
    this.users = new Map();
    this.examQuestions = new Map();
    this.colleges = new Map();
    this.studyMaterials = new Map();
    this.newsArticles = new Map();
    this.practiceTests = new Map();
    
    this.seedData();
  }

  private seedData() {
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

    sampleQuestions.forEach(q => this.createExamQuestion(q));

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

    sampleColleges.forEach(c => this.createCollege(c));

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

    sampleMaterials.forEach(m => this.createStudyMaterial(m));

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

    sampleNews.forEach(n => this.createNewsArticle(n));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, examProgress: {} };
    this.users.set(id, user);
    return user;
  }

  // Exam Question methods
  async getExamQuestions(examType: string, limit?: number): Promise<ExamQuestion[]> {
    const questions = Array.from(this.examQuestions.values()).filter(q => q.examType === examType);
    return limit ? questions.slice(0, limit) : questions;
  }

  async getExamQuestionById(id: string): Promise<ExamQuestion | undefined> {
    return this.examQuestions.get(id);
  }

  async createExamQuestion(insertQuestion: InsertExamQuestion): Promise<ExamQuestion> {
    const id = randomUUID();
    const question: ExamQuestion = { ...insertQuestion, id };
    this.examQuestions.set(id, question);
    return question;
  }

  // College methods
  async getColleges(filters?: { city?: string; type?: string; programs?: string }): Promise<College[]> {
    let colleges = Array.from(this.colleges.values());
    
    if (filters?.city && filters.city !== "All Cities") {
      colleges = colleges.filter(c => c.city === filters.city);
    }
    if (filters?.programs && filters.programs !== "All Programs") {
      colleges = colleges.filter(c => (c.programs as string[]).includes(filters.programs));
    }
    
    return colleges;
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    return this.colleges.get(id);
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const id = randomUUID();
    const college: College = { 
      ...insertCollege, 
      id, 
      description: insertCollege.description || null,
      admissionFee: insertCollege.admissionFee || null,
      rating: insertCollege.rating || null,
      reviewCount: insertCollege.reviewCount || null,
      contact: insertCollege.contact || null,
      accreditation: insertCollege.accreditation || null
    };
    this.colleges.set(id, college);
    return college;
  }

  // Study Material methods
  async getStudyMaterials(category?: string): Promise<StudyMaterial[]> {
    let materials = Array.from(this.studyMaterials.values());
    if (category && category !== "All Materials") {
      materials = materials.filter(m => m.category === category);
    }
    return materials;
  }

  async getStudyMaterialById(id: string): Promise<StudyMaterial | undefined> {
    return this.studyMaterials.get(id);
  }

  async createStudyMaterial(insertMaterial: InsertStudyMaterial): Promise<StudyMaterial> {
    const id = randomUUID();
    const material: StudyMaterial = { 
      ...insertMaterial, 
      id, 
      updatedAt: new Date(),
      description: insertMaterial.description || null,
      duration: insertMaterial.duration || null,
      rating: insertMaterial.rating || null,
      isPremium: insertMaterial.isPremium || false,
      fileUrl: insertMaterial.fileUrl || null,
      pageCount: insertMaterial.pageCount || null
    };
    this.studyMaterials.set(id, material);
    return material;
  }

  // News Article methods
  async getNewsArticles(limit?: number, featured?: boolean): Promise<NewsArticle[]> {
    let articles = Array.from(this.newsArticles.values()).sort((a, b) => 
      new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
    
    if (featured !== undefined) {
      articles = articles.filter(a => a.featured === featured);
    }
    
    return limit ? articles.slice(0, limit) : articles;
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const id = randomUUID();
    const article: NewsArticle = { 
      ...insertArticle, 
      id, 
      publishedAt: new Date(),
      excerpt: insertArticle.excerpt || null,
      authorTitle: insertArticle.authorTitle || null,
      imageUrl: insertArticle.imageUrl || null,
      featured: insertArticle.featured || false
    };
    this.newsArticles.set(id, article);
    return article;
  }

  // Practice Test methods
  async getPracticeTests(userId: string): Promise<PracticeTest[]> {
    return Array.from(this.practiceTests.values()).filter(t => t.userId === userId);
  }

  async createPracticeTest(insertTest: InsertPracticeTest): Promise<PracticeTest> {
    const id = randomUUID();
    const test: PracticeTest = { 
      ...insertTest, 
      id, 
      completedAt: new Date(),
      userId: insertTest.userId || null,
      questionsAnswered: insertTest.questionsAnswered || null,
      correctAnswers: insertTest.correctAnswers || null,
      totalQuestions: insertTest.totalQuestions || null,
      timeSpent: insertTest.timeSpent || null,
      score: insertTest.score || null
    };
    this.practiceTests.set(id, test);
    return test;
  }
}

import { DatabaseStorage } from "./database-storage";
import { seedDatabase } from "./seed";

export const storage = new DatabaseStorage();

// Initialize database with seed data
if (process.env.NODE_ENV === "development") {
  seedDatabase().catch(console.error);
}
