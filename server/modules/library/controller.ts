import type { Request, Response } from "express";
import { getStudyLibraries } from "./service";

export async function listStudyLibraries(req: Request, res: Response) {
  try {
    const category = req.query.category?.toString();
    const libraries = await getStudyLibraries(category);
    res.json(libraries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
