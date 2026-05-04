import { db } from "../db";
import {
  exams,
  examSubjects,
  difficultyLevels,
  mcqOptions as newMcqOptions,
} from "../../shared/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * MIGRATION SCRIPT: legacyQuestions -> mcqs & mcqOptions
 * 
 * This script migrates data from the flat legacyQuestions table to the
 * normalized mcqs and mcqOptions tables.
 */

const EXAM_MAP: Record<string, string> = {
  nclex: "NCLEX-RN",
  moh: "MOH",
  snle: "SNLE",
  dha: "DHA",
  haad: "HAAD",
  ielts: "IELTS",
};

const DIFFICULTY_MAP: Record<string, "easy" | "moderate" | "hard"> = {
  beginner: "easy",
  intermediate: "moderate",
  advanced: "hard",
};

const SYSTEM_MAP: Record<string, any> = {
  Cardiovascular: "Cardiovascular",
  Respiratory: "Respiratory",
  Neurological: "Neurological",
  Gastrointestinal: "Gastrointestinal",
  Renal: "Renal",
  Endocrine: "Endocrine",
  Musculoskeletal: "Musculoskeletal",
  Reproductive: "Reproductive",
  Hematology: "Hematology",
  Immune: "Immune",
  Integumentary: "Integumentary",
};

async function migrate(dryRun = true) {
  console.log(`🚀 Starting migration (Dry Run: ${dryRun})`);

  try {
    // 1. Fetch lookup data
    const allExams = await db.select().from(exams);
    const allDifficultyLevels = await db.select().from(difficultyLevels);
    
    // Fetch legacy questions safely (handling potentially missing system column)
    const allLegacyQuestions = await db.execute(sql`SELECT * FROM exam_questions`);
    const legacyRows = allLegacyQuestions.rows as any[];

    console.log(`📊 Found ${legacyRows.length} legacy questions.`);
    console.log(`📊 Found ${allExams.length} target exams.`);

    const stats = {
      processed: 0,
      migrated: 0,
      skipped: 0,
      errors: 0,
    };

    for (const legacy of legacyRows) {
      stats.processed++;
      
      try {
        // Find exam
        const examName = EXAM_MAP[legacy.exam_type?.toLowerCase()] || legacy.exam_type;
        const exam = allExams.find((e: any) => e.name.toLowerCase() === examName.toLowerCase());
        
        if (!exam) {
          console.warn(`⚠️  Skipping: No exam found for type "${legacy.exam_type}" (mapped to "${examName}")`);
          stats.skipped++;
          continue;
        }

        // Find or create subject
        let subject = (await db.select().from(examSubjects).where(
          and(
            eq(examSubjects.examId, exam.id),
            eq(examSubjects.name, legacy.category)
          )
        ))[0];

        if (!subject && !dryRun) {
          [subject] = await db.insert(examSubjects).values({
            examId: exam.id,
            name: legacy.category,
            sortOrder: 0
          }).returning();
          console.log(`🆕 Created subject "${legacy.category}" for exam "${exam.name}"`);
        }

        // Map difficulty
        const difficultyValue = DIFFICULTY_MAP[legacy.difficulty?.toLowerCase()] || "moderate";
        const difficultyLevel = allDifficultyLevels.find((d: any) => d.name.toLowerCase() === difficultyValue);

        // Map system (validate against enum, use default if missing)
        const systemValue = SYSTEM_MAP[legacy.system] || "Cardiovascular"; 

        if (!dryRun) {
          await db.transaction(async (tx: any) => {
            // Insert MCQ using raw SQL to handle column name mismatch (question vs stem)
            // We populate BOTH stem and question columns because the database has both 
            // and stem is marked as NOT NULL.
            const result = await tx.execute(sql`
              INSERT INTO mcqs (
                stem,
                question, 
                explanation, 
                exam_id, 
                subject_id, 
                difficulty, 
                system, 
                difficulty_id, 
                type
              ) VALUES (
                ${legacy.question}, 
                ${legacy.question}, 
                ${legacy.explanation}, 
                ${exam.id}, 
                ${subject.id}, 
                ${difficultyValue}, 
                ${systemValue}, 
                ${difficultyLevel?.id || null}, 
                'single'
              ) RETURNING id
            `);
            
            const newMcqId = result.rows[0].id as string;

            // Insert Options
            const legacyOptions = (typeof legacy.options === 'string' ? JSON.parse(legacy.options) : legacy.options) as string[];
            const optionValues = legacyOptions.map((optText, index) => ({
              mcqId: newMcqId,
              optionText: optText,
              isCorrect: optText.trim().toLowerCase() === legacy.correct_answer?.trim().toLowerCase(),
              position: index,
            }));

            await tx.insert(newMcqOptions).values(optionValues);
          });
          
          stats.migrated++;
        } else {
          // Validation only in dry run
          if (!subject) {
            console.log(`🔍 [Dry Run] Would create subject "${legacy.category}" for exam "${exam.name}"`);
          }
          stats.migrated++;
        }

        if (stats.processed % 10 === 0) {
          console.log(`⏳ Progress: ${stats.processed}/${legacyRows.length}...`);
        }

      } catch (err) {
        console.error(`❌ Error processing question ID ${legacy.id}:`, err);
        stats.errors++;
      }
    }

    console.log(`\n✅ Migration Finished!`);
    console.log(`------------------------`);
    console.log(`Total Processed: ${stats.processed}`);
    console.log(`Total Migrated:  ${stats.migrated}`);
    console.log(`Total Skipped:   ${stats.skipped}`);
    console.log(`Total Errors:    ${stats.errors}`);
    console.log(`------------------------`);
    
    if (dryRun) {
      console.log(`💡 This was a DRY RUN. No changes were made to the database.`);
      console.log(`💡 To execute the migration, run with DRY_RUN=false`);
    }

  } catch (error) {
    console.error("💀 Critical migration failure:", error);
    process.exit(1);
  }
}

// Execution
const isDryRun = process.env.DRY_RUN !== "false";
migrate(isDryRun).then(() => process.exit(0));
