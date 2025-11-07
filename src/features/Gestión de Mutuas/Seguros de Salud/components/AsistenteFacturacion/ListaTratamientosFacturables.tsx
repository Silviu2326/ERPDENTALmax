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
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando tratamientos pendientes...</p>
      </div>
    );
  }

  if (tratamientos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay tratamientos pendientes</h3>
        <p className="text-gray-600">No hay tratamientos pendientes de facturar para este paciente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Paso 2: Seleccionar Tratamientos</h3>
        <p className="text-gray-600 text-sm">
          Selecciona los tratamientos realizados que deseas incluir en esta factura.
        </p>
      </div>

      {/* Acciones de selección */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {tratamientosSeleccionados.length} de {tratamientos.length} tratamientos seleccionados
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSeleccionarTodos}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Seleccionar todos
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onDeseleccionarTodos}
            className="text-sm text-slate-600 hover:text-slate-700 font-medium transition-colors"
          >
            Deseleccionar todos
          </button>
        </div>
      </div>

      {/* Lista de tratamientos */}
      <div className="space-y-3">
        {tratamientos.map((tratamiento) => {
          const estaSeleccionado = tratamientosSeleccionados.includes(tratamiento._id);
          return (
            <div
              key={tratamiento._id}
              onClick={() => onTratamientoToggle(tratamiento._id)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all bg-white shadow-sm ${
                estaSeleccionado
                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    estaSeleccionado
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {estaSeleccionado && <Check size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {tratamiento.tratamiento.nombre}
                      </div>
                      {tratamiento.tratamiento.codigoInterno && (
                        <div className="text-sm text-slate-500 mt-1">
                          Código: {tratamiento.tratamiento.codigoInterno}
                        </div>
                      )}
                      <div className="text-sm text-slate-600 mt-1">
                        Realizado por: {tratamiento.profesional.nombre} {tratamiento.profesional.apellidos}
                      </div>
                      <div className="text-sm text-slate-600">
                        Fecha: {new Date(tratamiento.fechaRealizacion).toLocaleDateString('es-ES')}
                      </div>
                      {tratamiento.notas && (
                        <div className="text-sm text-slate-500 mt-1 italic">{tratamiento.notas}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <div className="text-sm text-slate-500">Cantidad</div>
                        <div className="font-semibold text-gray-900">{tratamiento.cantidad}</div>
                      </div>
                      <div className="border-l border-gray-200 pl-3">
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <DollarSign size={16} />
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
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
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



