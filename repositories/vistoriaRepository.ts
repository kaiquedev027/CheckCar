import { SQLiteDatabase } from 'expo-sqlite';

import { NovaVistoria, Vistoria } from '../types/vistoria';

type VistoriaRow = Omit<Vistoria, 'fotos'> & { fotoUri: string | null };

function parseFotos(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [String(parsed)];
  } catch {
    return [raw];
  }
}

function rowToVistoria(row: VistoriaRow): Vistoria {
  const { fotoUri, ...rest } = row;
  return { ...rest, fotos: parseFotos(fotoUri) };
}

export async function listarVistorias(db: SQLiteDatabase): Promise<Vistoria[]> {
  const rows = await db.getAllAsync<VistoriaRow>('SELECT * FROM vistorias ORDER BY id DESC;');
  return rows.map(rowToVistoria);
}

export async function buscarVistoria(db: SQLiteDatabase, id: number): Promise<Vistoria | null> {
  const row = await db.getFirstAsync<VistoriaRow>('SELECT * FROM vistorias WHERE id = ?;', [id]);
  return row ? rowToVistoria(row) : null;
}

export async function inserirVistoria(db: SQLiteDatabase, v: NovaVistoria): Promise<void> {
  await db.runAsync(
    'INSERT INTO vistorias (placa, modelo, cliente, tipo, km, observacoes, fotoUri, latitude, longitude, criadoEm) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
    [v.placa, v.modelo, v.cliente, v.tipo, v.km, v.observacoes, JSON.stringify(v.fotos), v.latitude, v.longitude, v.criadoEm],
  );
}

export async function atualizarVistoria(db: SQLiteDatabase, id: number, v: NovaVistoria): Promise<void> {
  await db.runAsync(
    'UPDATE vistorias SET placa = ?, modelo = ?, cliente = ?, tipo = ?, km = ?, observacoes = ?, fotoUri = ?, latitude = ?, longitude = ? WHERE id = ?;',
    [v.placa, v.modelo, v.cliente, v.tipo, v.km, v.observacoes, JSON.stringify(v.fotos), v.latitude, v.longitude, id],
  );
}

export async function excluirVistoria(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM vistorias WHERE id = ?;', [id]);
}
