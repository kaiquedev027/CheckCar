import { SQLiteDatabase } from 'expo-sqlite';

export async function inicializarBanco(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS vistorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      placa TEXT NOT NULL,
      modelo TEXT NOT NULL,
      cliente TEXT NOT NULL,
      tipo TEXT NOT NULL,
      km INTEGER,
      observacoes TEXT,
      fotoUri TEXT,
      latitude REAL,
      longitude REAL,
      criadoEm TEXT NOT NULL
    );
  `);
}
