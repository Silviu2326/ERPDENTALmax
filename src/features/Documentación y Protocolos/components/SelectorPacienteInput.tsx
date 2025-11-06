import { useState, useEffect } from 'react';
import { Search, User, X } from 'lucide-react';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  dni?: string;
}

interface SelectorPacienteInputProps {
  pacienteSeleccionado: Paciente | null;
  onPacienteSeleccionado: (paciente: Paciente | null) => void;
}

export default function SelectorPacienteInput({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: SelectorPacienteInputProps) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (busqueda.length >= 2) {
      buscarPacientes();
    } else {
      setResultados([]);
      setMostrarResultados(false);
    }
  }, [busqueda]);

  const buscarPacientes = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(
        `${API_BASE_URL}/pacientes/buscar?q=${encodeURIComponent(busqueda)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResultados(data);
        setMostrarResultados(true);
      } else {
        setResultados([]);
      }
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionar = (paciente: Paciente) => {
    onPacienteSeleccionado(paciente);
    setBusqueda('');
    setMostrarResultados(false);
  };

  const handleLimpiar = () => {
    onPacienteSeleccionado(null);
    setBusqueda('');
    setResultados([]);
    setMostrarResultados(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buscar Paciente
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => {
            if (resultados.length > 0) {
              setMostrarResultados(true);
            }
          }}
          placeholder={pacienteSeleccionado 
            ? `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellidos}` 
            : 'Buscar por nombre, apellidos o DNI...'}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={!!pacienteSeleccionado}
        />
        {pacienteSeleccionado && (
          <button
            onClick={handleLimpiar}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Buscando...</div>
          ) : (
            <ul className="py-1">
              {resultados.map((paciente) => (
                <li
                  key={paciente._id}
                  onClick={() => handleSeleccionar(paciente)}
                  className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors flex items-center space-x-3"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {paciente.nombre} {paciente.apellidos}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {paciente.dni && <span>DNI: {paciente.dni}</span>}
                      {paciente.telefono && <span>Tel: {paciente.telefono}</span>}
                      {paciente.email && <span>Email: {paciente.email}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {pacienteSeleccionado && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Paciente seleccionado:</span>{' '}
            {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
            {pacienteSeleccionado.email && (
              <span className="ml-2 text-gray-500">({pacienteSeleccionado.email})</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}


