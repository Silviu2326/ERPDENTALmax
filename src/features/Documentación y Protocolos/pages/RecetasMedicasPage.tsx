import { useState } from 'react';
import { Plus, FileText, User, Search } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import BuscadorPacientes from '../components/BuscadorPacientes';
import FormularioCrearReceta from '../components/FormularioCrearReceta';
import ListaHistorialRecetas from '../components/ListaHistorialRecetas';
import { crearReceta, MedicamentoReceta } from '../api/recetasApi';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  dni?: string;
}

type Vista = 'buscar' | 'crear' | 'historial';

export default function RecetasMedicasPage() {
  const { user } = useAuth();
  const [vista, setVista] = useState<Vista>('buscar');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recetaCreada, setRecetaCreada] = useState(false);

  const handlePacienteSeleccionado = (paciente: Paciente | null) => {
    setPacienteSeleccionado(paciente);
    if (paciente) {
      setVista('historial');
      setRecetaCreada(false);
    }
  };

  const handleNuevaReceta = () => {
    if (!pacienteSeleccionado) {
      alert('Por favor, selecciona un paciente primero');
      return;
    }
    setVista('crear');
    setRecetaCreada(false);
  };

  const handleGuardarReceta = async (
    medicamentos: MedicamentoReceta[],
    indicacionesGenerales: string
  ) => {
    if (!pacienteSeleccionado || !user) {
      setError('No hay paciente seleccionado o usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await crearReceta({
        pacienteId: pacienteSeleccionado._id,
        odontologoId: user._id || user.id || '',
        medicamentos,
        indicaciones_generales: indicacionesGenerales || undefined,
      });

      setRecetaCreada(true);
      setVista('historial');
      alert('Receta creada correctamente');
    } catch (err) {
      console.error('Error al crear receta:', err);
      setError('Error al crear la receta. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarCrear = () => {
    setVista('historial');
  };

  const handleVolverBuscar = () => {
    setPacienteSeleccionado(null);
    setVista('buscar');
    setRecetaCreada(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recetas Médicas</h1>
                <p className="text-gray-600 mt-1">
                  Gestión de recetas médicas y prescripciones
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Vista: Buscar Paciente */}
        {vista === 'buscar' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <Search className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Buscar Paciente
                </h2>
                <p className="text-gray-600">
                  Busca un paciente para ver su historial de recetas o crear una nueva
                </p>
              </div>

              <BuscadorPacientes
                pacienteSeleccionado={pacienteSeleccionado}
                onPacienteSeleccionado={handlePacienteSeleccionado}
              />

              {pacienteSeleccionado && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                        </p>
                        {pacienteSeleccionado.dni && (
                          <p className="text-sm text-gray-600">DNI: {pacienteSeleccionado.dni}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setVista('historial')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver Historial
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista: Crear Nueva Receta */}
        {vista === 'crear' && pacienteSeleccionado && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleCancelarCrear}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
              >
                <span>← Volver al historial</span>
              </button>
            </div>
            <FormularioCrearReceta
              pacienteId={pacienteSeleccionado._id}
              pacienteNombre={`${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellidos}`}
              onGuardar={handleGuardarReceta}
              onCancelar={handleCancelarCrear}
              loading={loading}
            />
          </div>
        )}

        {/* Vista: Historial de Recetas */}
        {vista === 'historial' && pacienteSeleccionado && (
          <div>
            <div className="mb-6 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                    </p>
                    {pacienteSeleccionado.dni && (
                      <p className="text-sm text-gray-600">DNI: {pacienteSeleccionado.dni}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleNuevaReceta}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Receta</span>
                  </button>
                  <button
                    onClick={handleVolverBuscar}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cambiar Paciente
                  </button>
                </div>
              </div>
            </div>

            <ListaHistorialRecetas
              pacienteId={pacienteSeleccionado._id}
              onRecetaCreada={recetaCreada ? () => setRecetaCreada(false) : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}


