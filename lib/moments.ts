import fs from "fs";
import path from "path";

export interface Moment {
  date: string;
  text: string;
  music?: {
    platform: string;
    title: string;
    url: string;
  };
  photo?: {
    src: string;
    alt: string;
  };
}

const momentsPath = path.join(process.cwd(), "content/moments.json");

export async function getAllMoments(): Promise<Moment[]> {
  if (!fs.existsSync(momentsPath)) return [];
  const raw = fs.readFileSync(momentsPath, "utf-8");
  return JSON.parse(raw);
}

export async function getRecentMoments(count: number = 3): Promise<Moment[]> {
  const moments = await getAllMoments();
  return moments.slice(0, count);
}
