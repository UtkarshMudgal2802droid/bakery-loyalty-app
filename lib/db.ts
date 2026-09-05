import fs from 'fs/promises';
import path from 'path';

// Define the shape of our user data
export interface UserData {
  stamps: number;
  lastStampedAt: number;
}

const DB_PATH = path.join(process.cwd(), 'data.json');

// Initialize database if it doesn't exist
async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify({}), 'utf-8');
  }
}

// Read the whole database
async function readDb(): Promise<Record<string, UserData>> {
  await initDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Write to the database
async function writeDb(data: Record<string, UserData>) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Get user's balance
export async function getUserData(userId: string): Promise<UserData> {
  const db = await readDb();
  return db[userId] || { stamps: 0, lastStampedAt: 0 };
}

// Increment user's stamp balance
export async function addStamp(userId: string): Promise<UserData> {
  const db = await readDb();
  const current = db[userId] || { stamps: 0, lastStampedAt: 0 };
  
  const updated = {
    stamps: current.stamps + 1,
    lastStampedAt: Date.now()
  };
  
  db[userId] = updated;
  await writeDb(db);
  return updated;
}
