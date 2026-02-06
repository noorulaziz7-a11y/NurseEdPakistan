import { storage } from "../../storage";

export async function getColleges(filters?: {
  city?: string;
  type?: string;
  programs?: string;
}) {
  return storage.getColleges(filters);
}

export async function getCollegeById(id: string) {
  return storage.getCollegeById(id);
}
