import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Building2, Loader2, AlertCircle, X } from 'lucide-react';
import {
  obtenerEmpresas,
  crearEmpresa,
  obtenerAnaliticasABM,
  EmpresaObjetivo,
  EstadoEmpresa,
  CrearEmpresaRequest,
  PaginacionParams,
} from '../api/abmApi';
import AbmEmpresaList from '../components/AbmEmpresaList';
import AbmAnalyticsWidget from '../components/AbmAnalyticsWidget';

interface AbmDashboardPageProps {
  onVerEmpresa?: (empresaId: string) => void;
}

export default function AbmDashboardPage({ onVerEmpresa }: AbmDashboardPageProps) {
  const [empresas, setEmpresas] = useState<EmpresaObjetivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<EstadoEmpresa | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [analiticas, setAnaliticas] = useState({
    totalEmpresas: 0,
    empresasPorEstado: {} as Record<EstadoEmpresa, number>,
    totalContactos: 0,
    totalCampanas: 0,
    campanasPorEstado: {} as Record<string, number>,
    interaccionesRecientes: [],
  });

  const [formulario, setFormulario] = useState<CrearEmpresaRequest>({
    nombre: '',
    sector: '',
    tamano: '',
    sitioWeb: '',
    direccion: '',
  });

  useEffect(() => {
    cargarEmpresas();
    cargarAnaliticas();
  }, [filtroEstado, busqueda]);

  const cargarEmpresas = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: PaginacionParams = {
        page: 1,
        limit: 50,
      };
      if (filtroEstado !== 'todos') {
        params.status = filtroEstado;
      }
      if (busqueda) {
        params.query = busqueda;
      }
      const response = await obtenerEmpresas(params);
      setEmpresas(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarAnaliticas = async () => {
    try {
      const datos = await obtenerAnaliticasABM();
      setAnaliticas(datos);
    } catch (err: any) {
      console.error('Error al cargar analíticas:', err);
    }
  };

  const handleCrearEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await crearEmpresa(formulario);
      setFormulario({
        nombre: '',
        sector: '',
        tamano: '',
        sitioWeb: '',
        direccion: '',
      });
      setMostrarFormulario(false);
      await cargarEmpresas();
      await cargarAnaliticas();
    } catch (err: any) {
      setError(err.message || 'Error al crear la empresa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarEmpresa = (empresaId: string) => {
    if (onVerEmpresa) {
      onVerEmpresa(empresaId);
    }
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
                <Building2 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Account-Based Marketing (ABM)
                </h1>
                <p className="text-gray-600">
                  Gestiona empresas objetivo y crea convenios corporativos
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
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} />
              <span>Nueva Empresa</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-2xl bg-red-50 ring-1 ring-red-200 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* KPIs/Métricas */}
          <AbmAnalyticsWidget
            totalEmpresas={analiticas.totalEmpresas}
            empresasPorEstado={analiticas.empresasPorEstado}
            totalContactos={analiticas.totalContactos}
            totalCampanas={analiticas.totalCampanas}
            campanasPorEstado={analiticas.campanasPorEstado}
          />

          {/* Formulario de Nueva Empresa */}
          {mostrarFormulario && (
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Nueva Empresa Objetivo</h2>
                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    setFormulario({
                      nombre: '',
                      sector: '',
                      tamano: '',
                      sitioWeb: '',
                      direccion: '',
                    });
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCrearEmpresa} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre de la empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={formulario.nombre}
                      onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sector *</label>
                    <input
                      type="text"
                      required
                      value={formulario.sector}
                      onChange={(e) => setFormulario({ ...formulario, sector: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      placeholder="Ej: Tecnología, Salud, Finanzas..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tamaño *</label>
                    <select
                      required
                      value={formulario.tamano}
                      onChange={(e) => setFormulario({ ...formulario, tamano: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Pequeña (1-50)">Pequeña (1-50)</option>
                      <option value="Mediana (51-250)">Mediana (51-250)</option>
                      <option value="Grande (251-1000)">Grande (251-1000)</option>
                      <option value="Corporativa (1000+)">Corporativa (1000+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sitio Web</label>
                    <input
                      type="url"
                      value={formulario.sitioWeb}
                      onChange={(e) => setFormulario({ ...formulario, sitioWeb: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={formulario.direccion}
                      onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Creando...</span>
                      </>
                    ) : (
                      <span>Crear Empresa</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormulario(false);
                      setFormulario({
                        nombre: '',
                        sector: '',
                        tamano: '',
                        sitioWeb: '',
                        direccion: '',
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sistema de Filtros */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 mb-6">
            <div className="space-y-4 p-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar empresas..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value as EstadoEmpresa | 'todos')}
                      className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="Identificada">Identificada</option>
                      <option value="Contactada">Contactada</option>
                      <option value="Negociando">Negociando</option>
                      <option value="Cliente">Cliente</option>
                      <option value="Descartada">Descartada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Resumen de resultados */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{empresas.length} resultados encontrados</span>
                <span>
                  {filtroEstado !== 'todos' || busqueda ? 'Filtros aplicados' : 'Sin filtros'}
                </span>
              </div>
            </div>
          </div>

          {/* Lista de Empresas */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Empresas Objetivo</h2>

            {loading ? (
              <div className="p-8 text-center bg-white">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando empresas...</p>
              </div>
            ) : (
              <AbmEmpresaList empresas={empresas} onSeleccionarEmpresa={handleSeleccionarEmpresa} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



