export type FormValues = {
  email: string;
  password: string;
};

export interface LoginResponse {
  data: string[];
  msg: string;
}

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  chk_ativo: boolean;
  perfil_acesso?: string;
  criado_em?: string; // Nome exato que o Prisma trouxe
  atualizado_em?: string;
  telefone?: string;
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  endereco?: string;
  role?: string;
}
export interface Unidade {
  id_unidade: number;
  nome_unidade: string;
  responsavel: string;
  email_responsavel: string;
  telefone: string;
  cnpj: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  numero?: string;
  telefone_responsavel?: string;
  cep?: string;
  role_responsavel?: string;
  chk_ativo: boolean;
}

export interface InstituicaoEnsino {
  id_instituicao: number;
  nome_instituicao: string;
  email: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  responsavel?: string;
  telefone_responsavel?: string;
  email_responsavel?: string;
  chk_ativo: boolean;
  created_at?: string;
}