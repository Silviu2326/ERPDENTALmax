import { useState, useEffect } from 'react';
import { BarChart3, Users, Filter } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de CRM</h1>
              <p className="text-gray-600 mt-1">
                Gestión estratégica de relaciones con proveedores
              </p>
            </div>
          </div>
        </div>

        {/* KPIs Widget */}
        <ProveedorKPIsWidget />

        {/* Filtros */}
        <FiltrosCrmDashboard
          filtros={filtros}
          onFiltrosChange={setFiltros}
          proveedores={proveedores}
        />

        {/* Layout principal: Dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
          <div className="mb-6">
            <GraficoRendimientoProveedor
              proveedorId={proveedorSeleccionado}
              proveedorNombre={
                proveedores.find((p) => p._id === proveedorSeleccionado)?.nombreComercial
              }
              anio={anioSeleccionado}
            />
          </div>
        )}

        {/* Selector de proveedor para gráfico (opcional) */}
        {proveedores.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Ver rendimiento de proveedor:
              </label>
              <select
                value={proveedorSeleccionado || ''}
                onChange={(e) => setProveedorSeleccionado(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  );
}


