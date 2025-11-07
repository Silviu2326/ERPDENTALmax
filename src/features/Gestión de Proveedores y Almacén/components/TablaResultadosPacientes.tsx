import { useState } from 'react';
import { User, Phone, Mail, Calendar, DollarSign, CheckSquare, Square, Loader2 } from 'lucide-react';
import { PacienteLista } from '../api/listasPacientesApi';

interface TablaResultadosPacientesProps {
  pacientes: PacienteLista[];
  loading: boolean;
  pacientesSeleccionados: Set<string>;
  onToggleSeleccionar: (pacienteId: string) => void;
  onToggleSeleccionarTodos: () => void;
  onOrdenar: (campo: string, direccion: 'asc' | 'desc') => void;
  ordenCampo?: string;
  ordenDireccion?: 'asc' | 'desc';
}

export default function TablaResultadosPacientes({
  pacientes,
  loading,
  pacientesSeleccionados,
  onToggleSeleccionar,
  onToggleSeleccionarTodos,
  onOrdenar,
  ordenCampo,
  ordenDireccion,
}: TablaResultadosPacientesProps) {
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  const formatearSaldo = (saldo?: number) => {
    if (saldo === undefined || saldo === null) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(saldo);
  };

  const todosSeleccionados = pacientes.length > 0 && pacientes.every(p => pacientesSeleccionados.has(p._id));
  const algunosSeleccionados = pacientes.some(p => pacientesSeleccionados.has(p._id));

  const handleSort = (campo: string) => {
    const nuevaDireccion = ordenCampo === campo && ordenDireccion === 'asc' ? 'desc' : 'asc';
    onOrdenar(campo, nuevaDireccion);
  };

  const getSortIcon = (campo: string) => {
    if (ordenCampo !== campo) return null;
    return ordenDireccion === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando pacientes...</p>
      </div>
    );
  }

  if (pacientes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron pacientes</h3>
        <p className="text-gray-600 mb-4">Ajusta los filtros para obtener resultados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={onToggleSeleccionarTodos}
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  {todosSeleccionados ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('apellidos')}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Nombre Completo
                  {getSortIcon('apellidos') && <span className="text-blue-600">{getSortIcon('apellidos')}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('dni')}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  DNI/NIE
                  {getSortIcon('dni') && <span className="text-blue-600">{getSortIcon('dni')}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Contacto</th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('ultimaVisita')}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Última Visita
                  {getSortIcon('ultimaVisita') && <span className="text-blue-600">{getSortIcon('ultimaVisita')}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('saldo')}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Saldo
                  {getSortIcon('saldo') && <span className="text-blue-600">{getSortIcon('saldo')}</span>}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pacientes.map((paciente) => {
              const estaSeleccionado = pacientesSeleccionados.has(paciente._id);
              return (
                <tr
                  key={paciente._id}
                  className={`hover:bg-blue-50 transition-colors ${estaSeleccionado ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onToggleSeleccionar(paciente._id)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {estaSeleccionado ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {paciente.nombre} {paciente.apellidos}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {paciente.dni || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="flex flex-col gap-1">
                      {paciente.telefono && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{paciente.telefono}</span>
                        </div>
                      )}
                      {paciente.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-xs">{paciente.email}</span>
                        </div>
                      )}
                      {!paciente.telefono && !paciente.email && (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatearFecha(paciente.ultimaVisita)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-400" />
                      <span className={paciente.saldo && paciente.saldo > 0 ? 'text-red-600 font-medium' : 'text-slate-600'}>
                        {formatearSaldo(paciente.saldo)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {algunosSeleccionados && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
          <p className="text-sm text-blue-900 font-medium">
            {pacientesSeleccionados.size} paciente(s) seleccionado(s)
          </p>
        </div>
      )}
    </div>
  );
}



