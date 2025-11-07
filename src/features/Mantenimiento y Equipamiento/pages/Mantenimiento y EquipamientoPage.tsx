import { useState } from 'react';
import { Package, Calendar, AlertCircle, Wrench, FileBarChart, Settings } from 'lucide-react';
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

  const tabs = [
    { id: 'inventario' as Vista, label: 'Inventario de Equipos', icon: Package },
    { id: 'mantenimiento-preventivo' as Vista, label: 'Plan de Mantenimiento Preventivo', icon: Calendar },
    { id: 'partes-averia' as Vista, label: 'Partes de Avería y Correctivos', icon: AlertCircle },
    { id: 'calendario-revisiones' as Vista, label: 'Calendario de Revisiones Técnicas', icon: Wrench },
    { id: 'informe-costes' as Vista, label: 'Informe de Costes', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Settings size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Mantenimiento y Equipamiento
                </h1>
                <p className="text-gray-600">
                  Gestión integral del equipamiento clínico, mantenimiento preventivo y correctivo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sistema de Tabs */}
          <div className="bg-white shadow-sm rounded-xl p-0">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = vista === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'inventario') {
                          setVista('inventario');
                          setVistaMantenimiento('lista');
                        } else if (tab.id === 'mantenimiento-preventivo') {
                          setVista('mantenimiento-preventivo');
                          setVistaMantenimiento('lista');
                        } else if (tab.id === 'partes-averia') {
                          setVista('partes-averia');
                          setVistaPartesAveria('lista');
                        } else {
                          setVista(tab.id);
                        }
                      }}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contenido según la pestaña activa */}
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
      </div>
    </div>
  );
}

