import { useState } from 'react';
import { Package, Calendar, AlertCircle, Wrench, FileBarChart } from 'lucide-react';
import InventarioEquiposPage from './InventarioEquiposPage';
import PreventiveMaintenancePlanPage from './PreventiveMaintenancePlanPage';
import CreateEditMaintenancePlanPage from './CreateEditMaintenancePlanPage';
import MaintenancePlanDetailPage from './MaintenancePlanDetailPage';
import PartesAveriaPage from './PartesAveriaPage';
import DetalleParteAveriaPage from './DetalleParteAveriaPage';
import CalendarioRevisionesTecnicasPage from './CalendarioRevisionesTecnicasPage';
import InformeCostesEquipamientoPage from './InformeCostesEquipamientoPage';
import { MaintenancePlan } from '../api/maintenanceApi';
import { ParteAveria } from '../api/partesAveriaApi';

type Vista = 'inventario' | 'mantenimiento-preventivo' | 'partes-averia' | 'calendario-revisiones' | 'informe-costes';
type VistaMantenimiento = 'lista' | 'crear' | 'editar' | 'detalle';
type VistaPartesAveria = 'lista' | 'detalle';

interface MantenimientoYEquipamientoPageProps {
  // Props opcionales para futuras funcionalidades del módulo
}

export default function MantenimientoYEquipamientoPage({}: MantenimientoYEquipamientoPageProps = {}) {
  const [vista, setVista] = useState<Vista>('inventario');
  const [vistaMantenimiento, setVistaMantenimiento] = useState<VistaMantenimiento>('lista');
  const [vistaPartesAveria, setVistaPartesAveria] = useState<VistaPartesAveria>('lista');
  const [planSeleccionado, setPlanSeleccionado] = useState<MaintenancePlan | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [parteAveriaId, setParteAveriaId] = useState<string | null>(null);

  const handleNuevoPlan = () => {
    setPlanSeleccionado(null);
    setPlanId(null);
    setVistaMantenimiento('crear');
  };

  const handleVerDetalle = (plan: MaintenancePlan) => {
    setPlanSeleccionado(plan);
    setPlanId(plan._id || null);
    setVistaMantenimiento('detalle');
  };

  const handleEditar = (plan: MaintenancePlan) => {
    setPlanSeleccionado(plan);
    setPlanId(plan._id || null);
    setVistaMantenimiento('editar');
  };

  const handleVolver = () => {
    setVistaMantenimiento('lista');
    setPlanSeleccionado(null);
    setPlanId(null);
  };

  const handleGuardado = () => {
    setVistaMantenimiento('lista');
    setPlanSeleccionado(null);
    setPlanId(null);
  };

  const handleVerDetalleParte = (parte: ParteAveria) => {
    if (parte._id) {
      setParteAveriaId(parte._id);
      setVistaPartesAveria('detalle');
    }
  };

  const handleVolverPartesAveria = () => {
    setVistaPartesAveria('lista');
    setParteAveriaId(null);
  };

  return (
    <div>
      {/* Navegación por pestañas */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-1 p-4">
          <button
            onClick={() => {
              setVista('inventario');
              setVistaMantenimiento('lista');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vista === 'inventario'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventario de Equipos
          </button>
          <button
            onClick={() => {
              setVista('mantenimiento-preventivo');
              setVistaMantenimiento('lista');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vista === 'mantenimiento-preventivo'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Plan de Mantenimiento Preventivo
          </button>
          <button
            onClick={() => {
              setVista('partes-averia');
              setVistaPartesAveria('lista');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vista === 'partes-averia'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Partes de Avería y Correctivos
          </button>
          <button
            onClick={() => {
              setVista('calendario-revisiones');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vista === 'calendario-revisiones'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Calendario de Revisiones Técnicas
          </button>
          <button
            onClick={() => {
              setVista('informe-costes');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vista === 'informe-costes'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileBarChart className="w-4 h-4" />
            Informe de Costes
          </button>
        </div>
      </div>

      {/* Contenido */}
      {vista === 'inventario' && <InventarioEquiposPage />}

      {vista === 'mantenimiento-preventivo' && (
        <>
          {vistaMantenimiento === 'lista' && (
            <PreventiveMaintenancePlanPage
              onNuevoPlan={handleNuevoPlan}
              onVerDetalle={handleVerDetalle}
              onEditar={handleEditar}
            />
          )}
          {vistaMantenimiento === 'crear' && (
            <CreateEditMaintenancePlanPage onVolver={handleVolver} onGuardado={handleGuardado} />
          )}
          {vistaMantenimiento === 'editar' && planId && (
            <CreateEditMaintenancePlanPage
              planId={planId}
              onVolver={handleVolver}
              onGuardado={handleGuardado}
            />
          )}
          {vistaMantenimiento === 'detalle' && planId && (
            <MaintenancePlanDetailPage
              planId={planId}
              onVolver={handleVolver}
              onEditar={(plan) => handleEditar(plan)}
            />
          )}
        </>
      )}

      {vista === 'partes-averia' && (
        <>
          {vistaPartesAveria === 'lista' && (
            <PartesAveriaPage onVerDetalle={handleVerDetalleParte} />
          )}
          {vistaPartesAveria === 'detalle' && parteAveriaId && (
            <DetalleParteAveriaPage
              parteId={parteAveriaId}
              onVolver={handleVolverPartesAveria}
            />
          )}
        </>
      )}

      {vista === 'calendario-revisiones' && <CalendarioRevisionesTecnicasPage />}

      {vista === 'informe-costes' && <InformeCostesEquipamientoPage />}
    </div>
  );
}

