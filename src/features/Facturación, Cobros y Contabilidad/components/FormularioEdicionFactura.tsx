import { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Loader2 } from 'lucide-react';
import {
  FacturaDetallada,
  ItemFacturaEditable,
  actualizarFactura,
  TratamientoBusqueda,
} from '../api/facturacionApi';
import CabeceraFacturaEditable from './CabeceraFacturaEditable';
import ListaItemsFacturaEditable from './ListaItemsFacturaEditable';
import ResumenTotalesFactura from './ResumenTotalesFactura';
import HistorialCambiosFactura from './HistorialCambiosFactura';
import ModalBusquedaTratamientos from './ModalBusquedaTratamientos';
import { ConceptoFactura } from '../api/facturacionApi';

interface FormularioEdicionFacturaProps {
  factura: FacturaDetallada;
  onGuardar: (factura: FacturaDetallada) => void;
  onCancelar: () => void;
}

export default function FormularioEdicionFactura({
  factura: facturaInicial,
  onGuardar,
  onCancelar,
}: FormularioEdicionFacturaProps) {
  const [factura, setFactura] = useState<FacturaDetallada>(facturaInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(false);

  // Verificar si la factura es editable
  const esEditable = factura.estado === 'borrador' || factura.estado === 'emitida';

  useEffect(() => {
    setFactura(facturaInicial);
  }, [facturaInicial]);

  const calcularTotales = (items: ItemFacturaEditable[]) => {
    let subtotal = 0;
    let totalImpuestos = 0;
    let totalDescuentos = 0;

    items.forEach((item) => {
      const subtotalItem = item.cantidad * item.precioUnitario;
      const descuentoItem = (subtotalItem * item.descuento) / 100;
      const subtotalConDescuento = subtotalItem - descuentoItem;
      const impuestoItem = (subtotalConDescuento * item.impuesto) / 100;

      subtotal += subtotalConDescuento;
      totalImpuestos += impuestoItem;
      totalDescuentos += descuentoItem;
    });

    const total = subtotal + totalImpuestos;

    return { subtotal, totalImpuestos, totalDescuentos, total };
  };

  const actualizarItem = (index: number, campo: keyof ItemFacturaEditable, valor: any) => {
    const nuevosItems = [...factura.items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };

    // Recalcular total del ítem
    const item = nuevosItems[index];
    const subtotalItem = item.cantidad * item.precioUnitario;
    const descuentoItem = (subtotalItem * item.descuento) / 100;
    const subtotalConDescuento = subtotalItem - descuentoItem;
    const impuestoItem = (subtotalConDescuento * item.impuesto) / 100;
    nuevosItems[index].totalItem = subtotalConDescuento + impuestoItem;

    const totales = calcularTotales(nuevosItems);
    setFactura({
      ...factura,
      items: nuevosItems,
      subtotal: totales.subtotal,
      totalImpuestos: totales.totalImpuestos,
      totalDescuentos: totales.totalDescuentos,
      total: totales.total,
    });
  };

  const eliminarItem = (index: number) => {
    const nuevosItems = factura.items.filter((_, i) => i !== index);
    const totales = calcularTotales(nuevosItems);
    setFactura({
      ...factura,
      items: nuevosItems,
      subtotal: totales.subtotal,
      totalImpuestos: totales.totalImpuestos,
      totalDescuentos: totales.totalDescuentos,
      total: totales.total,
    });
  };

  const agregarItem = () => {
    const nuevoItem: ItemFacturaEditable = {
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      impuesto: 21, // IVA por defecto
      totalItem: 0,
    };
    const nuevosItems = [...factura.items, nuevoItem];
    setFactura({
      ...factura,
      items: nuevosItems,
    });
  };

  const agregarTratamiento = (tratamiento: TratamientoBusqueda) => {
    const nuevoItem: ItemFacturaEditable = {
      tratamiento: {
        _id: tratamiento._id,
        nombre: tratamiento.nombre,
      },
      descripcion: tratamiento.descripcion || tratamiento.nombre,
      cantidad: 1,
      precioUnitario: tratamiento.precio,
      descuento: 0,
      impuesto: 21, // IVA por defecto
      totalItem: tratamiento.precio * 1.21,
    };
    const nuevosItems = [...factura.items, nuevoItem];
    const totales = calcularTotales(nuevosItems);
    setFactura({
      ...factura,
      items: nuevosItems,
      subtotal: totales.subtotal,
      totalImpuestos: totales.totalImpuestos,
      totalDescuentos: totales.totalDescuentos,
      total: totales.total,
    });
  };

  const handleGuardar = async () => {
    if (!esEditable) {
      setError('Esta factura no se puede editar porque ya está pagada o anulada');
      return;
    }

    if (factura.items.length === 0) {
      setError('La factura debe tener al menos un ítem');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const facturaActualizada = await actualizarFactura(factura._id, {
        items: factura.items.map((item) => ({
          tratamiento: item.tratamiento?._id,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          descuento: item.descuento,
          impuesto: item.impuesto,
        })),
        fechaEmision: factura.fechaEmision,
        fechaVencimiento: factura.fechaVencimiento,
        notas: factura.notas,
      });

      onGuardar(facturaActualizada);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  // Convertir items para ResumenTotalesFactura
  const conceptosParaResumen: ConceptoFactura[] = factura.items.map((item, index) => ({
    id: item._id || `temp-${index}`,
    descripcion: item.descripcion,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
    tipoImpuesto: 'IVA',
    porcentajeImpuesto: item.impuesto,
    descuento: item.descuento,
    total: item.totalItem,
  }));

  return (
    <div className="space-y-6">
      {/* Alerta si no es editable */}
      {!esEditable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Factura no editable</p>
            <p className="text-sm text-yellow-700 mt-1">
              Esta factura está en estado "{factura.estado}" y no se puede editar.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Cabecera */}
      <CabeceraFacturaEditable
        factura={factura}
        onFechaEmisionChange={(fecha) =>
          setFactura({ ...factura, fechaEmision: new Date(fecha).toISOString() })
        }
        onFechaVencimientoChange={(fecha) =>
          setFactura({ ...factura, fechaVencimiento: new Date(fecha).toISOString() })
        }
        readonly={!esEditable}
      />

      {/* Lista de ítems */}
      <ListaItemsFacturaEditable
        items={factura.items}
        onUpdate={actualizarItem}
        onDelete={eliminarItem}
        onAdd={() => setMostrarModalBusqueda(true)}
        readonly={!esEditable}
      />

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
            <textarea
              value={factura.notas || ''}
              onChange={(e) => setFactura({ ...factura, notas: e.target.value })}
              disabled={!esEditable}
              className="w-full h-32 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="Notas adicionales sobre la factura..."
            />
          </div>
        </div>
        <div>
          <ResumenTotalesFactura conceptos={conceptosParaResumen} />
        </div>
      </div>

      {/* Historial de cambios */}
      {factura.historialCambios && factura.historialCambios.length > 0 && (
        <HistorialCambiosFactura historial={factura.historialCambios} />
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={onCancelar}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200"
        >
          <X size={20} />
          <span>Cancelar</span>
        </button>
        {esEditable && (
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Modal de búsqueda de tratamientos */}
      <ModalBusquedaTratamientos
        isOpen={mostrarModalBusqueda}
        onClose={() => setMostrarModalBusqueda(false)}
        onSelect={agregarTratamiento}
      />
    </div>
  );
}



