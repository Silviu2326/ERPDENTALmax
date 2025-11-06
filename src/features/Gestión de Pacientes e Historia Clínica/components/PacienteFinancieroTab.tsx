import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText, CreditCard, Receipt, FileCheck } from 'lucide-react';
import { PerfilCompletoPaciente } from '../api/pacienteApi';

interface PacienteFinancieroTabProps {
  paciente: PerfilCompletoPaciente;
}

// Datos falsos de movimientos financieros
const generarMovimientosFinancieros = (pacienteId: string) => {
  const index = parseInt(pacienteId) - 1 || 0;
  
  return [
    {
      _id: 'mov-1',
      fecha: new Date(2024, 11, 10).toISOString(),
      tipo: 'pago',
      concepto: 'Limpieza dental profesional + Revisión + Aplicación de flúor',
      monto: 115.00,
      metodoPago: 'Efectivo',
      estado: 'completado',
      referencia: 'PAG-2024-001',
      descripcion: 'Pago completo de servicios realizados en la visita del 10/12/2024',
    },
    {
      _id: 'mov-2',
      fecha: new Date(2024, 10, 15).toISOString(),
      tipo: 'pago',
      concepto: 'Obturación composite - Pieza 36',
      monto: 80.00,
      metodoPago: 'Tarjeta',
      estado: 'completado',
      referencia: 'PAG-2024-002',
      descripcion: 'Pago con tarjeta de crédito. Tratamiento completado.',
    },
    {
      _id: 'mov-3',
      fecha: new Date(2024, 9, 20).toISOString(),
      tipo: 'pago',
      concepto: 'Consulta inicial ortodoncia + Estudio completo',
      monto: 200.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-003',
      descripcion: 'Transferencia bancaria recibida. Estudio de ortodoncia completado.',
    },
    {
      _id: 'mov-4',
      fecha: new Date(2024, 9, 1).toISOString(),
      tipo: 'factura',
      concepto: 'Factura #FAC-2024-123 - Plan Ortodoncia',
      monto: 2500.00,
      metodoPago: 'Transferencia',
      estado: 'pendiente',
      referencia: 'FAC-2024-123',
      descripcion: 'Factura pendiente de pago. Plan de ortodoncia completo.',
      fechaVencimiento: new Date(2025, 0, 15).toISOString(),
    },
    {
      _id: 'mov-5',
      fecha: new Date(2024, 8, 20).toISOString(),
      tipo: 'presupuesto',
      concepto: 'Presupuesto Ortodoncia Completo',
      monto: 3000.00,
      metodoPago: '-',
      estado: 'aprobado',
      referencia: 'PRE-2024-045',
      descripcion: 'Presupuesto aprobado por el paciente. Incluye brackets, controles y retenedores.',
    },
    {
      _id: 'mov-6',
      fecha: new Date(2024, 8, 5).toISOString(),
      tipo: 'pago',
      concepto: 'Revisión de rutina',
      monto: 30.00,
      metodoPago: 'Efectivo',
      estado: 'completado',
      referencia: 'PAG-2024-004',
      descripcion: 'Pago en efectivo de revisión de rutina.',
    },
    {
      _id: 'mov-7',
      fecha: new Date(2024, 7, 15).toISOString(),
      tipo: 'pago',
      concepto: 'Pago inicial Plan Ortodoncia',
      monto: 500.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-005',
      descripcion: 'Pago inicial del plan de ortodoncia. Resto pendiente de pago.',
    },
    {
      _id: 'mov-8',
      fecha: new Date(2024, 6, 10).toISOString(),
      tipo: 'pago',
      concepto: 'Limpieza dental + Revisión',
      monto: 90.00,
      metodoPago: 'Tarjeta',
      estado: 'completado',
      referencia: 'PAG-2024-006',
      descripcion: 'Pago con tarjeta de débito.',
    },
    {
      _id: 'mov-9',
      fecha: new Date(2024, 5, 20).toISOString(),
      tipo: 'pago',
      concepto: 'Primera consulta',
      monto: 50.00,
      metodoPago: 'Efectivo',
      estado: 'completado',
      referencia: 'PAG-2024-007',
      descripcion: 'Pago de primera consulta en efectivo.',
    },
    {
      _id: 'mov-10',
      fecha: new Date(2024, 6, 15).toISOString(),
      tipo: 'pago',
      concepto: 'Control post-tratamiento',
      monto: 30.00,
      metodoPago: 'Efectivo',
      estado: 'completado',
      referencia: 'PAG-2024-008',
      descripcion: 'Pago de control post-tratamiento.',
    },
    {
      _id: 'mov-11',
      fecha: new Date(2024, 11, 1).toISOString(),
      tipo: 'factura',
      concepto: 'Factura #FAC-2024-124 - Controles mensuales ortodoncia',
      monto: 50.00,
      metodoPago: 'Transferencia',
      estado: 'pendiente',
      referencia: 'FAC-2024-124',
      descripcion: 'Factura pendiente de pago. Control mensual de ortodoncia.',
      fechaVencimiento: new Date(2025, 0, 31).toISOString(),
    },
    {
      _id: 'mov-12',
      fecha: new Date(2024, 10, 1).toISOString(),
      tipo: 'pago',
      concepto: 'Pago parcial Plan Ortodoncia',
      monto: 300.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-009',
      descripcion: 'Pago parcial del plan de ortodoncia. Resto pendiente.',
    },
    {
      _id: 'mov-13',
      fecha: new Date(2024, 9, 25).toISOString(),
      tipo: 'pago',
      concepto: 'Pago parcial Plan Ortodoncia',
      monto: 200.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-010',
      descripcion: 'Segundo pago parcial del plan de ortodoncia.',
    },
    {
      _id: 'mov-14',
      fecha: new Date(2024, 8, 30).toISOString(),
      tipo: 'pago',
      concepto: 'Endodoncia pieza 46',
      monto: 300.00,
      metodoPago: 'Tarjeta',
      estado: 'completado',
      referencia: 'PAG-2024-011',
      descripcion: 'Pago de endodoncia realizada en pieza 46. Tratamiento completado exitosamente.',
    },
    {
      _id: 'mov-15',
      fecha: new Date(2024, 2, 10).toISOString(),
      tipo: 'pago',
      concepto: 'Blanqueamiento dental profesional',
      monto: 250.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-012',
      descripcion: 'Pago de blanqueamiento dental profesional. Resultados satisfactorios.',
    },
    {
      _id: 'mov-16',
      fecha: new Date(2024, 4, 15).toISOString(),
      tipo: 'pago',
      concepto: 'Control ortodoncia mensual',
      monto: 50.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-013',
      descripcion: 'Pago de control mensual de ortodoncia. Ajuste de brackets.',
    },
    {
      _id: 'mov-17',
      fecha: new Date(2024, 11, 5).toISOString(),
      tipo: 'factura',
      concepto: 'Factura #FAC-2024-125 - Control ortodoncia',
      monto: 50.00,
      metodoPago: 'Transferencia',
      estado: 'pendiente',
      referencia: 'FAC-2024-125',
      descripcion: 'Factura pendiente de pago. Control mensual de ortodoncia.',
      fechaVencimiento: new Date(2025, 0, 5).toISOString(),
    },
    {
      _id: 'mov-18',
      fecha: new Date(2024, 10, 25).toISOString(),
      tipo: 'pago',
      concepto: 'Pago parcial Plan Ortodoncia',
      monto: 150.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-014',
      descripcion: 'Tercer pago parcial del plan de ortodoncia.',
    },
    {
      _id: 'mov-19',
      fecha: new Date(2024, 7, 25).toISOString(),
      tipo: 'pago',
      concepto: 'Estudio radiológico y planificación implantes',
      monto: 150.00,
      metodoPago: 'Tarjeta',
      estado: 'completado',
      referencia: 'PAG-2024-015',
      descripcion: 'Pago de estudio radiológico y planificación para implantes dentales.',
    },
    {
      _id: 'mov-20',
      fecha: new Date(2024, 8, 10).toISOString(),
      tipo: 'pago',
      concepto: 'Cirugía de implante (pieza 16)',
      monto: 1200.00,
      metodoPago: 'Transferencia',
      estado: 'completado',
      referencia: 'PAG-2024-016',
      descripcion: 'Pago de cirugía de implante en pieza 16. Procedimiento exitoso.',
    },
  ];
};

