import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import {
  FaseTratamiento,
  Procedimiento,
  Tratamiento,
} from '../api/planesTratamientoApi';
import FaseTratamientoCard from './FaseTratamientoCard';
import SelectorTratamientos from './SelectorTratamientos';
import ResumenFinancieroPlan from './ResumenFinancieroPlan';
import OdontogramaInteractivoPlan from './OdontogramaInteractivoPlan';

interface PlanTratamientoBuilderProps {
  pacienteId: string;
  odontologoId: string;
  onGuardar: (plan: {
    pacienteId: string;
    odontologoId: string;
    fases: FaseTratamiento[];
    total: number;
    descuento: number;
    notas?: string;
  }) => void;
  onCancelar: () => void;
  planInicial?: {
    fases: FaseTratamiento[];
    descuento: number;
    notas?: string;
  };
}

export default function PlanTratamientoBuilder({
  pacienteId,
  odontologoId,
  onGuardar,
  onCancelar,
  planInicial,
}: PlanTratamientoBuilderProps) {
  const [fases, setFases] = useState<FaseTratamiento[]>(
    planInicial?.fases || []
  );
  const [descuento, setDescuento] = useState(planInicial?.descuento || 0);
  const [notas, setNotas] = useState(planInicial?.notas || '');
  const [tratamientoSeleccionado, setTratamientoSeleccionado] =
    useState<Tratamiento | null>(null);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<string | null>(
    null
  );
  const [caraSeleccionada, setCaraSeleccionada] = useState<string | null>(null);
  const [faseActiva, setFaseActiva] = useState<number | null>(null);
  const [mostrarOdontograma, setMostrarOdontograma] = useState(false);

  const agregarFase = () => {
    const nuevaFase: FaseTratamiento = {
      nombre: `Fase ${fases.length + 1}`,
      descripcion: '',
      procedimientos: [],
    };
    setFases([...fases, nuevaFase]);
    setFaseActiva(fases.length);
  };

  const eliminarFase = (indice: number) => {
    setFases(fases.filter((_, i) => i !== indice));
    if (faseActiva === indice) {
      setFaseActiva(null);
    }
  };

  const editarFase = (indice: number, faseEditada: FaseTratamiento) => {
    const nuevasFases = [...fases];
    nuevasFases[indice] = faseEditada;
    setFases(nuevasFases);
  };

  const agregarProcedimiento = (faseIndice: number) => {
    if (!tratamientoSeleccionado) {
      alert('Por favor, selecciona un tratamiento primero');
      return;
    }

    const nuevoProcedimiento: Procedimiento = {
      tratamiento: {
        _id: tratamientoSeleccionado._id,
        codigo: tratamientoSeleccionado.codigo,
        nombre: tratamientoSeleccionado.nombre,
        precioBase: tratamientoSeleccionado.precioBase,
      },
      piezaDental: piezaSeleccionada || undefined,
      cara: caraSeleccionada || undefined,
      precio: tratamientoSeleccionado.precioBase,
      estadoProcedimiento: 'Pendiente',
    };

    const nuevasFases = [...fases];
    if (!nuevasFases[faseIndice].procedimientos) {
      nuevasFases[faseIndice].procedimientos = [];
    }
    nuevasFases[faseIndice].procedimientos.push(nuevoProcedimiento);
    setFases(nuevasFases);

    // Limpiar selecciones
    setTratamientoSeleccionado(null);
    setPiezaSeleccionada(null);
    setCaraSeleccionada(null);
    setMostrarOdontograma(false);
  };

  const eliminarProcedimiento = (faseIndice: number, procedimientoIndice: number) => {
    const nuevasFases = [...fases];
    nuevasFases[faseIndice].procedimientos.splice(procedimientoIndice, 1);
    setFases(nuevasFases);
  };

  const editarProcedimiento = (
    faseIndice: number,
    procedimientoIndice: number,
    procedimiento: Procedimiento
  ) => {
    const nuevasFases = [...fases];
    nuevasFases[faseIndice].procedimientos[procedimientoIndice] = procedimiento;
    setFases(nuevasFases);
  };

  const calcularTotal = () => {
    return fases.reduce((sum, fase) => {
      return (
        sum +
        fase.procedimientos.reduce((faseSum, proc) => faseSum + proc.precio, 0)
      );
    }, 0);
  };

  const handleGuardar = () => {
    if (fases.length === 0) {
      alert('Debes agregar al menos una fase al plan de tratamiento');
      return;
    }

    const total = calcularTotal();
    const descuentoAplicado = (total * descuento) / 100;
    const totalNeto = total - descuentoAplicado;

    onGuardar({
      pacienteId,
      odontologoId,
      fases,
      total: totalNeto,
      descuento,
      notas,
    });
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleExportarPDF = () => {
    // TODO: Implementar exportación a PDF
    alert('Función de exportación a PDF en desarrollo');
  };

  return (
    <div className="space-y-6">
      {/* Barra de acciones */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Constructor de Plan de Tratamiento</h2>
        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Constructor de fases */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selector de tratamientos */}
          <SelectorTratamientos
            onTratamientoSeleccionado={(tratamiento) => {
              setTratamientoSeleccionado(tratamiento);
              setMostrarOdontograma(true);
            }}
            tratamientoSeleccionado={tratamientoSeleccionado}
          />

          {/* Odontograma (mostrar solo si hay tratamiento seleccionado) */}
          {mostrarOdontograma && tratamientoSeleccionado && (
            <OdontogramaInteractivoPlan
              piezaSeleccionada={piezaSeleccionada || undefined}
              onPiezaSeleccionada={setPiezaSeleccionada}
              onCaraSeleccionada={(pieza, cara) => {
                setPiezaSeleccionada(pieza);
                setCaraSeleccionada(cara);
              }}
            />
          )}

          {/* Botón para agregar fase */}
          <button
            onClick={agregarFase}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Agregar Fase de Tratamiento
          </button>

          {/* Lista de fases */}
          <div className="space-y-4">
            {fases.map((fase, index) => (
              <FaseTratamientoCard
                key={index}
                fase={fase}
                indice={index}
                onEliminar={() => eliminarFase(index)}
                onEditar={(faseEditada) => editarFase(index, faseEditada)}
                onAgregarProcedimiento={(faseIndice) => {
                  if (faseIndice === index) {
                    agregarProcedimiento(faseIndice);
                  }
                }}
                onEliminarProcedimiento={eliminarProcedimiento}
                onEditarProcedimiento={editarProcedimiento}
              />
            ))}
          </div>

          {/* Campo de notas */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas del Plan de Tratamiento
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Observaciones, recomendaciones o información adicional sobre el plan de tratamiento..."
            />
          </div>
        </div>

        {/* Columna derecha: Resumen financiero */}
        <div className="lg:col-span-1">
          <ResumenFinancieroPlan
            fases={fases}
            descuento={descuento}
            onDescuentoChange={setDescuento}
            onImprimir={handleImprimir}
            onExportarPDF={handleExportarPDF}
          />
        </div>
      </div>
    </div>
  );
}


