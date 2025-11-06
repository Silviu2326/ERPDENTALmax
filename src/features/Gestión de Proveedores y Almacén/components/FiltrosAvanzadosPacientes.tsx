import { useState } from 'react';
import { Filter, X, Search, Calendar, DollarSign, Package, Stethoscope, MapPin } from 'lucide-react';
import { FiltrosPacientes } from '../api/listasPacientesApi';

interface FiltrosAvanzadosPacientesProps {
  filtros: FiltrosPacientes;
  onFiltrosChange: (filtros: FiltrosPacientes) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosAvanzadosPacientes({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
}: FiltrosAvanzadosPacientesProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const actualizarFiltro = (campo: string, valor: any, seccion: keyof FiltrosPacientes) => {
    onFiltrosChange({
      ...filtros,
      [seccion]: {
        ...filtros[seccion],
        [campo]: valor || undefined,
      },
    });
  };

  const limpiarFiltros = () => {
    onLimpiarFiltros();
  };

  const tieneFiltrosActivos = () => {
    return !!(
      filtros.demograficos?.nombre ||
      filtros.demograficos?.apellidos ||
      filtros.demograficos?.dni ||
      filtros.demograficos?.email ||
      filtros.demograficos?.telefono ||
      filtros.demograficos?.genero ||
      filtros.demograficos?.edadMin ||
      filtros.demograficos?.edadMax ||
      filtros.historialClinico?.tratamientoId ||
      filtros.comprasProducto?.productoId ||
      filtros.fechasVisita?.primeraVisitaDesde ||
      filtros.fechasVisita?.primeraVisitaHasta ||
      filtros.fechasVisita?.ultimaVisitaDesde ||
      filtros.fechasVisita?.ultimaVisitaHasta ||
      filtros.saldo?.saldoMin ||
      filtros.saldo?.saldoMax ||
      filtros.saldo?.tieneSaldo ||
      filtros.sedeId
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              mostrarFiltros || tieneFiltrosActivos()
                ? 'bg-blue-50 border border-blue-300 text-blue-700'
                : 'bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtros Avanzados</span>
            {tieneFiltrosActivos() && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                Activos
              </span>
            )}
          </button>
          {tieneFiltrosActivos() && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {mostrarFiltros && (
        <div className="p-6 space-y-6">
          {/* Filtros Demográficos */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Datos Demográficos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={filtros.demograficos?.nombre || ''}
                  onChange={(e) => actualizarFiltro('nombre', e.target.value, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  value={filtros.demograficos?.apellidos || ''}
                  onChange={(e) => actualizarFiltro('apellidos', e.target.value, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apellidos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI/NIE</label>
                <input
                  type="text"
                  value={filtros.demograficos?.dni || ''}
                  onChange={(e) => actualizarFiltro('dni', e.target.value, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="DNI/NIE"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={filtros.demograficos?.email || ''}
                  onChange={(e) => actualizarFiltro('email', e.target.value, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={filtros.demograficos?.telefono || ''}
                  onChange={(e) => actualizarFiltro('telefono', e.target.value, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Teléfono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select
                  value={filtros.demograficos?.genero || ''}
                  onChange={(e) => actualizarFiltro('genero', e.target.value, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad Mínima</label>
                <input
                  type="number"
                  value={filtros.demograficos?.edadMin || ''}
                  onChange={(e) => actualizarFiltro('edadMin', e.target.value ? parseInt(e.target.value) : undefined, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Edad mínima"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad Máxima</label>
                <input
                  type="number"
                  value={filtros.demograficos?.edadMax || ''}
                  onChange={(e) => actualizarFiltro('edadMax', e.target.value ? parseInt(e.target.value) : undefined, 'demograficos')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Edad máxima"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Historial Clínico */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Historial Clínico</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Tratamiento</label>
                <input
                  type="text"
                  value={filtros.historialClinico?.tratamientoId || ''}
                  onChange={(e) => actualizarFiltro('tratamientoId', e.target.value, 'historialClinico')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID del tratamiento"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.historialClinico?.tratamientoRealizado || false}
                    onChange={(e) => actualizarFiltro('tratamientoRealizado', e.target.checked, 'historialClinico')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tratamiento realizado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filtros de Compras de Productos */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Compras de Productos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Producto</label>
                <input
                  type="text"
                  value={filtros.comprasProducto?.productoId || ''}
                  onChange={(e) => actualizarFiltro('productoId', e.target.value, 'comprasProducto')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID del producto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Mínima</label>
                <input
                  type="number"
                  value={filtros.comprasProducto?.cantidadMin || ''}
                  onChange={(e) => actualizarFiltro('cantidadMin', e.target.value ? parseInt(e.target.value) : undefined, 'comprasProducto')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cantidad mínima"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Fechas de Visita */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Fechas de Visita</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primera Visita Desde</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.primeraVisitaDesde || ''}
                  onChange={(e) => actualizarFiltro('primeraVisitaDesde', e.target.value, 'fechasVisita')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primera Visita Hasta</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.primeraVisitaHasta || ''}
                  onChange={(e) => actualizarFiltro('primeraVisitaHasta', e.target.value, 'fechasVisita')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Última Visita Desde</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.ultimaVisitaDesde || ''}
                  onChange={(e) => actualizarFiltro('ultimaVisitaDesde', e.target.value, 'fechasVisita')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Última Visita Hasta</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.ultimaVisitaHasta || ''}
                  onChange={(e) => actualizarFiltro('ultimaVisitaHasta', e.target.value, 'fechasVisita')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Saldo */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Saldo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Mínimo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={filtros.saldo?.saldoMin || ''}
                  onChange={(e) => actualizarFiltro('saldoMin', e.target.value ? parseFloat(e.target.value) : undefined, 'saldo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Saldo mínimo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Máximo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={filtros.saldo?.saldoMax || ''}
                  onChange={(e) => actualizarFiltro('saldoMax', e.target.value ? parseFloat(e.target.value) : undefined, 'saldo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Saldo máximo"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.saldo?.tieneSaldo || false}
                    onChange={(e) => actualizarFiltro('tieneSaldo', e.target.checked, 'saldo')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Solo pacientes con saldo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filtro de Sede */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Sede</h3>
            </div>
            <div>
              <input
                type="text"
                value={filtros.sedeId || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, sedeId: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ID de la sede"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


