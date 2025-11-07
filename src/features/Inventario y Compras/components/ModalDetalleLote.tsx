import { useState, useEffect } from 'react';
import { X, Package, Calendar, TrendingDown, History } from 'lucide-react';
import { LoteProducto, obtenerLotePorId, registrarConsumoLote } from '../api/lotesApi';
import AlertaCaducidadBadge from './AlertaCaducidadBadge';

interface ModalDetalleLoteProps {
  loteId: string;
  onClose: () => void;
}

export default function ModalDetalleLote({ loteId, onClose }: ModalDetalleLoteProps) {
  const [lote, setLote] = useState<LoteProducto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormConsumo, setMostrarFormConsumo] = useState(false);
  const [cantidadConsumo, setCantidadConsumo] = useState<number>(0);
  const [guardandoConsumo, setGuardandoConsumo] = useState(false);

  useEffect(() => {
    cargarLote();
  }, [loteId]);

  const cargarLote = async () => {
    try {
      setLoading(true);
      const data = await obtenerLotePorId(loteId);
      setLote(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle del lote');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarConsumo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lote || cantidadConsumo <= 0) {
      alert('La cantidad debe ser mayor a cero');
      return;
    }

    if (cantidadConsumo > lote.cantidadActual) {
      alert(`La cantidad no puede ser mayor a la cantidad actual (${lote.cantidadActual})`);
      return;
    }

    try {
      setGuardandoConsumo(true);
      await registrarConsumoLote(loteId, {
        cantidadConsumida: cantidadConsumo,
      });
      await cargarLote(); // Recargar datos
      setCantidadConsumo(0);
      setMostrarFormConsumo(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al registrar el consumo');
    } finally {
      setGuardandoConsumo(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalle del lote...</p>
        </div>
      </div>
    );
  }

  if (error || !lote) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Lote no encontrado'}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const porcentajeConsumido = ((lote.cantidadInicial - lote.cantidadActual) / lote.cantidadInicial) * 100;
  const fechaCaducidad = new Date(lote.fechaCaducidad);
  const hoy = new Date();
  const diasRestantes = Math.ceil((fechaCaducidad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Detalle del Lote</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información del Producto */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Producto</h3>
            <p className="text-lg font-medium text-gray-900">{lote.producto.nombre}</p>
            {lote.producto.sku && (
              <p className="text-sm text-gray-600">SKU: {lote.producto.sku}</p>
            )}
          </div>

          {/* Información del Lote */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Número de Lote</span>
              </div>
              <p className="text-lg font-mono font-semibold text-gray-900">{lote.numeroLote}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Estado</span>
              </div>
              <AlertaCaducidadBadge lote={lote} />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Fecha de Caducidad</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {fechaCaducidad.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {diasRestantes >= 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {diasRestantes === 0
                    ? 'Caduca hoy'
                    : diasRestantes === 1
                    ? 'Caduca mañana'
                    : `Caduca en ${diasRestantes} días`}
                </p>
              )}
              {diasRestantes < 0 && (
                <p className="text-sm text-red-600 font-medium mt-1">
                  Caducado hace {Math.abs(diasRestantes)} días
                </p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Fecha de Recepción</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(lote.fechaRecepcion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Cantidades */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Cantidades</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cantidad Inicial</p>
                <p className="text-2xl font-bold text-gray-900">{lote.cantidadInicial}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Cantidad Actual</p>
                <p className="text-2xl font-bold text-blue-600">{lote.cantidadActual}</p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Consumo</span>
                <span>{porcentajeConsumido.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${porcentajeConsumido}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {lote.cantidadInicial - lote.cantidadActual} unidades consumidas
            </p>
          </div>

          {/* Historial de Consumo */}
          {lote.historialConsumo && lote.historialConsumo.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Historial de Consumo</h3>
              </div>
              <div className="space-y-2">
                {lote.historialConsumo.map((consumo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {consumo.cantidad} unidades
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(consumo.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {consumo.tratamientoId && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Tratamiento #{consumo.tratamientoId.slice(-6)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulario de Consumo */}
          {!mostrarFormConsumo && lote.cantidadActual > 0 && (
            <button
              onClick={() => setMostrarFormConsumo(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              Registrar Consumo
            </button>
          )}

          {mostrarFormConsumo && (
            <form onSubmit={handleRegistrarConsumo} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Registrar Consumo</h4>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  max={lote.cantidadActual}
                  value={cantidadConsumo || ''}
                  onChange={(e) => setCantidadConsumo(parseInt(e.target.value) || 0)}
                  placeholder="Cantidad"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={guardandoConsumo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {guardandoConsumo ? 'Guardando...' : 'Registrar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormConsumo(false);
                    setCantidadConsumo(0);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



