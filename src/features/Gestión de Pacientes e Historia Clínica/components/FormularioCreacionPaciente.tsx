import { useState } from 'react';
import { Save, Loader2, AlertCircle, User, Phone, Mail, MapPin, Heart } from 'lucide-react';
import {
  NuevoPaciente,
  DatosPersonales,
  Contacto,
  ContactoEmergencia,
  HistoriaMedica,
  DatosSeguro,
} from '../api/pacientesApi';
import SeccionDatosPersonales from './SeccionDatosPersonales';
import SeccionAnamnesis from './SeccionAnamnesis';
import SeccionDatosSeguro from './SeccionDatosSeguro';
import BuscadorPacientesDuplicados from './BuscadorPacientesDuplicados';

interface FormularioCreacionPacienteProps {
  onSubmit: (paciente: NuevoPaciente) => Promise<void>;
  onCancel?: () => void;
}

export default function FormularioCreacionPaciente({
  onSubmit,
  onCancel,
}: FormularioCreacionPacienteProps) {
  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales>({
    nombre: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    genero: '',
  });

  const [contacto, setContacto] = useState<Contacto>({
    email: '',
    telefono: '',
    direccion: {
      calle: '',
      ciudad: '',
      codigoPostal: '',
    },
  });

  const [contactoEmergencia, setContactoEmergencia] = useState<ContactoEmergencia>({
    nombre: '',
    telefono: '',
    relacion: '',
  });

  const [historiaMedica, setHistoriaMedica] = useState<HistoriaMedica>({
    alergias: [],
    enfermedadesCronicas: [],
    medicacionActual: [],
    notas: '',
  });

  const [datosSeguro, setDatosSeguro] = useState<DatosSeguro>({
    aseguradora: '',
    numeroPoliza: '',
    tipoPlan: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validar datos personales obligatorios
    if (!datosPersonales.nombre.trim()) {
      nuevosErrores['datosPersonales.nombre'] = 'El nombre es obligatorio';
    }
    if (!datosPersonales.apellidos.trim()) {
      nuevosErrores['datosPersonales.apellidos'] = 'Los apellidos son obligatorios';
    }

    // Validar formato de email si se proporciona
    if (contacto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.email)) {
      nuevosErrores['contacto.email'] = 'El formato del email no es válido';
    }

    // Validar formato de DNI si se proporciona (formato español básico)
    if (datosPersonales.dni && !/^[0-9]{8}[A-Z]$/i.test(datosPersonales.dni.trim())) {
      nuevosErrores['datosPersonales.dni'] = 'El formato del DNI no es válido (ej: 12345678A)';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validarFormulario()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const nuevoPaciente: NuevoPaciente = {
        datosPersonales: {
          nombre: datosPersonales.nombre.trim(),
          apellidos: datosPersonales.apellidos.trim(),
          dni: datosPersonales.dni?.trim() || undefined,
          fechaNacimiento: datosPersonales.fechaNacimiento || undefined,
          genero: datosPersonales.genero || undefined,
        },
        contacto: {
          email: contacto.email?.trim() || undefined,
          telefono: contacto.telefono?.trim() || undefined,
          direccion: contacto.direccion?.calle || contacto.direccion?.ciudad || contacto.direccion?.codigoPostal
            ? {
                calle: contacto.direccion?.calle?.trim() || undefined,
                ciudad: contacto.direccion?.ciudad?.trim() || undefined,
                codigoPostal: contacto.direccion?.codigoPostal?.trim() || undefined,
              }
            : undefined,
        },
        contactoEmergencia:
          contactoEmergencia.nombre || contactoEmergencia.telefono || contactoEmergencia.relacion
            ? {
                nombre: contactoEmergencia.nombre?.trim() || undefined,
                telefono: contactoEmergencia.telefono?.trim() || undefined,
                relacion: contactoEmergencia.relacion?.trim() || undefined,
              }
            : undefined,
        historiaMedica:
          historiaMedica.alergias?.length ||
          historiaMedica.enfermedadesCronicas?.length ||
          historiaMedica.medicacionActual?.length ||
          historiaMedica.notas
            ? {
                alergias: historiaMedica.alergias?.length ? historiaMedica.alergias : undefined,
                enfermedadesCronicas: historiaMedica.enfermedadesCronicas?.length
                  ? historiaMedica.enfermedadesCronicas
                  : undefined,
                medicacionActual: historiaMedica.medicacionActual?.length
                  ? historiaMedica.medicacionActual
                  : undefined,
                notas: historiaMedica.notas?.trim() || undefined,
              }
            : undefined,
        datosSeguro:
          datosSeguro.aseguradora || datosSeguro.numeroPoliza || datosSeguro.tipoPlan
            ? {
                aseguradora: datosSeguro.aseguradora?.trim() || undefined,
                numeroPoliza: datosSeguro.numeroPoliza?.trim() || undefined,
                tipoPlan: datosSeguro.tipoPlan || undefined,
              }
            : undefined,
        administrativo: {
          estado: 'Activo',
        },
      };

      await onSubmit(nuevoPaciente);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Buscador de duplicados */}
      <BuscadorPacientesDuplicados
        dni={datosPersonales.dni}
        nombre={datosPersonales.nombre}
        apellidos={datosPersonales.apellidos}
        email={contacto.email}
      />

      {/* Mensaje de error general */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sección Datos Personales */}
      <SeccionDatosPersonales
        datos={datosPersonales}
        onChange={setDatosPersonales}
        errores={{
          nombre: errores['datosPersonales.nombre'],
          apellidos: errores['datosPersonales.apellidos'],
          dni: errores['datosPersonales.dni'],
        }}
      />

      {/* Sección Contacto */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
          <Phone size={18} />
          Datos de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Phone size={16} className="inline mr-1" />
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={contacto.telefono || ''}
              onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Ej: 612345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Mail size={16} className="inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={contacto.email || ''}
              onChange={(e) => setContacto({ ...contacto, email: e.target.value })}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                errores['contacto.email'] ? 'ring-red-300' : 'ring-slate-300'
              }`}
              placeholder="correo@ejemplo.com"
            />
            {errores['contacto.email'] && (
              <p className="mt-1 text-sm text-red-600">{errores['contacto.email']}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Dirección
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                value={contacto.direccion?.calle || ''}
                onChange={(e) =>
                  setContacto({
                    ...contacto,
                    direccion: { ...contacto.direccion, calle: e.target.value },
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Calle y número"
              />
            </div>
            <div>
              <input
                type="text"
                value={contacto.direccion?.ciudad || ''}
                onChange={(e) =>
                  setContacto({
                    ...contacto,
                    direccion: { ...contacto.direccion, ciudad: e.target.value },
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Ciudad"
              />
            </div>
            <div>
              <input
                type="text"
                value={contacto.direccion?.codigoPostal || ''}
                onChange={(e) =>
                  setContacto({
                    ...contacto,
                    direccion: { ...contacto.direccion, codigoPostal: e.target.value },
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Código Postal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección Contacto de Emergencia */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
          <Heart size={18} />
          Contacto de Emergencia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={contactoEmergencia.nombre || ''}
              onChange={(e) =>
                setContactoEmergencia({ ...contactoEmergencia, nombre: e.target.value })
              }
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={contactoEmergencia.telefono || ''}
              onChange={(e) =>
                setContactoEmergencia({ ...contactoEmergencia, telefono: e.target.value })
              }
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Teléfono de contacto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Relación
            </label>
            <input
              type="text"
              value={contactoEmergencia.relacion || ''}
              onChange={(e) =>
                setContactoEmergencia({ ...contactoEmergencia, relacion: e.target.value })
              }
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Ej: Cónyuge, Padre, Hijo..."
            />
          </div>
        </div>
      </div>

      {/* Sección Anamnesis */}
      <SeccionAnamnesis datos={historiaMedica} onChange={setHistoriaMedica} />

      {/* Sección Datos Seguro */}
      <SeccionDatosSeguro datos={datosSeguro} onChange={setDatosSeguro} />

      {/* Botones de acción */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Guardar Paciente</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}



