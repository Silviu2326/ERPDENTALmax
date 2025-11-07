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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Recetas Médicas
                </h1>
                <p className="text-gray-600">
                  Gestión de recetas médicas y prescripciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl ring-1 ring-red-200/70">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Vista: Buscar Paciente */}
          {vista === 'buscar' && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-4 ring-1 ring-blue-200/70">
                    <Search size={48} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
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
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl ring-1 ring-blue-200/70">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                          </p>
                          {pacienteSeleccionado.dni && (
                            <p className="text-xs text-gray-600">DNI: {pacienteSeleccionado.dni}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setVista('historial')}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
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
            <div className="space-y-6">
              <div className="flex items-center">
                <button
                  onClick={handleCancelarCrear}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium transition-colors"
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
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                      </p>
                      {pacienteSeleccionado.dni && (
                        <p className="text-xs text-gray-600">DNI: {pacienteSeleccionado.dni}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNuevaReceta}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    >
                      <Plus size={20} />
                      <span>Nueva Receta</span>
                    </button>
                    <button
                      onClick={handleVolverBuscar}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
    </div>
  );
}



