import fs from 'fs';
import path from 'path';

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

const momentsPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../../content/moments.json'
);

export function getAllMoments(): Moment[] {
  if (!fs.existsSync(momentsPath)) return [];
  const raw = fs.readFileSync(momentsPath, 'utf-8');
  return JSON.parse(raw);
}

export function getRecentMoments(count: number = 3): Moment[] {
  const moments = getAllMoments();
  return moments.slice(0, count);
}
