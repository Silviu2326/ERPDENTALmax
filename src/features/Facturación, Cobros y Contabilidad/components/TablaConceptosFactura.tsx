import { useState } from 'react';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import { ConceptoFactura } from '../api/facturacionApi';

interface TablaConceptosFacturaProps {
  conceptos: ConceptoFactura[];
  onConceptosChange: (conceptos: ConceptoFactura[]) => void;
  tiposImpuesto: Array<{ tipo: string; porcentaje: number; descripcion: string }>;
}

export default function TablaConceptosFactura({
  conceptos,
  onConceptosChange,
  tiposImpuesto,
}: TablaConceptosFacturaProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editConcepto, setEditConcepto] = useState<Partial<ConceptoFactura> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevoConcepto, setNuevoConcepto] = useState<Partial<ConceptoFactura>>({
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    tipoImpuesto: tiposImpuesto[0]?.tipo || '',
    porcentajeImpuesto: tiposImpuesto[0]?.porcentaje || 0,
    descuento: 0,
  });

  const calcularTotal = (concepto: Partial<ConceptoFactura>): number => {
    const cantidad = concepto.cantidad || 0;
    const precioUnitario = concepto.precioUnitario || 0;
    const descuento = concepto.descuento || 0;
    const subtotal = cantidad * precioUnitario;
    const subtotalConDescuento = subtotal - (subtotal * descuento) / 100;
    const impuesto = (subtotalConDescuento * (concepto.porcentajeImpuesto || 0)) / 100;
    return subtotalConDescuento + impuesto;
  };

  const handleEliminar = (id: string) => {
    onConceptosChange(conceptos.filter((c) => c.id !== id));
  };

  const handleEditar = (concepto: ConceptoFactura) => {
    setEditingId(concepto.id);
    setEditConcepto({ ...concepto });
  };

  const handleGuardarEdicion = () => {
    if (!editingId || !editConcepto) return;

    const conceptoActualizado: ConceptoFactura = {
      ...editConcepto as ConceptoFactura,
      id: editingId,
      total: calcularTotal(editConcepto),
    };

    onConceptosChange(
      conceptos.map((c) => (c.id === editingId ? conceptoActualizado : c))
    );
    setEditingId(null);
    setEditConcepto(null);
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
    setEditConcepto(null);
  };

  const handleAgregarConcepto = () => {
    if (!nuevoConcepto.descripcion || !nuevoConcepto.precioUnitario) {
      return;
    }

    const concepto: ConceptoFactura = {
      id: `temp-${Date.now()}`,
      descripcion: nuevoConcepto.descripcion || '',
      cantidad: nuevoConcepto.cantidad || 1,
      precioUnitario: nuevoConcepto.precioUnitario || 0,
      tipoImpuesto: nuevoConcepto.tipoImpuesto || tiposImpuesto[0]?.tipo || '',
      porcentajeImpuesto: nuevoConcepto.porcentajeImpuesto || tiposImpuesto[0]?.porcentaje || 0,
      descuento: nuevoConcepto.descuento || 0,
      total: calcularTotal(nuevoConcepto),
    };

    onConceptosChange([...conceptos, concepto]);
    setNuevoConcepto({
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      tipoImpuesto: tiposImpuesto[0]?.tipo || '',
      porcentajeImpuesto: tiposImpuesto[0]?.porcentaje || 0,
      descuento: 0,
    });
    setShowAddForm(false);
  };

  const handleTipoImpuestoChange = (tipo: string) => {
    const tipoImpuesto = tiposImpuesto.find((t) => t.tipo === tipo);
    if (tipoImpuesto) {
      if (editingId && editConcepto) {
        setEditConcepto({
          ...editConcepto,
          tipoImpuesto: tipo,
          porcentajeImpuesto: tipoImpuesto.porcentaje,
        });
      } else {
        setNuevoConcepto({
          ...nuevoConcepto,
          tipoImpuesto: tipo,
          porcentajeImpuesto: tipoImpuesto.porcentaje,
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Conceptos de la Factura</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={18} />
            <span>Agregar Concepto</span>
          </button>
        )}
      </div>

      {/* Formulario para agregar nuevo concepto */}
      {showAddForm && (
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción *
              </label>
              <input
                type="text"
                value={nuevoConcepto.descripcion || ''}
                onChange={(e) =>
                  setNuevoConcepto({ ...nuevoConcepto, descripcion: e.target.value })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                placeholder="Descripción del concepto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                min="1"
                value={nuevoConcepto.cantidad || 1}
                onChange={(e) =>
                  setNuevoConcepto({
                    ...nuevoConcepto,
                    cantidad: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Precio Unitario *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={nuevoConcepto.precioUnitario || 0}
                onChange={(e) =>
                  setNuevoConcepto({
                    ...nuevoConcepto,
                    precioUnitario: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo IVA
              </label>
              <select
                value={nuevoConcepto.tipoImpuesto || ''}
                onChange={(e) => handleTipoImpuestoChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              >
                {tiposImpuesto.map((tipo) => (
                  <option key={tipo.tipo} value={tipo.tipo}>
                    {tipo.descripcion} ({tipo.porcentaje}%)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAgregarConcepto}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-sm"
              >
                Agregar
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNuevoConcepto({
                    descripcion: '',
                    cantidad: 1,
                    precioUnitario: 0,
                    tipoImpuesto: tiposImpuesto[0]?.tipo || '',
                    porcentajeImpuesto: tiposImpuesto[0]?.porcentaje || 0,
                    descuento: 0,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de conceptos */}
      {conceptos.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No hay conceptos agregados. Haz clic en "Agregar Concepto" para comenzar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 ring-1 ring-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  IVA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {conceptos.map((concepto) => (
                <tr key={concepto.id} className="hover:bg-gray-50">
                  {editingId === concepto.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editConcepto?.descripcion || ''}
                          onChange={(e) =>
                            setEditConcepto({ ...editConcepto, descripcion: e.target.value })
                          }
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1.5 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={editConcepto?.cantidad || 0}
                          onChange={(e) =>
                            setEditConcepto({
                              ...editConcepto,
                              cantidad: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1.5 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editConcepto?.precioUnitario || 0}
                          onChange={(e) =>
                            setEditConcepto({
                              ...editConcepto,
                              precioUnitario: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1.5 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editConcepto?.descuento || 0}
                          onChange={(e) =>
                            setEditConcepto({
                              ...editConcepto,
                              descuento: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1.5 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editConcepto?.tipoImpuesto || ''}
                          onChange={(e) => handleTipoImpuestoChange(e.target.value)}
                          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1.5 text-sm"
                        >
                          {tiposImpuesto.map((tipo) => (
                            <option key={tipo.tipo} value={tipo.tipo}>
                              {tipo.porcentaje}%
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {calcularTotal(editConcepto).toFixed(2)} €
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={handleGuardarEdicion}
                            className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelarEdicion}
                            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-900">{concepto.descripcion}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{concepto.cantidad}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {concepto.precioUnitario.toFixed(2)} €
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {concepto.descuento ? `${concepto.descuento}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {concepto.porcentajeImpuesto}%
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {concepto.total.toFixed(2)} €
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditar(concepto)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleEliminar(concepto.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



