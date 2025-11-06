import { useState } from 'react';
import { Save, X, Calendar, FileText, Package } from 'lucide-react';
import { PedidoCompra, RecepcionMercancia, LineaRecepcion } from '../api/recepcionApi';
import TablaLineasPedidoRecepcion from './TablaLineasPedidoRecepcion';

interface FormularioRecepcionMercanciasProps {
  pedido: PedidoCompra;
  onGuardar: (recepcion: RecepcionMercancia) => void;
  onCancelar: () => void;
}

export default function FormularioRecepcionMercancias({
  pedido,
  onGuardar,
  onCancelar,
}: FormularioRecepcionMercanciasProps) {
  const [fechaRecepcion, setFechaRecepcion] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [numeroAlbaran, setNumeroAlbaran] = useState('');
  const [notas, setNotas] = useState('');
  const [lineasRecepcion, setLineasRecepcion] = useState<LineaRecepcion[]>([]);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const getProveedorNombre = (proveedor: string | any): string => {
    if (typeof proveedor === 'string') return proveedor;
    return proveedor?.nombreComercial || proveedor?.razonSocial || 'N/A';
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!numeroAlbaran.trim()) {
      nuevosErrores.numeroAlbaran = 'El número de albarán es obligatorio';
    }

    if (!fechaRecepcion) {
      nuevosErrores.fechaRecepcion = 'La fecha de recepción es obligatoria';
    }

    // Validar que haya al menos una línea con cantidad recibida > 0
    const lineasConCantidad = lineasRecepcion.filter((l) => l.cantidadRecibida > 0);
    if (lineasConCantidad.length === 0) {
      nuevosErrores.lineas = 'Debe recibir al menos un artículo';
    }

    // Validar que las cantidades recibidas no excedan las pendientes
    pedido.items.forEach((item) => {
      const lineaRecepcion = lineasRecepcion.find(
        (l) => l.productoId === (typeof item.producto === 'string' ? item.producto : item.producto._id)
      );
      if (lineaRecepcion) {
        const cantidadPendiente = item.cantidadPendiente || item.cantidad;
        if (lineaRecepcion.cantidadRecibida > cantidadPendiente) {
          nuevosErrores[`cantidad_${lineaRecepcion.productoId}`] =
            'La cantidad recibida no puede exceder la cantidad pendiente';
        }
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = () => {
    if (!validarFormulario()) {
      return;
    }

    const recepcion: RecepcionMercancia = {
      pedidoCompraId: pedido._id,
      fechaRecepcion: new Date(fechaRecepcion).toISOString(),
      numeroAlbaran: numeroAlbaran.trim(),
      notas: notas.trim() || undefined,
      lineas: lineasRecepcion.filter((l) => l.cantidadRecibida > 0),
    };

    onGuardar(recepcion);
  };

  const totalArticulosRecibidos = lineasRecepcion.reduce(
    (sum, linea) => sum + linea.cantidadRecibida,
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Información del pedido */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{pedido.numeroOrden}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Proveedor:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {getProveedorNombre(pedido.proveedor)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Fecha Estimada:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(pedido.fechaEntregaEstimada).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>
          <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
            {pedido.estado === 'abierto' ? 'Abierto' : 'Parcialmente Recibido'}
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        {/* Fecha de recepción y número de albarán */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Fecha de Recepción *
            </label>
            <input
              type="date"
              value={fechaRecepcion}
              onChange={(e) => setFechaRecepcion(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.fechaRecepcion ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errores.fechaRecepcion && (
              <p className="mt-1 text-sm text-red-600">{errores.fechaRecepcion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Número de Albarán *
            </label>
            <input
              type="text"
              value={numeroAlbaran}
              onChange={(e) => setNumeroAlbaran(e.target.value)}
              placeholder="ALB-2024-001"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.numeroAlbaran ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errores.numeroAlbaran && (
              <p className="mt-1 text-sm text-red-600">{errores.numeroAlbaran}</p>
            )}
          </div>
        </div>

        {/* Tabla de líneas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              <Package className="w-4 h-4 inline mr-2" />
              Artículos a Recibir
            </label>
            {totalArticulosRecibidos > 0 && (
              <span className="text-sm text-gray-600">
                Total: {totalArticulosRecibidos} artículo(s)
              </span>
            )}
          </div>
          {errores.lineas && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errores.lineas}</p>
            </div>
          )}
          <TablaLineasPedidoRecepcion
            lineas={pedido.items}
            lineasRecepcion={lineasRecepcion}
            onLineasChange={setLineasRecepcion}
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Observaciones sobre la recepción..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={onCancelar}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Confirmar Recepción
          </button>
        </div>
      </div>
    </div>
  );
}


