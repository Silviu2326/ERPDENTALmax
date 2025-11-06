import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Promocion, crearPromocion, actualizarPromocion } from '../api/promocionesApi';
import SelectorTratamientosProductos from './SelectorTratamientosProductos';

interface FormularioPromocionProps {
  promocion?: Promocion;
  onGuardar: () => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function FormularioPromocion({
  promocion,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioPromocionProps) {
  const [formData, setFormData] = useState({
    nombre: promocion?.nombre || '',
    descripcion: promocion?.descripcion || '',
    tipo: promocion?.tipo || 'porcentaje' as 'porcentaje' | 'fijo' | '2x1' | 'paquete',
    valor: promocion?.valor || 0,
    fechaInicio: promocion?.fechaInicio ? promocion.fechaInicio.split('T')[0] : '',
    fechaFin: promocion?.fechaFin ? promocion.fechaFin.split('T')[0] : '',
    codigo: promocion?.codigo || '',
    condiciones: promocion?.condiciones || '',
    estado: promocion?.estado || 'activa' as 'activa' | 'inactiva' | 'expirada',
    usosMaximos: promocion?.usosMaximos || undefined,
    soloNuevosPacientes: promocion?.soloNuevosPacientes || false,
  });

  const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<string[]>(
    promocion?.tratamientosAplicables?.map(t => t._id) || []
  );
  const [productosSeleccionados, setProductosSeleccionados] = useState<string[]>(
    promocion?.productosAplicables?.map(p => p._id) || []
  );

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (formData.valor < 0) {
      nuevosErrores.valor = 'El valor no puede ser negativo';
    }

    if (formData.tipo === 'porcentaje' && formData.valor > 100) {
      nuevosErrores.valor = 'El porcentaje no puede ser mayor a 100%';
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

    if (formData.usosMaximos !== undefined && formData.usosMaximos < 1) {
      nuevosErrores.usosMaximos = 'Los usos máximos deben ser al menos 1';
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

    setSaving(true);

    try {
      const datosPromocion: Omit<Promocion, '_id' | 'createdAt' | 'updatedAt' | 'usosActuales'> = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        tipo: formData.tipo,
        valor: formData.valor,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
        codigo: formData.codigo.trim() || undefined,
        condiciones: formData.condiciones.trim() || undefined,
        estado: formData.estado,
        usosMaximos: formData.usosMaximos,
        soloNuevosPacientes: formData.soloNuevosPacientes,
        tratamientosAplicables: tratamientosSeleccionados.map(id => ({ _id: id, nombre: '' })),
        productosAplicables: productosSeleccionados.map(id => ({ _id: id, nombre: '' })),
      };

      if (promocion?._id) {
        await actualizarPromocion(promocion._id, datosPromocion);
      } else {
        await crearPromocion(datosPromocion);
      }

      onGuardar();
    } catch (error: any) {
      setErrorGeneral(error.message || 'Error al guardar la promoción');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));

    if (errores[name]) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[name];
        return nuevos;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorGeneral && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorGeneral}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errores.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Descuento Verano 2024"
          />
          {errores.nombre && (
            <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo <span className="text-red-500">*</span>
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errores.tipo ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="porcentaje">Porcentaje</option>
            <option value="fijo">Monto Fijo</option>
            <option value="2x1">2x1</option>
            <option value="paquete">Paquete</option>
          </select>
          {errores.tipo && (
            <p className="mt-1 text-sm text-red-600">{errores.tipo}</p>
          )}
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            min="0"
            step={formData.tipo === 'porcentaje' ? '1' : '0.01'}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errores.valor ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={formData.tipo === 'porcentaje' ? '15' : '50.00'}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.tipo === 'porcentaje' ? 'Porcentaje de descuento (0-100)' : 'Monto fijo en euros'}
          </p>
          {errores.valor && (
            <p className="mt-1 text-sm text-red-600">{errores.valor}</p>
          )}
        </div>

        {/* Código promocional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Promocional (opcional)
          </label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="VERANO2024"
          />
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errores.fechaInicio ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errores.fechaInicio && (
            <p className="mt-1 text-sm text-red-600">{errores.fechaInicio}</p>
          )}
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Fin <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errores.fechaFin ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errores.fechaFin && (
            <p className="mt-1 text-sm text-red-600">{errores.fechaFin}</p>
          )}
        </div>

        {/* Usos Máximos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usos Máximos (opcional)
          </label>
          <input
            type="number"
            name="usosMaximos"
            value={formData.usosMaximos || ''}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errores.usosMaximos ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Sin límite"
          />
          {errores.usosMaximos && (
            <p className="mt-1 text-sm text-red-600">{errores.usosMaximos}</p>
          )}
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
            <option value="expirada">Expirada</option>
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errores.descripcion ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Descripción detallada de la promoción..."
        />
        {errores.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errores.descripcion}</p>
        )}
      </div>

      {/* Condiciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condiciones Adicionales (opcional)
        </label>
        <textarea
          name="condiciones"
          value={formData.condiciones}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Condiciones especiales, restricciones, etc."
        />
      </div>

      {/* Solo nuevos pacientes */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="soloNuevosPacientes"
          checked={formData.soloNuevosPacientes}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm font-medium text-gray-700">
          Solo aplicable para nuevos pacientes
        </label>
      </div>

      {/* Selector de tratamientos y productos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tratamientos y Productos Aplicables
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Si no selecciona ninguno, la promoción aplicará a todos los tratamientos y productos
        </p>
        <SelectorTratamientosProductos
          tratamientosSeleccionados={tratamientosSeleccionados}
          productosSeleccionados={productosSeleccionados}
          onTratamientoSeleccionado={(id) => setTratamientosSeleccionados([...tratamientosSeleccionados, id])}
          onTratamientoEliminado={(id) => setTratamientosSeleccionados(tratamientosSeleccionados.filter(t => t !== id))}
          onProductoSeleccionado={(id) => setProductosSeleccionados([...productosSeleccionados, id])}
          onProductoEliminado={(id) => setProductosSeleccionados(productosSeleccionados.filter(p => p !== id))}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancelar}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          <X className="w-4 h-4 inline mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 inline mr-2" />
          {saving ? 'Guardando...' : promocion ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}


