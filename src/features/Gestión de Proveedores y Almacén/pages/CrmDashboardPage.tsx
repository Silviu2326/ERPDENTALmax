import { useState, useEffect } from 'react';
import { BarChart3, Users } from 'lucide-react';
import ProveedorKPIsWidget from '../components/Crm/ProveedorKPIsWidget';
import HistorialComunicacionList from '../components/Crm/HistorialComunicacionList';
import ContratosActivosTable from '../components/Crm/ContratosActivosTable';
import GraficoRendimientoProveedor from '../components/Crm/GraficoRendimientoProveedor';
import FiltrosCrmDashboard from '../components/Crm/FiltrosCrmDashboard';
import { FiltrosComunicaciones } from '../api/crmApi';
import { obtenerProveedores } from '../api/proveedoresApi';

export default function CrmDashboardPage() {
  const [filtros, setFiltros] = useState<FiltrosComunicaciones>({});
  const [proveedores, setProveedores] = useState<Array<{ _id: string; nombreComercial: string }>>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<string | null>(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Datos falsos completos de proveedores
      const proveedoresFalsos = [
        { _id: '1', nombreComercial: 'Dental Supplies Pro' },
        { _id: '2', nombreComercial: 'MedTech Solutions' },
        { _id: '3', nombreComercial: 'Dental Care Plus' },
        { _id: '4', nombreComercial: 'ProDental Equipment' },
        { _id: '5', nombreComercial: 'BioDental Materials' },
        { _id: '6', nombreComercial: 'Dental Innovations' },
        { _id: '7', nombreComercial: 'MaxiDental Supplies' },
        { _id: '8', nombreComercial: 'Premium Dental Tools' },
        { _id: '9', nombreComercial: 'LabDental Pro' },
        { _id: '10', nombreComercial: 'SteriDent Solutions' },
        { _id: '11', nombreComercial: 'Radiología Dental Avanzada' },
        { _id: '12', nombreComercial: 'OrthoMaterials' },
      ];
      
      setProveedores(proveedoresFalsos);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      // Datos mock para desarrollo
      setProveedores([
        { _id: '1', nombreComercial: 'Dental Supplies Pro' },
        { _id: '2', nombreComercial: 'MedTech Solutions' },
        { _id: '3', nombreComercial: 'Dental Care Plus' },
        { _id: '4', nombreComercial: 'ProDental Equipment' },
        { _id: '5', nombreComercial: 'BioDental Materials' },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Panel de CRM
                </h1>
                <p className="text-gray-600">
                  Gestión estratégica de relaciones con proveedores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* KPIs Widget */}
          <ProveedorKPIsWidget />

          {/* Filtros */}
          <FiltrosCrmDashboard
            filtros={filtros}
            onFiltrosChange={setFiltros}
            proveedores={proveedores}
          />

          {/* Layout principal: Dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda: Historial de Comunicaciones */}
            <div className="lg:col-span-2">
              <HistorialComunicacionList filtros={filtros} proveedores={proveedores} />
            </div>

            {/* Columna derecha: Contratos por Vencer */}
            <div>
              <ContratosActivosTable />
            </div>
          </div>

          {/* Gráfico de Rendimiento (si hay proveedor seleccionado) */}
          {proveedorSeleccionado && (
            <GraficoRendimientoProveedor
              proveedorId={proveedorSeleccionado}
              proveedorNombre={
                proveedores.find((p) => p._id === proveedorSeleccionado)?.nombreComercial
              }
              anio={anioSeleccionado}
            />
          )}

          {/* Selector de proveedor para gráfico (opcional) */}
          {proveedores.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Users size={16} />
                  Ver rendimiento de proveedor:
                </label>
                <select
                  value={proveedorSeleccionado || ''}
                  onChange={(e) => setProveedorSeleccionado(e.target.value || null)}
                  className="w-full md:w-auto rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor._id} value={proveedor._id}>
                      {proveedor.nombreComercial}
                    </option>
                  ))}
                </select>
                {proveedorSeleccionado && (
                  <select
                    value={anioSeleccionado}
                    onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
                    className="w-full md:w-auto rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const anio = new Date().getFullYear() - i;
                      return (
                        <option key={anio} value={anio}>
                          {anio}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


