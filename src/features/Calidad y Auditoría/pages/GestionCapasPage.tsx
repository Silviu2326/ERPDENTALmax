import { useState, useEffect } from 'react';
import { Plus, RefreshCw, ArrowLeft, ShieldAlert, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <button
                onClick={() => {
                  setVista('lista');
                  setCapaEditando(null);
                }}
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2 text-sm font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a la lista
              </button>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ShieldAlert size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {vista === 'nueva' ? 'Nueva CAPA' : 'Editar CAPA'}
                  </h1>
                  <p className="text-gray-600">
                    {vista === 'nueva' ? 'Crear una nueva Acción Correctiva y Preventiva' : 'Modificar la información de la CAPA'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            {onVolver && (
              <button
                onClick={onVolver}
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2 text-sm font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
            )}
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <ShieldAlert size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Gestión de CAPAs
                </h1>
                <p className="text-gray-600">
                  Acciones Correctivas y Preventivas
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
                onClick={cargarCapas}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
              <button
                onClick={() => setVista('nueva')}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Plus size={20} />
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
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
                  {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
                  {paginacion.total} CAPAs
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setFiltros({ ...filtros, page: paginacion.page - 1 })}
                    disabled={paginacion.page === 1}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-700">
                    Página {paginacion.page} de {paginacion.totalPages}
                  </span>
                  <button
                    onClick={() => setFiltros({ ...filtros, page: paginacion.page + 1 })}
                    disabled={paginacion.page === paginacion.totalPages}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



