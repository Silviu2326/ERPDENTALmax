import { useState, useEffect } from 'react';
import { Save, X, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Convenio, NuevoConvenio, Cobertura, Tratamiento, obtenerMutuas, Mutua } from '../api/conveniosApi';
import SelectorTratamientos from './SelectorTratamientos';
import DetalleCoberturaConvenio from './DetalleCoberturaConvenio';

interface ConvenioFormModalProps {
  convenio?: Convenio | null;
  onGuardar: (convenio: NuevoConvenio) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function ConvenioFormModal({
  convenio,
  onGuardar,
  onCancelar,
  loading = false,
}: ConvenioFormModalProps) {
  const [formData, setFormData] = useState<NuevoConvenio>({
    mutua: '',
    nombre: '',
    codigo: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estado: 'borrador',
    notas: '',
    coberturas: [],
  });

  const [mutuas, setMutuas] = useState<Mutua[]>([]);
  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<string[]>([]);
  const [coberturaEditando, setCoberturaEditando] = useState<Cobertura | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  useEffect(() => {
    cargarMutuas();
  }, []);

  useEffect(() => {
    if (convenio) {
      setFormData({
        mutua: typeof convenio.mutua === 'object' ? convenio.mutua._id : convenio.mutua,
        nombre: convenio.nombre || '',
        codigo: convenio.codigo || '',
        fechaInicio: typeof convenio.fechaInicio === 'string' 
          ? convenio.fechaInicio.split('T')[0] 
          : new Date(convenio.fechaInicio).toISOString().split('T')[0],
        fechaFin: typeof convenio.fechaFin === 'string' 
          ? convenio.fechaFin.split('T')[0] 
          : new Date(convenio.fechaFin).toISOString().split('T')[0],
        estado: convenio.estado || 'borrador',
        notas: convenio.notas || '',
        coberturas: convenio.coberturas || [],
      });
      setTratamientosSeleccionados(
        convenio.coberturas?.map((c) => 
          typeof c.tratamiento === 'string' ? c.tratamiento : c.tratamiento._id
        ) || []
      );
    }
  }, [convenio]);

  const cargarMutuas = async () => {
    try {
      const { obtenerMutuas: obtenerMutuasApi } = await import('../api/mutuasApi');
      const respuesta = await obtenerMutuasApi({ limit: 1000 });
      setMutuas(respuesta.data);
    } catch (error) {
      console.error('Error al cargar mutuas:', error);
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.mutua) {
      nuevosErrores.mutua = 'Debes seleccionar una mutua';
    }

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formData.codigo.trim()) {
      nuevosErrores.codigo = 'El código es obligatorio';
    }

    if (!formData.fechaInicio) {
      nuevosErrores.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fechaFin) {
      nuevosErrores.fechaFin = 'La fecha de fin es obligatoria';
    }

    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      if (fin < inicio) {
        nuevosErrores.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validarFormulario()) {
      setErrorGeneral('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      await onGuardar(formData);
    } catch (err) {
      setErrorGeneral(err instanceof Error ? err.message : 'Error al guardar el convenio');
    }
  };

  const handleTratamientoSeleccionado = (tratamientoId: string) => {
    if (!tratamientosSeleccionados.includes(tratamientoId)) {
      setTratamientosSeleccionados([...tratamientosSeleccionados, tratamientoId]);
      setCoberturaEditando({
        tratamiento: tratamientoId,
        tipo: 'porcentaje',
        valor: 0,
        notas_cobertura: '',
      });
    }
  };

  const handleTratamientoEliminado = (tratamientoId: string) => {
    setTratamientosSeleccionados(tratamientosSeleccionados.filter((id) => id !== tratamientoId));
    setFormData({
      ...formData,
      coberturas: formData.coberturas.filter((c) => {
        const id = typeof c.tratamiento === 'string' ? c.tratamiento : c.tratamiento._id;
        return id !== tratamientoId;
      }),
    });
  };

  const handleGuardarCobertura = () => {
    if (!coberturaEditando) return;

    const tratamientoId = typeof coberturaEditando.tratamiento === 'string' 
      ? coberturaEditando.tratamiento 
      : coberturaEditando.tratamiento._id;

    const coberturaExistente = formData.coberturas.findIndex((c) => {
      const id = typeof c.tratamiento === 'string' ? c.tratamiento : c.tratamiento._id;
      return id === tratamientoId;
    });

    const nuevaCobertura: Cobertura = {
      ...coberturaEditando,
      tratamiento: tratamientoId,
    };

    if (coberturaExistente >= 0) {
      const nuevasCoberturas = [...formData.coberturas];
      nuevasCoberturas[coberturaExistente] = nuevaCobertura;
      setFormData({ ...formData, coberturas: nuevasCoberturas });
    } else {
      setFormData({
        ...formData,
        coberturas: [...formData.coberturas, nuevaCobertura],
      });
    }

    setCoberturaEditando(null);
  };

  const handleEliminarCobertura = (coberturaId: string) => {
    setFormData({
      ...formData,
      coberturas: formData.coberturas.filter((c) => c._id !== coberturaId),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {convenio ? 'Editar Convenio' : 'Nuevo Convenio'}
          </h2>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorGeneral && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorGeneral}</span>
            </div>
          )}

          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mutua <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.mutua}
                onChange={(e) => setFormData({ ...formData, mutua: e.target.value })}
                className={`w-full rounded-xl bg-white text-slate-900 ring-1 ${
                  errores.mutua ? 'ring-red-500' : 'ring-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5`}
                disabled={loading}
              >
                <option value="">Seleccionar mutua...</option>
                {mutuas.map((mutua) => (
                  <option key={mutua._id} value={mutua._id}>
                    {mutua.nombreComercial}
                  </option>
                ))}
              </select>
              {errores.mutua && (
                <p className="mt-1 text-sm text-red-600">{errores.mutua}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estado: e.target.value as 'activo' | 'inactivo' | 'borrador',
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                disabled={loading}
              >
                <option value="borrador">Borrador</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                  errores.nombre ? 'ring-red-500' : 'ring-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5`}
                disabled={loading}
              />
              {errores.nombre && (
                <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                  errores.codigo ? 'ring-red-500' : 'ring-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5`}
                disabled={loading}
              />
              {errores.codigo && (
                <p className="mt-1 text-sm text-red-600">{errores.codigo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className={`w-full rounded-xl bg-white text-slate-900 ring-1 ${
                  errores.fechaInicio ? 'ring-red-500' : 'ring-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5`}
                disabled={loading}
              />
              {errores.fechaInicio && (
                <p className="mt-1 text-sm text-red-600">{errores.fechaInicio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className={`w-full rounded-xl bg-white text-slate-900 ring-1 ${
                  errores.fechaFin ? 'ring-red-500' : 'ring-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5`}
                disabled={loading}
              />
              {errores.fechaFin && (
                <p className="mt-1 text-sm text-red-600">{errores.fechaFin}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notas
            </label>
            <textarea
              value={formData.notas || ''}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={3}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              disabled={loading}
            />
          </div>

          {/* Coberturas */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Coberturas de Tratamientos</h3>
            </div>

            <SelectorTratamientos
              tratamientosSeleccionados={tratamientosSeleccionados}
              onTratamientoSeleccionado={handleTratamientoSeleccionado}
              onTratamientoEliminado={handleTratamientoEliminado}
              disabled={loading}
            />

            {/* Formulario de cobertura */}
            {coberturaEditando && (
              <div className="mt-4 p-4 rounded-2xl bg-white ring-1 ring-slate-200">
                <h4 className="font-semibold text-gray-900 mb-3">Configurar Cobertura</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tipo de Cobertura
                    </label>
                    <select
                      value={coberturaEditando.tipo}
                      onChange={(e) =>
                        setCoberturaEditando({
                          ...coberturaEditando,
                          tipo: e.target.value as 'porcentaje' | 'copago_fijo' | 'tarifa_especial',
                        })
                      }
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    >
                      <option value="porcentaje">Porcentaje</option>
                      <option value="copago_fijo">Copago Fijo</option>
                      <option value="tarifa_especial">Tarifa Especial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Valor
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={coberturaEditando.valor}
                      onChange={(e) =>
                        setCoberturaEditando({
                          ...coberturaEditando,
                          valor: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleGuardarCobertura}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notas de Cobertura
                  </label>
                  <textarea
                    value={coberturaEditando.notas_cobertura || ''}
                    onChange={(e) =>
                      setCoberturaEditando({
                        ...coberturaEditando,
                        notas_cobertura: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    placeholder="Notas adicionales sobre esta cobertura..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCoberturaEditando(null)}
                  className="mt-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Lista de coberturas guardadas */}
            {formData.coberturas.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Coberturas Configuradas</h4>
                {formData.coberturas.map((cobertura, index) => (
                  <DetalleCoberturaConvenio
                    key={cobertura._id || index}
                    cobertura={cobertura}
                    onEliminar={cobertura._id ? () => handleEliminarCobertura(cobertura._id!) : undefined}
                    onEditar={() => setCoberturaEditando(cobertura)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancelar}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm ring-1 ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Convenio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



