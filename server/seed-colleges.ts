// server/seed-recognized-colleges.ts
import { db } from "./db";
import { colleges } from "@shared/schema";

async function seedRecognizedColleges() {
  const data = [
    {
      name: "PIMS School of Nursing",
      city: "Islamabad",
      province: "Federal",
      type: "Government",
      programs: ["Generic BSN", "BSN Post RN"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Recognized by PNMC. 2025 list shows PIMS School of Nursing. :contentReference[oaicite:0]{index=0}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "F.G Polyclinic Hospital SON, G-7/3-4, Islamabad",
      city: "Islamabad",
      province: "Federal",
      type: "Government",
      programs: ["Generic BSN", "BSN Post RN"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Found on PNMC recognized institutes list. :contentReference[oaicite:1]{index=1}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "Naz Nursing Institute of Health Sciences",
      city: "Karachi",
      province: "Sindh",
      type: "Private",
      programs: ["Generic BSN"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Listed in PNMC institute directory. :contentReference[oaicite:2]{index=2}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "Gomal Institute of Nursing, Darya Khan",
      city: "Darya Khan",
      province: "Punjab",
      type: "Private",
      programs: ["LHV", "Midwifery"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Listed in PNMC directory. :contentReference[oaicite:3]{index=3}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "South Punjab Institute of Nursing, Multan",
      city: "Multan",
      province: "Punjab",
      type: "Private / Public",
      programs: ["LHV", "Midwifery"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "On PNMC recognized institutes list. :contentReference[oaicite:4]{index=4}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "Horizon School of Nursing & Health Sciences",
      city: "Hassan Abdal",
      province: "Punjab",
      type: "Private",
      programs: ["Generic BSN", "Post RN BSN", "Other specialties"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Appears in PNMC institute directory. :contentReference[oaicite:5]{index=5}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "College of Nursing, Niazi Medical and Dental College",
      city: "Sargodha",
      province: "Punjab",
      type: "Private",
      programs: ["Generic BSN", "Post RN BSN"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Listed among PNMC recognized institutes. :contentReference[oaicite:6]{index=6}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "Al-Nimrah College of Nursing & Health Sciences",
      city: "Karachi",
      province: "Sindh",
      type: "Private",
      programs: ["Generic BSN"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Recognized institute in PNMC list. :contentReference[oaicite:7]{index=7}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
    {
      name: "Prime College of Nursing, Faisalabad",
      city: "Faisalabad",
      province: "Punjab",
      type: "Private",
      programs: ["LHV", "Midwifery", "Critical Care Nursing"],
      admissionFee: null,
      rating: null,
      reviewCount: 0,
      description: "Derived from PNMC institute listings. :contentReference[oaicite:8]{index=8}",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      accreditation: ["PNMC"],
    },
  ];

  await db.insert(colleges).values(data);
  console.log("✅ Recognized nursing colleges seeded successfully");
}

seedRecognizedColleges()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
