import { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Package, FileText, User } from 'lucide-react';
import {
  ParteAveria,
  NuevoParteAveria,
  ActualizarParteAveria,
  PrioridadParteAveria,
  EstadoParteAveria,
  Equipo,
  obtenerEquiposDisponibles,
} from '../api/partesAveriaApi';

interface FormularioCrearEditarParteProps {
  parte?: ParteAveria;
  clinicaId?: string;
  clinicas?: Array<{ _id: string; nombre: string }>;
  reportadoPor?: string;
  onGuardar: (datos: NuevoParteAveria | ActualizarParteAveria) => Promise<void>;
  onCancelar: () => void;
  modoEdicion?: boolean;
}

export default function FormularioCrearEditarParte({
  parte,
  clinicaId,
  clinicas = [],
  reportadoPor,
  onGuardar,
  onCancelar,
  modoEdicion = false,
}: FormularioCrearEditarParteProps) {
  const [equipoId, setEquipoId] = useState(parte?.equipoId || '');
  const [clinicaSeleccionada, setClinicaSeleccionada] = useState(
    parte?.clinicaId || clinicaId || ''
  );
  const [descripcionProblema, setDescripcionProblema] = useState(
    parte?.descripcionProblema || ''
  );
  const [prioridad, setPrioridad] = useState<PrioridadParteAveria>(
    parte?.prioridad || 'Media'
  );
  const [notas, setNotas] = useState(parte?.notas || '');
  const [estado, setEstado] = useState<EstadoParteAveria>(
    parte?.estado || 'Abierto'
  );
  const [tecnicoAsignado, setTecnicoAsignado] = useState(parte?.tecnicoAsignado || '');

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(false);
  const [busquedaEquipo, setBusquedaEquipo] = useState('');
  const [mostrarEquipos, setMostrarEquipos] = useState(false);

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);

  const prioridades: PrioridadParteAveria[] = ['Baja', 'Media', 'Alta', 'Crítica'];
  const estados: EstadoParteAveria[] = ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado'];

  useEffect(() => {
    if (clinicaSeleccionada) {
      cargarEquipos();
    }
  }, [clinicaSeleccionada]);

  const cargarEquipos = async () => {
    setCargandoEquipos(true);
    try {
      const listaEquipos = await obtenerEquiposDisponibles(clinicaSeleccionada);
      setEquipos(listaEquipos);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    } finally {
      setCargandoEquipos(false);
    }
  };

  const equiposFiltrados = equipos.filter((eq) =>
    eq.nombre.toLowerCase().includes(busquedaEquipo.toLowerCase())
  );

  const equipoSeleccionado = equipos.find((eq) => eq._id === equipoId);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!equipoId) {
      nuevosErrores.equipoId = 'Debe seleccionar un equipo';
    }
    if (!clinicaSeleccionada) {
      nuevosErrores.clinicaId = 'Debe seleccionar una clínica';
    }
    if (!descripcionProblema.trim()) {
      nuevosErrores.descripcionProblema = 'Debe describir el problema';
    }
    if (descripcionProblema.trim().length < 10) {
      nuevosErrores.descripcionProblema = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    try {
      if (modoEdicion && parte?._id) {
        // Actualizar
        await onGuardar({
          estado,
          prioridad,
          tecnicoAsignado: tecnicoAsignado || undefined,
          notas: notas || undefined,
        });
      } else {
        // Crear
        if (!reportadoPor) {
          throw new Error('No se ha identificado al usuario que reporta');
        }
        await onGuardar({
          equipoId,
          clinicaId: clinicaSeleccionada,
          descripcionProblema: descripcionProblema.trim(),
          reportadoPor,
          prioridad,
          notas: notas || undefined,
        });
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrores({
        general: error instanceof Error ? error.message : 'Error al guardar el parte de avería',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {modoEdicion ? 'Editar Parte de Avería' : 'Nuevo Parte de Avería'}
        </h2>
        <button
          type="button"
          onClick={onCancelar}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errores.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{errores.general}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Selección de Clínica */}
        {clinicas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Clínica <span className="text-red-500">*</span>
            </label>
            <select
              value={clinicaSeleccionada}
              onChange={(e) => {
                setClinicaSeleccionada(e.target.value);
                setEquipoId('');
                setErrores({ ...errores, clinicaId: '', equipoId: '' });
              }}
              disabled={modoEdicion}
              className={`w-full rounded-xl bg-white text-slate-900 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                errores.clinicaId ? 'ring-red-300' : 'ring-slate-300'
              } ${modoEdicion ? 'bg-gray-100' : ''}`}
            >
              <option value="">Seleccione una clínica</option>
              {clinicas.map((clinica) => (
                <option key={clinica._id} value={clinica._id}>
                  {clinica.nombre}
                </option>
              ))}
            </select>
            {errores.clinicaId && (
              <p className="mt-1 text-sm text-red-600">{errores.clinicaId}</p>
            )}
          </div>
        )}

        {/* Selección de Equipo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Equipo Afectado <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={equipoSeleccionado?.nombre || busquedaEquipo}
              onChange={(e) => {
                setBusquedaEquipo(e.target.value);
                setMostrarEquipos(true);
                if (!e.target.value) {
                  setEquipoId('');
                }
              }}
              onFocus={() => setMostrarEquipos(true)}
              placeholder="Buscar equipo..."
              disabled={modoEdicion || !clinicaSeleccionada}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-10 py-2.5 ${
                errores.equipoId ? 'ring-red-300' : 'ring-slate-300'
              } ${modoEdicion || !clinicaSeleccionada ? 'bg-gray-100' : ''}`}
            />
            <Package className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            {mostrarEquipos && !modoEdicion && clinicaSeleccionada && busquedaEquipo && (
              <div className="absolute z-10 w-full mt-1 bg-white ring-1 ring-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {cargandoEquipos ? (
                  <div className="p-4 text-center text-slate-500">Cargando equipos...</div>
                ) : equiposFiltrados.length > 0 ? (
                  equiposFiltrados.map((equipo) => (
                    <button
                      key={equipo._id}
                      type="button"
                      onClick={() => {
                        setEquipoId(equipo._id);
                        setBusquedaEquipo(equipo.nombre);
                        setMostrarEquipos(false);
                        setErrores({ ...errores, equipoId: '' });
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{equipo.nombre}</div>
                      {equipo.marca && equipo.modelo && (
                        <div className="text-sm text-slate-500">
                          {equipo.marca} {equipo.modelo}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500">No se encontraron equipos</div>
                )}
              </div>
            )}
          </div>
          {errores.equipoId && (
            <p className="mt-1 text-sm text-red-600">{errores.equipoId}</p>
          )}
        </div>

        {/* Descripción del Problema */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción del Problema <span className="text-red-500">*</span>
          </label>
          <textarea
            value={descripcionProblema}
            onChange={(e) => {
              setDescripcionProblema(e.target.value);
              setErrores({ ...errores, descripcionProblema: '' });
            }}
            rows={4}
            placeholder="Describa detalladamente el problema detectado en el equipo..."
            className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
              errores.descripcionProblema ? 'ring-red-300' : 'ring-slate-300'
            }`}
          />
          {errores.descripcionProblema && (
            <p className="mt-1 text-sm text-red-600">{errores.descripcionProblema}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            {descripcionProblema.length}/500 caracteres
          </p>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Prioridad <span className="text-red-500">*</span>
          </label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value as PrioridadParteAveria)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          >
            {prioridades.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Estado (solo en edición) */}
        {modoEdicion && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoParteAveria)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Técnico Asignado (solo en edición) */}
        {modoEdicion && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Técnico Asignado
            </label>
            <input
              type="text"
              value={tecnicoAsignado}
              onChange={(e) => setTecnicoAsignado(e.target.value)}
              placeholder="Nombre del técnico interno o externo"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
        )}

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Notas Adicionales</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Información adicional, observaciones, etc."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
        >
          {guardando ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
  );
}



