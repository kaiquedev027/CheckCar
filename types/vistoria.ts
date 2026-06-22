export type Vistoria = {
  id: number;
  placa: string;
  modelo: string;
  cliente: string;
  tipo: 'saida' | 'devolucao';
  km: number | null;
  observacoes: string;
  fotos: string[];
  latitude: number | null;
  longitude: number | null;
  criadoEm: string;
};

export type NovaVistoria = {
  placa: string;
  modelo: string;
  cliente: string;
  tipo: 'saida' | 'devolucao';
  km: number | null;
  observacoes: string;
  fotos: string[];
  latitude: number | null;
  longitude: number | null;
  criadoEm: string;
};
