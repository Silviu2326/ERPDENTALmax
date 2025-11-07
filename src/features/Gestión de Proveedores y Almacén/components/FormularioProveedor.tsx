import { useState, useEffect } from 'react';
import { X, Save, Building2, User, Mail, Phone, MapPin, FileText, Tag } from 'lucide-react';
import { Proveedor, NuevoProveedor } from '../api/proveedoresApi';

interface FormularioProveedorProps {
  proveedor?: Proveedor;
  onGuardar: (proveedor: NuevoProveedor) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

const categoriasComunes = [
  'Material de Ortodoncia',
  'Implantes',
  'Consumibles',
  'Servicios de Laboratorio',
  'Equipamiento',
  'Materiales Estéticos',
  'Anestesia',
  'Otros',
];

export default function FormularioProveedor({
  proveedor,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioProveedorProps) {
  const [formData, setFormData] = useState<NuevoProveedor>({
    nombreComercial: proveedor?.nombreComercial || '',
    razonSocial: proveedor?.razonSocial || '',
    rfc: proveedor?.rfc || '',
    contactoPrincipal: {
      nombre: proveedor?.contactoPrincipal.nombre || '',
      email: proveedor?.contactoPrincipal.email || '',
      telefono: proveedor?.contactoPrincipal.telefono || '',
    },
    direccion: {
      calle: proveedor?.direccion?.calle || '',
      ciudad: proveedor?.direccion?.ciudad || '',
      estado: proveedor?.direccion?.estado || '',
      codigoPostal: proveedor?.direccion?.codigoPostal || '',
    },
    condicionesPago: proveedor?.condicionesPago || '',
    categorias: proveedor?.categorias || [],
    notas: proveedor?.notas || '',
    estado: proveedor?.estado || 'activo',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombreComercial.trim()) {
      nuevosErrores.nombreComercial = 'El nombre comercial es obligatorio';
    }

    if (!formData.contactoPrincipal.nombre.trim()) {
      nuevosErrores['contactoPrincipal.nombre'] = 'El nombre del contacto es obligatorio';
    }

    if (formData.contactoPrincipal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactoPrincipal.email)) {
      nuevosErrores['contactoPrincipal.email'] = 'El formato del email no es válido';
    }

    if (formData.rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(formData.rfc.trim())) {
      nuevosErrores.rfc = 'El formato del RFC no es válido';
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
    } catch (error: any) {
      setErrorGeneral(error.message || 'Error al guardar el proveedor');
    }
  };

  const updateField = (field: string, value: any) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0] as keyof NuevoProveedor] as any),
          [keys[1]]: value,
        },
      }));
    }
    // Limpiar error del campo
    if (errores[field]) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos[field];
        return nuevos;
      });
    }
  };

  const handleDireccionChange = (campo: string, valor: string) => {
    setFormData((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion!,
        [campo]: valor,
      },
    }));
  };

  const toggleCategoria = (categoria: string) => {
    setFormData((prev) => {
      const categorias = prev.categorias || [];
      if (categorias.includes(categoria)) {
        return {
          ...prev,
          categorias: categorias.filter((c) => c !== categoria),
        };
      } else {
        return {
          ...prev,
          categorias: [...categorias, categoria],
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h2>
          <button
            onClick={onCancelar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errorGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errorGeneral}
            </div>
          )}

          <div className="space-y-6">
            {/* Sección: Datos básicos */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Datos Básicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Comercial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombreComercial}
                    onChange={(e) => updateField('nombreComercial', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.nombreComercial ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Proveedor XYZ"
                  />
                  {errores.nombreComercial && (
                    <p className="mt-1 text-sm text-red-600">{errores.nombreComercial}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={formData.razonSocial || ''}
                    onChange={(e) => updateField('razonSocial', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Razón social completa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RFC
                  </label>
                  <input
                    type="text"
                    value={formData.rfc || ''}
                    onChange={(e) => updateField('rfc', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.rfc ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: ABC123456789"
                    maxLength={13}
                  />
                  {errores.rfc && (
                    <p className="mt-1 text-sm text-red-600">{errores.rfc}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Contacto Principal */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Contacto Principal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactoPrincipal.nombre}
                    onChange={(e) => updateField('contactoPrincipal.nombre', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores['contactoPrincipal.nombre'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del contacto"
                  />
                  {errores['contactoPrincipal.nombre'] && (
                    <p className="mt-1 text-sm text-red-600">{errores['contactoPrincipal.nombre']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactoPrincipal.email || ''}
                    onChange={(e) => updateField('contactoPrincipal.email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores['contactoPrincipal.email'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@ejemplo.com"
                  />
                  {errores['contactoPrincipal.email'] && (
                    <p className="mt-1 text-sm text-red-600">{errores['contactoPrincipal.email']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.contactoPrincipal.telefono || ''}
                    onChange={(e) => updateField('contactoPrincipal.telefono', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+34 123 456 789"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Dirección */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calle
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.calle || ''}
                    onChange={(e) => handleDireccionChange('calle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Calle y número"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.ciudad || ''}
                    onChange={(e) => handleDireccionChange('ciudad', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ciudad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado/Provincia
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.estado || ''}
                    onChange={(e) => handleDireccionChange('estado', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Estado o provincia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.codigoPostal || ''}
                    onChange={(e) => handleDireccionChange('codigoPostal', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Código postal"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Categorías */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Categorías de Productos
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoriasComunes.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategoria(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.categorias?.includes(cat)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sección: Condiciones y Notas */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condiciones de Pago
                  </label>
                  <input
                    type="text"
                    value={formData.condicionesPago || ''}
                    onChange={(e) => updateField('condicionesPago', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 30 días, contado, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => updateField('estado', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={formData.notas || ''}
                  onChange={(e) => updateField('notas', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notas adicionales sobre el proveedor..."
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



