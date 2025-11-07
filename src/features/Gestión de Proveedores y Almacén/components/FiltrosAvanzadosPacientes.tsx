import { useState } from 'react';
import { Filter, X, Search, Calendar, DollarSign, Package, Stethoscope, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
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

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.demograficos?.nombre) count++;
    if (filtros.demograficos?.apellidos) count++;
    if (filtros.demograficos?.dni) count++;
    if (filtros.demograficos?.email) count++;
    if (filtros.demograficos?.telefono) count++;
    if (filtros.demograficos?.genero) count++;
    if (filtros.demograficos?.edadMin) count++;
    if (filtros.demograficos?.edadMax) count++;
    if (filtros.historialClinico?.tratamientoId) count++;
    if (filtros.comprasProducto?.productoId) count++;
    if (filtros.fechasVisita?.primeraVisitaDesde) count++;
    if (filtros.fechasVisita?.primeraVisitaHasta) count++;
    if (filtros.fechasVisita?.ultimaVisitaDesde) count++;
    if (filtros.fechasVisita?.ultimaVisitaHasta) count++;
    if (filtros.saldo?.saldoMin) count++;
    if (filtros.saldo?.saldoMax) count++;
    if (filtros.saldo?.tieneSaldo) count++;
    if (filtros.sedeId) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="p-4">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar pacientes..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mostrarFiltros || tieneFiltrosActivos()
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Filter size={18} className={mostrarFiltros || tieneFiltrosActivos() ? 'opacity-100' : 'opacity-70'} />
              <span>Filtros</span>
              {tieneFiltrosActivos() && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {contarFiltrosActivos()}
                </span>
              )}
              {mostrarFiltros ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {tieneFiltrosActivos() && (
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
              >
                <X size={18} />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            {/* Filtros Demográficos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search size={16} className="text-slate-700" />
                <h3 className="text-lg font-semibold text-gray-900">Datos Demográficos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Search size={16} className="inline mr-1" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={filtros.demograficos?.nombre || ''}
                    onChange={(e) => actualizarFiltro('nombre', e.target.value, 'demograficos')}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    placeholder="Nombre"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Apellidos</label>
                <input
                  type="text"
                  value={filtros.demograficos?.apellidos || ''}
                  onChange={(e) => actualizarFiltro('apellidos', e.target.value, 'demograficos')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Apellidos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">DNI/NIE</label>
                <input
                  type="text"
                  value={filtros.demograficos?.dni || ''}
                  onChange={(e) => actualizarFiltro('dni', e.target.value, 'demograficos')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="DNI/NIE"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={filtros.demograficos?.email || ''}
                  onChange={(e) => actualizarFiltro('email', e.target.value, 'demograficos')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  value={filtros.demograficos?.telefono || ''}
                  onChange={(e) => actualizarFiltro('telefono', e.target.value, 'demograficos')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Teléfono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Género</label>
                <select
                  value={filtros.demograficos?.genero || ''}
                  onChange={(e) => actualizarFiltro('genero', e.target.value, 'demograficos')}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Edad Mínima</label>
                <input
                  type="number"
                  value={filtros.demograficos?.edadMin || ''}
                  onChange={(e) => actualizarFiltro('edadMin', e.target.value ? parseInt(e.target.value) : undefined, 'demograficos')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Edad mínima"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Edad Máxima</label>
                <input
                  type="number"
                  value={filtros.demograficos?.edadMax || ''}
                  onChange={(e) => actualizarFiltro('edadMax', e.target.value ? parseInt(e.target.value) : undefined, 'demograficos')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Edad máxima"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Historial Clínico */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Stethoscope size={16} className="text-slate-700" />
              <h3 className="text-lg font-semibold text-gray-900">Historial Clínico</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ID Tratamiento</label>
                <input
                  type="text"
                  value={filtros.historialClinico?.tratamientoId || ''}
                  onChange={(e) => actualizarFiltro('tratamientoId', e.target.value, 'historialClinico')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="ID del tratamiento"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.historialClinico?.tratamientoRealizado || false}
                    onChange={(e) => actualizarFiltro('tratamientoRealizado', e.target.checked, 'historialClinico')}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Tratamiento realizado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filtros de Compras de Productos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-slate-700" />
              <h3 className="text-lg font-semibold text-gray-900">Compras de Productos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ID Producto</label>
                <input
                  type="text"
                  value={filtros.comprasProducto?.productoId || ''}
                  onChange={(e) => actualizarFiltro('productoId', e.target.value, 'comprasProducto')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="ID del producto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cantidad Mínima</label>
                <input
                  type="number"
                  value={filtros.comprasProducto?.cantidadMin || ''}
                  onChange={(e) => actualizarFiltro('cantidadMin', e.target.value ? parseInt(e.target.value) : undefined, 'comprasProducto')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Cantidad mínima"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Fechas de Visita */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-700" />
              <h3 className="text-lg font-semibold text-gray-900">Fechas de Visita</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primera Visita Desde</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.primeraVisitaDesde || ''}
                  onChange={(e) => actualizarFiltro('primeraVisitaDesde', e.target.value, 'fechasVisita')}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primera Visita Hasta</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.primeraVisitaHasta || ''}
                  onChange={(e) => actualizarFiltro('primeraVisitaHasta', e.target.value, 'fechasVisita')}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Última Visita Desde</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.ultimaVisitaDesde || ''}
                  onChange={(e) => actualizarFiltro('ultimaVisitaDesde', e.target.value, 'fechasVisita')}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Última Visita Hasta</label>
                <input
                  type="date"
                  value={filtros.fechasVisita?.ultimaVisitaHasta || ''}
                  onChange={(e) => actualizarFiltro('ultimaVisitaHasta', e.target.value, 'fechasVisita')}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Saldo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-slate-700" />
              <h3 className="text-lg font-semibold text-gray-900">Saldo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Saldo Mínimo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={filtros.saldo?.saldoMin || ''}
                  onChange={(e) => actualizarFiltro('saldoMin', e.target.value ? parseFloat(e.target.value) : undefined, 'saldo')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Saldo mínimo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Saldo Máximo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={filtros.saldo?.saldoMax || ''}
                  onChange={(e) => actualizarFiltro('saldoMax', e.target.value ? parseFloat(e.target.value) : undefined, 'saldo')}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Saldo máximo"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.saldo?.tieneSaldo || false}
                    onChange={(e) => actualizarFiltro('tieneSaldo', e.target.checked, 'saldo')}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Solo pacientes con saldo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filtro de Sede */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-700" />
              <h3 className="text-lg font-semibold text-gray-900">Sede</h3>
            </div>
            <div>
              <input
                type="text"
                value={filtros.sedeId || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, sedeId: e.target.value || undefined })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="ID de la sede"
              />
            </div>
          </div>

          {/* Resumen de resultados */}
          {tieneFiltrosActivos() && (
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{contarFiltrosActivos()} filtro(s) aplicado(s)</span>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}



