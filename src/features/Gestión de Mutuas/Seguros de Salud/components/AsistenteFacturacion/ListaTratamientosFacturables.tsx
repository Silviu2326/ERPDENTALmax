import { Check, AlertCircle, DollarSign } from 'lucide-react';
import { TratamientoFacturable } from '../../api/facturacionMutuaApi';

interface ListaTratamientosFacturablesProps {
  tratamientos: TratamientoFacturable[];
  tratamientosSeleccionados: string[];
  onTratamientoToggle: (tratamientoId: string) => void;
  onSeleccionarTodos: () => void;
  onDeseleccionarTodos: () => void;
  loading?: boolean;
}

export default function ListaTratamientosFacturables({
  tratamientos,
  tratamientosSeleccionados,
  onTratamientoToggle,
  onSeleccionarTodos,
  onDeseleccionarTodos,
  loading = false,
}: ListaTratamientosFacturablesProps) {
  const todosSeleccionados = tratamientos.length > 0 && tratamientosSeleccionados.length === tratamientos.length;
  const algunosSeleccionados = tratamientosSeleccionados.length > 0 && tratamientosSeleccionados.length < tratamientos.length;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando tratamientos pendientes...</p>
      </div>
    );
  }

  if (tratamientos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No hay tratamientos pendientes de facturar para este paciente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Acciones de selección */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {tratamientosSeleccionados.length} de {tratamientos.length} tratamientos seleccionados
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSeleccionarTodos}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Seleccionar todos
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onDeseleccionarTodos}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
          >
            Deseleccionar todos
          </button>
        </div>
      </div>

      {/* Lista de tratamientos */}
      <div className="space-y-2">
        {tratamientos.map((tratamiento) => {
          const estaSeleccionado = tratamientosSeleccionados.includes(tratamiento._id);
          return (
            <div
              key={tratamiento._id}
              onClick={() => onTratamientoToggle(tratamiento._id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                estaSeleccionado
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    estaSeleccionado
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {estaSeleccionado && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {tratamiento.tratamiento.nombre}
                      </div>
                      {tratamiento.tratamiento.codigoInterno && (
                        <div className="text-sm text-gray-500 mt-1">
                          Código: {tratamiento.tratamiento.codigoInterno}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">
                        Realizado por: {tratamiento.profesional.nombre} {tratamiento.profesional.apellidos}
                      </div>
                      <div className="text-sm text-gray-600">
                        Fecha: {new Date(tratamiento.fechaRealizacion).toLocaleDateString('es-ES')}
                      </div>
                      {tratamiento.notas && (
                        <div className="text-sm text-gray-500 mt-1 italic">{tratamiento.notas}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <div className="text-sm text-gray-500">Cantidad</div>
                        <div className="font-semibold text-gray-900">{tratamiento.cantidad}</div>
                      </div>
                      <div className="border-l pl-3">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Precio
                        </div>
                        <div className="font-semibold text-gray-900">
                          {tratamiento.precio.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de selección */}
      {tratamientosSeleccionados.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              Total seleccionado: {tratamientosSeleccionados.length} tratamiento(s)
            </span>
            <span className="text-lg font-bold text-blue-900">
              {tratamientos
                .filter((t) => tratamientosSeleccionados.includes(t._id))
                .reduce((sum, t) => sum + t.precio * t.cantidad, 0)
                .toFixed(2)}{' '}
              €
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


