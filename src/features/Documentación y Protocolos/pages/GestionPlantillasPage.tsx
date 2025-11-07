import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, FileText, X, AlertCircle } from 'lucide-react';
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

  const hayFiltrosActivos = busqueda || filtroTipo;
  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroTipo('');
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
                  Gestión de Plantillas
                </h1>
                <p className="text-gray-600">
                  Administra las plantillas de documentos del sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarPlantillas}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-300 hover:border-slate-400"
              >
                <RefreshCw size={20} className="mr-2" />
                Actualizar
              </button>
              {isAdmin && (
                <button
                  onClick={() => onCrearNueva && onCrearNueva()}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  <Plus size={20} className="mr-2" />
                  Nueva Plantilla
                </button>
              )}
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Sistema de Filtros */}
          <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200">
            <div className="p-4 space-y-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  {/* Input de búsqueda */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar plantillas..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  {/* Select de tipo */}
                  <div className="relative w-full md:w-64">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 appearance-none"
                    >
                      {tipos.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Botón limpiar filtros */}
                  {hayFiltrosActivos && (
                    <button
                      onClick={limpiarFiltros}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-300 hover:border-slate-400"
                    >
                      <X size={18} />
                      <span>Limpiar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Resumen de resultados */}
              {plantillasFiltradas.length > 0 && (
                <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                  <span>{plantillasFiltradas.length} {plantillasFiltradas.length === 1 ? 'plantilla encontrada' : 'plantillas encontradas'}</span>
                  {hayFiltrosActivos && (
                    <span>Filtros aplicados</span>
                  )}
                </div>
              )}
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
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ModalConfirmacionBorradoPlantilla
        plantilla={plantillaAEliminar}
        onConfirmar={handleEliminar}
        onCancelar={() => setPlantillaAEliminar(null)}
        loading={eliminando}
      />
    </div>
  );
}



