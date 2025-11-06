import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import TablaPlantillasDocumentos from '../components/TablaPlantillasDocumentos';
import ModalConfirmacionBorradoPlantilla from '../components/ModalConfirmacionBorradoPlantilla';
import {
  DocumentoPlantilla,
  obtenerPlantillas,
  eliminarPlantilla,
  PlantillasQueryParams,
} from '../api/plantillasApi';

interface GestionPlantillasPageProps {
  onCrearNueva?: () => void;
  onEditar?: (plantilla: DocumentoPlantilla) => void;
  onVer?: (plantilla: DocumentoPlantilla) => void;
}

export default function GestionPlantillasPage({
  onCrearNueva,
  onEditar,
  onVer,
}: GestionPlantillasPageProps) {
  const { user } = useAuth();
  const [plantillas, setPlantillas] = useState<DocumentoPlantilla[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plantillaAEliminar, setPlantillaAEliminar] = useState<DocumentoPlantilla | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [filtros, setFiltros] = useState<PlantillasQueryParams>({
    page: 1,
    limit: 20,
  });
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  const tipos: Array<{ value: string; label: string }> = [
    { value: '', label: 'Todos los tipos' },
    { value: 'consentimiento', label: 'Consentimiento' },
    { value: 'prescripcion', label: 'Prescripción' },
    { value: 'informe', label: 'Informe' },
    { value: 'justificante', label: 'Justificante' },
    { value: 'presupuesto', label: 'Presupuesto' },
    { value: 'otro', label: 'Otro' },
  ];

  const cargarPlantillas = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: PlantillasQueryParams = {
        ...filtros,
        tipo: filtroTipo || undefined,
      };
      const respuesta = await obtenerPlantillas(params);
      setPlantillas(respuesta.plantillas || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar plantillas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPlantillas();
  }, [filtros, filtroTipo]);

  const handleEliminar = async () => {
    if (!plantillaAEliminar) return;

    setEliminando(true);
    try {
      await eliminarPlantilla(plantillaAEliminar._id!);
      setPlantillaAEliminar(null);
      cargarPlantillas();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar plantilla');
      console.error(err);
    } finally {
      setEliminando(false);
    }
  };

  const handleEditar = (plantilla: DocumentoPlantilla) => {
    if (onEditar) {
      onEditar(plantilla);
    }
  };

  const handleVer = (plantilla: DocumentoPlantilla) => {
    if (onVer) {
      onVer(plantilla);
    }
  };

  const plantillasFiltradas = plantillas.filter((plantilla) => {
    if (!busqueda) return true;
    const busquedaLower = busqueda.toLowerCase();
    return (
      plantilla.nombre.toLowerCase().includes(busquedaLower) ||
      plantilla.tipo.toLowerCase().includes(busquedaLower)
    );
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'director';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Plantillas</h1>
              <p className="text-gray-600 mt-1">
                Administra las plantillas de documentos del sistema
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cargarPlantillas}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualizar</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => onCrearNueva && onCrearNueva()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Plantilla</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar plantillas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {tipos.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de plantillas */}
        <TablaPlantillasDocumentos
          plantillas={plantillasFiltradas}
          onEditar={handleEditar}
          onEliminar={setPlantillaAEliminar}
          onVer={handleVer}
          loading={loading}
        />

        {/* Modal de confirmación de eliminación */}
        <ModalConfirmacionBorradoPlantilla
          plantilla={plantillaAEliminar}
          onConfirmar={handleEliminar}
          onCancelar={() => setPlantillaAEliminar(null)}
          loading={eliminando}
        />
      </div>
    </div>
  );
}


