import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account-Based Marketing (ABM)</h1>
          <p className="text-gray-600 mt-2">
            Gestiona empresas objetivo y crea convenios corporativos
          </p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Empresa</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <AbmAnalyticsWidget
        totalEmpresas={analiticas.totalEmpresas}
        empresasPorEstado={analiticas.empresasPorEstado}
        totalContactos={analiticas.totalContactos}
        totalCampanas={analiticas.totalCampanas}
        campanasPorEstado={analiticas.campanasPorEstado}
      />

      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nueva Empresa Objetivo</h2>
          <form onSubmit={handleCrearEmpresa} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la empresa *
                </label>
                <input
                  type="text"
                  required
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector *</label>
                <input
                  type="text"
                  required
                  value={formulario.sector}
                  onChange={(e) => setFormulario({ ...formulario, sector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Tecnología, Salud, Finanzas..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño *</label>
                <select
                  required
                  value={formulario.tamano}
                  onChange={(e) => setFormulario({ ...formulario, tamano: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Pequeña (1-50)">Pequeña (1-50)</option>
                  <option value="Mediana (51-250)">Mediana (51-250)</option>
                  <option value="Grande (251-1000)">Grande (251-1000)</option>
                  <option value="Corporativa (1000+)">Corporativa (1000+)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                <input
                  type="url"
                  value={formulario.sitioWeb}
                  onChange={(e) => setFormulario({ ...formulario, sitioWeb: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formulario.direccion}
                  onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Empresa'}
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Empresas Objetivo</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar empresas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as EstadoEmpresa | 'todos')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Cargando empresas...</p>
          </div>
        ) : (
          <AbmEmpresaList empresas={empresas} onSeleccionarEmpresa={handleSeleccionarEmpresa} />
        )}
      </div>
    </div>
  );
}


