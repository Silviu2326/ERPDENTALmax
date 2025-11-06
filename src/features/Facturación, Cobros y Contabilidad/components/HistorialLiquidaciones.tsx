import { useState, useEffect } from 'react';
import { Liquidacion, obtenerHistorialLiquidaciones, FiltrosHistorialLiquidaciones } from '../api/liquidacionesApi';
import { FileText, Eye, CheckCircle2, Clock, Send, AlertCircle } from 'lucide-react';

interface HistorialLiquidacionesProps {
  onVerDetalle: (liquidacionId: string) => void;
  onConciliarPago?: (liquidacionId: string) => void;
}

export default function HistorialLiquidaciones({
  onVerDetalle,
  onConciliarPago,
}: HistorialLiquidacionesProps) {
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosHistorialLiquidaciones>({
    page: 1,
    limit: 10,
  });

  const cargarHistorial = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await obtenerHistorialLiquidaciones(filtros).catch(() => {
        // Datos mock enriquecidos para desarrollo
        const mutuas = ['Adeslas', 'Sanitas', 'DKV Seguros', 'Asisa', 'Mapfre Salud'];
        const estados: Array<'pendiente' | 'enviada' | 'conciliada' | 'parcial'> = ['pendiente', 'enviada', 'conciliada', 'parcial'];
        
        const liquidacionesMock: Liquidacion[] = [];
        const numLiquidaciones = 12;
        
        for (let i = 0; i < numLiquidaciones; i++) {
          const mutuaNombre = mutuas[Math.floor(Math.random() * mutuas.length)];
          const estado = estados[Math.floor(Math.random() * estados.length)];
          
          const fechaCreacion = new Date();
          fechaCreacion.setDate(fechaCreacion.getDate() - Math.floor(Math.random() * 90));
          
          const fechaDesde = new Date(fechaCreacion);
          fechaDesde.setDate(fechaDesde.getDate() - Math.floor(Math.random() * 30));
          
          const fechaHasta = new Date(fechaDesde);
          fechaHasta.setDate(fechaHasta.getDate() + Math.floor(Math.random() * 30) + 7);
          
          const numTratamientos = Math.floor(Math.random() * 15) + 5;
          const tratamientos: any[] = [];
          let importeTotal = 0;
          
          for (let j = 0; j < numTratamientos; j++) {
            const importe = Math.round((Math.random() * 1000 + 200) * 100) / 100;
            importeTotal += importe;
            tratamientos.push({
              _id: `tratamiento-${i}-${j}`,
              paciente: { _id: `p-${j}`, nombre: 'Paciente', apellidos: 'Ejemplo' },
              fecha: fechaDesde.toISOString(),
              prestacion: { _id: `prest-${j}`, nombre: 'Tratamiento' },
              mutua: { _id: `mutua-${i}`, nombre: mutuaNombre },
              importeTotal: importe,
              importePaciente: importe * 0.2,
              importeMutua: importe * 0.8,
              estadoLiquidacion: 'liquidado',
            });
          }
          
          const importePagado = estado === 'conciliada' ? importeTotal : 
                               estado === 'parcial' ? importeTotal * (0.3 + Math.random() * 0.5) : 0;
          
          const fechaPago = estado === 'conciliada' || estado === 'parcial' ? 
            new Date(fechaCreacion.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined;
          
          liquidacionesMock.push({
            _id: `liquidacion-${i + 1}`,
            mutua: {
              _id: `mutua-${i + 1}`,
              nombre: mutuaNombre,
              cif: `A${Math.floor(Math.random() * 90000000) + 10000000}`,
            },
            codigo: `LIQ-2024-${String(i + 1).padStart(4, '0')}`,
            fechaCreacion: fechaCreacion.toISOString(),
            fechaDesde: fechaDesde.toISOString(),
            fechaHasta: fechaHasta.toISOString(),
            tratamientos,
            importeTotal: Math.round(importeTotal * 100) / 100,
            importePagado: Math.round(importePagado * 100) / 100,
            fechaPago,
            estado,
            notas: estado === 'conciliada' ? 'Pago recibido correctamente' : undefined,
          });
        }
        
        // Ordenar por fecha más reciente primero
        liquidacionesMock.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        
        // Aplicar paginación
        const page = filtros.page || 1;
        const limit = filtros.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const liquidacionesPaginadas = liquidacionesMock.slice(startIndex, endIndex);
        
        return {
          data: liquidacionesPaginadas,
          total: liquidacionesMock.length,
          page,
          limit,
          totalPages: Math.ceil(liquidacionesMock.length / limit),
        };
      });
      
      setLiquidaciones(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial');
      console.error('Error al cargar historial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [filtros]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getEstadoBadge = (estado: string) => {
    const estados = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock, label: 'Pendiente' },
      enviada: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Send, label: 'Enviada' },
      conciliada: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle2, label: 'Conciliada' },
      parcial: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertCircle, label: 'Parcial' },
    };

    const estadoInfo = estados[estado as keyof typeof estados] || estados.pendiente;
    const Icon = estadoInfo.icon;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${estadoInfo.color}`}
      >
        <Icon className="w-3 h-3" />
        <span>{estadoInfo.label}</span>
      </span>
    );
  };

  if (loading && liquidaciones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Historial de Liquidaciones</h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {liquidaciones.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay liquidaciones</h3>
          <p className="text-gray-500">Aún no se han generado liquidaciones.</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {liquidaciones.map((liquidacion) => (
              <div
                key={liquidacion._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-base font-semibold text-gray-900">
                        {liquidacion.codigo}
                      </h4>
                      {getEstadoBadge(liquidacion.estado)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Mutua:</span>{' '}
                        <span className="text-gray-900">{liquidacion.mutua.nombre}</span>
                      </div>
                      <div>
                        <span className="font-medium">Período:</span>{' '}
                        <span className="text-gray-900">
                          {formatearFecha(liquidacion.fechaDesde)} -{' '}
                          {formatearFecha(liquidacion.fechaHasta)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Tratamientos:</span>{' '}
                        <span className="text-gray-900">{liquidacion.tratamientos.length}</span>
                      </div>
                      <div>
                        <span className="font-medium">Importe:</span>{' '}
                        <span className="text-gray-900 font-semibold">
                          {formatearMoneda(liquidacion.importeTotal)}
                        </span>
                      </div>
                    </div>
                    {liquidacion.estado === 'conciliada' && liquidacion.fechaPago && (
                      <div className="mt-2 text-xs text-gray-500">
                        Pagado: {formatearFecha(liquidacion.fechaPago)} -{' '}
                        {formatearMoneda(liquidacion.importePagado)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onVerDetalle(liquidacion._id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                    {liquidacion.estado !== 'conciliada' && onConciliarPago && (
                      <button
                        onClick={() => onConciliarPago(liquidacion._id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Conciliar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setFiltros({ ...filtros, page: page - 1 })}
                disabled={page === 1 || loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setFiltros({ ...filtros, page: page + 1 })}
                disabled={page === totalPages || loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


