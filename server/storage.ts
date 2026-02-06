import {
  type User,
  type InsertUser,
  type ExamQuestion,
  type InsertExamQuestion,
  type College,
  type InsertCollege,
  type StudyLibrary,
  type InsertStudyLibrary,
  type NewsArticle,
  type InsertNewsArticle,
  type BlogPost,
  type InsertBlogPost,
  type PracticeTest,
  type InsertPracticeTest,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: string): Promise<void>;

  // Exams
  getAllExams(): Promise<any[]>;

  // Exam Questions
  getExamQuestions(
    examType: string,
    filters?: { subject?: string; system?: string; difficulty?: string; limit?: number }
  ): Promise<ExamQuestion[]>;
  getExamQuestionById(id: string): Promise<ExamQuestion | undefined>;
  createExamQuestion(question: InsertExamQuestion): Promise<ExamQuestion>;

  // Colleges
  getColleges(filters?: { city?: string; type?: string; programs?: string }): Promise<College[]>;
  getCollegeById(id: string): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;

  // Study Library
  getStudyLibraries(category?: string): Promise<StudyLibrary[]>;
  getStudyLibraryById(id: string): Promise<StudyLibrary | undefined>;
  createStudyLibrary(material: InsertStudyLibrary): Promise<StudyLibrary>;

  // News Articles
  getNewsArticles(limit?: number, featured?: boolean): Promise<NewsArticle[]>;
  getNewsArticleById(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;

  // Blog Posts
  getBlogPosts(filters?: { status?: string; limit?: number }): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Practice Tests
  getPracticeTests(userId: string): Promise<PracticeTest[]>;
  createPracticeTest(test: InsertPracticeTest): Promise<PracticeTest>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private examQuestions: Map<string, ExamQuestion>;
  private colleges: Map<string, College>;
  private studyLibraries: Map<string, StudyLibrary>;
  private newsArticles: Map<string, NewsArticle>;
  private blogPosts: Map<string, BlogPost>;
  private practiceTests: Map<string, PracticeTest>;
  private exams: any[];

  constructor() {
    this.users = new Map();
    this.examQuestions = new Map();
    this.colleges = new Map();
    this.studyLibraries = new Map();
    this.newsArticles = new Map();
    this.blogPosts = new Map();
    this.practiceTests = new Map();
    this.exams = [];
    
    this.seedData();
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  private ensureUniqueSlug(baseSlug: string) {
    let slug = baseSlug || "post";
    let counter = 2;
    while (Array.from(this.blogPosts.values()).some((post) => post.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    return slug;
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

    // Seed exams (for /api/exams)
    this.exams = [
      {
        id: "nclex",
        name: "NCLEX-RN",
        description:
          "The National Council Licensure Examination for Registered Nurses (NCLEX-RN) evaluates nursing competence for practice in the United States and Canada.",
        badge: "USA",
        badgeColor: "bg-blue-500",
      },
      {
        id: "moh",
        name: "MOH",
        description:
          "The Ministry of Health (MOH) exam is required for nurses seeking licensure in the UAE under the MOH authority.",
        badge: "UAE",
        badgeColor: "bg-teal-500",
      },
      {
        id: "dha",
        name: "DHA",
        description:
          "The Dubai Health Authority (DHA) exam is for nurses who wish to practice in Dubai healthcare facilities.",
        badge: "UAE",
        badgeColor: "bg-pink-500",
      },
      {
        id: "haad",
        name: "HAAD",
        description:
          "The HAAD (now DOH Abu Dhabi) exam assesses nurses for licensure in the Abu Dhabi region.",
        badge: "UAE",
        badgeColor: "bg-orange-500",
      },
      {
        id: "snle",
        name: "SNLE",
        description:
          "The Saudi Nursing Licensure Exam (SNLE) ensures nurses meet the professional practice standards of Saudi Arabia.",
        badge: "Saudi Arabia",
        badgeColor: "bg-green-500",
      },
      {
        id: "ielts",
        name: "IELTS",
        description:
          "The International English Language Testing System (IELTS) measures language proficiency for healthcare professionals.",
        badge: "Intl",
        badgeColor: "bg-purple-500",
      },
    ];

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

    // Seed study library
    const sampleLibraries: InsertStudyLibrary[] = [
      {
        examType: "NCLEX-RN",
        title: "Fundamentals of Nursing Practice",
        description: "Comprehensive guide covering basic nursing principles, patient care techniques, and fundamental nursing procedures.",
        category: "Fundamentals",
        type: "PDF",
        level: "beginner",
        isPremium: false,
        fileUrl: "/materials/fundamentals-nursing.pdf",
        rating: 5
      },
      {
        examType: "NCLEX-RN",
        title: "Medical-Surgical Nursing Handbook",
        description: "Advanced reference covering medical-surgical nursing concepts, pathophysiology, and evidence-based practice guidelines.",
        category: "Medical-Surgical",
        type: "EPUB",
        level: "advanced",
        isPremium: true,
        fileUrl: "/materials/medsurg-handbook.epub",
        rating: 5
      },
      {
        examType: "NCLEX-RN",
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

    sampleLibraries.forEach(m => this.createStudyLibrary(m));

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

    // Seed blog posts
    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: "How to Pass the NCLEX on Your First Try",
        slug: "how-to-pass-the-nclex",
        excerpt: "Proven strategies, study routines, and mindset tips to ace the NCLEX.",
        content:
          "# How to Pass the NCLEX\\n\\nStart early, practice daily, and focus on rationales.\\n\\n## Key Tips\\n- Build a weekly plan\\n- Use question banks\\n- Review weak areas",
        status: "published",
        tags: ["NCLEX", "Study Tips"],
        publishedAt: new Date(),
      },
    ];
    sampleBlogPosts.forEach((post) => this.createBlogPost(post));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      examProgress: {},
      createdAt: new Date(),
      lastLoginAt: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date();
      this.users.set(userId, user);
    }
  }

  // Exams
  async getAllExams(): Promise<any[]> {
    return this.exams;
  }

  // Exam Question methods
  async getExamQuestions(
    examType: string,
    filters?: { subject?: string; system?: string; difficulty?: string; limit?: number }
  ): Promise<ExamQuestion[]> {
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedExam = normalize(examType);

    let questions = Array.from(this.examQuestions.values()).filter(
      (q) => normalize(q.examType) === normalizedExam
    );

    if (filters?.subject) {
      const subject = filters.subject.toLowerCase();
      questions = questions.filter((q) => q.category?.toLowerCase() === subject);
    }

    if (filters?.system) {
      const system = filters.system.toLowerCase();
      questions = questions.filter((q) => q.system?.toLowerCase() === system);
    }

    if (filters?.difficulty) {
      const difficulty = filters.difficulty.toLowerCase();
      questions = questions.filter((q) => q.difficulty?.toLowerCase() === difficulty);
    }

    return filters?.limit ? questions.slice(0, filters.limit) : questions;
  }

  async getExamQuestionById(id: string): Promise<ExamQuestion | undefined> {
    return this.examQuestions.get(id);
  }

  async createExamQuestion(insertQuestion: InsertExamQuestion): Promise<ExamQuestion> {
    const id = randomUUID();
    const question: ExamQuestion = {
      ...insertQuestion,
      id,
      system: insertQuestion.system ?? null,
    };
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
      colleges = colleges.filter(c => c.programs && (c.programs as string[]).includes(filters.programs!));
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

  // Study Library methods
  async getStudyLibraries(category?: string): Promise<StudyLibrary[]> {
    let materials = Array.from(this.studyLibraries.values());
    if (category && category !== "All Materials" && category !== "All Libraries") {
      materials = materials.filter(m => m.category === category);
    }
    return materials;
  }

  async getStudyLibraryById(id: string): Promise<StudyLibrary | undefined> {
    return this.studyLibraries.get(id);
  }

  async createStudyLibrary(insertMaterial: InsertStudyLibrary): Promise<StudyLibrary> {
    const id = randomUUID();
    const material: StudyLibrary = {
      ...insertMaterial,
      id,
      updatedAt: new Date(),
      description: insertMaterial.description || null,
      duration: insertMaterial.duration || null,
      rating: insertMaterial.rating || null,
      isPremium: insertMaterial.isPremium || false,
      fileUrl: insertMaterial.fileUrl || null
    };
    this.studyLibraries.set(id, material);
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

  // Blog Posts
  async getBlogPosts(filters?: { status?: string; limit?: number }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    if (filters?.status) {
      posts = posts.filter((post) => post.status === filters.status);
    }
    posts.sort((a, b) => {
      const aDate = a.publishedAt || a.updatedAt || a.createdAt || new Date(0);
      const bDate = b.publishedAt || b.updatedAt || b.createdAt || new Date(0);
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
    return filters?.limit ? posts.slice(0, filters.limit) : posts;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find((post) => post.slug === slug);
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const baseSlug = insertPost.slug || this.slugify(insertPost.title);
    const slug = this.ensureUniqueSlug(baseSlug);
    const now = new Date();
    const post: BlogPost = {
      ...insertPost,
      id,
      slug,
      excerpt: insertPost.excerpt || null,
      coverImageUrl: insertPost.coverImageUrl || null,
      author: insertPost.author || null,
      authorTitle: insertPost.authorTitle || null,
      status: insertPost.status || "draft",
      tags: insertPost.tags || [],
      publishedAt:
        insertPost.status === "published"
          ? insertPost.publishedAt || now
          : insertPost.publishedAt || null,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    const baseSlug = post.slug || (post.title ? this.slugify(post.title) : existing.slug);
    const slug =
      baseSlug === existing.slug ? baseSlug : this.ensureUniqueSlug(baseSlug);
    const updated: BlogPost = {
      ...existing,
      ...post,
      slug,
      excerpt: post.excerpt ?? existing.excerpt,
      coverImageUrl: post.coverImageUrl ?? existing.coverImageUrl,
      author: post.author ?? existing.author,
      authorTitle: post.authorTitle ?? existing.authorTitle,
      status: post.status ?? existing.status,
      tags: post.tags ?? existing.tags,
      publishedAt:
        post.status === "published"
          ? post.publishedAt || existing.publishedAt || new Date()
          : post.publishedAt ?? existing.publishedAt,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
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

// Prefer in-memory storage when DATABASE_URL is not configured
const shouldUseMemStorage = !process.env.DATABASE_URL;
export const storage = shouldUseMemStorage ? new MemStorage() : new DatabaseStorage();

// Initialize seed data only for the selected storage in development
if (process.env.NODE_ENV === "development") {
  if (shouldUseMemStorage) {
    // MemStorage constructor already seeds demo data; nothing to do
  } else {
    seedDatabase().catch(console.error);
  }
}
