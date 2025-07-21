// lib/parseCSV.ts
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { Participant } from './generator';

export function parseCSVParticipants(file: File): Promise<Participant[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = results.data as { name: string; room: string; gender: string,  age: string  }[];

          const participants: Participant[] = parsed.map((row) => ({
            id: uuidv4(),
            name: row.name.trim(),
            room: row.room.trim(),
            gender: row.gender.trim().toLowerCase() as 'male' | 'female',
            age: parseInt(row.age, 10)
          }));

          resolve(participants);
        } catch (error) {
          reject(error);
        }
      },
      error: (err) => reject(err),
    });
  });
}
