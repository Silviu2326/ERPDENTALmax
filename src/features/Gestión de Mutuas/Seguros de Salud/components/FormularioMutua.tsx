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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {mutua ? 'Editar Mutua/Seguro' : 'Nueva Mutua/Seguro'}
              </h2>
            </div>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errorGeneral && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{errorGeneral}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Sección: Datos básicos */}
            <div className="bg-slate-50 rounded-2xl ring-1 ring-slate-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Datos Básicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre Comercial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombreComercial}
                    onChange={(e) => updateField('nombreComercial', e.target.value)}
                    className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 ${
                      errores.nombreComercial ? 'ring-red-500' : 'ring-slate-300'
                    }`}
                    placeholder="Ej: Sanitas, Adeslas..."
                  />
                  {errores.nombreComercial && (
                    <p className="mt-1 text-sm text-red-600">{errores.nombreComercial}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={formData.razonSocial || ''}
                    onChange={(e) => updateField('razonSocial', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Razón social completa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CIF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cif}
                    onChange={(e) => updateField('cif', e.target.value.toUpperCase())}
                    className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 font-mono ${
                      errores.cif ? 'ring-red-500' : 'ring-slate-300'
                    }`}
                    placeholder="A12345678"
                    maxLength={9}
                  />
                  {errores.cif && (
                    <p className="mt-1 text-sm text-red-600">{errores.cif}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.activo ? 'activo' : 'inactivo'}
                    onChange={(e) => updateField('activo', e.target.value === 'activo')}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  >
                    <option value="activo">Activa</option>
                    <option value="inactivo">Inactiva</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Dirección */}
            <div className="bg-slate-50 rounded-2xl ring-1 ring-slate-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Dirección
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Calle y Número
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.calle || ''}
                    onChange={(e) => updateField('direccion.calle', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Calle y número"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.ciudad || ''}
                    onChange={(e) => updateField('direccion.ciudad', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.codigoPostal || ''}
                    onChange={(e) => updateField('direccion.codigoPostal', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="28001"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.provincia || ''}
                    onChange={(e) => updateField('direccion.provincia', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Madrid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.direccion?.pais || ''}
                    onChange={(e) => updateField('direccion.pais', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="España"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Contacto */}
            <div className="bg-slate-50 rounded-2xl ring-1 ring-slate-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone size={20} />
                Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Phone size={16} className="inline mr-1" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.contacto?.telefono || ''}
                    onChange={(e) => updateField('contacto.telefono', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="912345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contacto?.email || ''}
                    onChange={(e) => updateField('contacto.email', e.target.value)}
                    className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 ${
                      errores['contacto.email'] ? 'ring-red-500' : 'ring-slate-300'
                    }`}
                    placeholder="contacto@mutua.es"
                  />
                  {errores['contacto.email'] && (
                    <p className="mt-1 text-sm text-red-600">{errores['contacto.email']}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.contacto?.personaContacto || ''}
                    onChange={(e) => updateField('contacto.personaContacto', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Nombre del contacto principal"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Condiciones Generales */}
            <div className="bg-slate-50 rounded-2xl ring-1 ring-slate-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Condiciones Generales
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notas y Condiciones
                </label>
                <textarea
                  value={formData.condicionesGenerales || ''}
                  onChange={(e) => updateField('condicionesGenerales', e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
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
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
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



