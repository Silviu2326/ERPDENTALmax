export type UserRole =
  | 'propietario'
  | 'director'
  | 'odontologo'
  | 'higienista'
  | 'auxiliar'
  | 'tecnico_radiologia'
  | 'tecnico_laboratorio'
  | 'recepcionista'
  | 'teleoperador'
  | 'contable'
  | 'rrhh'
  | 'compras'
  | 'marketing';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'propietario@clinica.com',
    password: 'propietario123',
    name: 'Carlos Rodríguez',
    role: 'propietario'
  },
  {
    id: '2',
    email: 'director@clinica.com',
    password: 'director123',
    name: 'María González',
    role: 'director'
  },
  {
    id: '3',
    email: 'odontologo@clinica.com',
    password: 'odontologo123',
    name: 'Dr. Juan Pérez',
    role: 'odontologo'
  },
  {
    id: '4',
    email: 'higienista@clinica.com',
    password: 'higienista123',
    name: 'Ana Martínez',
    role: 'higienista'
  },
  {
    id: '5',
    email: 'auxiliar@clinica.com',
    password: 'auxiliar123',
    name: 'Pedro López',
    role: 'auxiliar'
  },
  {
    id: '6',
    email: 'radiologia@clinica.com',
    password: 'radiologia123',
    name: 'Laura Sánchez',
    role: 'tecnico_radiologia'
  },
  {
    id: '7',
    email: 'laboratorio@clinica.com',
    password: 'laboratorio123',
    name: 'Miguel Torres',
    role: 'tecnico_laboratorio'
  },
  {
    id: '8',
    email: 'recepcion@clinica.com',
    password: 'recepcion123',
    name: 'Carmen Ruiz',
    role: 'recepcionista'
  },
  {
    id: '9',
    email: 'callcenter@clinica.com',
    password: 'callcenter123',
    name: 'Lucía Fernández',
    role: 'teleoperador'
  },
  {
    id: '10',
    email: 'contable@clinica.com',
    password: 'contable123',
    name: 'Roberto Jiménez',
    role: 'contable'
  },
  {
    id: '11',
    email: 'rrhh@clinica.com',
    password: 'rrhh123',
    name: 'Isabel Moreno',
    role: 'rrhh'
  },
  {
    id: '12',
    email: 'compras@clinica.com',
    password: 'compras123',
    name: 'Francisco Navarro',
    role: 'compras'
  },
  {
    id: '13',
    email: 'marketing@clinica.com',
    password: 'marketing123',
    name: 'Elena Ramírez',
    role: 'marketing'
  }
];

export const ROLE_LABELS: Record<UserRole, string> = {
  propietario: 'Propietario/Gerente',
  director: 'Director General',
  odontologo: 'Odontólogo',
  higienista: 'Higienista Dental',
  auxiliar: 'Auxiliar Dental',
  tecnico_radiologia: 'Técnico de Radiología',
  tecnico_laboratorio: 'Técnico de Laboratorio',
  recepcionista: 'Recepcionista',
  teleoperador: 'Teleoperador',
  contable: 'Contable/Finanzas',
  rrhh: 'Recursos Humanos',
  compras: 'Compras e Inventario',
  marketing: 'Marketing/CRM'
};
