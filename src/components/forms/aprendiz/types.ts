export interface AprendizFormData {
  IdAluno?: number;
  CodigoExterno?: string;
  NomeJovem: string;
  NomeSocial?: string;
  IdUnidade?: number;
  IdInstituicaoParceira?: number;
  IdEscola?: number;
  IdMonitorResponsavel?: number;
  IdTurmaCapacitacao?: number;
  DataNascimento?: string;
  Sexo?: string;
  EstadoCivil?: string;
  Nacionalidade?: string;
  UF_Naturalidade?: string;
  Naturalidade?: string;
  AlistamentoMilitar?: string;
  EstudaAtualmente?: string;
  EscolaridadeNivel?: string;
  TipoAprendizagem?: string;
  TurnoEscolar?: string;
  StatusJovem?: string;
  TipoPagamento?: string;
  CBO?: string;
  AreaAtuacao?: string;
  HorasDiarias?: number;
  MesesContrato?: number;
  DataInicioEmpresa?: string;
  DataInicioAprendizagem?: string;
  DataPrevistaTermino?: string;
  DataDesligamento?: string;
  DataInicioFerias?: string;
  DataTerminoFerias?: string;
  TurmaSimultaneidade?: string;
  TurmaCCI?: string;
  RG?: string;
  RG_DataEmissao?: string;
  RG_OrgaoExpedidor?: string;
  RG_UF?: string;
  CPF?: string;
  PIS?: string;
  CTPS_Numero?: string;
  CTPS_Serie?: string;
  Reservista?: string;
  TituloEleitor?: string;
  TituloSecao?: string;
  TituloZona?: string;
  CEP?: string;
  Logradouro?: string;
  Numero?: string;
  Complemento?: string;
  Bairro?: string;
  Municipio?: string;
  UF_Endereco?: string;
  TelefoneFixo?: string;
  Celular?: string;
  Email?: string;
  OutrosTelefones?: string;
  UsaMedicamentos?: boolean;
  MedicamentosQual?: string;
  MedicamentosFinalidade?: string;
  TemAlergia?: boolean;
  AlergiaQual?: string;
  TemProblemaSaude?: boolean;
  ProblemaSaudeQual?: string;
  Deficiencia?: string;
}

export const ufOptions = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
