import { db } from "../db";
import { sql } from "drizzle-orm";

async function run() {
  const mcqs = await db.execute(sql`SELECT count(*) FROM mcqs`);
  const options = await db.execute(sql`SELECT count(*) FROM mcq_options`);
  const subjects = await db.execute(sql`SELECT count(*) FROM exam_subjects`);
  
  console.log("--------------------------------");
  console.log("📊 Migration Verification Report");
  console.log("--------------------------------");
  console.log(`MCQs in new table:      ${mcqs.rows[0].count}`);
  console.log(`Options in new table:   ${options.rows[0].count}`);
  console.log(`Subjects in new table:  ${subjects.rows[0].count}`);
  console.log("--------------------------------");

  // Sample check
  const sample = await db.execute(sql`
    SELECT m.question, count(o.id) as option_count 
    FROM mcqs m 
    JOIN mcq_options o ON m.id = o.mcq_id 
    GROUP BY m.id 
    LIMIT 1
  `);
  
  if (sample.rows.length > 0) {
    console.log("✅ Sample Check: Question found with associated options.");
    console.log(`Question: ${sample.rows[0].question.substring(0, 50)}...`);
    console.log(`Options:  ${sample.rows[0].option_count}`);
  } else {
    console.log("❌ Sample Check: No linked questions/options found!");
  }
}

run().then(() => process.exit(0));
