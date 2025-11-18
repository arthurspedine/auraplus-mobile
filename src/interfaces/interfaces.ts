export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  cargo: string | null;
}
