import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { EquipoClinico, NuevoEquipo } from '../api/equiposApi';

interface FormularioEquipoProps {
  equipo?: EquipoClinico | null;
  onGuardar: (equipo: NuevoEquipo) => Promise<void>;
  onCancelar: () => void;
  sedes?: Array<{ _id: string; nombre: string }>;
  proveedores?: Array<{ _id: string; nombre: string }>;
}

export default function FormularioEquipo({
  equipo,
  onGuardar,
  onCancelar,
  sedes = [],
  proveedores = [],
}: FormularioEquipoProps) {
  const [formData, setFormData] = useState<NuevoEquipo>({
    nombre: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    fechaAdquisicion: new Date().toISOString().split('T')[0],
    costo: 0,
    proveedor: undefined,
    ubicacion: {
      sede: sedes.length > 0 ? sedes[0]._id : '',
      gabinete: '',
    },
    estado: 'Operativo',
    fechaUltimoMantenimiento: undefined,
    fechaProximoMantenimiento: undefined,
    garantiaHasta: undefined,
    documentos: [],
    notas: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre: equipo.nombre,
        marca: equipo.marca,
        modelo: equipo.modelo,
        numeroSerie: equipo.numeroSerie,
        fechaAdquisicion: equipo.fechaAdquisicion.split('T')[0],
        costo: equipo.costo,
        proveedor: equipo.proveedor?._id,
        ubicacion: {
          sede: equipo.ubicacion.sede._id,
          gabinete: equipo.ubicacion.gabinete || '',
        },
        estado: equipo.estado,
        fechaUltimoMantenimiento: equipo.fechaUltimoMantenimiento
          ? equipo.fechaUltimoMantenimiento.split('T')[0]
          : undefined,
        fechaProximoMantenimiento: equipo.fechaProximoMantenimiento
          ? equipo.fechaProximoMantenimiento.split('T')[0]
          : undefined,
        garantiaHasta: equipo.garantiaHasta ? equipo.garantiaHasta.split('T')[0] : undefined,
        documentos: equipo.documentos || [],
        notas: equipo.notas || '',
      });
    }
  }, [equipo, sedes]);

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('ubicacion.')) {
      const subField = field.split('.')[1];
      setFormData({
        ...formData,
        ubicacion: {
          ...formData.ubicacion,
          [subField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
    // Limpiar error del campo
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es obligatoria';
    }
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es obligatorio';
    }
    if (!formData.numeroSerie.trim()) {
      newErrors.numeroSerie = 'El número de serie es obligatorio';
    }
    if (!formData.ubicacion.sede) {
      newErrors['ubicacion.sede'] = 'La sede es obligatoria';
    }
    if (formData.costo < 0) {
      newErrors.costo = 'El costo debe ser mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onGuardar(formData);
    } catch (error) {
      console.error('Error al guardar equipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const estados = ['Operativo', 'En Mantenimiento', 'Fuera de Servicio', 'De Baja'];

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {equipo ? 'Editar Equipo' : 'Nuevo Equipo Clínico'}
        </h2>
        <p className="text-gray-600 mt-1">
          {equipo ? 'Modifica los datos del equipo' : 'Completa la información del nuevo equipo'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Básica</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del Equipo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                errors.nombre ? 'ring-red-300 focus:ring-2 focus:ring-red-400' : 'ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
              } px-3 py-2.5`}
              placeholder="Ej: Unidad Dental"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Marca <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) => handleChange('marca', e.target.value)}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                errors.marca ? 'ring-red-300 focus:ring-2 focus:ring-red-400' : 'ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
              } px-3 py-2.5`}
              placeholder="Ej: A-dec"
            />
            {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Modelo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => handleChange('modelo', e.target.value)}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                errors.modelo ? 'ring-red-300 focus:ring-2 focus:ring-red-400' : 'ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
              } px-3 py-2.5`}
              placeholder="Ej: A-dec 300"
            />
            {errors.modelo && <p className="text-red-500 text-xs mt-1">{errors.modelo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Número de Serie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.numeroSerie}
              onChange={(e) => handleChange('numeroSerie', e.target.value)}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 font-mono ${
                errors.numeroSerie ? 'ring-red-300 focus:ring-2 focus:ring-red-400' : 'ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
              } px-3 py-2.5`}
              placeholder="Ej: SN123456789"
            />
            {errors.numeroSerie && <p className="text-red-500 text-xs mt-1">{errors.numeroSerie}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha de Adquisición <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fechaAdquisicion}
              onChange={(e) => handleChange('fechaAdquisicion', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Costo de Adquisición (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.costo}
              onChange={(e) => handleChange('costo', parseFloat(e.target.value) || 0)}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ${
                errors.costo ? 'ring-red-300 focus:ring-2 focus:ring-red-400' : 'ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
              } px-3 py-2.5`}
              placeholder="0.00"
            />
            {errors.costo && <p className="text-red-500 text-xs mt-1">{errors.costo}</p>}
          </div>
        </div>

        {/* Ubicación y Estado */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ubicación y Estado</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sede <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.ubicacion.sede}
              onChange={(e) => handleChange('ubicacion.sede', e.target.value)}
              className={`w-full rounded-xl bg-white text-slate-900 ring-1 ${
                errors['ubicacion.sede'] ? 'ring-red-300 focus:ring-2 focus:ring-red-400' : 'ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
              } px-3 py-2.5`}
            >
              <option value="">Selecciona una sede</option>
              {sedes.map((sede) => (
                <option key={sede._id} value={sede._id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
            {errors['ubicacion.sede'] && (
              <p className="text-red-500 text-xs mt-1">{errors['ubicacion.sede']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gabinete</label>
            <input
              type="text"
              value={formData.ubicacion.gabinete || ''}
              onChange={(e) => handleChange('ubicacion.gabinete', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Ej: Gabinete 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Proveedor</label>
            <select
              value={formData.proveedor || ''}
              onChange={(e) => handleChange('proveedor', e.target.value || undefined)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor._id} value={proveedor._id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mantenimiento y Garantía */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Último Mantenimiento
          </label>
          <input
            type="date"
            value={formData.fechaUltimoMantenimiento || ''}
            onChange={(e) =>
              handleChange('fechaUltimoMantenimiento', e.target.value || undefined)
            }
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Próximo Mantenimiento
          </label>
          <input
            type="date"
            value={formData.fechaProximoMantenimiento || ''}
            onChange={(e) =>
              handleChange('fechaProximoMantenimiento', e.target.value || undefined)
            }
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Garantía hasta</label>
          <input
            type="date"
            value={formData.garantiaHasta || ''}
            onChange={(e) => handleChange('garantiaHasta', e.target.value || undefined)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
      </div>

      {/* Notas */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
        <textarea
          value={formData.notas || ''}
          onChange={(e) => handleChange('notas', e.target.value)}
          rows={4}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          placeholder="Observaciones o notas adicionales sobre el equipo..."
        />
      </div>

      {/* Botones */}
      <div className="mt-6 flex items-center justify-end gap-2 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium inline-flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : equipo ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}



