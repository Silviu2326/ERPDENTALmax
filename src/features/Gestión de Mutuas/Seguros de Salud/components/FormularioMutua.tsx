import { useState, useEffect } from 'react';
import { Save, X, Loader2, AlertCircle, Building2, FileText, MapPin, Phone, Mail, User } from 'lucide-react';
import { Mutua, NuevaMutua } from '../api/mutuasApi';

interface FormularioMutuaProps {
  mutua?: Mutua | null;
  onGuardar: (mutua: NuevaMutua) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function FormularioMutua({
  mutua,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioMutuaProps) {
  const [formData, setFormData] = useState<NuevaMutua>({
    nombreComercial: '',
    razonSocial: '',
    cif: '',
    direccion: {
      calle: '',
      ciudad: '',
      codigoPostal: '',
      provincia: '',
      pais: '',
    },
    contacto: {
      telefono: '',
      email: '',
      personaContacto: '',
    },
    condicionesGenerales: '',
    activo: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  useEffect(() => {
    if (mutua) {
      setFormData({
        nombreComercial: mutua.nombreComercial || '',
        razonSocial: mutua.razonSocial || '',
        cif: mutua.cif || '',
        direccion: mutua.direccion || {
          calle: '',
          ciudad: '',
          codigoPostal: '',
          provincia: '',
          pais: '',
        },
        contacto: mutua.contacto || {
          telefono: '',
          email: '',
          personaContacto: '',
        },
        condicionesGenerales: mutua.condicionesGenerales || '',
        activo: mutua.activo !== undefined ? mutua.activo : true,
      });
    }
  }, [mutua]);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombreComercial.trim()) {
      nuevosErrores.nombreComercial = 'El nombre comercial es obligatorio';
    }

    if (!formData.cif.trim()) {
      nuevosErrores.cif = 'El CIF es obligatorio';
    } else if (!/^[A-Z]{1}[0-9]{8}$|^[0-9]{8}[A-Z]{1}$/i.test(formData.cif.trim())) {
      nuevosErrores.cif = 'El formato del CIF no es válido';
    }

    if (formData.contacto?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contacto.email)) {
      nuevosErrores['contacto.email'] = 'El formato del email no es válido';
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
      const datosEnviar: NuevaMutua = {
        nombreComercial: formData.nombreComercial.trim(),
        razonSocial: formData.razonSocial?.trim() || undefined,
        cif: formData.cif.trim().toUpperCase(),
        direccion: formData.direccion?.calle || formData.direccion?.ciudad || formData.direccion?.codigoPostal || formData.direccion?.provincia || formData.direccion?.pais
          ? {
              calle: formData.direccion?.calle?.trim() || undefined,
              ciudad: formData.direccion?.ciudad?.trim() || undefined,
              codigoPostal: formData.direccion?.codigoPostal?.trim() || undefined,
              provincia: formData.direccion?.provincia?.trim() || undefined,
              pais: formData.direccion?.pais?.trim() || undefined,
            }
          : undefined,
        contacto: formData.contacto?.telefono || formData.contacto?.email || formData.contacto?.personaContacto
          ? {
              telefono: formData.contacto?.telefono?.trim() || undefined,
              email: formData.contacto?.email?.trim() || undefined,
              personaContacto: formData.contacto?.personaContacto?.trim() || undefined,
            }
          : undefined,
        condicionesGenerales: formData.condicionesGenerales?.trim() || undefined,
        activo: formData.activo,
      };

      await onGuardar(datosEnviar);
    } catch (error: any) {
      setErrorGeneral(error.message || 'Error al guardar la mutua');
    }
  };

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof NuevaMutua] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              {mutua ? 'Editar Mutua/Seguro' : 'Nueva Mutua/Seguro'}
            </h2>
            <button
              onClick={onCancelar}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errorGeneral && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorGeneral}</span>
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
                    placeholder="Ej: Sanitas, Adeslas..."
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
                    CIF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cif}
                    onChange={(e) => updateField('cif', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                      errores.cif ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="A12345678"
                    maxLength={9}
                  />
                  {errores.cif && (
                    <p className="mt-1 text-sm text-red-600">{errores.cif}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.activo ? 'activo' : 'inactivo'}
                    onChange={(e) => updateField('activo', e.target.value === 'activo')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="activo">Activa</option>
                    <option value="inactivo">Inactiva</option>
                  </select>
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
                    Calle y Número
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.calle || ''}
                    onChange={(e) => updateField('direccion.calle', e.target.value)}
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
                    onChange={(e) => updateField('direccion.ciudad', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.codigoPostal || ''}
                    onChange={(e) => updateField('direccion.codigoPostal', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="28001"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.provincia || ''}
                    onChange={(e) => updateField('direccion.provincia', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Madrid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.pais || ''}
                    onChange={(e) => updateField('direccion.pais', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="España"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Contacto */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.contacto?.telefono || ''}
                    onChange={(e) => updateField('contacto.telefono', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="912345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contacto?.email || ''}
                    onChange={(e) => updateField('contacto.email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores['contacto.email'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contacto@mutua.es"
                  />
                  {errores['contacto.email'] && (
                    <p className="mt-1 text-sm text-red-600">{errores['contacto.email']}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.contacto?.personaContacto || ''}
                    onChange={(e) => updateField('contacto.personaContacto', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del contacto principal"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Condiciones Generales */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Condiciones Generales
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas y Condiciones
                </label>
                <textarea
                  value={formData.condicionesGenerales || ''}
                  onChange={(e) => updateField('condicionesGenerales', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Información sobre condiciones de cobertura, porcentajes, topes anuales, etc."
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


