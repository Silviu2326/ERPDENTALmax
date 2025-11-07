import { useState, useEffect } from 'react';
import {
  obtenerPlantillasEncuestas,
  crearPlantillaEncuesta,
  actualizarPlantillaEncuesta,
  eliminarPlantillaEncuesta,
  EncuestaPlantilla,
  Pregunta,
  TipoPregunta,
} from '../api/encuestasApi';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, ArrowLeft, ClipboardList, Loader2, AlertCircle, X } from 'lucide-react';

interface GestionEncuestasPageProps {
  onVolver?: () => void;
  onVerResultados?: (plantillaId: string) => void;
}

export default function GestionEncuestasPage({
  onVolver,
  onVerResultados,
}: GestionEncuestasPageProps) {
  const [plantillas, setPlantillas] = useState<EncuestaPlantilla[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<EncuestaPlantilla | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    activa: true,
    preguntas: [] as Pregunta[],
  });

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setIsLoading(true);
      const data = await obtenerPlantillasEncuestas();
      setPlantillas(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las plantillas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuevaPlantilla = () => {
    setEditingPlantilla(null);
    setFormData({
      titulo: '',
      descripcion: '',
      activa: true,
      preguntas: [],
    });
    setShowModal(true);
  };

  const handleEditar = (plantilla: EncuestaPlantilla) => {
    setEditingPlantilla(plantilla);
    setFormData({
      titulo: plantilla.titulo,
      descripcion: plantilla.descripcion,
      activa: plantilla.activa,
      preguntas: plantilla.preguntas,
    });
    setShowModal(true);
  };

  const handleEliminar = async (plantillaId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      return;
    }

    try {
      await eliminarPlantillaEncuesta(plantillaId);
      cargarPlantillas();
    } catch (err: any) {
      alert('Error al eliminar la plantilla: ' + err.message);
    }
  };

  const handleAgregarPregunta = () => {
    setFormData({
      ...formData,
      preguntas: [
        ...formData.preguntas,
        {
          texto: '',
          tipo: 'estrellas',
          opciones: [],
        },
      ],
    });
  };

  const handleEliminarPregunta = (index: number) => {
    setFormData({
      ...formData,
      preguntas: formData.preguntas.filter((_, i) => i !== index),
    });
  };

  const handleActualizarPregunta = (index: number, pregunta: Partial<Pregunta>) => {
    const nuevasPreguntas = [...formData.preguntas];
    nuevasPreguntas[index] = { ...nuevasPreguntas[index], ...pregunta };
    setFormData({ ...formData, preguntas: nuevasPreguntas });
  };

  const handleGuardar = async () => {
    try {
      if (editingPlantilla?._id) {
        await actualizarPlantillaEncuesta(editingPlantilla._id, formData);
      } else {
        await crearPlantillaEncuesta(formData);
      }
      setShowModal(false);
      cargarPlantillas();
    } catch (err: any) {
      alert('Error al guardar la plantilla: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ClipboardList size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Gestión de Encuestas
                  </h1>
                  <p className="text-gray-600">
                    Crea y gestiona plantillas de encuestas para pacientes
                  </p>
                </div>
              </div>

              {/* Botón volver si existe */}
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                >
                  <ArrowLeft size={18} className="opacity-70" />
                  <span>Volver</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleNuevaPlantilla}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} />
              <span>Nueva Plantilla</span>
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarPlantillas}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Grid de Plantillas */}
          {!error && plantillas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plantillas.map((plantilla) => (
                <div
                  key={plantilla._id}
                  className="bg-white shadow-sm rounded-xl overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col"
                >
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {plantilla.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{plantilla.descripcion}</p>
                      <div className="flex items-center gap-2 mb-2">
                        {plantilla.activa ? (
                          <ToggleRight size={18} className="text-green-600" />
                        ) : (
                          <ToggleLeft size={18} className="text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${plantilla.activa ? 'text-green-600' : 'text-gray-500'}`}>
                          {plantilla.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {plantilla.preguntas.length} {plantilla.preguntas.length === 1 ? 'pregunta' : 'preguntas'}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                      {onVerResultados && (
                        <button
                          onClick={() => onVerResultados(plantilla._id || '')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye size={16} />
                          <span>Resultados</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleEditar(plantilla)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                      >
                        <Edit size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleEliminar(plantilla._id || '')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estado Vacío */}
          {!error && plantillas.length === 0 && (
            <div className="bg-white shadow-sm rounded-xl p-8 text-center">
              <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas creadas</h3>
              <p className="text-gray-600 mb-4">Comienza creando tu primera plantilla de encuesta</p>
              <button
                onClick={handleNuevaPlantilla}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Plus size={20} />
                <span>Nueva Plantilla</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal de creación/edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingPlantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Título de la plantilla"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                    placeholder="Descripción de la plantilla"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.activa}
                    onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <label className="text-sm font-medium text-slate-700">Activa</label>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
                    <button
                      onClick={handleAgregarPregunta}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    >
                      <Plus size={18} />
                      <span>Agregar Pregunta</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.preguntas.map((pregunta, index) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">
                            Pregunta {index + 1}
                          </span>
                          <button
                            onClick={() => handleEliminarPregunta(index)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={pregunta.texto}
                          onChange={(e) =>
                            handleActualizarPregunta(index, { texto: e.target.value })
                          }
                          placeholder="Texto de la pregunta"
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                        />

                        <select
                          value={pregunta.tipo}
                          onChange={(e) =>
                            handleActualizarPregunta(index, {
                              tipo: e.target.value as TipoPregunta,
                            })
                          }
                          className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                        >
                          <option value="estrellas">Calificación por Estrellas</option>
                          <option value="multiple">Opción Múltiple</option>
                          <option value="abierta">Respuesta Abierta</option>
                        </select>

                        {pregunta.tipo === 'multiple' && (
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-slate-700">
                              Opciones (una por línea)
                            </label>
                            <textarea
                              value={pregunta.opciones?.join('\n') || ''}
                              onChange={(e) =>
                                handleActualizarPregunta(index, {
                                  opciones: e.target.value.split('\n').filter((o) => o.trim()),
                                })
                              }
                              rows={3}
                              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                              placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200/60 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



