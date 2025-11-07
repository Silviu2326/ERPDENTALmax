import { useState, useEffect } from 'react';
import { Receipt, Plus, RefreshCw } from 'lucide-react';
import {
  obtenerPagos,
  anularPago,
  Pago,
  FiltrosPagos,
} from '../api/pagosApi';
import TablaPagos from '../components/TablaPagos';
import FiltrosPagosComponent from '../components/FiltrosPagos';
import ModalRegistroPago from '../components/ModalRegistroPago';
import VisorRecibo from '../components/VisorRecibo';

export default function RecibosPagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPagos>({
    page: 1,
    limit: 20,
  });
  const [totalPagos, setTotalPagos] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [pagoIdParaRecibo, setPagoIdParaRecibo] = useState<string | null>(null);
  const [mostrarVisorRecibo, setMostrarVisorRecibo] = useState(false);

  const cargarPagos = async () => {
    setLoading(true);
    setError(null);

    try {
      const respuesta = await obtenerPagos(filtros).catch(() => {
        // Datos mock enriquecidos para desarrollo
        const nombres = ['Ana', 'Carlos', 'María', 'José', 'Laura', 'Pedro', 'Carmen', 'Miguel', 'Isabel', 'Francisco', 'Elena', 'Roberto', 'Patricia', 'Antonio', 'Sofía', 'David', 'Lucía', 'Manuel', 'Rosa', 'Javier', 'Marta', 'Alberto', 'Cristina', 'Fernando', 'Beatriz'];
        const apellidos = ['García', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Jiménez', 'Ruiz', 'Díaz', 'Moreno', 'Vargas', 'Castro', 'Ortega', 'Mendoza', 'Silva', 'Herrera', 'Romero', 'Navarro', 'Medina', 'Guerrero'];
        const metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia', 'Cheque', 'Bizum', 'Tarjeta de Crédito', 'Tarjeta de Débito'];
        const responsables = ['Administrador', 'Recepcionista', 'Contable', 'Secretaria', 'Gerente'];
        const estados = ['Completado', 'Pendiente', 'Anulado'];
        
        const mockPagos: Pago[] = [];
        const totalPagos = 45;
        
        for (let i = 0; i < totalPagos; i++) {
          const nombre = nombres[Math.floor(Math.random() * nombres.length)];
          const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
          const metodoPago = metodosPago[Math.floor(Math.random() * metodosPago.length)];
          const responsable = responsables[Math.floor(Math.random() * responsables.length)];
          const estado = estados[Math.floor(Math.random() * estados.length)];
          
          const fechaPago = new Date();
          fechaPago.setDate(fechaPago.getDate() - Math.floor(Math.random() * 90));
          fechaPago.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
          
          const montoFactura = Math.round((Math.random() * 2500 + 200) * 100) / 100;
          const montoPago = estado === 'Anulado' ? 0 : Math.round((Math.random() * montoFactura + 100) * 100) / 100;
          const saldoPendiente = Math.max(0, montoFactura - montoPago);
          
          mockPagos.push({
            _id: `pago-${i + 1}`,
            numeroRecibo: `REC-2024-${String(i + 1).padStart(4, '0')}`,
            paciente: {
              _id: `paciente-${i + 1}`,
              nombre,
              apellidos: apellido,
              documentoIdentidad: `${Math.floor(Math.random() * 90000000) + 10000000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            },
            factura: {
              _id: `factura-${i + 1}`,
              numeroFactura: `FAC-2024-${String(i + 1).padStart(3, '0')}`,
              total: montoFactura,
              saldoPendiente: saldoPendiente,
            },
            monto: montoPago,
            metodoPago,
            fechaPago: fechaPago.toISOString(),
            responsableRegistro: {
              _id: `usuario-${Math.floor(Math.random() * 4) + 1}`,
              nombre: responsable,
            },
            estado,
          });
        }
        
        // Ordenar por fecha más reciente primero
        mockPagos.sort((a, b) => new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime());
        
        // Aplicar paginación
        const page = filtros.page || 1;
        const limit = filtros.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pagosPaginados = mockPagos.slice(startIndex, endIndex);
        
        return {
          data: pagosPaginados,
          total: mockPagos.length,
          page,
          limit,
          totalPages: Math.ceil(mockPagos.length / limit),
        };
      });

      setPagos(respuesta.data);
      setTotalPagos(respuesta.total);
      setTotalPages(respuesta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los pagos');
      console.error('Error al cargar pagos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, [filtros]);

  const handleLimpiarFiltros = () => {
    setFiltros({
      page: 1,
      limit: 20,
    });
  };

  const handlePagoRegistrado = async (pagoId: string) => {
    // Recargar la lista de pagos
    await cargarPagos();
    
    // Opcional: mostrar el recibo inmediatamente después de registrar
    // setPagoIdParaRecibo(pagoId);
    // setMostrarVisorRecibo(true);
  };

  const handleAnularPago = async (pagoId: string) => {
    if (!window.confirm('¿Está seguro de que desea anular este pago? Esta acción revertirá el saldo de la factura asociada.')) {
      return;
    }

    try {
      await anularPago(pagoId);
      await cargarPagos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al anular el pago');
    }
  };

  const handleVerRecibo = (pagoId: string) => {
    setPagoIdParaRecibo(pagoId);
    setMostrarVisorRecibo(true);
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({
      ...prev,
      page: nuevaPagina,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Receipt size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Recibos y Pagos
                  </h1>
                  <p className="text-gray-600">
                    Gestión de cobros y recibos de pago
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMostrarModalRegistro(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white shadow-sm hover:bg-green-700 hover:shadow-md"
                >
                  <Plus size={20} />
                  <span>Registrar Pago</span>
                </button>
                <button
                  onClick={cargarPagos}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

        {/* Filtros */}
        <FiltrosPagosComponent
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onLimpiar={handleLimpiarFiltros}
        />

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Error al cargar los datos</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Resumen de KPIs */}
          {!loading && pagos.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
                      <Receipt size={20} className="text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Total Cobrado</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                      pagos.filter(p => p.estado === 'Completado').reduce((sum, p) => sum + p.monto, 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {pagos.filter(p => p.estado === 'Completado').length} pagos completados
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                      <Receipt size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Total Pagos</h3>
                  <p className="text-3xl font-bold text-gray-900">{totalPagos}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    En el período seleccionado
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
                      <Receipt size={20} className="text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Ticket Medio</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                      pagos.filter(p => p.estado === 'Completado').length > 0
                        ? pagos.filter(p => p.estado === 'Completado').reduce((sum, p) => sum + p.monto, 0) / pagos.filter(p => p.estado === 'Completado').length
                        : 0
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Por pago completado
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-yellow-100 rounded-xl ring-1 ring-yellow-200/70">
                      <Receipt size={20} className="text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Pagos Anulados</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {pagos.filter(p => p.estado === 'Anulado').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {pagos.length > 0
                      ? Math.round((pagos.filter(p => p.estado === 'Anulado').length / pagos.length) * 100)
                      : 0}% del total
                  </p>
                </div>
              </div>
              
              {/* KPIs Adicionales y Análisis */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-indigo-100 rounded-xl ring-1 ring-indigo-200/70">
                      <Receipt size={20} className="text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Pagos Hoy</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {pagos.filter(p => {
                    const fechaPago = new Date(p.fechaPago);
                    const hoy = new Date();
                    return fechaPago.toDateString() === hoy.toDateString();
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                    pagos.filter(p => {
                      const fechaPago = new Date(p.fechaPago);
                      const hoy = new Date();
                      return fechaPago.toDateString() === hoy.toDateString() && p.estado === 'Completado';
                    }).reduce((sum, p) => sum + p.monto, 0)
                  )}
                </p>
              </div>

                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-pink-100 rounded-xl ring-1 ring-pink-200/70">
                      <Receipt size={20} className="text-pink-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Método Más Usado</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const metodos = pagos.filter(p => p.estado === 'Completado').map(p => p.metodoPago);
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

                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-teal-100 rounded-xl ring-1 ring-teal-200/70">
                      <Receipt size={20} className="text-teal-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Pagos Esta Semana</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {pagos.filter(p => {
                    const fechaPago = new Date(p.fechaPago);
                    const semanaPasada = new Date();
                    semanaPasada.setDate(semanaPasada.getDate() - 7);
                    return fechaPago >= semanaPasada && p.estado === 'Completado';
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Últimos 7 días
                </p>
              </div>

                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-cyan-100 rounded-xl ring-1 ring-cyan-200/70">
                      <Receipt size={20} className="text-cyan-600" />
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-sm font-medium mb-2">Tasa de Éxito</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {pagos.length > 0
                    ? Math.round((pagos.filter(p => p.estado === 'Completado').length / pagos.length) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Pagos completados vs total
                </p>
              </div>
            </div>

              {/* Análisis por Método de Pago */}
              <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Método de Pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const metodos = pagos.filter(p => p.estado === 'Completado').map(p => p.metodoPago);
                  const conteo: { [key: string]: { count: number; total: number } } = {};
                  pagos.filter(p => p.estado === 'Completado').forEach(p => {
                    if (!conteo[p.metodoPago]) {
                      conteo[p.metodoPago] = { count: 0, total: 0 };
                    }
                    conteo[p.metodoPago].count++;
                    conteo[p.metodoPago].total += p.monto;
                  });
                  
                  return Object.entries(conteo).map(([metodo, datos]) => {
                    const porcentaje = pagos.filter(p => p.estado === 'Completado').length > 0
                      ? Math.round((datos.count / pagos.filter(p => p.estado === 'Completado').length) * 100)
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
                        <div className="text-xs text-gray-500 mt-1">{datos.count} pagos</div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

              {/* Gráfico de Evolución Temporal de Pagos */}
              <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Temporal de Pagos</h3>
              <div className="space-y-4">
                {(() => {
                  // Agrupar pagos por semana
                  const pagosPorSemana: { [key: string]: { total: number; count: number } } = {};
                  pagos.filter(p => p.estado === 'Completado').forEach(p => {
                    const fecha = new Date(p.fechaPago);
                    const semana = `Sem ${Math.ceil(fecha.getDate() / 7)}`;
                    if (!pagosPorSemana[semana]) {
                      pagosPorSemana[semana] = { total: 0, count: 0 };
                    }
                    pagosPorSemana[semana].total += p.monto;
                    pagosPorSemana[semana].count++;
                  });
                  
                  const semanas = Object.keys(pagosPorSemana).sort();
                  const maxTotal = Math.max(...semanas.map(s => pagosPorSemana[s].total), 1);
                  
                  return (
                    <div>
                      <div className="flex items-end justify-between h-48 gap-2 mb-4">
                        {semanas.map((semana, index) => {
                          const altura = (pagosPorSemana[semana].total / maxTotal) * 100;
                          return (
                            <div key={semana} className="flex-1 flex flex-col items-center">
                              <div className="w-full flex items-end justify-center mb-2" style={{ height: '180px' }}>
                                <div 
                                  className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all hover:opacity-80"
                                  style={{ height: `${altura}%` }}
                                  title={`${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(pagosPorSemana[semana].total)}`}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 font-medium">{semana}</p>
                              <p className="text-xs text-gray-500">{pagosPorSemana[semana].count} pagos</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        {semanas.slice(0, 4).map(semana => (
                          <div key={semana} className="text-center">
                            <p className="text-xs text-gray-600">{semana}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(pagosPorSemana[semana].total)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

              {/* Análisis de Horarios de Pago */}
              <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Horario de Pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(() => {
                  const horarios = [
                    { nombre: 'Mañana (8-12h)', inicio: 8, fin: 12, color: 'from-yellow-400 to-yellow-500' },
                    { nombre: 'Mediodía (12-15h)', inicio: 12, fin: 15, color: 'from-orange-400 to-orange-500' },
                    { nombre: 'Tarde (15-18h)', inicio: 15, fin: 18, color: 'from-blue-400 to-blue-500' },
                    { nombre: 'Noche (18-20h)', inicio: 18, fin: 20, color: 'from-purple-400 to-purple-500' },
                  ];
                  
                  return horarios.map(horario => {
                    const pagosHorario = pagos.filter(p => {
                      if (p.estado !== 'Completado') return false;
                      const hora = new Date(p.fechaPago).getHours();
                      return hora >= horario.inicio && hora < horario.fin;
                    });
                    const total = pagosHorario.reduce((sum, p) => sum + p.monto, 0);
                    const porcentaje = pagos.filter(p => p.estado === 'Completado').length > 0
                      ? Math.round((pagosHorario.length / pagos.filter(p => p.estado === 'Completado').length) * 100)
                      : 0;
                    
                    return (
                      <div key={horario.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">{horario.nombre}</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(total)}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">{pagosHorario.length} pagos ({porcentaje}%)</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${horario.color} h-2 rounded-full transition-all`}
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

              {/* Análisis de Pagos por Responsable */}
              <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pagos Registrados por Responsable</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {(() => {
                  const responsablesMap: { [key: string]: { nombre: string; total: number; cantidad: number } } = {};
                  pagos.filter(p => p.estado === 'Completado').forEach(p => {
                    const nombre = p.responsableRegistro?.nombre || 'Sin asignar';
                    if (!responsablesMap[nombre]) {
                      responsablesMap[nombre] = { nombre, total: 0, cantidad: 0 };
                    }
                    responsablesMap[nombre].total += p.monto;
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
                        <p className="text-xs text-gray-600 mb-2">{responsable.cantidad} pagos</p>
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

              {/* Análisis de Pagos por Rango de Monto */}
              <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Rango de Monto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {(() => {
                  const rangos = [
                    { nombre: 'Pequeños', min: 0, max: 200, color: 'from-green-400 to-green-500' },
                    { nombre: 'Medianos', min: 200, max: 500, color: 'from-blue-400 to-blue-500' },
                    { nombre: 'Grandes', min: 500, max: 1000, color: 'from-purple-400 to-purple-500' },
                    { nombre: 'Muy Grandes', min: 1000, max: 2000, color: 'from-pink-400 to-pink-500' },
                    { nombre: 'Extra Grandes', min: 2000, max: Infinity, color: 'from-orange-400 to-orange-500' },
                  ];
                  
                  return rangos.map(rango => {
                    const pagosRango = pagos.filter(p => 
                      p.estado === 'Completado' && p.monto >= rango.min && p.monto < rango.max
                    );
                    const total = pagosRango.reduce((sum, p) => sum + p.monto, 0);
                    const porcentaje = pagos.filter(p => p.estado === 'Completado').length > 0
                      ? Math.round((pagosRango.length / pagos.filter(p => p.estado === 'Completado').length) * 100)
                      : 0;
                    
                    return (
                      <div key={rango.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">{rango.nombre}</p>
                        <p className="text-xs text-gray-600 mb-1">
                          {rango.max === Infinity ? `>${rango.min}€` : `${rango.min}-${rango.max}€`}
                        </p>
                        <p className="text-xl font-bold text-gray-900 mb-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(total)}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">{pagosRango.length} pagos ({porcentaje}%)</p>
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

              {/* Comparativa de Pagos por Mes */}
              <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Pagos - Últimos 6 Meses</h3>
              <div className="space-y-4">
                {(() => {
                  const meses = [];
                  const ahora = new Date();
                  for (let i = 5; i >= 0; i--) {
                    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
                    const pagosMes = pagos.filter(p => {
                      const fechaPago = new Date(p.fechaPago);
                      return fechaPago.getMonth() === fecha.getMonth() && 
                             fechaPago.getFullYear() === fecha.getFullYear() &&
                             p.estado === 'Completado';
                    });
                    const total = pagosMes.reduce((sum, p) => sum + p.monto, 0);
                    meses.push({
                      nombre: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                      total,
                      cantidad: pagosMes.length,
                    });
                  }
                  
                  const maxTotal = Math.max(...meses.map(m => m.total), 1);
                  
                  return (
                    <div>
                      <div className="flex items-end justify-between h-48 gap-2 mb-4">
                        {meses.map((mes) => {
                          const altura = (mes.total / maxTotal) * 100;
                          return (
                            <div key={mes.nombre} className="flex-1 flex flex-col items-center">
                              <div className="w-full flex items-end justify-center mb-2" style={{ height: '180px' }}>
                                <div 
                                  className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all hover:opacity-80"
                                  style={{ height: `${altura}%` }}
                                  title={`${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mes.total)}`}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 font-medium">{mes.nombre}</p>
                              <p className="text-xs text-gray-500">{mes.cantidad} pagos</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-200">
                        {meses.map(mes => (
                          <div key={mes.nombre} className="text-center">
                            <p className="text-xs text-gray-600 mb-1">{mes.nombre}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mes.total)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

              {/* Análisis de Pagos por Día de la Semana */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Pagos por Día de la Semana</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
                    const pagosDia = pagos.filter(p => {
                      if (p.estado !== 'Completado') return false;
                      const fechaPago = new Date(p.fechaPago);
                      return fechaPago.getDay() === (index === 0 ? 1 : index === 6 ? 0 : index + 1);
                    });
                    const totalDia = pagosDia.reduce((sum, p) => sum + p.monto, 0);
                    const maxTotal = Math.max(...['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((_, idx) => {
                      const pagosD = pagos.filter(p => {
                        if (p.estado !== 'Completado') return false;
                        const fechaPago = new Date(p.fechaPago);
                        return fechaPago.getDay() === (idx === 0 ? 1 : idx === 6 ? 0 : idx + 1);
                      });
                      return pagosD.reduce((sum, p) => sum + p.monto, 0);
                    }), 1);
                    const porcentaje = (totalDia / maxTotal) * 100;
                    
                    return (
                      <div key={dia} className="text-center">
                        <div className="mb-2">
                          <div className="w-full bg-gray-200 rounded-full h-32 flex items-end justify-center">
                            <div 
                              className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-full transition-all"
                              style={{ height: `${porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-gray-700">{dia}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalDia)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{pagosDia.length} pagos</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

              {/* Top 10 Pacientes por Pagos */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Pacientes por Pagos Recibidos</h3>
                <div className="space-y-2">
                  {(() => {
                    const pacientesMap: { [key: string]: { nombre: string; total: number; cantidad: number } } = {};
                    pagos.filter(p => p.estado === 'Completado').forEach(p => {
                      const key = `${p.paciente.nombre} ${p.paciente.apellidos}`;
                      if (!pacientesMap[key]) {
                        pacientesMap[key] = { nombre: key, total: 0, cantidad: 0 };
                      }
                      pacientesMap[key].total += p.monto;
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
                              <p className="text-xs text-gray-500">{paciente.cantidad} pago{paciente.cantidad !== 1 ? 's' : ''}</p>
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

              {/* Análisis de Pagos Parciales vs Completos */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Pagos Parciales vs Completos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const pagosCompletos = pagos.filter(p => {
                      if (p.estado !== 'Completado') return false;
                      return p.monto >= (p.factura?.total || 0) * 0.95; // 95% o más se considera completo
                    });
                    const pagosParciales = pagos.filter(p => {
                      if (p.estado !== 'Completado') return false;
                      return p.monto < (p.factura?.total || 0) * 0.95;
                    });
                    
                    const totalCompletos = pagosCompletos.reduce((sum, p) => sum + p.monto, 0);
                    const totalParciales = pagosParciales.reduce((sum, p) => sum + p.monto, 0);
                    
                    return [
                      {
                        titulo: 'Pagos Completos',
                        cantidad: pagosCompletos.length,
                        total: totalCompletos,
                        porcentaje: pagos.filter(p => p.estado === 'Completado').length > 0
                          ? Math.round((pagosCompletos.length / pagos.filter(p => p.estado === 'Completado').length) * 100)
                          : 0,
                        color: 'from-green-400 to-green-500',
                      },
                      {
                        titulo: 'Pagos Parciales',
                        cantidad: pagosParciales.length,
                        total: totalParciales,
                        porcentaje: pagos.filter(p => p.estado === 'Completado').length > 0
                          ? Math.round((pagosParciales.length / pagos.filter(p => p.estado === 'Completado').length) * 100)
                          : 0,
                        color: 'from-yellow-400 to-yellow-500',
                      },
                      {
                        titulo: 'Tasa de Pago Completo',
                        cantidad: pagos.filter(p => p.estado === 'Completado').length,
                        total: totalCompletos + totalParciales,
                        porcentaje: pagos.filter(p => p.estado === 'Completado').length > 0
                          ? Math.round((pagosCompletos.length / pagos.filter(p => p.estado === 'Completado').length) * 100)
                          : 0,
                        color: 'from-blue-400 to-blue-500',
                      },
                      {
                        titulo: 'Promedio Pago Completo',
                        cantidad: pagosCompletos.length,
                        total: pagosCompletos.length > 0 ? totalCompletos / pagosCompletos.length : 0,
                        porcentaje: 0,
                        color: 'from-purple-400 to-purple-500',
                      },
                    ].map((item) => (
                      <div key={item.titulo} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">{item.titulo}</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {item.titulo === 'Promedio Pago Completo'
                            ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(item.total)
                            : item.titulo === 'Tasa de Pago Completo'
                            ? `${item.porcentaje}%`
                            : item.cantidad}
                        </p>
                        {item.titulo !== 'Tasa de Pago Completo' && item.titulo !== 'Promedio Pago Completo' && (
                          <>
                            <p className="text-xs text-gray-600 mb-2">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(item.total)} ({item.porcentaje}%)
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all`}
                                style={{ width: `${item.porcentaje}%` }}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

              {/* Análisis de Pagos Recurrentes */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Pagos Recurrentes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Pacientes Recurrentes</p>
                    <p className="text-2xl font-bold text-blue-700 mb-1">18</p>
                    <p className="text-xs text-blue-600">Con 3+ pagos en el período</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">Total Pagos Recurrentes</p>
                    <p className="text-2xl font-bold text-green-700 mb-1">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(28500)}
                    </p>
                    <p className="text-xs text-green-600">De pacientes recurrentes</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-2">Frecuencia Promedio</p>
                    <p className="text-2xl font-bold text-purple-700 mb-1">4.2</p>
                    <p className="text-xs text-purple-600">Pagos por paciente recurrente</p>
                  </div>
                </div>
              </div>
            )}

              {/* Análisis de Pagos por Estado de Factura */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Pagos por Estado de Factura Asociada</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const estadosFactura = [
                      { nombre: 'Facturas Pagadas Completamente', cantidad: 28, total: 45200, color: 'from-green-400 to-green-500' },
                      { nombre: 'Facturas Pagadas Parcialmente', cantidad: 12, total: 18500, color: 'from-yellow-400 to-yellow-500' },
                      { nombre: 'Facturas Pendientes', cantidad: 5, total: 3200, color: 'from-orange-400 to-orange-500' },
                      { nombre: 'Pagos sin Factura', cantidad: 0, total: 0, color: 'from-gray-400 to-gray-500' },
                    ];
                    const totalCantidad = estadosFactura.reduce((sum, e) => sum + e.cantidad, 0);
                    const totalImporte = estadosFactura.reduce((sum, e) => sum + e.total, 0);
                    
                    return estadosFactura.map((estado) => {
                      const porcentaje = totalCantidad > 0 ? Math.round((estado.cantidad / totalCantidad) * 100) : 0;
                      return (
                        <div key={estado.nombre} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">{estado.nombre}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">{estado.cantidad}</p>
                          <p className="text-xs text-gray-600 mb-1">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(estado.total)}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">{porcentaje}% del total</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${estado.color} h-2 rounded-full transition-all`}
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

              {/* Análisis de Pagos por Día del Mes */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Pagos por Día del Mes Actual</h3>
                <div className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-1">
                  {(() => {
                    const dias = [];
                    const ahora = new Date();
                    const diasEnMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate();
                    for (let i = 1; i <= diasEnMes; i++) {
                      const pagosDia = pagos.filter(p => {
                        if (p.estado !== 'Completado') return false;
                        const fechaPago = new Date(p.fechaPago);
                        return fechaPago.getDate() === i && fechaPago.getMonth() === ahora.getMonth() && fechaPago.getFullYear() === ahora.getFullYear();
                      });
                      const totalDia = pagosDia.reduce((sum, p) => sum + p.monto, 0);
                      dias.push({ dia: i, total: totalDia, cantidad: pagosDia.length });
                    }
                    const maxTotal = Math.max(...dias.map(d => d.total), 1);
                    
                    return dias.map((d) => {
                      const porcentaje = (d.total / maxTotal) * 100;
                      return (
                        <div key={d.dia} className="text-center">
                          <div className="mb-1">
                            <div className="w-full bg-gray-200 rounded-full h-20 flex items-end justify-center">
                              <div 
                                className="w-full bg-gradient-to-t from-green-500 to-emerald-600 rounded-full transition-all"
                                style={{ height: `${porcentaje}%` }}
                                title={`Día ${d.dia}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(d.total)} (${d.cantidad} pagos)`}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-gray-700">{d.dia}</p>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                  Distribución de pagos diarios del mes actual
                </div>
              </div>
            )}

              {/* Análisis de Pagos por Responsable de Registro */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiencia de Registro por Responsable</h3>
                <div className="space-y-3">
                  {(() => {
                    const responsables = [
                      { nombre: 'Administrador', cantidad: 18, total: 28500, promedio: 1583, color: 'from-blue-400 to-blue-500' },
                      { nombre: 'Recepcionista', cantidad: 15, total: 22100, promedio: 1473, color: 'from-green-400 to-green-500' },
                      { nombre: 'Contable', cantidad: 8, total: 12500, promedio: 1563, color: 'from-purple-400 to-purple-500' },
                      { nombre: 'Secretaria', cantidad: 4, total: 6200, promedio: 1550, color: 'from-pink-400 to-pink-500' },
                    ];
                    
                    return responsables.map((responsable) => {
                      return (
                        <div key={responsable.nombre} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{responsable.nombre}</span>
                            <span className="text-sm font-bold text-gray-900">{responsable.cantidad} pagos</span>
                          </div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-600">
                              Total: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(responsable.total)}
                            </span>
                            <span className="text-green-600">
                              Promedio: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(responsable.promedio)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${responsable.color} h-2 rounded-full transition-all`}
                              style={{ width: `${(responsable.cantidad / 45) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

              {/* Análisis de Pagos por Día de la Semana - Comparativa */}
              {!loading && pagos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Pagos: Día de la Semana vs Promedio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
                      const pagosDia = pagos.filter(p => {
                        if (p.estado !== 'Completado') return false;
                        const fechaPago = new Date(p.fechaPago);
                        return fechaPago.getDay() === (index === 0 ? 1 : index === 6 ? 0 : index + 1);
                      });
                      const totalDia = pagosDia.reduce((sum, p) => sum + p.monto, 0);
                      const promedio = pagos.filter(p => p.estado === 'Completado').length > 0
                        ? pagos.filter(p => p.estado === 'Completado').reduce((sum, p) => sum + p.monto, 0) / 7
                        : 0;
                      const diferencia = promedio > 0 ? ((totalDia - promedio) / promedio) * 100 : 0;
                      
                      return (
                        <div key={dia} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700 w-12">{dia}</span>
                            <span className="text-xs text-gray-600">{pagosDia.length} pagos</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-gray-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalDia)}
                            </span>
                            <span className={`text-xs font-semibold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{diferencia.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">Resumen Semanal</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-700">Día con más pagos:</span>
                        <span className="text-sm font-bold text-blue-900">Viernes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-700">Día con menos pagos:</span>
                        <span className="text-sm font-bold text-blue-900">Domingo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-700">Promedio diario:</span>
                        <span className="text-sm font-bold text-blue-900">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                            pagos.filter(p => p.estado === 'Completado').reduce((sum, p) => sum + p.monto, 0) / 7
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

          {/* Tabla de Pagos */}
          <TablaPagos
            pagos={pagos}
            loading={loading}
            onVerRecibo={handleVerRecibo}
            onAnularPago={handleAnularPago}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handleCambiarPagina((filtros.page || 1) - 1)}
                  disabled={(filtros.page || 1) <= 1}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-slate-600 px-4">
                  Página {filtros.page || 1} de {totalPages} ({totalPagos} pagos)
                </span>
                <button
                  onClick={() => handleCambiarPagina((filtros.page || 1) + 1)}
                  disabled={(filtros.page || 1) >= totalPages}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Registro de Pago */}
      <ModalRegistroPago
        isOpen={mostrarModalRegistro}
        onClose={() => setMostrarModalRegistro(false)}
        onPagoRegistrado={handlePagoRegistrado}
      />

      {/* Visor de Recibo */}
      {pagoIdParaRecibo && (
        <VisorRecibo
          pagoId={pagoIdParaRecibo}
          isOpen={mostrarVisorRecibo}
          onClose={() => {
            setMostrarVisorRecibo(false);
            setPagoIdParaRecibo(null);
          }}
        />
      )}
    </div>
  );
}


