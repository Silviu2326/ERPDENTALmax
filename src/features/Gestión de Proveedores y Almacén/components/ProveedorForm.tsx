import { useState, useEffect } from 'react';
import { Save, X, Building2, AlertCircle } from 'lucide-react';
import InformacionGeneralSection from './InformacionGeneralSection';
import DatosContactoSection from './DatosContactoSection';
import InformacionFiscalBancariaSection from './InformacionFiscalBancariaSection';
import CategoriasProveedorInput from './CategoriasProveedorInput';
import { Proveedor, NuevoProveedor, verificarCifExistente } from '../api/proveedoresApi';

interface ProveedorFormProps {
  proveedor?: Proveedor;
  onGuardar: (proveedor: NuevoProveedor) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

export default function ProveedorForm({
  proveedor,
  onGuardar,
  onCancelar,
  loading = false,
}: ProveedorFormProps) {
  const [formData, setFormData] = useState<NuevoProveedor>({
    nombreComercial: proveedor?.nombreComercial || '',
    razonSocial: proveedor?.razonSocial || '',
    cifnif: proveedor?.cifnif || proveedor?.rfc || '', // Compatibilidad con RFC existente
    direccion: {
      calle: proveedor?.direccion?.calle || '',
      ciudad: proveedor?.direccion?.ciudad || '',
      codigoPostal: proveedor?.direccion?.codigoPostal || '',
      pais: proveedor?.direccion?.pais || '',
    },
    contactoPrincipal: {
      nombre: proveedor?.contactoPrincipal?.nombre || '',
      email: proveedor?.contactoPrincipal?.email || '',
      telefono: proveedor?.contactoPrincipal?.telefono || '',
    },
    contactosAdicionales: proveedor?.contactosAdicionales || [],
    informacionBancaria: {
      banco: proveedor?.informacionBancaria?.banco || '',
      iban: proveedor?.informacionBancaria?.iban || '',
    },
    categorias: proveedor?.categorias || [],
    notas: proveedor?.notas || '',
    activo: proveedor?.activo !== false,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [cifExiste, setCifExiste] = useState(false);
  const [verificandoCif, setVerificandoCif] = useState(false);

  // Verificar CIF cuando cambia (con debounce)
  useEffect(() => {
    if (!formData.cifnif || formData.cifnif.length < 8) {
      setCifExiste(false);
      return;
    }

    // Si estamos editando y el CIF es el mismo, no verificar
    if (proveedor && proveedor.cifnif === formData.cifnif) {
      setCifExiste(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setVerificandoCif(true);
      try {
        const existe = await verificarCifExistente(formData.cifnif);
        setCifExiste(existe);
      } catch (error) {
        // Error al verificar, no mostrar como duplicado
        setCifExiste(false);
      } finally {
        setVerificandoCif(false);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.cifnif, proveedor]);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombreComercial.trim()) {
      nuevosErrores.nombreComercial = 'El nombre comercial es obligatorio';
    }

    if (!formData.cifnif?.trim()) {
      nuevosErrores.cifnif = 'El CIF/NIF es obligatorio';
    } else if (formData.cifnif.length < 8) {
      nuevosErrores.cifnif = 'El CIF/NIF debe tener al menos 8 caracteres';
    }

    if (!formData.contactoPrincipal.nombre.trim()) {
      nuevosErrores['contactoPrincipal.nombre'] = 'El nombre del contacto es obligatorio';
    }

    if (formData.contactoPrincipal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactoPrincipal.email)) {
      nuevosErrores['contactoPrincipal.email'] = 'El formato del email no es válido';
    }

    // Validación IBAN básica
    if (formData.informacionBancaria?.iban) {
      const iban = formData.informacionBancaria.iban.replace(/\s/g, '');
      if (iban.length < 15 || iban.length > 34) {
        nuevosErrores['informacionBancaria.iban'] = 'El IBAN debe tener entre 15 y 34 caracteres';
      } else if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
        nuevosErrores['informacionBancaria.iban'] = 'El formato del IBAN no es válido';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0 && !cifExiste;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validarFormulario()) {
      if (cifExiste) {
        setErrorGeneral('El CIF/NIF ya está registrado en el sistema. Por favor, verifica los datos.');
      } else {
        setErrorGeneral('Por favor, corrige los errores en el formulario');
      }
      return;
    }

    try {
      await onGuardar(formData);
    } catch (error: any) {
      setErrorGeneral(error.message || 'Error al guardar el proveedor');
    }
  };

  const handleInformacionGeneralChange = (datos: any) => {
    setFormData((prev) => ({
      ...prev,
      ...datos,
    }));
  };

  const handleContactoChange = (datos: any) => {
    setFormData((prev) => ({
      ...prev,
      ...datos,
    }));
  };

  const handleFiscalBancariaChange = (datos: any) => {
    setFormData((prev) => ({
      ...prev,
      ...datos,
    }));
  };

  const handleCategoriasChange = (categorias: string[]) => {
    setFormData((prev) => ({
      ...prev,
      categorias,
    }));
  };

  const handleCifChange = (cif: string) => {
    setFormData((prev) => ({
      ...prev,
      cifnif: cif,
    }));
    // Limpiar error de CIF
    if (errores.cifnif) {
      setErrores((prev) => {
        const nuevos = { ...prev };
        delete nuevos.cifnif;
        return nuevos;
      });
    }
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
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorGeneral}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Sección: Información General */}
            <InformacionGeneralSection
              datos={{
                nombreComercial: formData.nombreComercial,
                razonSocial: formData.razonSocial,
                cifnif: formData.cifnif,
                direccion: formData.direccion,
              }}
              onChange={handleInformacionGeneralChange}
              errores={errores}
              onCifChange={handleCifChange}
              cifExiste={cifExiste}
            />

            {/* Sección: Datos de Contacto */}
            <DatosContactoSection
              datos={{
                contactoPrincipal: formData.contactoPrincipal,
                contactosAdicionales: formData.contactosAdicionales,
              }}
              onChange={handleContactoChange}
              errores={errores}
            />

            {/* Sección: Información Fiscal y Bancaria */}
            <InformacionFiscalBancariaSection
              datos={{
                informacionBancaria: formData.informacionBancaria,
              }}
              onChange={handleFiscalBancariaChange}
              errores={errores}
            />

            {/* Sección: Categorías */}
            <CategoriasProveedorInput
              categorias={formData.categorias || []}
              onChange={handleCategoriasChange}
            />

            {/* Sección: Notas */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas Adicionales</h3>
              <textarea
                value={formData.notas || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notas: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Notas adicionales sobre el proveedor..."
              />
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
              disabled={loading || verificandoCif}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {verificandoCif ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {loading ? 'Guardando...' : 'Guardar Proveedor'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



