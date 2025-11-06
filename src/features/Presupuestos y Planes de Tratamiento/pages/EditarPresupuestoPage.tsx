import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Loader2 } from 'lucide-react';
import {
  Presupuesto,
  ItemPresupuesto,
  Tratamiento,
  obtenerPresupuestoPorId,
  actualizarPresupuesto,
} from '../api/presupuestosApi';
import FormularioEdicionPresupuesto from '../components/FormularioEdicionPresupuesto';
import TablaTratamientosEditable from '../components/TablaTratamientosEditable';
import ResumenFinancieroEditable from '../components/ResumenFinancieroEditable';
import ModalBusquedaTratamientos from '../components/ModalBusquedaTratamientos';

interface EditarPresupuestoPageProps {
  presupuestoId: string;
  onVolver?: () => void;
}

export default function EditarPresupuestoPage({ presupuestoId, onVolver }: EditarPresupuestoPageProps) {
  const idPresupuesto = presupuestoId;

  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [items, setItems] = useState<ItemPresupuesto[]>([]);
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalTratamientos, setMostrarModalTratamientos] = useState(false);

  // Cargar presupuesto al montar
  useEffect(() => {
    if (idPresupuesto) {
      cargarPresupuesto();
    }
  }, [idPresupuesto]);

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

  const cargarPresupuesto = async () => {
    if (!idPresupuesto) return;

    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerPresupuestoPorId(idPresupuesto);
      setPresupuesto(datos);
      
      // Convertir tratamientos del presupuesto a items editables
      const itemsConvertidos: ItemPresupuesto[] = datos.tratamientos.map((trat) => ({
        tratamientoId: trat.tratamientoId,
        descripcion: trat.descripcion,
        cantidad: 1, // Por defecto, ajustar según la estructura real
        precioUnitario: trat.precio,
        descuento: trat.descuento || 0,
        total: trat.precio - (trat.precio * (trat.descuento || 0)) / 100,
        piezaDental: '',
      }));

      setItems(itemsConvertidos);
      
      // Calcular descuento general basado en el total
      if (datos.descuentoTotal > 0 && datos.subtotal > 0) {
        const descuentoPorLineas = itemsConvertidos.reduce((sum, item) => {
          const subtotalLinea = item.precioUnitario * item.cantidad;
          const descuentoLinea = (subtotalLinea * item.descuento) / 100;
          return sum + descuentoLinea;
        }, 0);
        const subtotalDespuesDescuentos = datos.subtotal - descuentoPorLineas;
        if (subtotalDespuesDescuentos > 0) {
          const descuentoGen = ((datos.descuentoTotal - descuentoPorLineas) / subtotalDespuesDescuentos) * 100;
          setDescuentoGeneral(descuentoGen);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  const handleCambioPresupuesto = (campo: keyof Presupuesto, valor: any) => {
    if (!presupuesto) return;
    setPresupuesto({ ...presupuesto, [campo]: valor });
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

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    const descuentoPorLineas = items.reduce((sum, item) => {
      const subtotalLinea = item.precioUnitario * item.cantidad;
      const descuentoLinea = (subtotalLinea * item.descuento) / 100;
      return sum + descuentoLinea;
    }, 0);
    const subtotalDespuesDescuentos = subtotal - descuentoPorLineas;
    const descuentoGeneralCalculado = (subtotalDespuesDescuentos * descuentoGeneral) / 100;
    const descuentoTotal = descuentoPorLineas + descuentoGeneralCalculado;
    const total = subtotal - descuentoTotal;

    return { subtotal, descuentoTotal, total };
  };

  const handleGuardar = async () => {
    if (!presupuesto || !idPresupuesto) return;

    setError(null);
    setGuardando(true);

    try {
      const { subtotal, descuentoTotal, total } = calcularTotales();

      const presupuestoActualizado = {
        estado: presupuesto.estado,
        fechaVencimiento: presupuesto.fechaValidez,
        items: items.map((item) => ({
          tratamientoId: item.tratamientoId,
          descripcion: item.descripcion,
          piezaDental: item.piezaDental,
          caraDental: '',
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          descuentoItem: item.descuento,
          totalItem: item.total,
        })),
        subtotal,
        descuentoTotal,
        total,
        notas: presupuesto.notas,
      };

      await actualizarPresupuesto(idPresupuesto, presupuestoActualizado);

      // Redirigir o volver
      if (onVolver) {
        onVolver();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!presupuesto) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          No se pudo cargar el presupuesto
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onVolver && (
            <button
              onClick={onVolver}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Presupuesto</h1>
            <p className="text-sm text-gray-500 mt-1">
              Presupuesto #{presupuesto.numeroPresupuesto}
            </p>
          </div>
        </div>
        <button
          onClick={handleGuardar}
          disabled={guardando || items.length === 0}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" />
          <span>{guardando ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Formulario de datos generales */}
      <FormularioEdicionPresupuesto
        presupuesto={presupuesto}
        onCambio={handleCambioPresupuesto}
      />

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
        <TablaTratamientosEditable
          items={items}
          onEliminarItem={handleEliminarItem}
          onActualizarItem={handleActualizarItem}
        />
      </div>

      {/* Resumen Financiero */}
      <ResumenFinancieroEditable
        items={items}
        descuentoGeneral={descuentoGeneral}
        onDescuentoGeneralChange={setDescuentoGeneral}
      />

      {/* Modal de búsqueda de tratamientos */}
      <ModalBusquedaTratamientos
        isOpen={mostrarModalTratamientos}
        onClose={() => setMostrarModalTratamientos(false)}
        onTratamientoSeleccionado={handleAgregarTratamiento}
      />
    </div>
  );
}

