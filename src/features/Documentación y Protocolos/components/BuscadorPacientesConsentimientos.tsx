import { useState, useEffect } from 'react';
import { Search, User, X } from 'lucide-react';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  dni?: string;
  telefono?: string;
}

interface BuscadorPacientesConsentimientosProps {
  pacienteSeleccionado: Paciente | null;
  onPacienteSeleccionado: (paciente: Paciente | null) => void;
}

export default function BuscadorPacientesConsentimientos({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: BuscadorPacientesConsentimientosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const buscarPacientes = async (termino: string) => {
    if (termino.length < 2) {
      setResultados([]);
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(
        `${API_BASE_URL}/pacientes/buscar?q=${encodeURIComponent(termino)}`,
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
      }
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busqueda) {
        buscarPacientes(busqueda);
      } else {
        setResultados([]);
        setMostrarResultados(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda]);

  const handleSeleccionarPaciente = (paciente: Paciente) => {
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar paciente por nombre, apellidos o DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {pacienteSeleccionado && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-full">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
              </p>
              {pacienteSeleccionado.dni && (
                <p className="text-sm text-gray-600">DNI: {pacienteSeleccionado.dni}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {mostrarResultados && resultados.length > 0 && !pacienteSeleccionado && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {resultados.map((paciente) => (
            <button
              key={paciente._id}
              onClick={() => handleSeleccionarPaciente(paciente)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
            >
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {paciente.nombre} {paciente.apellidos}
                </p>
                {paciente.dni && <p className="text-sm text-gray-500">DNI: {paciente.dni}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-500">Buscando...</p>
        </div>
      )}
    </div>
  );
}


