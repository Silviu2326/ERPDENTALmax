import { useState, useEffect } from 'react';
import { Search, User, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { buscarPacientesConSeguro, PacienteConSeguro } from '../../api/facturacionMutuaApi';

interface PasoSeleccionPacienteProps {
  pacienteSeleccionado: PacienteConSeguro | null;
  onPacienteSeleccionado: (paciente: PacienteConSeguro) => void;
}

export default function PasoSeleccionPaciente({
  pacienteSeleccionado,
  onPacienteSeleccionado,
}: PasoSeleccionPacienteProps) {
  const [busqueda, setBusqueda] = useState('');
  const [pacientes, setPacientes] = useState<PacienteConSeguro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarPacientes = async () => {
      if (busqueda.length < 2) {
        setPacientes([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const resultados = await buscarPacientesConSeguro(busqueda);
        setPacientes(resultados);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar pacientes');
        setPacientes([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      buscarPacientes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleSeleccionarPaciente = (paciente: PacienteConSeguro) => {
    onPacienteSeleccionado(paciente);
    setBusqueda('');
    setPacientes([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Paso 1: Seleccionar Paciente</h3>
        <p className="text-gray-600 text-sm">
          Busca y selecciona al paciente con seguro activo para el cual deseas generar la factura.
        </p>
      </div>

      {/* Buscador de pacientes */}
      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, apellidos o DNI..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Lista de resultados */}
        {busqueda.length >= 2 && (
          <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-sm max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Buscando pacientes...</p>
              </div>
            )}

            {error && (
              <div className="p-4 text-red-600 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!loading && !error && pacientes.length === 0 && busqueda.length >= 2 && (
              <div className="p-8 text-center">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No se encontraron pacientes con seguro activo</p>
              </div>
            )}

            {!loading && !error && pacientes.length > 0 && (
              <div className="divide-y divide-gray-200">
                {pacientes.map((paciente) => (
                  <button
                    key={paciente._id}
                    onClick={() => handleSeleccionarPaciente(paciente)}
                    className="w-full p-4 text-left hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-2 ring-1 ring-blue-200/70">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {paciente.nombre} {paciente.apellidos}
                        </div>
                        {paciente.DNI && (
                          <div className="text-sm text-gray-600 mt-1">DNI: {paciente.DNI}</div>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-blue-600">
                            <CreditCard size={16} />
                            <span className="font-medium">{paciente.poliza.mutuaNombre}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span>Póliza: {paciente.poliza.numeroPoliza}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Paciente seleccionado */}
      {pacienteSeleccionado && (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-blue-200/70 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <User size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-lg">
                {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
              </div>
              {pacienteSeleccionado.DNI && (
                <div className="text-sm text-gray-600 mt-1">DNI: {pacienteSeleccionado.DNI}</div>
              )}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard size={16} className="text-blue-600" />
                  <span className="font-medium text-gray-900">Mutua/Seguro:</span>
                  <span className="text-gray-700">{pacienteSeleccionado.poliza.mutuaNombre}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">Nº Póliza:</span>
                  <span className="text-gray-700">{pacienteSeleccionado.poliza.numeroPoliza}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="font-medium text-gray-900">Válida hasta:</span>
                  <span className="text-gray-700">
                    {new Date(pacienteSeleccionado.poliza.fechaValidez).toLocaleDateString('es-ES')}
                  </span>
                </div>
                {pacienteSeleccionado.poliza.condicionesEspeciales && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    <span className="font-medium">Condiciones especiales:</span>{' '}
                    {pacienteSeleccionado.poliza.condicionesEspeciales}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



