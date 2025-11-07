import { useState } from 'react';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import { FaseTratamiento, Procedimiento } from '../api/planesTratamientoApi';

interface FaseTratamientoCardProps {
  fase: FaseTratamiento;
  indice: number;
  onEliminar: () => void;
  onEditar: (fase: FaseTratamiento) => void;
  onAgregarProcedimiento: (faseIndice: number) => void;
  onEliminarProcedimiento: (faseIndice: number, procedimientoIndice: number) => void;
  onEditarProcedimiento: (
    faseIndice: number,
    procedimientoIndice: number,
    procedimiento: Procedimiento
  ) => void;
}

export default function FaseTratamientoCard({
  fase,
  indice,
  onEliminar,
  onEditar,
  onAgregarProcedimiento,
  onEliminarProcedimiento,
  onEditarProcedimiento,
}: FaseTratamientoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(fase.nombre);
  const [descripcionEditada, setDescripcionEditada] = useState(fase.descripcion || '');

  const subtotalFase = fase.procedimientos.reduce((sum, proc) => sum + proc.precio, 0);

  const handleGuardar = () => {
    onEditar({
      ...fase,
      nombre: nombreEditado,
      descripcion: descripcionEditada,
    });
    setIsEditing(false);
  };

  const handleCancelar = () => {
    setNombreEditado(fase.nombre);
    setDescripcionEditada(fase.descripcion || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header de la fase */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={nombreEditado}
                onChange={(e) => setNombreEditado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                placeholder="Nombre de la fase"
              />
              <textarea
                value={descripcionEditada}
                onChange={(e) => setDescripcionEditada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Descripción de la fase (opcional)"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleGuardar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelar}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Fase {indice + 1}: {fase.nombre}
              </h3>
              {fase.descripcion && (
                <p className="text-sm text-gray-600 mt-1">{fase.descripcion}</p>
              )}
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar fase"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onEliminar}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar fase"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lista de procedimientos */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Procedimientos</h4>
          <button
            onClick={() => onAgregarProcedimiento(indice)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {fase.procedimientos.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
            No hay procedimientos en esta fase
          </div>
        ) : (
          <div className="space-y-2">
            {fase.procedimientos.map((procedimiento, procIndex) => (
              <div
                key={procIndex}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {procedimiento.tratamiento.nombre}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {procedimiento.piezaDental && (
                      <span className="mr-2">Pieza: {procedimiento.piezaDental}</span>
                    )}
                    {procedimiento.cara && <span className="mr-2">Cara: {procedimiento.cara}</span>}
                    <span className="text-gray-500">
                      Estado: {procedimiento.estadoProcedimiento}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">€{procedimiento.precio}</div>
                  </div>
                  <button
                    onClick={() => onEliminarProcedimiento(indice, procIndex)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar procedimiento"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subtotal de la fase */}
      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <div className="text-right">
          <div className="text-sm text-gray-600">Subtotal Fase</div>
          <div className="text-lg font-semibold text-gray-900">€{subtotalFase.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}