export default function PacienteFinancieroTab({ paciente }: PacienteFinancieroTabProps) {
  const saldo = paciente.saldo || 0;
  const movimientos = generarMovimientosFinancieros(paciente._id);
  const citasRealizadas = paciente.citas?.filter(c => c.estado === 'realizada' || c.estado === 'completada') || [];
  
  const totalPagado = movimientos
    .filter(m => m.tipo === 'pago' && m.estado === 'completado')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalPendiente = movimientos
    .filter(m => m.estado === 'pendiente')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalEsteMes = movimientos
    .filter(m => {
      const fecha = new Date(m.fecha);
      const ahora = new Date();
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear() && m.tipo === 'pago';
    })
    .reduce((sum, m) => sum + m.monto, 0);
  
  const promedioPorCita = citasRealizadas.length > 0 
    ? totalPagado / citasRealizadas.length 
    : 0;
  
  const facturasVencidas = movimientos.filter(m => {
    if (m.tipo === 'factura' && m.estado === 'pendiente' && (m as any).fechaVencimiento) {
      return new Date((m as any).fechaVencimiento) < new Date();
    }
    return false;
  });
  
  // Calcular estadísticas adicionales
  const totalFacturado = movimientos
    .filter(m => m.tipo === 'factura')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalPresupuestado = movimientos
    .filter(m => m.tipo === 'presupuesto')
    .reduce((sum, m) => sum + m.monto, 0);
  
  const porcentajeCobrado = totalFacturado > 0 
    ? Math.round((totalPagado / totalFacturado) * 100)
    : 0;
  
  const promedioPorMovimiento = movimientos.length > 0
    ? totalPagado / movimientos.filter(m => m.tipo === 'pago' && m.estado === 'completado').length
    : 0;
  
  const movimientosEsteAño = movimientos.filter(m => {
    const fecha = new Date(m.fecha);
    return fecha.getFullYear() === new Date().getFullYear();
  }).length;

  // Calcular estadísticas por mes (últimos 6 meses)
  const movimientosPorMes = movimientos
    .filter(m => m.tipo === 'pago' && m.estado === 'completado')
    .reduce((acc: Record<string, number>, m) => {
      const fecha = new Date(m.fecha);
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      acc[mesKey] = (acc[mesKey] || 0) + m.monto;
      return acc;
    }, {});

  const meses = Object.keys(movimientosPorMes).sort().slice(-6);
  const maxMonto = Math.max(...Object.values(movimientosPorMes), 1);

  // Calcular distribución por método de pago
  const porMetodoPago = movimientos
    .filter(m => m.tipo === 'pago' && m.estado === 'completado')
    .reduce((acc: Record<string, number>, m) => {
      acc[m.metodoPago] = (acc[m.metodoPago] || 0) + m.monto;
      return acc;
    }, {});

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'pago':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'factura':
        return <Receipt className="w-5 h-5 text-blue-600" />;
      case 'presupuesto':
        return <FileCheck className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      completado: 'bg-green-100 text-green-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      aprobado: 'bg-blue-100 text-blue-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estilos[estado as keyof typeof estilos] || estilos.pendiente}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Resumen Financiero
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Nuevo Movimiento
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Saldo Actual</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {saldo >= 0 ? '+' : ''}
            {saldo.toFixed(2)} €
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {saldo >= 0 ? 'A favor del paciente' : 'Pendiente de pago'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Pagado</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalPagado.toFixed(2)} €</div>
          <p className="text-xs text-gray-500 mt-1">Total histórico</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pendiente</span>
            <TrendingDown className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalPendiente.toFixed(2)} €</div>
          <p className="text-xs text-gray-500 mt-1">Pendiente de pago</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Este Mes</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalEsteMes.toFixed(2)} €</div>
          <p className="text-xs text-gray-500 mt-1">Pagos recibidos</p>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      {movimientos.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promedio por Cita</p>
                  <p className="text-xl font-bold text-indigo-600">{promedioPorCita.toFixed(2)} €</p>
                </div>
                <TrendingUp className="w-6 h-6 text-indigo-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Facturas Vencidas</p>
                  <p className="text-xl font-bold text-red-600">{facturasVencidas.length}</p>
                  {facturasVencidas.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {facturasVencidas.reduce((sum, f) => sum + f.monto, 0).toFixed(2)} €
                    </p>
                  )}
                </div>
                <FileText className="w-6 h-6 text-red-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Movimientos</p>
                  <p className="text-xl font-bold text-teal-600">{movimientos.length}</p>
                  <p className="text-xs text-gray-500 mt-1">{movimientosEsteAño} este año</p>
                </div>
                <Receipt className="w-6 h-6 text-teal-500 opacity-50" />
              </div>
            </div>
          </div>
          
          {/* Estadísticas financieras avanzadas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-violet-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Facturado</p>
                  <p className="text-xl font-bold text-violet-600">{totalFacturado.toFixed(2)} €</p>
                </div>
                <FileText className="w-6 h-6 text-violet-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-sky-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Presupuestado</p>
                  <p className="text-xl font-bold text-sky-600">{totalPresupuestado.toFixed(2)} €</p>
                </div>
                <FileCheck className="w-6 h-6 text-sky-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">% Cobrado</p>
                  <p className="text-xl font-bold text-green-600">{porcentajeCobrado}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalPagado.toFixed(2)} € / {totalFacturado.toFixed(2)} €
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promedio Movimiento</p>
                  <p className="text-xl font-bold text-amber-600">{promedioPorMovimiento.toFixed(2)} €</p>
                </div>
                <DollarSign className="w-6 h-6 text-amber-500 opacity-50" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Gráficos y visualizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pagos por mes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Pagos por Mes (Últimos 6 meses)</h4>
          {meses.length > 0 ? (
            <div className="space-y-3">
              {meses.map((mes) => {
                const monto = movimientosPorMes[mes];
                const porcentaje = (monto / maxMonto) * 100;
                const [año, mesNum] = mes.split('-');
                const nombreMes = new Date(parseInt(año), parseInt(mesNum) - 1, 1).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
                
                return (
                  <div key={mes} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">{nombreMes}</span>
                      <span className="text-gray-900 font-semibold">{monto.toFixed(2)} €</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay datos de pagos por mes</p>
          )}
        </div>

        {/* Distribución por método de pago */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Método de Pago</h4>
          {Object.keys(porMetodoPago).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(porMetodoPago).map(([metodo, monto]) => {
                const porcentaje = (monto / totalPagado) * 100;
                const colores: Record<string, string> = {
                  'Efectivo': 'bg-green-500',
                  'Tarjeta': 'bg-blue-500',
                  'Transferencia': 'bg-purple-500',
                };
                const color = colores[metodo] || 'bg-gray-500';
                
                return (
                  <div key={metodo} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color}`}></div>
                        <span className="text-sm font-medium text-gray-700">{metodo}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">{monto.toFixed(2)} €</span>
                        <span className="text-xs text-gray-500 ml-2">({porcentaje.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay datos de métodos de pago</p>
          )}
        </div>
      </div>

      {/* Tabla de movimientos financieros */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Movimientos Financieros</h4>
            <p className="text-sm text-gray-600 mt-1">
              {movimientos.length} {movimientos.length === 1 ? 'movimiento registrado' : 'movimientos registrados'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Exportar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Filtrar
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Método de Pago</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movimientos.map((movimiento) => (
                <tr key={movimiento._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(movimiento.fecha).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(movimiento.tipo)}
                      <span className="text-sm text-gray-900 capitalize">{movimiento.tipo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{movimiento.concepto}</div>
                    {(movimiento as any).descripcion && (
                      <div className="text-xs text-gray-500 mt-1">{(movimiento as any).descripcion}</div>
                    )}
                    {(movimiento as any).fechaVencimiento && (
                      <div className="text-xs text-red-600 mt-1">
                        Vence: {new Date((movimiento as any).fechaVencimiento).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{movimiento.metodoPago}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                    movimiento.tipo === 'pago' ? 'text-green-600' : 
                    movimiento.tipo === 'factura' ? 'text-red-600' : 
                    'text-gray-900'
                  }`}>
                    {movimiento.tipo === 'pago' ? '+' : movimiento.tipo === 'factura' ? '-' : ''}
                    {movimiento.monto.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(movimiento.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {movimiento.referencia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Ver
                      </button>
                      {movimiento.tipo === 'factura' && movimiento.estado === 'pendiente' && (
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Cobrar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

