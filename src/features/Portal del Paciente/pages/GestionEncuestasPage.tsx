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
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {onVolver && (
              <button
                onClick={onVolver}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Encuestas</h1>
          </div>
          <button
            onClick={handleNuevaPlantilla}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Plantilla</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plantillas.map((plantilla) => (
            <div
              key={plantilla._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {plantilla.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{plantilla.descripcion}</p>
                  <div className="flex items-center space-x-2">
                    {plantilla.activa ? (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={`text-sm ${plantilla.activa ? 'text-green-600' : 'text-gray-500'}`}>
                      {plantilla.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {plantilla.preguntas.length} preguntas
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {onVerResultados && (
                  <button
                    onClick={() => onVerResultados(plantilla._id || '')}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Resultados</span>
                  </button>
                )}
                <button
                  onClick={() => handleEditar(plantilla)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleEliminar(plantilla._id || '')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {plantillas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">No hay plantillas de encuestas creadas</p>
          </div>
        )}

        {/* Modal de creación/edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPlantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.activa}
                    onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Activa</label>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
                    <button
                      onClick={handleAgregarPregunta}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Pregunta</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.preguntas.map((pregunta, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Pregunta {index + 1}
                          </span>
                          <button
                            onClick={() => handleEliminarPregunta(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={pregunta.texto}
                          onChange={(e) =>
                            handleActualizarPregunta(index, { texto: e.target.value })
                          }
                          placeholder="Texto de la pregunta"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />

                        <select
                          value={pregunta.tipo}
                          onChange={(e) =>
                            handleActualizarPregunta(index, {
                              tipo: e.target.value as TipoPregunta,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="estrellas">Calificación por Estrellas</option>
                          <option value="multiple">Opción Múltiple</option>
                          <option value="abierta">Respuesta Abierta</option>
                        </select>

                        {pregunta.tipo === 'multiple' && (
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-700">
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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


