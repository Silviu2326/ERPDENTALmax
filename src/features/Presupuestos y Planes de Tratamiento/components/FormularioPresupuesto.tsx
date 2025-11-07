import { useState, useEffect } from 'react';
import { Plus, Save, X, Calendar } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ItemPresupuesto,
  Tratamiento,
  PacienteSimplificado,
  PacienteCompleto,
  obtenerPacientePorId,
} from '../api/presupuestosApi';
import SelectorPacientePresupuesto from './SelectorPacientePresupuesto';
import ModalBusquedaTratamientos from './ModalBusquedaTratamientos';
import TablaItemsPresupuesto from './TablaItemsPresupuesto';
import ResumenTotalesPresupuesto from './ResumenTotalesPresupuesto';

interface FormularioPresupuestoProps {
  onSubmit: (presupuesto: {
    pacienteId: string;
    odontologoId: string;
    items: ItemPresupuesto[];
    notas?: string;
    fechaVencimiento?: string;
  }) => Promise<void>;
  onCancel?: () => void;
}

export default function FormularioPresupuesto({ onSubmit, onCancel }: FormularioPresupuestoProps) {
  const { user } = useAuth();
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteSimplificado | null>(null);
  const [pacienteCompleto, setPacienteCompleto] = useState<PacienteCompleto | null>(null);
  const [items, setItems] = useState<ItemPresupuesto[]>([]);
  const [mostrarModalTratamientos, setMostrarModalTratamientos] = useState(false);
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [notas, setNotas] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos completos del paciente cuando se selecciona
  useEffect(() => {
    if (pacienteSeleccionado) {
      cargarPacienteCompleto(pacienteSeleccionado._id);
    } else {
      setPacienteCompleto(null);
    }
  }, [pacienteSeleccionado]);

  // Recalcular totales cuando cambian items o descuento general
  useEffect(() => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        const subtotal = item.precioUnitario * item.cantidad;
        const descuentoLinea = (subtotal * item.descuento) / 100;
        const total = subtotal - descuentoLinea;
        return { ...item, total };
      })
    );
  }, [descuentoGeneral]);

  const cargarPacienteCompleto = async (pacienteId: string) => {
    try {
      const paciente = await obtenerPacientePorId(pacienteId);
      setPacienteCompleto(paciente);
    } catch (err) {
      // Si falla, usar datos simplificados
      console.error('Error al cargar paciente completo:', err);
    }
  };

  const handleAgregarTratamiento = (tratamiento: Tratamiento) => {
    const nuevoItem: ItemPresupuesto = {
      tratamientoId: tratamiento._id,
      descripcion: tratamiento.nombre,
      cantidad: 1,
      precioUnitario: tratamiento.precioBase,
      descuento: 0,
      total: tratamiento.precioBase,
      piezaDental: '',
    };

    setItems([...items, nuevoItem]);
    setMostrarModalTratamientos(false);
  };

  const handleEliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleActualizarItem = (index: number, campo: keyof ItemPresupuesto, valor: any) => {
    const nuevosItems = [...items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };

    // Recalcular total si cambia precio, cantidad o descuento
    if (campo === 'precioUnitario' || campo === 'cantidad' || campo === 'descuento') {
      const item = nuevosItems[index];
      const subtotal = item.precioUnitario * item.cantidad;
      const descuentoLinea = (subtotal * item.descuento) / 100;
      item.total = subtotal - descuentoLinea;
    }

    setItems(nuevosItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pacienteSeleccionado) {
      setError('Debe seleccionar un paciente');
      return;
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un tratamiento');
      return;
    }

    if (!user?._id) {
      setError('No se pudo identificar al usuario');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        pacienteId: pacienteSeleccionado._id,
        odontologoId: user._id,
        items,
        notas: notas.trim() || undefined,
        fechaVencimiento: fechaVencimiento || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  // Calcular fecha de vencimiento por defecto (30 días desde hoy)
  const fechaVencimientoDefault = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 30);
    return fecha.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!fechaVencimiento) {
      setFechaVencimiento(fechaVencimientoDefault());
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Paciente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Paciente</h2>
        <SelectorPacientePresupuesto
          pacienteSeleccionado={pacienteSeleccionado}
          onPacienteSeleccionado={setPacienteSeleccionado}
        />
        {pacienteCompleto && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre completo:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {pacienteCompleto.nombre} {pacienteCompleto.apellidos}
                </span>
              </div>
              {pacienteCompleto.dni && (
                <div>
                  <span className="text-gray-600">DNI:</span>
                  <span className="ml-2 font-medium text-gray-900">{pacienteCompleto.dni}</span>
                </div>
              )}
              {pacienteCompleto.telefono && (
                <div>
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="ml-2 font-medium text-gray-900">{pacienteCompleto.telefono}</span>
                </div>
              )}
              {pacienteCompleto.email && (
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium text-gray-900">{pacienteCompleto.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tratamientos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Tratamientos</h2>
          <button
            type="button"
            onClick={() => setMostrarModalTratamientos(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Tratamiento</span>
          </button>
        </div>
        <TablaItemsPresupuesto
          items={items}
          onEliminarItem={handleEliminarItem}
          onEditarItem={(index, item) => {
            // Edición inline ya está implementada en la tabla
          }}
          onActualizarItem={handleActualizarItem}
        />
      </div>

      {/* Resumen y Notas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Adicional</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={4}
                placeholder="Notas adicionales sobre el presupuesto..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <ResumenTotalesPresupuesto
          items={items}
          descuentoGeneral={descuentoGeneral}
          onDescuentoGeneralChange={setDescuentoGeneral}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
          >
            <X className="h-5 w-5" />
            <span>Cancelar</span>
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !pacienteSeleccionado || items.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>{loading ? 'Guardando...' : 'Guardar Presupuesto'}</span>
        </button>
      </div>

      {/* Modal de búsqueda de tratamientos */}
      <ModalBusquedaTratamientos
        isOpen={mostrarModalTratamientos}
        onClose={() => setMostrarModalTratamientos(false)}
        onTratamientoSeleccionado={handleAgregarTratamiento}
      />
    </form>
  );
}



