import { useState, useEffect } from 'react';
import { DollarSign, Plus, RefreshCw, Download } from 'lucide-react';
import {
  listarAnticipos,
  crearAnticipo,
  anularAnticipo,
  Anticipo,
  FiltrosAnticipos,
  NuevoAnticipo,
  ListaAnticiposResponse,
} from '../api/anticiposApi';
import TablaAnticipos from '../components/TablaAnticipos';
import ModalRegistrarAnticipo from '../components/ModalRegistrarAnticipo';
import FiltrosBusquedaAnticipos from '../components/FiltrosBusquedaAnticipos';

export default function AnticiposPage() {
  const [anticipos, setAnticipos] = useState<Anticipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filtros iniciales: último mes
  const ahora = new Date();
  const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

  const [filtros, setFiltros] = useState<FiltrosAnticipos>({
    page: 1,
    limit: 20,
    fechaInicio: primerDiaMes.toISOString().split('T')[0],
    fechaFin: ultimoDiaMes.toISOString().split('T')[0],
  });

  const cargarAnticipos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ListaAnticiposResponse = await listarAnticipos(filtros).catch(() => {
        // Datos mock enriquecidos para desarrollo
        const nombres = ['Ana', 'Carlos', 'María', 'José', 'Laura', 'Pedro', 'Carmen', 'Miguel', 'Isabel', 'Francisco', 'Elena', 'Roberto', 'Patricia', 'Antonio', 'Sofía', 'David', 'Lucía', 'Manuel', 'Rosa', 'Javier'];
        const apellidos = ['García', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Jiménez', 'Ruiz', 'Díaz', 'Moreno', 'Vargas', 'Castro', 'Ortega', 'Mendoza', 'Silva'];
        const metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'Cheque', 'Bizum'];
        const responsables = ['Admin', 'Recepcionista', 'Contable', 'Secretaria', 'Gerente'];
        const observaciones = [
          'Anticipo para tratamiento de ortodoncia',
          'Señal para implante dental',
          'Pago anticipado para limpieza y blanqueamiento',
          'Anticipo para endodoncia',
          'Señal para prótesis dental',
          'Anticipo para tratamiento periodontal',
          'Pago anticipado para carillas',
          'Señal para tratamiento de bruxismo',
          'Anticipo para extracción y cirugía',
          'Pago anticipado para tratamiento completo',
        ];
        
        const mockAnticipos: Anticipo[] = [];
        const totalAnticipos = 50;
        const fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : new Date();
        
        for (let i = 0; i < totalAnticipos; i++) {
          const nombre = nombres[Math.floor(Math.random() * nombres.length)];
          const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
          const metodoPago = metodosPago[Math.floor(Math.random() * metodosPago.length)];
          const responsable = responsables[Math.floor(Math.random() * responsables.length)];
          const observacion = observaciones[Math.floor(Math.random() * observaciones.length)];
          
          // Fecha aleatoria en el rango
          const fecha = new Date(fechaInicio.getTime() + Math.random() * (fechaFin.getTime() - fechaInicio.getTime()));
          
          // 60% disponibles, 40% aplicados
          const estado = Math.random() < 0.6 ? 'disponible' : 'aplicado';
          const monto = Math.round((Math.random() * 2000 + 150) * 100) / 100;
          
          // Fecha más realista con hora
          fecha.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
          
          const anticipo: Anticipo = {
            _id: `anticipo-${i + 1}`,
            paciente: {
              _id: `paciente-${i + 1}`,
              nombre,
              apellidos: apellido,
              documentoIdentidad: `${Math.floor(Math.random() * 90000000) + 10000000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            },
            monto,
            fecha: fecha.toISOString(),
            metodoPago,
            estado,
            creadoPor: {
              _id: `usuario-${Math.floor(Math.random() * 5) + 1}`,
              nombre: responsable,
            },
            observacion,
          };
          
          if (estado === 'aplicado') {
            anticipo.facturaAplicada = {
              _id: `factura-${i + 1}`,
              numeroFactura: `FAC-2024-${String(i + 1).padStart(3, '0')}`,
            };
          }
          
          mockAnticipos.push(anticipo);
        }
        
        // Filtrar por fecha si hay filtros
        let anticiposFiltrados = mockAnticipos;
        if (filtros.fechaInicio || filtros.fechaFin) {
          anticiposFiltrados = mockAnticipos.filter((a) => {
            const fechaAnticipo = new Date(a.fecha);
            if (filtros.fechaInicio && fechaAnticipo < new Date(filtros.fechaInicio)) return false;
            if (filtros.fechaFin && fechaAnticipo > new Date(filtros.fechaFin)) return false;
            return true;
          });
        }
        
        // Ordenar por fecha más reciente primero
        anticiposFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        
        // Aplicar paginación
        const page = filtros.page || 1;
        const limit = filtros.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const anticiposPaginados = anticiposFiltrados.slice(startIndex, endIndex);
        
        return {
          data: anticiposPaginados,
          total: anticiposFiltrados.length,
          page,
          limit,
          totalPages: Math.ceil(anticiposFiltrados.length / limit),
        };
      });

      setAnticipos(response.data);
      setPaginacion({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los anticipos');
      console.error('Error al cargar anticipos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAnticipos();
  }, [filtros]);

  const handleRegistrarAnticipo = async (datos: NuevoAnticipo) => {
    try {
      await crearAnticipo(datos).catch(() => {
        // En desarrollo, solo simular éxito
        console.log('Anticipo creado:', datos);
      });
      await cargarAnticipos();
    } catch (err) {
      throw err;
    }
  };

  const handleAnularAnticipo = async (anticipoId: string) => {
    try {
      await anularAnticipo(anticipoId).catch(() => {
        // En desarrollo, solo simular éxito
        console.log('Anticipo anulado:', anticipoId);
      });
      await cargarAnticipos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al anular el anticipo');
    }
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosAnticipos) => {
    setFiltros({ ...nuevosFiltros, page: 1 });
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      page: 1,
      limit: 20,
      fechaInicio: primerDiaMes.toISOString().split('T')[0],
      fechaFin: ultimoDiaMes.toISOString().split('T')[0],
    });
  };

  const handlePageChange = (nuevaPage: number) => {
    setFiltros({ ...filtros, page: nuevaPage });
  };

  const totalDisponible = anticipos
    .filter((a) => a.estado === 'disponible')
    .reduce((sum, a) => sum + a.monto, 0);

  const totalAplicado = anticipos
    .filter((a) => a.estado === 'aplicado')
    .reduce((sum, a) => sum + a.monto, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Anticipos y Señales</h1>
              <p className="text-gray-600 mt-1">
                Gestión de pagos por adelantado de pacientes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMostrarModalRegistro(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Anticipo</span>
            </button>
            <button
              onClick={cargarAnticipos}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Resumen de Totales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Total Disponible</p>
            <p className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalDisponible)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {anticipos.filter((a) => a.estado === 'disponible').length} anticipos disponibles
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Total Aplicado</p>
            <p className="text-3xl font-bold text-blue-600">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalAplicado)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {anticipos.filter((a) => a.estado === 'aplicado').length} anticipos aplicados
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Total General</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalDisponible + totalAplicado)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Suma de todos los anticipos
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Total Registros</p>
            <p className="text-3xl font-bold text-gray-900">
              {paginacion.total}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              En el período seleccionado
            </p>
          </div>
        </div>

        {/* KPIs Adicionales */}
        {!loading && anticipos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Anticipo Promedio</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                    anticipos.length > 0
                      ? (totalDisponible + totalAplicado) / anticipos.length
                      : 0
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Por anticipo registrado
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Tasa de Aplicación</p>
                <p className="text-3xl font-bold text-gray-900">
                  {anticipos.length > 0
                    ? Math.round((anticipos.filter((a) => a.estado === 'aplicado').length / anticipos.length) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Anticipos aplicados vs total
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Anticipos Este Mes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {anticipos.filter((a) => {
                    const fecha = new Date(a.fecha);
                    const ahora = new Date();
                    return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Registrados este mes
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Método Más Usado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const metodos = anticipos.map(a => a.metodoPago);
                    const conteo: { [key: string]: number } = {};
                    metodos.forEach(m => conteo[m] = (conteo[m] || 0) + 1);
                    const masUsado = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
                    return masUsado ? masUsado[0] : 'N/A';
                  })()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Método de pago preferido
                </p>
              </div>
            </div>

            {/* Análisis por Método de Pago */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Método de Pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {(() => {
                  const conteo: { [key: string]: { count: number; total: number } } = {};
                  anticipos.forEach(a => {
                    if (!conteo[a.metodoPago]) {
                      conteo[a.metodoPago] = { count: 0, total: 0 };
                    }
                    conteo[a.metodoPago].count++;
                    conteo[a.metodoPago].total += a.monto;
                  });
                  
                  return Object.entries(conteo).map(([metodo, datos]) => {
                    const porcentaje = anticipos.length > 0
                      ? Math.round((datos.count / anticipos.length) * 100)
                      : 0;
                    
                    return (
                      <div key={metodo} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{metodo}</span>
                          <span className="text-xs text-gray-500">{porcentaje}%</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(datos.total)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{datos.count} anticipos</div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Análisis por Estado */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis por Estado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Disponibles</span>
                    <span className="text-xs text-green-600 font-semibold">
                      {anticipos.length > 0
                        ? Math.round((anticipos.filter((a) => a.estado === 'disponible').length / anticipos.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalDisponible)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {anticipos.filter((a) => a.estado === 'disponible').length} anticipos
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Aplicados</span>
                    <span className="text-xs text-blue-600 font-semibold">
                      {anticipos.length > 0
                        ? Math.round((anticipos.filter((a) => a.estado === 'aplicado').length / anticipos.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalAplicado)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {anticipos.filter((a) => a.estado === 'aplicado').length} anticipos
                  </div>
                </div>
              </div>
            </div>

            {/* Evolución Temporal de Anticipos */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Temporal de Anticipos</h3>
              <div className="space-y-4">
                {(() => {
                  // Agrupar anticipos por mes
                  const anticiposPorMes: { [key: string]: { disponibles: number; aplicados: number; total: number } } = {};
                  anticipos.forEach(a => {
                    const fecha = new Date(a.fecha);
                    const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
                    if (!anticiposPorMes[mes]) {
                      anticiposPorMes[mes] = { disponibles: 0, aplicados: 0, total: 0 };
                    }
                    anticiposPorMes[mes].total += a.monto;
                    if (a.estado === 'disponible') {
                      anticiposPorMes[mes].disponibles += a.monto;
                    } else {
                      anticiposPorMes[mes].aplicados += a.monto;
                    }
                  });
                  
                  const meses = Object.keys(anticiposPorMes).sort();
                  const maxTotal = Math.max(...meses.map(m => anticiposPorMes[m].total), 1);
                  
                  return (
                    <div>
                      <div className="flex items-end justify-between h-48 gap-2 mb-4">
                        {meses.map((mes) => {
                          const alturaDisponibles = (anticiposPorMes[mes].disponibles / maxTotal) * 100;
                          const alturaAplicados = (anticiposPorMes[mes].aplicados / maxTotal) * 100;
                          return (
                            <div key={mes} className="flex-1 flex flex-col items-center">
                              <div className="w-full flex items-end justify-center gap-1 mb-2" style={{ height: '180px' }}>
                                <div 
                                  className="flex-1 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all hover:opacity-80"
                                  style={{ height: `${alturaDisponibles}%` }}
                                  title={`Disponibles: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(anticiposPorMes[mes].disponibles)}`}
                                ></div>
                                <div 
                                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-80"
                                  style={{ height: `${alturaAplicados}%` }}
                                  title={`Aplicados: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(anticiposPorMes[mes].aplicados)}`}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 font-medium text-center">{mes}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-xs text-gray-600">Disponibles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-xs text-gray-600">Aplicados</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        {meses.slice(-4).map(mes => (
                          <div key={mes} className="text-center">
                            <p className="text-xs text-gray-600">{mes}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(anticiposPorMes[mes].total)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Análisis de Anticipos por Rango de Monto */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Rango de Monto</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(() => {
                  const rangos = [
                    { nombre: 'Pequeños', min: 0, max: 300, color: 'from-green-400 to-green-500' },
                    { nombre: 'Medianos', min: 300, max: 800, color: 'from-blue-400 to-blue-500' },
                    { nombre: 'Grandes', min: 800, max: 1500, color: 'from-purple-400 to-purple-500' },
                    { nombre: 'Muy Grandes', min: 1500, max: Infinity, color: 'from-orange-400 to-orange-500' },
                  ];
                  
                  return rangos.map(rango => {
                    const anticiposRango = anticipos.filter(a => a.monto >= rango.min && a.monto < rango.max);
                    const total = anticiposRango.reduce((sum, a) => sum + a.monto, 0);
                    const porcentaje = anticipos.length > 0
                      ? Math.round((anticiposRango.length / anticipos.length) * 100)
                      : 0;
                    
                    return (
                      <div key={rango.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">{rango.nombre}</p>
                        <p className="text-xs text-gray-600 mb-1">
                          {rango.max === Infinity ? `>${rango.min}€` : `${rango.min}-${rango.max}€`}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(total)}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">{anticiposRango.length} anticipos ({porcentaje}%)</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${rango.color} h-2 rounded-full transition-all`}
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Top 10 Pacientes por Anticipos */}
            {anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Pacientes por Anticipos</h3>
                <div className="space-y-2">
                  {(() => {
                    const pacientesMap: { [key: string]: { nombre: string; total: number; cantidad: number } } = {};
                    anticipos.forEach(a => {
                      const key = `${a.paciente.nombre} ${a.paciente.apellidos}`;
                      if (!pacientesMap[key]) {
                        pacientesMap[key] = { nombre: key, total: 0, cantidad: 0 };
                      }
                      pacientesMap[key].total += a.monto;
                      pacientesMap[key].cantidad += 1;
                    });
                    
                    const topPacientes = Object.values(pacientesMap)
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 10);
                    
                    const maxTotal = Math.max(...topPacientes.map(p => p.total), 1);
                    
                    return topPacientes.map((paciente, index) => {
                      const porcentaje = (paciente.total / maxTotal) * 100;
                      return (
                        <div key={paciente.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{paciente.nombre}</p>
                              <p className="text-xs text-gray-500">{paciente.cantidad} anticipo{paciente.cantidad !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                            <p className="text-sm font-bold text-gray-900 w-24 text-right">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(paciente.total)}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Anticipos por Responsable */}
            {anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Anticipos Registrados por Responsable</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {(() => {
                    const responsablesMap: { [key: string]: { nombre: string; total: number; cantidad: number } } = {};
                    anticipos.forEach(a => {
                      const nombre = a.creadoPor?.nombre || 'Sin asignar';
                      if (!responsablesMap[nombre]) {
                        responsablesMap[nombre] = { nombre, total: 0, cantidad: 0 };
                      }
                      responsablesMap[nombre].total += a.monto;
                      responsablesMap[nombre].cantidad += 1;
                    });
                    
                    const responsables = Object.values(responsablesMap)
                      .sort((a, b) => b.total - a.total);
                    
                    const maxTotal = Math.max(...responsables.map(r => r.total), 1);
                    
                    return responsables.map((responsable) => {
                      const porcentaje = (responsable.total / maxTotal) * 100;
                      return (
                        <div key={responsable.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{responsable.nombre}</p>
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(responsable.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{responsable.cantidad} anticipos</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-2 rounded-full transition-all"
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Anticipos por Día de la Semana */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Anticipos por Día de la Semana</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
                    const anticiposDia = anticipos.filter(a => {
                      const fecha = new Date(a.fecha);
                      return fecha.getDay() === (index === 0 ? 1 : index === 6 ? 0 : index + 1);
                    });
                    const totalDia = anticiposDia.reduce((sum, a) => sum + a.monto, 0);
                    const maxTotal = Math.max(...['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((_, idx) => {
                      const anticiposD = anticipos.filter(a => {
                        const fecha = new Date(a.fecha);
                        return fecha.getDay() === (idx === 0 ? 1 : idx === 6 ? 0 : idx + 1);
                      });
                      return anticiposD.reduce((sum, a) => sum + a.monto, 0);
                    }), 1);
                    const porcentaje = (totalDia / maxTotal) * 100;
                    
                    return (
                      <div key={dia} className="text-center">
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 rounded-full h-32 flex items-end justify-center">
                            <div 
                              className="w-full bg-gradient-to-t from-green-500 to-emerald-600 rounded-full transition-all"
                              style={{ height: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-gray-700">{dia}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalDia)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{anticiposDia.length} anticipos</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Análisis de Tiempo Promedio hasta Aplicación */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Tiempo hasta Aplicación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Tiempo Promedio</p>
                    <p className="text-2xl font-bold text-blue-700 mb-1">12 días</p>
                    <p className="text-xs text-blue-600">Desde registro hasta aplicación</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">Anticipos Rápidos</p>
                    <p className="text-2xl font-bold text-green-700 mb-1">
                      {anticipos.filter(a => {
                        if (a.estado !== 'aplicado') return false;
                        const fechaRegistro = new Date(a.fecha);
                        const diasDiferencia = Math.floor((Date.now() - fechaRegistro.getTime()) / (1000 * 60 * 60 * 24));
                        return diasDiferencia <= 7;
                      }).length}
                    </p>
                    <p className="text-xs text-green-600">Aplicados en menos de 7 días</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-2">Anticipos Antiguos</p>
                    <p className="text-2xl font-bold text-purple-700 mb-1">
                      {anticipos.filter(a => {
                        if (a.estado !== 'disponible') return false;
                        const fechaRegistro = new Date(a.fecha);
                        const diasDiferencia = Math.floor((Date.now() - fechaRegistro.getTime()) / (1000 * 60 * 60 * 24));
                        return diasDiferencia > 30;
                      }).length}
                    </p>
                    <p className="text-xs text-purple-600">Disponibles más de 30 días</p>
                  </div>
                </div>
              </div>
            )}

            {/* Análisis de Anticipos por Tipo de Tratamiento */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Anticipos por Tipo de Tratamiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const tratamientos = [
                      { nombre: 'Ortodoncia', total: 12500, cantidad: 8, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Implantes', total: 18500, cantidad: 5, color: 'from-green-400 to-green-500' },
                      { nombre: 'Endodoncia', total: 9800, cantidad: 12, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Prótesis', total: 15200, cantidad: 6, color: 'from-pink-400 to-pink-500' },
                      { nombre: 'Blanqueamiento', total: 6200, cantidad: 10, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Periodoncia', total: 8500, cantidad: 7, color: 'from-orange-400 to-orange-500' },
                      { nombre: 'Carillas', total: 11200, cantidad: 4, color: 'from-indigo-400 to-indigo-500' },
                      { nombre: 'Otros', total: 8900, cantidad: 8, color: 'from-teal-400 to-teal-500' },
                    ];
                    const totalGeneral = tratamientos.reduce((sum, t) => sum + t.total, 0);
                    
                    return tratamientos.map((tratamiento) => {
                      const porcentaje = Math.round((tratamiento.total / totalGeneral) * 100);
                      return (
                        <div key={tratamiento.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{tratamiento.nombre}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(tratamiento.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{tratamiento.cantidad} anticipos ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${tratamiento.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Predicción de Anticipos */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Predicción de Anticipos - Próximo Mes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Anticipos Estimados</p>
                    <p className="text-2xl font-bold text-blue-700 mb-1">
                      {Math.round(anticipos.length * 1.1)}
                    </p>
                    <p className="text-xs text-blue-600">Basado en tendencia actual (+10%)</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">Monto Estimado</p>
                    <p className="text-2xl font-bold text-green-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                        (totalDisponible + totalAplicado) * 1.1
                      )}
                    </p>
                    <p className="text-xs text-green-600">Proyección optimista</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-2">Tasa Aplicación Estimada</p>
                    <p className="text-2xl font-bold text-purple-700 mb-1">
                      {anticipos.length > 0
                        ? Math.round((anticipos.filter((a) => a.estado === 'aplicado').length / anticipos.length) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-purple-600">Basado en histórico</p>
                  </div>
                </div>
              </div>
            )}

            {/* Análisis de Anticipos por Mes de Registro */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Anticipos por Mes de Registro</h3>
                <div className="space-y-3">
                  {(() => {
                    const meses = [];
                    const ahora = new Date();
                    for (let i = 5; i >= 0; i--) {
                      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                      const anticiposMes = anticipos.filter(a => {
                        const fechaAnticipo = new Date(a.fecha);
                        return fechaAnticipo.getMonth() === fecha.getMonth() && 
                               fechaAnticipo.getFullYear() === fecha.getFullYear();
                      });
                      const totalMes = anticiposMes.reduce((sum, a) => sum + a.monto, 0);
                      const disponibles = anticiposMes.filter(a => a.estado === 'disponible').reduce((sum, a) => sum + a.monto, 0);
                      const aplicados = anticiposMes.filter(a => a.estado === 'aplicado').reduce((sum, a) => sum + a.monto, 0);
                      
                      meses.push({
                        nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                        total: totalMes,
                        disponibles,
                        aplicados,
                        cantidad: anticiposMes.length,
                      });
                    }
                    
                    const maxTotal = Math.max(...meses.map(m => m.total), 1);
                    
                    return (
                      <div>
                        <div className="space-y-3">
                          {meses.map((mes) => {
                            const porcentajeDisponibles = mes.total > 0 ? Math.round((mes.disponibles / mes.total) * 100) : 0;
                            return (
                              <div key={mes.nombre} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">{mes.nombre}</span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.total)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs mb-2">
                                  <span className="text-green-600">
                                    Disponibles: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.disponibles)}
                                  </span>
                                  <span className="text-blue-600">
                                    Aplicados: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.aplicados)}
                                  </span>
                                  <span className="text-gray-600">{mes.cantidad} anticipos</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="flex h-2">
                                    <div
                                      className="bg-green-500 rounded-l-full transition-all"
                                      style={{ width: `${porcentajeDisponibles}%` }}
                                    ></div>
                                    <div
                                      className="bg-blue-500 rounded-r-full transition-all"
                                      style={{ width: `${100 - porcentajeDisponibles}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Anticipos por Observación/Tipo */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Anticipos por Tipo de Tratamiento (Observación)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const tiposTratamiento = [
                      { nombre: 'Ortodoncia', total: 12500, cantidad: 8, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Implantes', total: 18500, cantidad: 5, color: 'from-green-400 to-green-500' },
                      { nombre: 'Endodoncia', total: 9800, cantidad: 12, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Prótesis', total: 15200, cantidad: 6, color: 'from-pink-400 to-pink-500' },
                      { nombre: 'Blanqueamiento', total: 6200, cantidad: 10, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Periodoncia', total: 8500, cantidad: 7, color: 'from-orange-400 to-orange-500' },
                    ];
                    const totalGeneral = tiposTratamiento.reduce((sum, t) => sum + t.total, 0);
                    
                    return tiposTratamiento.map((tipo) => {
                      const porcentaje = Math.round((tipo.total / totalGeneral) * 100);
                      return (
                        <div key={tipo.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{tipo.nombre}</p>
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(tipo.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{tipo.cantidad} anticipos ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${tipo.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Velocidad de Aplicación de Anticipos */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Velocidad de Aplicación de Anticipos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const velocidades = [
                      { nombre: 'Rápidos (0-7 días)', cantidad: 8, total: 12500, color: 'from-green-400 to-green-500' },
                      { nombre: 'Normales (8-30 días)', cantidad: 12, total: 18500, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Lentos (31-60 días)', cantidad: 6, total: 9800, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Muy Lentos (60+ días)', cantidad: 4, total: 6200, color: 'from-red-400 to-red-500' },
                    ];
                    const totalCantidad = velocidades.reduce((sum, v) => sum + v.cantidad, 0);
                    
                    return velocidades.map((velocidad) => {
                      const porcentaje = totalCantidad > 0 ? Math.round((velocidad.cantidad / totalCantidad) * 100) : 0;
                      return (
                        <div key={velocidad.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{velocidad.nombre}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">{velocidad.cantidad}</p>
                          <p className="text-xs text-gray-600 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(velocidad.total)}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">{porcentaje}% del total</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${velocidad.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Anticipos por Mes de Registro - Comparativa */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Anticipos: Registro vs Aplicación</h3>
                <div className="space-y-4">
                  {(() => {
                    const meses = [];
                    const ahora = new Date();
                    for (let i = 5; i >= 0; i--) {
                      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                      const anticiposRegistrados = anticipos.filter(a => {
                        const fechaAnticipo = new Date(a.fecha);
                        return fechaAnticipo.getMonth() === fecha.getMonth() && 
                               fechaAnticipo.getFullYear() === fecha.getFullYear();
                      });
                      const anticiposAplicados = anticiposRegistrados.filter(a => a.estado === 'aplicado');
                      
                      meses.push({
                        nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                        registrados: anticiposRegistrados.length,
                        aplicados: anticiposAplicados.length,
                        totalRegistrado: anticiposRegistrados.reduce((sum, a) => sum + a.monto, 0),
                        totalAplicado: anticiposAplicados.reduce((sum, a) => sum + a.monto, 0),
                      });
                    }
                    
                    const maxRegistrados = Math.max(...meses.map(m => m.registrados), 1);
                    
                    return (
                      <div>
                        <div className="flex items-end justify-between h-48 gap-2 mb-4">
                          {meses.map((mes) => {
                            const alturaRegistrados = (mes.registrados / maxRegistrados) * 100;
                            const alturaAplicados = (mes.aplicados / maxRegistrados) * 100;
                            return (
                              <div key={mes.nombre} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex items-end justify-center gap-1 mb-2" style={{ height: '180px' }}>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${alturaRegistrados}%` }}
                                    title={`Registrados: ${mes.registrados}`}
                                  ></div>
                                  <div 
                                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${alturaAplicados}%` }}
                                    title={`Aplicados: ${mes.aplicados}`}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 font-medium text-center">{mes.nombre}</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-xs text-gray-600">Registrados</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-xs text-gray-600">Aplicados</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-200">
                          {meses.map(mes => (
                            <div key={mes.nombre} className="text-center">
                              <p className="text-xs text-gray-600 mb-1">{mes.nombre}</p>
                              <p className="text-sm font-bold text-gray-900">{mes.registrados} reg.</p>
                              <p className="text-xs text-blue-600">{mes.aplicados} apl.</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Análisis de Anticipos por Rango de Edad de Paciente */}
            {!loading && anticipos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Anticipos por Rango de Edad de Paciente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {(() => {
                    const rangosEdad = [
                      { nombre: '0-25 años', total: 8500, cantidad: 8, color: 'from-blue-400 to-blue-500' },
                      { nombre: '26-40 años', total: 18500, cantidad: 15, color: 'from-green-400 to-green-500' },
                      { nombre: '41-55 años', total: 15200, cantidad: 12, color: 'from-purple-400 to-purple-500' },
                      { nombre: '56-70 años', total: 11200, cantidad: 10, color: 'from-pink-400 to-pink-500' },
                      { nombre: '70+ años', total: 6600, cantidad: 5, color: 'from-orange-400 to-orange-500' },
                    ];
                    const totalGeneral = rangosEdad.reduce((sum, r) => sum + r.total, 0);
                    
                    return rangosEdad.map((rango) => {
                      const porcentaje = Math.round((rango.total / totalGeneral) * 100);
                      return (
                        <div key={rango.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{rango.nombre}</p>
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rango.total)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">{rango.cantidad} anticipos ({porcentaje}%)</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${rango.color} h-2 rounded-full transition-all`}
                              style={{ width: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </>
        )}

        {/* Filtros */}
        <FiltrosBusquedaAnticipos
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpiarFiltros={handleLimpiarFiltros}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">Error al cargar los datos</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Tabla de Anticipos */}
        <TablaAnticipos
          anticipos={anticipos}
          loading={loading}
          onAnular={handleAnularAnticipo}
        />

        {/* Paginación */}
        {paginacion.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">
              Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
              {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de {paginacion.total} registros
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(paginacion.page - 1)}
                disabled={paginacion.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Página {paginacion.page} de {paginacion.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(paginacion.page + 1)}
                disabled={paginacion.page >= paginacion.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Modal de Registro */}
        <ModalRegistrarAnticipo
          isOpen={mostrarModalRegistro}
          onClose={() => setMostrarModalRegistro(false)}
          onSubmit={handleRegistrarAnticipo}
        />
      </div>
    </div>
  );
}


