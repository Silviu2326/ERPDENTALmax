import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Edit2, Trash2, Eye } from 'lucide-react';
import {
  obtenerPlanesPorPaciente,
  PlanTratamiento,
  eliminarPlanTratamiento,
  actualizarPlanTratamiento,
} from '../api/planesTratamientoApi';

interface ListaPlanesPacientePageProps {
  pacienteId: string;
  pacienteNombre?: string;
  onVolver?: () => void;
  onCrearNuevo?: () => void;
  onEditar?: (planId: string) => void;
  onVerDetalle?: (planId: string) => void;
}

export default function ListaPlanesPacientePage({
  pacienteId,
  pacienteNombre,
  onVolver,
  onCrearNuevo,
  onEditar,
  onVerDetalle,
}: ListaPlanesPacientePageProps) {
  const [planes, setPlanes] = useState<PlanTratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPlanes();
  }, [pacienteId]);

  const cargarPlanes = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerPlanesPorPaciente(pacienteId);
      setPlanes(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes de tratamiento');
      // Datos mock enriquecidos para desarrollo
      const ahora = new Date();
      const nombrePaciente = pacienteNombre?.split(' ')[0] || 'Juan';
      const apellidosPaciente = pacienteNombre?.split(' ').slice(1).join(' ') || 'Pérez';
      
      setPlanes([
        {
          _id: '1',
          paciente: {
            _id: pacienteId,
            nombre: nombrePaciente,
            apellidos: apellidosPaciente,
          },
          odontologo: {
            _id: '1',
            nombre: 'Dr. Carlos',
            apellidos: 'Martínez López',
          },
          fechaCreacion: new Date(ahora.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Propuesto',
          totalBruto: 1850,
          descuento: 10,
          totalNeto: 1665,
          notas: 'Plan de tratamiento inicial completo. Paciente con múltiples necesidades odontológicas que requieren abordaje integral. Tratamiento estructurado en 3 fases: saneamiento y prevención, restauración estética, y mantenimiento a largo plazo. Paciente muy colaborador y comprometido con excelente higiene bucal. Se ha establecido protocolo de seguimiento cada 6 meses. Paciente ha mostrado gran interés en mantener su salud dental. Todas las fases programadas y explicadas detalladamente. Pronóstico muy favorable.',
          fases: [
            {
              nombre: 'Fase 1: Saneamiento y Prevención',
              descripcion: 'Eliminación de caries, limpieza profunda y tratamiento preventivo',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '1',
                    nombre: 'Limpieza Dental Profesional con Ultrasonidos',
                    precioBase: 60,
                  },
                  precio: 60,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: {
                    _id: '2',
                    nombre: 'Eliminación de Caries (3 piezas)',
                    precioBase: 360,
                  },
                  precio: 360,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: {
                    _id: '3',
                    nombre: 'Fluorización Tópica',
                    precioBase: 25,
                  },
                  precio: 25,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
            {
              nombre: 'Fase 2: Restauración',
              descripcion: 'Restauraciones estéticas con composite de alta calidad',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '4',
                    nombre: 'Obturación Composite (4 piezas)',
                    precioBase: 380,
                  },
                  precio: 380,
                  estadoProcedimiento: 'Pendiente',
                },
                {
                  tratamiento: {
                    _id: '5',
                    nombre: 'Reconstrucción con Composite',
                    precioBase: 95,
                  },
                  precio: 95,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
            {
              nombre: 'Fase 3: Mantenimiento',
              descripcion: 'Seguimiento y controles periódicos',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '6',
                    nombre: 'Control y Revisión (3 sesiones)',
                    precioBase: 150,
                  },
                  precio: 150,
                  estadoProcedimiento: 'Pendiente',
                },
              ],
            },
          ],
        },
        {
          _id: '2',
          paciente: {
            _id: pacienteId,
            nombre: nombrePaciente,
            apellidos: apellidosPaciente,
          },
          odontologo: {
            _id: '2',
            nombre: 'Dra. María',
            apellidos: 'García Fernández',
          },
          fechaCreacion: new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'En Curso',
          totalBruto: 3800,
          descuento: 5,
          totalNeto: 3610,
          notas: 'Plan de ortodoncia en curso con excelente progreso. Paciente muy colaborador y comprometido con el tratamiento. Todas las fases iniciales completadas exitosamente. Ajustes realizados según planificación establecida. Progreso excelente con movimientos dentales según lo esperado. Próximo control programado en 4 semanas para continuar con los ajustes. Paciente sigue todas las recomendaciones de higiene y uso de aparatos. Pronóstico muy favorable para completar el tratamiento en el tiempo estimado.',
          fases: [
            {
              nombre: 'Fase 1: Estudio y Preparación',
              descripcion: 'Estudio completo y preparación para ortodoncia. Análisis 3D y planificación',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '7',
                    nombre: 'Estudio Ortodóncico Completo 3D',
                    precioBase: 200,
                  },
                  precio: 200,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: {
                    _id: '8',
                    nombre: 'Radiografías Cefalométricas y Panorámica',
                    precioBase: 120,
                  },
                  precio: 120,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: {
                    _id: '9',
                    nombre: 'Fotografías Clínicas',
                    precioBase: 30,
                  },
                  precio: 30,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 2: Colocación de Brackets',
              descripcion: 'Instalación del sistema de ortodoncia metálica',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '10',
                    nombre: 'Brackets Metálicos (2 arcadas)',
                    precioBase: 1800,
                  },
                  precio: 1800,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: {
                    _id: '11',
                    nombre: 'Arcos Iniciales y Materiales',
                    precioBase: 150,
                  },
                  precio: 150,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 3: Controles y Ajustes Mensuales',
              descripcion: 'Seguimiento y ajustes periódicos durante 18 meses',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '12',
                    nombre: 'Control Mensual (18 meses)',
                    precioBase: 1500,
                  },
                  precio: 1500,
                  estadoProcedimiento: 'En Curso',
                },
              ],
            },
          ],
        },
        {
          _id: '3',
          paciente: {
            _id: pacienteId,
            nombre: nombrePaciente,
            apellidos: apellidosPaciente,
          },
          odontologo: {
            _id: '5',
            nombre: 'Dr. Luis',
            apellidos: 'González Torres',
          },
          fechaCreacion: new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'Finalizado',
          totalBruto: 2150,
          descuento: 0,
          totalNeto: 2150,
          notas: 'Plan de tratamiento completado exitosamente en todas sus fases. Implante dental colocado con éxito y osteointegración perfecta confirmada. Corona cerámica instalada con excelente resultado estético y funcional. Paciente muy satisfecho con el resultado final. Todas las fases del tratamiento se completaron según lo planificado. Próxima revisión programada en 6 meses para control y mantenimiento. Paciente ha recibido instrucciones completas de cuidado y mantenimiento. Garantía de 5 años en el implante activa. Excelente pronóstico a largo plazo.',
          fases: [
            {
              nombre: 'Fase 1: Planificación y Preparación',
              descripcion: 'Estudio previo y planificación del implante',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '13',
                    nombre: 'CBCT 3D para Planificación',
                    precioBase: 90,
                  },
                  precio: 90,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 2: Colocación del Implante',
              descripcion: 'Cirugía de colocación del implante dental',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '14',
                    nombre: 'Implante Dental Titanio (pieza 16)',
                    precioBase: 1500,
                  },
                  precio: 1500,
                  estadoProcedimiento: 'Completado',
                },
                {
                  tratamiento: {
                    _id: '15',
                    nombre: 'Prótesis Provisional',
                    precioBase: 120,
                  },
                  precio: 120,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
            {
              nombre: 'Fase 3: Corona Final',
              descripcion: 'Instalación de la corona cerámica definitiva',
              procedimientos: [
                {
                  tratamiento: {
                    _id: '16',
                    nombre: 'Corona Cerámica sobre Implante',
                    precioBase: 650,
                  },
                  precio: 650,
                  estadoProcedimiento: 'Completado',
                },
              ],
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (
    planId: string,
    nuevoEstado: 'Propuesto' | 'Aceptado' | 'En Curso' | 'Finalizado' | 'Rechazado'
  ) => {
    try {
      await actualizarPlanTratamiento(planId, { estado: nuevoEstado });
      setPlanes((prev) =>
        prev.map((p) => (p._id === planId ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar el estado');
    }
  };

  const handleEliminar = async (planId: string) => {
    if (!confirm('¿Está seguro de eliminar este plan de tratamiento?')) {
      return;
    }

    try {
      await eliminarPlanTratamiento(planId);
      setPlanes((prev) => prev.filter((p) => p._id !== planId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el plan');
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Propuesto':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aceptado':
        return 'bg-green-100 text-green-800';
      case 'En Curso':
        return 'bg-blue-100 text-blue-800';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Planes de Tratamiento
              {pacienteNombre && (
                <span className="text-xl font-normal text-gray-600 ml-2">
                  - {pacienteNombre}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona los planes de tratamiento del paciente
            </p>
          </div>
          <div className="flex gap-2">
            {onVolver && (
              <button
                onClick={onVolver}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            )}
            {onCrearNuevo && (
              <button
                onClick={onCrearNuevo}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                Nuevo Plan
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de planes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando planes de tratamiento...</p>
          </div>
        ) : planes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No hay planes de tratamiento para este paciente</p>
            {onCrearNuevo && (
              <button
                onClick={onCrearNuevo}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear Primer Plan
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {planes.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Plan de Tratamiento
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeColor(
                          plan.estado
                        )}`}
                      >
                        {plan.estado}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Odontólogo:</span> {plan.odontologo.nombre}{' '}
                        {plan.odontologo.apellidos}
                      </p>
                      <p>
                        <span className="font-medium">Fecha de creación:</span>{' '}
                        {new Date(plan.fechaCreacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        <span className="font-medium">Fases:</span> {plan.fases.length}
                      </p>
                      <p>
                        <span className="font-medium">Procedimientos:</span>{' '}
                        {plan.fases.reduce((sum, fase) => sum + fase.procedimientos.length, 0)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600">
                      €{plan.totalNeto.toFixed(2)}
                    </div>
                    {plan.descuento > 0 && (
                      <div className="text-sm text-gray-500">
                        Descuento: {plan.descuento}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen de fases */}
                <div className="mb-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Fases del Tratamiento:</h4>
                  <div className="space-y-2">
                    {plan.fases.map((fase, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        <span className="font-medium">
                          Fase {index + 1}: {fase.nombre}
                        </span>
                        <span className="ml-2">
                          ({fase.procedimientos.length} procedimientos)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                {plan.notas && (
                  <div className="mb-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notas:</span> {plan.notas}
                    </p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <select
                      value={plan.estado}
                      onChange={(e) =>
                        handleCambiarEstado(
                          plan._id || '',
                          e.target.value as PlanTratamiento['estado']
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Propuesto">Propuesto</option>
                      <option value="Aceptado">Aceptado</option>
                      <option value="En Curso">En Curso</option>
                      <option value="Finalizado">Finalizado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {onVerDetalle && plan._id && (
                      <button
                        onClick={() => onVerDetalle(plan._id || '')}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalle
                      </button>
                    )}
                    {onEditar && plan._id && (
                      <button
                        onClick={() => onEditar(plan._id || '')}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                    )}
                    {plan._id && (
                      <button
                        onClick={() => handleEliminar(plan._id || '')}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


