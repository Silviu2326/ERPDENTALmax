import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload, X, CheckCircle } from 'lucide-react';
import SeccionDatosPersonales from './SeccionDatosPersonales';
import SeccionInformacionContractual from './SeccionInformacionContractual';
import SeccionAccesosSistema from './SeccionAccesosSistema';
import {
  crearEmpleado,
  subirDocumentoEmpleado,
  obtenerRoles,
  Rol,
  DatosSubirDocumentoEmpleado,
} from '../api/empleadosApi';

interface FormularioNuevoEmpleadoProps {
  onEmpleadoCreado: (empleado: any) => void;
  onCancelar?: () => void;
}

type Paso = 'datos-personales' | 'informacion-contractual' | 'acceso-sistema';

export default function FormularioNuevoEmpleado({
  onEmpleadoCreado,
  onCancelar,
}: FormularioNuevoEmpleadoProps) {
  const [pasoActual, setPasoActual] = useState<Paso>('datos-personales');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [documentos, setDocumentos] = useState<Array<DatosSubirDocumentoEmpleado & { file: File }>>([]);

  // Estado del formulario
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    email: '',
    telefono: '',
    direccion: {
      calle: '',
      numero: '',
      ciudad: '',
      provincia: '',
      codigoPostal: '',
      pais: 'España',
    },
  });

  const [informacionContractual, setInformacionContractual] = useState({
    puesto: '',
    tipoContrato: 'Indefinido' as 'Indefinido' | 'Temporal' | 'Practicas' | 'Otro',
    salario: '',
    fechaContratacion: new Date().toISOString().split('T')[0],
    numeroSeguridadSocial: '',
    datosBancarios: {
      iban: '',
      titular: '',
    },
  });

  const [accesosSistema, setAccesosSistema] = useState({
    rolId: '',
    password: '',
    confirmPassword: '',
  });

  const [errores, setErrores] = useState<Record<string, Record<string, string>>>({});

  // Cargar roles al montar
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setLoadingRoles(true);
        const rolesData = await obtenerRoles();
        setRoles(rolesData);
      } catch (err) {
        setError('Error al cargar los roles disponibles');
      } finally {
        setLoadingRoles(false);
      }
    };

    cargarRoles();
  }, []);

  const pasos: { id: Paso; label: string }[] = [
    { id: 'datos-personales', label: 'Datos Personales' },
    { id: 'informacion-contractual', label: 'Información Contractual' },
    { id: 'acceso-sistema', label: 'Acceso al Sistema' },
  ];

  const indicePasoActual = pasos.findIndex((p) => p.id === pasoActual);
  const puedeSiguiente = indicePasoActual < pasos.length - 1;
  const puedeAnterior = indicePasoActual > 0;

  const validarPaso = (paso: Paso): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (paso === 'datos-personales') {
      if (!datosPersonales.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
      if (!datosPersonales.apellidos.trim()) nuevosErrores.apellidos = 'Los apellidos son obligatorios';
      if (!datosPersonales.dni.trim()) nuevosErrores.dni = 'El DNI es obligatorio';
      if (!datosPersonales.email.trim()) {
        nuevosErrores.email = 'El email es obligatorio';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosPersonales.email)) {
        nuevosErrores.email = 'El email no es válido';
      }
    }

    if (paso === 'informacion-contractual') {
      if (!informacionContractual.puesto.trim()) nuevosErrores.puesto = 'El puesto es obligatorio';
      if (!informacionContractual.salario.trim()) nuevosErrores.salario = 'El salario es obligatorio';
      if (!informacionContractual.fechaContratacion) {
        nuevosErrores.fechaContratacion = 'La fecha de contratación es obligatoria';
      }
    }

    if (paso === 'acceso-sistema') {
      if (!accesosSistema.rolId) nuevosErrores.rolId = 'Debe seleccionar un rol';
      if (!accesosSistema.password) {
        nuevosErrores.password = 'La contraseña es obligatoria';
      } else if (accesosSistema.password.length < 8) {
        nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      if (accesosSistema.password !== accesosSistema.confirmPassword) {
        nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrores((prev) => ({ ...prev, [paso]: nuevosErrores }));
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSiguiente = () => {
    if (validarPaso(pasoActual)) {
      const siguienteIndice = indicePasoActual + 1;
      if (siguienteIndice < pasos.length) {
        setPasoActual(pasos[siguienteIndice].id);
      }
    }
  };

  const handleAnterior = () => {
    const anteriorIndice = indicePasoActual - 1;
    if (anteriorIndice >= 0) {
      setPasoActual(pasos[anteriorIndice].id);
    }
  };

  const handleAgregarDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nuevoDocumento: DatosSubirDocumentoEmpleado & { file: File } = {
        file,
        tipo: 'Otro',
      };
      setDocumentos([...documentos, nuevoDocumento]);
    }
    e.target.value = '';
  };

  const handleEliminarDocumento = (index: number) => {
    setDocumentos(documentos.filter((_, i) => i !== index));
  };

  const handleTipoDocumentoChange = (index: number, tipo: 'Contrato' | 'DNI' | 'Titulacion' | 'Otro') => {
    const nuevosDocumentos = [...documentos];
    nuevosDocumentos[index].tipo = tipo;
    setDocumentos(nuevosDocumentos);
  };

  const handleSubmit = async () => {
    if (!validarPaso('acceso-sistema')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Obtener el nombre del rol desde el rolId
      const rolSeleccionado = roles.find((r) => r._id === accesosSistema.rolId);
      const nombreRol = rolSeleccionado?.nombre || 'Asistente';

      // Preparar datos del empleado según la interfaz NuevoEmpleado
      const empleadoData: any = {
        nombre: datosPersonales.nombre,
        apellidos: datosPersonales.apellidos,
        dni: datosPersonales.dni,
        email: datosPersonales.email,
        telefono: datosPersonales.telefono || undefined,
        fechaContratacion: informacionContractual.fechaContratacion,
        rol: nombreRol as 'Odontologo' | 'Asistente' | 'Recepcionista' | 'RR.HH.' | 'Gerente',
        estado: 'Activo' as const,
        // Campos adicionales que el backend puede aceptar
        puesto: informacionContractual.puesto,
        salario: parseFloat(informacionContractual.salario),
        tipoContrato: informacionContractual.tipoContrato,
        numeroSeguridadSocial: informacionContractual.numeroSeguridadSocial || undefined,
        fechaNacimiento: datosPersonales.fechaNacimiento || undefined,
        direccion: datosPersonales.direccion.calle || datosPersonales.direccion.ciudad
          ? {
              calle: datosPersonales.direccion.calle || undefined,
              numero: datosPersonales.direccion.numero || undefined,
              ciudad: datosPersonales.direccion.ciudad || undefined,
              provincia: datosPersonales.direccion.provincia || undefined,
              codigoPostal: datosPersonales.direccion.codigoPostal || undefined,
              pais: datosPersonales.direccion.pais || undefined,
            }
          : undefined,
        datosBancarios: informacionContractual.datosBancarios.iban || informacionContractual.datosBancarios.titular
          ? {
              iban: informacionContractual.datosBancarios.iban || undefined,
              titular: informacionContractual.datosBancarios.titular || undefined,
            }
          : undefined,
        // Campos para crear usuario
        rolId: accesosSistema.rolId,
        password: accesosSistema.password,
      };

      // Crear empleado
      const empleadoCreado = await crearEmpleado(empleadoData as any);

      // Subir documentos si hay
      if (empleadoCreado._id && documentos.length > 0) {
        for (const documento of documentos) {
          try {
            await subirDocumentoEmpleado(empleadoCreado._id, documento);
          } catch (err) {
            console.error('Error al subir documento:', err);
            // Continuar aunque falle la subida de un documento
          }
        }
      }

      onEmpleadoCreado(empleadoCreado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de pasos */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {pasos.map((paso, index) => (
            <div key={paso.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index < indicePasoActual
                      ? 'bg-green-500 text-white'
                      : index === indicePasoActual
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < indicePasoActual ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    index === indicePasoActual ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {paso.label}
                </span>
              </div>
              {index < pasos.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    index < indicePasoActual ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error general */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Contenido del paso actual */}
      <div>
        {pasoActual === 'datos-personales' && (
          <SeccionDatosPersonales
            datos={datosPersonales}
            onChange={(field, value) =>
              setDatosPersonales((prev) => ({ ...prev, [field]: value }))
            }
            onChangeDireccion={(field, value) =>
              setDatosPersonales((prev) => ({
                ...prev,
                direccion: { ...prev.direccion, [field]: value },
              }))
            }
            errors={errores['datos-personales'] || {}}
          />
        )}

        {pasoActual === 'informacion-contractual' && (
          <SeccionInformacionContractual
            datos={informacionContractual}
            onChange={(field, value) =>
              setInformacionContractual((prev) => ({ ...prev, [field]: value }))
            }
            onChangeBancarios={(field, value) =>
              setInformacionContractual((prev) => ({
                ...prev,
                datosBancarios: { ...prev.datosBancarios, [field]: value },
              }))
            }
            errors={errores['informacion-contractual'] || {}}
          />
        )}

        {pasoActual === 'acceso-sistema' && (
          <>
            <SeccionAccesosSistema
              datos={accesosSistema}
              roles={roles}
              onChange={(field, value) =>
                setAccesosSistema((prev) => ({ ...prev, [field]: value }))
              }
              errors={errores['acceso-sistema'] || {}}
              loadingRoles={loadingRoles}
            />

            {/* Subida de documentos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                Documentos (Opcional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Puede adjuntar documentos como DNI, contrato firmado o titulaciones.
              </p>

              <div className="space-y-4">
                {documentos.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(doc.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <select
                      value={doc.tipo}
                      onChange={(e) =>
                        handleTipoDocumentoChange(
                          index,
                          e.target.value as 'Contrato' | 'DNI' | 'Titulacion' | 'Otro'
                        )
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="DNI">DNI</option>
                      <option value="Contrato">Contrato</option>
                      <option value="Titulacion">Titulación</option>
                      <option value="Otro">Otro</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleEliminarDocumento(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Agregar documento</span>
                  <input
                    type="file"
                    onChange={handleAgregarDocumento}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div>
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {puedeAnterior && (
            <button
              type="button"
              onClick={handleAnterior}
              className="flex items-center gap-2 px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>
          )}
          {puedeSiguiente ? (
            <button
              type="button"
              onClick={handleSiguiente}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Empleado'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

