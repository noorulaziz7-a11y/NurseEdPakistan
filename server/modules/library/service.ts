import { storage } from "../../storage";

export async function getStudyLibraries(category?: string) {
  return storage.getStudyLibraries(category);
}
