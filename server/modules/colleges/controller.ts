import type { Request, Response } from "express";
import { getColleges, getCollegeById } from "./service";

export async function listColleges(req: Request, res: Response) {
  try {
    const { city, type, programs } = req.query;
    const colleges = await getColleges({
      city: city?.toString(),
      type: type?.toString(),
      programs: programs?.toString(),
    });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getCollege(req: Request, res: Response) {
  try {
    const college = await getCollegeById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
