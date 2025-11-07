// API para autenticación del Portal del Paciente
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces
export interface Usuario {
  _id?: string;
  email: string;
  pacienteId?: string;
  isEmailVerified: boolean;
  createdAt?: string;
}

export interface Paciente {
  _id?: string;
  nombre: string;
  apellidos: string;
  email: string;
  fechaNacimiento: string;
  telefono: string;
}

export interface DatosRegistro {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  telefono: string;
}

export interface DatosLogin {
  email: string;
  password: string;
}

export interface RespuestaLogin {
  token: string;
  user: Usuario;
  paciente?: Paciente;
}

export interface RespuestaRegistro {
  user: Usuario;
  message: string;
}

// Registrar un nuevo paciente
export async function registrarPaciente(datos: DatosRegistro): Promise<RespuestaRegistro> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al registrar el paciente' }));
    throw new Error(error.message || 'Error al registrar el paciente');
  }

  return response.json();
}

// Iniciar sesión
export async function iniciarSesion(datos: DatosLogin): Promise<RespuestaLogin> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al iniciar sesión' }));
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return response.json();
}

// Solicitar recuperación de contraseña
export async function solicitarRecuperacionPassword(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al solicitar recuperación de contraseña' }));
    throw new Error(error.message || 'Error al solicitar recuperación de contraseña');
  }

  return response.json();
}

// Restablecer contraseña con token
export async function restablecerPassword(token: string, password: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al restablecer la contraseña' }));
    throw new Error(error.message || 'Error al restablecer la contraseña');
  }

  return response.json();
}

// Verificar email con token
export async function verificarEmail(token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al verificar el email' }));
    throw new Error(error.message || 'Error al verificar el email');
  }

  return response.json();
}



