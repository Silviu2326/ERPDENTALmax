import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Calculator, Loader2 } from 'lucide-react';
import SelectorLaboratorio from './SelectorLaboratorio';
import BuscadorTrabajosLaboratorio from './BuscadorTrabajosLaboratorio';
import { FacturaLaboratorio, NuevaFacturaLaboratorio, TrabajoLaboratorio } from '../api/facturacionLaboratorioApi';
import { obtenerLaboratorios, Laboratorio } from '../api/laboratoriosApi';

interface FormularioFacturaLaboratorioProps {
  factura?: FacturaLaboratorio;
  onGuardar: (factura: NuevaFacturaLaboratorio) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

interface ItemFactura {
  descripcion: string;
  trabajoId: string;
  trabajo?: TrabajoLaboratorio;
  precioUnitario: number;
  cantidad: number;
}

export default function FormularioFacturaLaboratorio({
  factura,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioFacturaLaboratorioProps) {
  const [numeroFactura, setNumeroFactura] = useState(factura?.numeroFactura || '');
  const [laboratorio, setLaboratorio] = useState<Laboratorio | null>(
    factura?.laboratorio ? {
      _id: factura.laboratorio._id,
      nombre: factura.laboratorio.nombre,
      cif: factura.laboratorio.cif,
      direccion: factura.laboratorio.direccion,
      personaContacto: factura.laboratorio.contacto?.nombre,
      email: factura.laboratorio.contacto?.email,
      telefono: factura.laboratorio.contacto?.telefono,
    } : null
  );
  const [fechaEmision, setFechaEmision] = useState(
    factura?.fechaEmision
      ? new Date(factura.fechaEmision).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [fechaVencimiento, setFechaVencimiento] = useState(
    factura?.fechaVencimiento
      ? new Date(factura.fechaVencimiento).toISOString().split('T')[0]
      : ''
  );
  const [trabajosSeleccionados, setTrabajosSeleccionados] = useState<TrabajoLaboratorio[]>([]);
  const [items, setItems] = useState<ItemFactura[]>([]);
  const [impuestosPorcentaje, setImpuestosPorcentaje] = useState(21); // IVA por defecto
  const [notas, setNotas] = useState(factura?.notas || '');
  const [error, setError] = useState<string | null>(null);

  // Inicializar items desde factura existente
  useEffect(() => {
    if (factura && factura.items) {
      const itemsIniciales: ItemFactura[] = factura.items.map((item) => ({
        descripcion: item.descripcion,
        trabajoId: item.trabajo._id,
        trabajo: item.trabajo as any,
        precioUnitario: item.precioUnitario,
        cantidad: item.cantidad,
      }));
      setItems(itemsIniciales);
    }
  }, [factura]);

  // Cuando se seleccionan trabajos, crear items automáticamente
  useEffect(() => {
    if (trabajosSeleccionados.length > 0) {
      const nuevosItems: ItemFactura[] = trabajosSeleccionados.map((trabajo) => ({
        descripcion: `Trabajo de laboratorio - ${trabajo.tratamiento.nombre}`,
        trabajoId: trabajo._id,
        trabajo,
        precioUnitario: trabajo.coste,
        cantidad: 1,
      }));
      setItems(nuevosItems);
    }
  }, [trabajosSeleccionados]);

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
  };

  const calcularImpuestos = () => {
    const subtotal = calcularSubtotal();
    return (subtotal * impuestosPorcentaje) / 100;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularImpuestos();
  };

  const handleAgregarItem = () => {
    setItems([
      ...items,
      {
        descripcion: '',
        trabajoId: '',
        precioUnitario: 0,
        cantidad: 1,
      },
    ]);
  };

  const handleEliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleActualizarItem = (index: number, campo: keyof ItemFactura, valor: any) => {
    const nuevosItems = [...items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
    setItems(nuevosItems);
  };

  const handleGuardar = async () => {
    setError(null);

    if (!numeroFactura.trim()) {
      setError('El número de factura es obligatorio');
      return;
    }

    if (!laboratorio) {
      setError('Debe seleccionar un laboratorio');
      return;
    }

    if (!fechaEmision) {
      setError('La fecha de emisión es obligatoria');
      return;
    }

    if (!fechaVencimiento) {
      setError('La fecha de vencimiento es obligatoria');
      return;
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un ítem a la factura');
      return;
    }

    // Validar que todos los items tengan los datos necesarios
    for (const item of items) {
      if (!item.descripcion.trim()) {
        setError('Todos los ítems deben tener una descripción');
        return;
      }
      if (!item.trabajoId) {
        setError('Todos los ítems deben estar asociados a un trabajo');
        return;
      }
      if (item.precioUnitario <= 0) {
        setError('Todos los ítems deben tener un precio válido');
        return;
      }
      if (item.cantidad <= 0) {
        setError('Todos los ítems deben tener una cantidad válida');
        return;
      }
    }

    const subtotal = calcularSubtotal();
    const impuestos = calcularImpuestos();
    const total = calcularTotal();

    const nuevaFactura: NuevaFacturaLaboratorio = {
      numeroFactura: numeroFactura.trim(),
      laboratorioId: laboratorio._id,
      fechaEmision,
      fechaVencimiento,
      items: items.map((item) => ({
        descripcion: item.descripcion,
        trabajoId: item.trabajoId,
        precioUnitario: item.precioUnitario,
        cantidad: item.cantidad,
      })),
      subtotal,
      impuestos,
      total,
      notas: notas.trim() || undefined,
    };

    try {
      await onGuardar(nuevaFactura);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la factura');
    }
  };

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {factura ? 'Editar Factura de Laboratorio' : 'Nueva Factura de Laboratorio'}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Número de Factura <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Ej: FACT-2024-001"
              required
            />
          </div>

          <div>
            <SelectorLaboratorio
              laboratorioSeleccionado={laboratorio}
              onLaboratorioSeleccionado={setLaboratorio}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Emisión <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Vencimiento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              min={fechaEmision}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              required
            />
          </div>
        </div>

        {/* Buscador de Trabajos */}
        {laboratorio && (
          <div>
            <BuscadorTrabajosLaboratorio
              laboratorioId={laboratorio._id}
              trabajosSeleccionados={trabajosSeleccionados}
              onTrabajosSeleccionados={setTrabajosSeleccionados}
            />
          </div>
        )}

        {/* Items de Factura */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ítems de la Factura</h3>
            <button
              type="button"
              onClick={handleAgregarItem}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} />
              <span>Agregar Ítem</span>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl ring-1 ring-slate-200">
              <p className="text-gray-600">No hay ítems en la factura</p>
              <p className="text-sm text-gray-500 mt-1">
                {laboratorio
                  ? 'Selecciona trabajos o agrega ítems manualmente'
                  : 'Selecciona un laboratorio primero'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={item.descripcion}
                        onChange={(e) =>
                          handleActualizarItem(index, 'descripcion', e.target.value)
                        }
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                        placeholder="Descripción del trabajo"
                      />
                      {item.trabajo && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.trabajo.paciente.nombre} {item.trabajo.paciente.apellidos} -{' '}
                          {item.trabajo.tratamiento.nombre}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleActualizarItem(index, 'cantidad', parseInt(e.target.value) || 1)
                        }
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Precio Unitario
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precioUnitario}
                        onChange={(e) =>
                          handleActualizarItem(
                            index,
                            'precioUnitario',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Total
                      </label>
                      <div className="px-3 py-2.5 bg-white ring-1 ring-slate-300 rounded-xl text-sm font-semibold text-gray-900">
                        {formatearMoneda(item.precioUnitario * item.cantidad)}
                      </div>
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => handleEliminarItem(index)}
                        className="w-full px-3 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center"
                        title="Eliminar ítem"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Impuestos y Totales */}
        <div className="bg-slate-50 rounded-xl ring-1 ring-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                % Impuestos (IVA)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={impuestosPorcentaje}
                onChange={(e) => setImpuestosPorcentaje(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{formatearMoneda(calcularSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Impuestos ({impuestosPorcentaje}%):</span>
                <span className="text-gray-900">{formatearMoneda(calcularImpuestos())}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600">{formatearMoneda(calcularTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            placeholder="Notas adicionales sobre la factura..."
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancelar}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
            <span>Cancelar</span>
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Guardar Factura</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



