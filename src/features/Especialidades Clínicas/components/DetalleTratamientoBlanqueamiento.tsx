import { useState } from 'react';
import { ArrowLeft, Save, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { Blanqueamiento, ActualizarBlanqueamientoData } from '../api/blanqueamientoApi';
import SelectorTonalidadVita from './SelectorTonalidadVita';
import SeguimientoSesionesBlanqueamiento from './SeguimientoSesionesBlanqueamiento';
import GaleriaFotosAntesDespues from './GaleriaFotosAntesDespues';
import { agregarNuevaSesion, subirFotos, actualizarBlanqueamiento, NuevaSesionData } from '../api/blanqueamientoApi';

interface DetalleTratamientoBlanqueamientoProps {
  blanqueamiento: Blanqueamiento;
  onVolver: () => void;
  onActualizado: () => void;
  loading?: boolean;
}

export default function DetalleTratamientoBlanqueamiento({
  blanqueamiento,
  onVolver,
  onActualizado,
  loading = false,
}: DetalleTratamientoBlanqueamientoProps) {
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState<ActualizarBlanqueamientoData>({
    tipoBlanqueamiento: blanqueamiento.tipoBlanqueamiento,
    productoUtilizado: blanqueamiento.productoUtilizado,
    concentracion: blanqueamiento.concentracion,
    tonoFinal: blanqueamiento.tonoFinal,
    consentimientoFirmado: blanqueamiento.consentimientoFirmado,
    notasGenerales: blanqueamiento.notasGenerales,
    estado: blanqueamiento.estado,
  });
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!blanqueamiento._id) return;

    setGuardando(true);
    try {
      await actualizarBlanqueamiento(blanqueamiento._id, formulario);
      setEditando(false);
      onActualizado();
    } catch (error) {
      console.error('Error al actualizar tratamiento:', error);
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarSesion = async (datos: NuevaSesionData) => {
    if (!blanqueamiento._id) return;
    try {
      await agregarNuevaSesion(blanqueamiento._id, datos);
      onActualizado();
    } catch (error) {
      console.error('Error al agregar sesión:', error);
      throw error;
    }
  };

  const handleSubirFotos = async (archivos: File[], tipo: 'Antes' | 'Después') => {
    if (!blanqueamiento._id) return;
    try {
      await subirFotos(blanqueamiento._id, archivos, tipo);
      onActualizado();
    } catch (error) {
      console.error('Error al subir fotos:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onVolver}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Detalle del Tratamiento</h1>
                <p className="text-sm text-gray-600">
                  Iniciado el{' '}
                  {new Date(blanqueamiento.fechaInicio).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            {!editando ? (
              <button
                onClick={() => setEditando(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Información General */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Blanqueamiento</label>
              {editando ? (
                <select
                  value={formulario.tipoBlanqueamiento}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      tipoBlanqueamiento: e.target.value as 'En Clínica' | 'En Casa' | 'Combinado',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="En Clínica">En Clínica</option>
                  <option value="En Casa">En Casa</option>
                  <option value="Combinado">Combinado</option>
                </select>
              ) : (
                <p className="text-gray-900">{blanqueamiento.tipoBlanqueamiento}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Producto Utilizado</label>
              {editando ? (
                <input
                  type="text"
                  value={formulario.productoUtilizado}
                  onChange={(e) => setFormulario({ ...formulario, productoUtilizado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{blanqueamiento.productoUtilizado}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Concentración</label>
              {editando ? (
                <input
                  type="text"
                  value={formulario.concentracion || ''}
                  onChange={(e) => setFormulario({ ...formulario, concentracion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{blanqueamiento.concentracion || 'No especificada'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tono Inicial</label>
              <p className="text-gray-900">{blanqueamiento.tonoInicial}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tono Final</label>
              {editando ? (
                <SelectorTonalidadVita
                  valor={formulario.tonoFinal || ''}
                  onChange={(tono) => setFormulario({ ...formulario, tonoFinal: tono })}
                  label=""
                  required={false}
                />
              ) : (
                <p className="text-gray-900">{blanqueamiento.tonoFinal || 'No registrado'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              {editando ? (
                <select
                  value={formulario.estado}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      estado: e.target.value as 'En Proceso' | 'Completado' | 'Cancelado',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  {blanqueamiento.estado === 'Completado' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : blanqueamiento.estado === 'Cancelado' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : null}
                  <p className="text-gray-900">{blanqueamiento.estado}</p>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={formulario.consentimientoFirmado}
                  onChange={(e) =>
                    setFormulario({ ...formulario, consentimientoFirmado: e.target.checked })
                  }
                  disabled={!editando}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Consentimiento informado firmado
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notas Generales</label>
              {editando ? (
                <textarea
                  value={formulario.notasGenerales || ''}
                  onChange={(e) => setFormulario({ ...formulario, notasGenerales: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {blanqueamiento.notasGenerales || 'Sin notas'}
                </p>
              )}
            </div>
          </div>

          {editando && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setEditando(false);
                  setFormulario({
                    tipoBlanqueamiento: blanqueamiento.tipoBlanqueamiento,
                    productoUtilizado: blanqueamiento.productoUtilizado,
                    concentracion: blanqueamiento.concentracion,
                    tonoFinal: blanqueamiento.tonoFinal,
                    consentimientoFirmado: blanqueamiento.consentimientoFirmado,
                    notasGenerales: blanqueamiento.notasGenerales,
                    estado: blanqueamiento.estado,
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Seguimiento de Sesiones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <SeguimientoSesionesBlanqueamiento
            sesiones={blanqueamiento.sesiones}
            onAgregarSesion={handleAgregarSesion}
            tratamientoId={blanqueamiento._id || ''}
            loading={loading}
          />
        </div>

        {/* Galería de Fotos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <GaleriaFotosAntesDespues
            fotos={blanqueamiento.fotos}
            onSubirFotos={handleSubirFotos}
            tratamientoId={blanqueamiento._id || ''}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}


