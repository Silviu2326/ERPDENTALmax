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

interface BuscadorPacientesProps {
  pacienteSeleccionado: Paciente | null;
  onPacienteSeleccionado: (paciente: Paciente | null) => void;
}

export default function BuscadorPacientes({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: BuscadorPacientesProps) {
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
      // En producción, esto llamaría a la API real
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
        // Fallback: datos mock para desarrollo
        const datosMock: Paciente[] = [
          { _id: '1', nombre: 'Ana', apellidos: 'Martínez', telefono: '123456789', dni: '12345678A' },
          { _id: '2', nombre: 'Pedro', apellidos: 'Sánchez', telefono: '987654321', dni: '87654321B' },
          { _id: '3', nombre: 'Laura', apellidos: 'Rodríguez', telefono: '456789123', dni: '45678912C' },
        ].filter(p => 
          `${p.nombre} ${p.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.dni?.includes(busqueda)
        );
        setResultados(datosMock);
        setMostrarResultados(true);
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
    setBusqueda(`${paciente.nombre} ${paciente.apellidos}`);
    setMostrarResultados(false);
  };

  const handleLimpiar = () => {
    setBusqueda('');
    onPacienteSeleccionado(null);
    setResultados([]);
    setMostrarResultados(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buscar Paciente
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => busqueda.length >= 2 && setMostrarResultados(true)}
          placeholder="Buscar por nombre, apellidos o DNI..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {pacienteSeleccionado && (
          <button
            onClick={handleLimpiar}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {resultados.map((paciente) => (
              <li
                key={paciente._id}
                onClick={() => handleSeleccionar(paciente)}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {paciente.nombre} {paciente.apellidos}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      {paciente.dni && (
                        <p className="text-xs text-gray-500">DNI: {paciente.dni}</p>
                      )}
                      {paciente.telefono && (
                        <p className="text-xs text-gray-500">Tel: {paciente.telefono}</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">Buscando pacientes...</p>
        </div>
      )}

      {pacienteSeleccionado && (
        <div className="mt-2 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              Paciente seleccionado: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


