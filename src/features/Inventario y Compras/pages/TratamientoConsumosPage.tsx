import { useMemo, useState, useEffect } from 'react';
import { ClipboardList, DollarSign, Package, TrendingUp, BarChart3, TrendingDown, AlertCircle, Activity } from 'lucide-react';
import TratamientoConsumosList from '../components/TratamientoConsumosList';

interface TratamientoConsumosPageProps {
  // Props opcionales para futuras funcionalidades
}

export default function TratamientoConsumosPage({}: TratamientoConsumosPageProps = {}) {
  const [tratamientosData, setTratamientosData] = useState<any[]>([]);

  useEffect(() => {
    // Datos falsos completos - NO usar API
    const datos = [
      { nombre: 'Limpieza Dental Profunda', precio: 85.00, items: 5, costoMateriales: 12.50, frecuencia: 45, margen: 85.3 },
      { nombre: 'Obturación Composite', precio: 120.00, items: 4, costoMateriales: 18.75, frecuencia: 68, margen: 84.4 },
      { nombre: 'Extracción Dental Simple', precio: 95.00, items: 6, costoMateriales: 15.20, frecuencia: 52, margen: 84.0 },
      { nombre: 'Blanqueamiento Dental', precio: 250.00, items: 3, costoMateriales: 45.00, frecuencia: 28, margen: 82.0 },
      { nombre: 'Endodoncia Unirradicular', precio: 350.00, items: 8, costoMateriales: 52.30, frecuencia: 35, margen: 85.1 },
      { nombre: 'Ortodoncia - Ajuste Brackets', precio: 75.00, items: 4, costoMateriales: 22.15, frecuencia: 42, margen: 70.5 },
      { nombre: 'Periodoncia - Raspado y Alisado', precio: 180.00, items: 5, costoMateriales: 28.40, frecuencia: 38, margen: 84.2 },
      { nombre: 'Implante Dental', precio: 1200.00, items: 7, costoMateriales: 285.50, frecuencia: 12, margen: 76.2 },
      { nombre: 'Corona Provisional', precio: 150.00, items: 4, costoMateriales: 19.80, frecuencia: 25, margen: 86.8 },
      { nombre: 'Profilaxis Dental', precio: 60.00, items: 3, costoMateriales: 8.25, frecuencia: 85, margen: 86.3 },
      { nombre: 'Endodoncia Birradicular', precio: 450.00, items: 9, costoMateriales: 68.90, frecuencia: 22, margen: 84.7 },
      { nombre: 'Ortodoncia - Colocación Brackets', precio: 200.00, items: 5, costoMateriales: 35.60, frecuencia: 18, margen: 82.2 },
      { nombre: 'Periodoncia - Cirugía Gingival', precio: 280.00, items: 6, costoMateriales: 42.15, frecuencia: 15, margen: 85.0 },
      { nombre: 'Reconstrucción con Poste', precio: 180.00, items: 5, costoMateriales: 31.20, frecuencia: 20, margen: 82.7 },
      { nombre: 'Aplicación de Flúor', precio: 40.00, items: 2, costoMateriales: 5.50, frecuencia: 72, margen: 86.3 },
      { nombre: 'Curetaje Subgingival', precio: 220.00, items: 6, costoMateriales: 38.50, frecuencia: 30, margen: 82.5 },
      { nombre: 'Incrustación Cerámica', precio: 320.00, items: 5, costoMateriales: 58.20, frecuencia: 16, margen: 81.8 },
      { nombre: 'Carilla Dental', precio: 380.00, items: 4, costoMateriales: 65.40, frecuencia: 14, margen: 82.8 },
      { nombre: 'Férula de Descarga', precio: 280.00, items: 3, costoMateriales: 48.50, frecuencia: 22, margen: 82.7 },
      { nombre: 'Pulpotomía', precio: 140.00, items: 5, costoMateriales: 24.30, frecuencia: 28, margen: 82.6 },
      { nombre: 'Sellado de Fisuras', precio: 55.00, items: 3, costoMateriales: 9.80, frecuencia: 58, margen: 82.2 },
      { nombre: 'Aplicación de Barniz Fluorado', precio: 45.00, items: 2, costoMateriales: 6.20, frecuencia: 65, margen: 86.2 },
      { nombre: 'Radiografía Panorámica', precio: 35.00, items: 2, costoMateriales: 4.50, frecuencia: 88, margen: 87.1 },
      { nombre: 'Consulta de Urgencia', precio: 65.00, items: 3, costoMateriales: 8.90, frecuencia: 48, margen: 86.3 },
    ];
    setTratamientosData(datos);
  }, []);

  // Datos mock para estadísticas - en producción vendrían de la API
  const estadisticasMock = useMemo(() => {
    const totalTratamientos = tratamientosData.length || 15;
    const valorTotalTratamientos = tratamientosData.reduce((sum, t) => sum + (t.precio || 0), 0) || 3750.00;
    const totalItemsConsumo = tratamientosData.reduce((sum, t) => sum + (t.items || 0), 0) || 85;
    const promedioItemsPorTratamiento = totalTratamientos > 0 ? totalItemsConsumo / totalTratamientos : 5.7;
    const costoTotalMateriales = tratamientosData.reduce((sum, t) => sum + (t.costoMateriales || 0), 0) || 695.45;
    const margenPromedio = totalTratamientos > 0 
      ? ((valorTotalTratamientos - costoTotalMateriales) / valorTotalTratamientos) * 100 
      : 81.5;
    
    const tratamientosMasCostosos = [...tratamientosData]
      .sort((a, b) => (b.precio || 0) - (a.precio || 0))
      .slice(0, 5)
      .map(t => ({
        nombre: t.nombre,
        precio: t.precio || 0,
        items: t.items || 0,
        costoMateriales: t.costoMateriales || 0,
      }));

    const tratamientosMasRentables = [...tratamientosData]
      .map(t => ({
        nombre: t.nombre,
        precio: t.precio || 0,
        costoMateriales: t.costoMateriales || 0,
        margen: ((t.precio || 0) - (t.costoMateriales || 0)) / (t.precio || 1) * 100,
      }))
      .sort((a, b) => b.margen - a.margen)
      .slice(0, 5);

    const materialesMasUsados = [
      { nombre: 'Guantes de Nitrilo', usos: 22, porcentaje: 91.7, categoria: 'Consumibles' },
      { nombre: 'Anestésico Lidocaína 2%', usos: 18, porcentaje: 75.0, categoria: 'Anestésicos' },
      { nombre: 'Agujas Desechables 27G', usos: 16, porcentaje: 66.7, categoria: 'Consumibles' },
      { nombre: 'Gel Desinfectante Clorhexidina', usos: 15, porcentaje: 62.5, categoria: 'Insumos Médicos' },
      { nombre: 'Resina Composite A2', usos: 12, porcentaje: 50.0, categoria: 'Materiales de Restauración' },
      { nombre: 'Seda Dental', usos: 11, porcentaje: 45.8, categoria: 'Consumibles' },
      { nombre: 'Algodón Estéril', usos: 10, porcentaje: 41.7, categoria: 'Consumibles' },
      { nombre: 'Gasa Estéril', usos: 9, porcentaje: 37.5, categoria: 'Consumibles' },
      { nombre: 'Cemento de Ionómero de Vidrio', usos: 8, porcentaje: 33.3, categoria: 'Materiales de Restauración' },
      { nombre: 'Fresas de Carburo Tungsteno', usos: 7, porcentaje: 29.2, categoria: 'Instrumental' },
    ];

    const tratamientosMasFrecuentes = [...tratamientosData]
      .sort((a, b) => (b.frecuencia || 0) - (a.frecuencia || 0))
      .slice(0, 5);

    const tratamientosMejorMargen = [...tratamientosData]
      .sort((a, b) => (b.margen || 0) - (a.margen || 0))
      .slice(0, 5);

    return {
      totalTratamientos,
      valorTotalTratamientos,
      totalItemsConsumo,
      promedioItemsPorTratamiento,
      costoTotalMateriales,
      margenPromedio,
      tratamientosMasCostosos,
      tratamientosMasRentables,
      materialesMasUsados,
      tratamientosMasFrecuentes,
      tratamientosMejorMargen,
    };
  }, [tratamientosData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ClipboardList className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consumos por Tratamiento</h1>
              <p className="text-gray-600 mt-1">Gestiona los materiales consumidos en cada tipo de tratamiento</p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tratamientos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticasMock.totalTratamientos}</p>
                <p className="text-xs text-gray-500 mt-1">Configurados</p>
              </div>
              <ClipboardList className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${estadisticasMock.valorTotalTratamientos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Precio acumulado</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items de Consumo</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticasMock.totalItemsConsumo}</p>
                <p className="text-xs text-gray-500 mt-1">Total de materiales</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio Items</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {estadisticasMock.promedioItemsPorTratamiento.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Por tratamiento</p>
              </div>
              <TrendingUp className="w-12 h-12 text-indigo-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Costo Total Materiales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${estadisticasMock.costoTotalMateriales.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Inversión en materiales</p>
              </div>
              <Package className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Margen Promedio</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {estadisticasMock.margenPromedio.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Rentabilidad promedio</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Promedio</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ${(estadisticasMock.valorTotalTratamientos / estadisticasMock.totalTratamientos).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Por tratamiento</p>
              </div>
              <Activity className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Tratamientos más costosos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Tratamientos Más Costosos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estadisticasMock.tratamientosMasCostosos.map((tratamiento, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-700 mb-2 truncate">{tratamiento.nombre}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${tratamiento.precio.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">{tratamiento.items} items</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Costo materiales: ${tratamiento.costoMateriales.toFixed(2)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((tratamiento.precio / estadisticasMock.valorTotalTratamientos) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tratamientos más rentables */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Tratamientos Más Rentables</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estadisticasMock.tratamientosMasRentables.map((tratamiento, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-700 mb-2 truncate">{tratamiento.nombre}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {tratamiento.margen.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">Margen</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Precio: ${tratamiento.precio.toFixed(2)} | Costo: ${tratamiento.costoMateriales.toFixed(2)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(tratamiento.margen, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Materiales más usados */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Materiales Más Utilizados</h2>
          </div>
          <div className="space-y-3">
            {estadisticasMock.materialesMasUsados.map((material, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{material.nombre}</p>
                    <p className="text-xs text-gray-500">{material.categoria}</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{material.usos} tratamientos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${material.porcentaje}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{material.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tratamientos más frecuentes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Tratamientos Más Frecuentes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estadisticasMock.tratamientosMasFrecuentes.map((tratamiento, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-gray-700 mb-2 truncate">{tratamiento.nombre}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{tratamiento.frecuencia} veces/mes</span>
                    <span className="text-xs text-gray-500">{tratamiento.items} items</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Margen: {tratamiento.margen.toFixed(1)}%
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((tratamiento.frecuencia / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tratamientos con mejor margen */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Tratamientos con Mejor Margen de Ganancia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estadisticasMock.tratamientosMejorMargen.map((tratamiento, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
                <p className="text-sm font-medium text-gray-700 mb-2 truncate">{tratamiento.nombre}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">{tratamiento.margen.toFixed(1)}%</span>
                    <span className="text-xs text-gray-500">Margen</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Precio: ${tratamiento.precio.toFixed(2)} | Costo: ${tratamiento.costoMateriales.toFixed(2)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(tratamiento.margen, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de tratamientos */}
      <TratamientoConsumosList />
    </div>
  );
}


