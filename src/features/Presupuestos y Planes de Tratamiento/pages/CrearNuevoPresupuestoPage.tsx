import { useState } from 'react';
import { ArrowLeft, Receipt } from 'lucide-react';
import FormularioPresupuesto from '../components/FormularioPresupuesto';
import { crearPresupuesto, ItemPresupuesto } from '../api/presupuestosApi';

interface CrearNuevoPresupuestoPageProps {
  onVolver?: () => void;
}

export default function CrearNuevoPresupuestoPage({ onVolver }: CrearNuevoPresupuestoPageProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (presupuesto: {
    pacienteId: string;
    odontologoId: string;
    items: ItemPresupuesto[];
    notas?: string;
    fechaVencimiento?: string;
  }) => {
    setLoading(true);
    try {
      // Convertir items al formato esperado por la API
      const itemsParaAPI = presupuesto.items.map((item) => ({
        tratamientoId: item.tratamientoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        descuento: item.descuento,
        piezaDental: item.piezaDental || undefined,
      }));

      const nuevoPresupuesto = await crearPresupuesto({
        pacienteId: presupuesto.pacienteId,
        odontologoId: presupuesto.odontologoId,
        items: itemsParaAPI,
        notas: presupuesto.notas,
        fechaVencimiento: presupuesto.fechaVencimiento,
      });

      // Mostrar mensaje de éxito y volver
      alert(`Presupuesto ${nuevoPresupuesto.numeroPresupuesto} creado exitosamente`);
      if (onVolver) {
        onVolver();
      }
    } catch (error) {
      throw error; // Re-lanzar para que FormularioPresupuesto lo maneje
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Está seguro de que desea cancelar? Se perderán todos los datos no guardados.')) {
      if (onVolver) {
        onVolver();
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <Receipt className="w-8 h-8 text-blue-600" />
                <span>Crear Nuevo Presupuesto</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Crea un nuevo presupuesto para un paciente con los tratamientos necesarios
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <FormularioPresupuesto onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}

