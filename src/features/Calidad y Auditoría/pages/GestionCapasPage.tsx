import { useState, useEffect } from 'react';
import { Plus, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerCapas,
  eliminarCapa,
  crearCapa,
  actualizarCapa,
  FiltrosCapas as FiltrosCapasType,
  Capa,
  NuevaCapa,
  ActualizarCapa,
} from '../api/capasApi';
import TablaCapas from '../components/TablaCapas';
import FormularioCapa from '../components/FormularioCapa';
import FiltrosCapas from '../components/FiltrosCapas';
import DetalleCapaPage from './DetalleCapaPage';

interface GestionCapasPageProps {
  onVolver?: () => void;
}

export default function GestionCapasPage({ onVolver }: GestionCapasPageProps) {
  const { user } = useAuth();
  const [vista, setVista] = useState<'lista' | 'nueva' | 'editar' | 'detalle'>('lista');
  const [capas, setCapas] = useState<Capa[]>([]);
  const [loading, setLoading] = useState(true);
  const [capaEditando, setCapaEditando] = useState<Capa | null>(null);
  const [capaDetalle, setCapaDetalle] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosCapasType>({
    page: 1,
    limit: 10,
  });
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [clinicas, setClinicas] = useState<Array<{ _id: string; nombre: string }>>([]);
  const [responsables, setResponsables] = useState<
    Array<{ _id: string; nombre: string; apellidos?: string }>
  >([]);

  useEffect(() => {
    if (vista === 'lista') {
      cargarCapas();
      cargarClinicas();
      cargarResponsables();
    }
  }, [vista, filtros]);

  const cargarCapas = async () => {
    try {
      setLoading(true);
      const respuesta = await obtenerCapas(filtros);
      setCapas(respuesta.data);
      setPaginacion(respuesta.pagination);
    } catch (error) {
      console.error('Error al cargar CAPAs:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarClinicas = async () => {
    try {
      // TODO: Implementar llamada a API para obtener clínicas
      // Por ahora usamos datos mock
      setClinicas([
        { _id: '1', nombre: 'Clínica Principal' },
        { _id: '2', nombre: 'Clínica Sede 2' },
      ]);
    } catch (error) {
      console.error('Error al cargar clínicas:', error);
    }
  };

  const cargarResponsables = async () => {
    try {
      // TODO: Implementar llamada a API para obtener responsables
      // Por ahora usamos datos mock
      setResponsables([
        { _id: '1', nombre: 'Juan', apellidos: 'Pérez' },
        { _id: '2', nombre: 'María', apellidos: 'García' },
      ]);
    } catch (error) {
      console.error('Error al cargar responsables:', error);
    }
  };

  const handleGuardar = async (datos: NuevaCapa | ActualizarCapa) => {
    try {
      if (capaEditando) {
        await actualizarCapa(capaEditando._id!, datos as ActualizarCapa);
      } else {
        await crearCapa(datos as NuevaCapa);
      }
      setVista('lista');
      setCapaEditando(null);
      cargarCapas();
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta CAPA?')) {
      try {
        await eliminarCapa(id);
        cargarCapas();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la CAPA');
      }
    }
  };

  const handleVerDetalle = (capaId: string) => {
    setCapaDetalle(capaId);
    setVista('detalle');
  };

  if (vista === 'detalle' && capaDetalle) {
    return (
      <DetalleCapaPage
        capaId={capaDetalle}
        onVolver={() => {
          setVista('lista');
          setCapaDetalle(null);
        }}
      />
    );
  }

  if (vista === 'nueva' || vista === 'editar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => {
                setVista('lista');
                setCapaEditando(null);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {vista === 'nueva' ? 'Nueva CAPA' : 'Editar CAPA'}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <FormularioCapa
              capa={capaEditando || undefined}
              onGuardar={handleGuardar}
              onCancelar={() => {
                setVista('lista');
                setCapaEditando(null);
              }}
              clinicas={clinicas}
              responsables={responsables}
              modoEdicion={vista === 'editar'}
            />
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            {onVolver && (
              <button
                onClick={onVolver}
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de CAPAs
            </h1>
            <p className="text-gray-600 mt-2">
              Acciones Correctivas y Preventivas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={cargarCapas}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={() => setVista('nueva')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Nueva CAPA
            </button>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosCapas
          filtros={filtros}
          onFiltrosChange={setFiltros}
          clinicas={clinicas}
          responsables={responsables}
        />

        {/* Tabla */}
        <TablaCapas
          capas={capas}
          onVerDetalle={handleVerDetalle}
          onEditar={(capaId) => {
            const capa = capas.find((c) => c._id === capaId);
            if (capa) {
              setCapaEditando(capa);
              setVista('editar');
            }
          }}
          onEliminar={handleEliminar}
          loading={loading}
        />

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
              {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
              {paginacion.total} CAPAs
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltros({ ...filtros, page: paginacion.page - 1 })}
                disabled={paginacion.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Página {paginacion.page} de {paginacion.totalPages}
              </span>
              <button
                onClick={() => setFiltros({ ...filtros, page: paginacion.page + 1 })}
                disabled={paginacion.page === paginacion.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


