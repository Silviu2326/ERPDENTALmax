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
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Concepto</span>
          </button>
        )}
      </div>

      {/* Formulario para agregar nuevo concepto */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <input
                type="text"
                value={nuevoConcepto.descripcion || ''}
                onChange={(e) =>
                  setNuevoConcepto({ ...nuevoConcepto, descripcion: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción del concepto"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo IVA
              </label>
              <select
                value={nuevoConcepto.tipoImpuesto || ''}
                onChange={(e) => handleTipoImpuestoChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {tiposImpuesto.map((tipo) => (
                  <option key={tipo.tipo} value={tipo.tipo}>
                    {tipo.descripcion} ({tipo.porcentaje}%)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleAgregarConcepto}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
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
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de conceptos */}
      {conceptos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay conceptos agregados. Haz clic en "Agregar Concepto" para comenzar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Precio Unitario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Descuento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  IVA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editConcepto?.tipoImpuesto || ''}
                          onChange={(e) => handleTipoImpuestoChange(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {tiposImpuesto.map((tipo) => (
                            <option key={tipo.tipo} value={tipo.tipo}>
                              {tipo.porcentaje}%
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {calcularTotal(editConcepto).toFixed(2)} €
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={handleGuardarEdicion}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelarEdicion}
                            className="text-red-600 hover:text-red-800 text-sm"
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
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditar(concepto)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEliminar(concepto.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
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


