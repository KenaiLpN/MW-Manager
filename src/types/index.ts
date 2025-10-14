export type FormValues = {
  email: string;
  password: string;
};

export interface LoginResponse {
  data: string[];
  msg: string;
}

export interface AnydeskSession {
  id_data: number;
  cod_cli: number;
  anydesk_id: string;
  descricao: string;
  tipo_maquina: string;
  ip_maquina: string;
  pwd: string;
  user_os: string | null;
  pwd_os: string | null;
  cliente: {
    nome: string;
    nome_fantasia: string;
    cnpj: string;
    tecnicos_loja?: {
      nome: string;
      numero: string;
    }[];
  };
}

export interface AnydeskApiResponse {
  data: AnydeskSession[];
  msg: string;
}

export interface Client {
  cod_cli: number;
  nome: string;
  nome_fantasia: string;
  cnpj: string;
  ie: string | null;
  contato: string | null;
  email: string | null;
  cell: string | null;
  estado: string;
  cidade: string;
  bairro: string | null;
  endereco: string | null;
  cep: string | null;
  data_inicio: string;
  chk_updated_at: string | null;
  chk_created_at: string | null;
  isActive: 'T' | 'F';
  func_last_update: number | null;
  cod_user?: number | null;
  tecnicos_loja?: {
    id_tec: number;
    nome: string;
    numero: string;
  }[];
}

export interface ClientApiResponse {
  data: Client[];
  msg: string;
}

export type AnydeskCreateData = {
  cod_cli: number;
  anydesk_id: string;
  descricao?: string;
  tipo_maquina?: string;
  ip_maquina?: string;
  pwd?: string;
  user_os?: string;
  pwd_os?: string;
};

export type AnydeskUpdateData = {
  cod_cli: number;
  anydesk_id?: string;
  descricao?: string;
  tipo_maquina?: string;
  ip_maquina?: string;
  pwd?: string;
  user_os?: string | null;
  pwd_os?: string | null;
};

export interface UserProfile {
  cargo: 'ADMIN' | 'USER';
  email: string;
  cod_user: number;
  name: string;
}

export interface ProfileApiResponse {
  data: UserProfile[];
  msg: string;
}

export type ClientCreateData = {
  cod_cli: number;
  nome: string;
  nome_fantasia: string;
  cnpj: string;
  ie: string;
  contato: string;
  email?: string;
  cell?: string;
  estado: string;
  cidade: string;
  bairro: string;
  endereco: string;
  cep: string;
  data_inicio: string;
  cod_user?: number | null;
}

export type ClientUpdateData = {
  nome?: string;
  nome_fantasia?: string;
  cnpj?: string;
  ie?: string;
  contato?: string;
  email?: string;
  cell?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  endereco?: string;
  cep?: string;
  data_inicio?: string;
  cod_user?:  number | null;
};

export interface User {
  cod_user: number;
  name: string;
  email: string;
  cargo: 'ADMIN' | 'USER';
  contato: string | null;
  updated_at?: string | null;
  isActive: 'T' | 'F';
  chk_created_at: string;
}

export interface UserApiResponse {
  data: User[][];
  msg: string;
}

export type UserCreateData = {
  name: string;
  email: string;
  password: string;
  cargo?: 'ADMIN' | 'USER';
  contato?: string;
};

export type UserUpdateData = {
  name?: string;
  email?: string;
  cargo?: 'ADMIN' | 'USER';
  contato?: string;
};

export interface ChamadoStatus {
  id_status: number;
  nome: string;
}

export interface ChamadoPrioridade {
  id_prioridade: number;
  nome: string;
  nivel: number;
}

export interface TecnicoLoja {
  id_tec: number;
  cod_cli: number;
  nome: string;
  numero: string;
  cliente?: { 
    nome_fantasia: string;
  };
}

export type StatusCreateData = Omit<ChamadoStatus, 'id_status'>;
export type PrioridadeCreateData = Omit<ChamadoPrioridade, 'id_prioridade'>;
export type TecnicoCreateData = Omit<TecnicoLoja, 'id_tec' | 'cliente'>;

export interface StatusApiResponse {
  data: ChamadoStatus[];
}
export interface PrioridadeApiResponse {
  data: ChamadoPrioridade[];
}
export interface TecnicoApiResponse {
  data: TecnicoLoja[];
}

export type TecnicoUpdateData = {
  nome?: string;
  numero?: string;
  cod_cli?: number;
};

export interface Chamado {
  id_chamado: number;
  titulo: string;
  descricao: string;
  resolucao: string | null;
  id_status: number;
  id_prioridade: number;
  cod_cli: number;
  cod_criador: number;
  cod_atribuido: number | null;
  created_at: string | null;
  updated_at: string | null;
  data_fechamento: string | null;
  chk_aberto: 'T' | 'F';
  status: { nome: string };
  prioridade: { nome: string; nivel: number };
  cliente: { nome_fantasia: string; cnpj: string;  };
  criado_por: { name: string };
  atribuido_a: { name: string } | null;
}

export type ChamadoCreateData = {
  titulo: string;
  descricao: string;
  id_status: number;
  id_prioridade: number;
  cod_cli: number;
  resolucao?: string;
  cod_atribuido?: number;
  data_fechamento?: string;
};

export type ChamadoUpdateData = Partial<Omit<ChamadoCreateData, 'cod_cli'>>;

export interface ChamadoApiResponse {
  data: Chamado[][];
}