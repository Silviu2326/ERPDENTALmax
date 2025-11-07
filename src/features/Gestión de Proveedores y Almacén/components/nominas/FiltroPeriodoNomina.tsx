import { Calendar } from 'lucide-react';

interface FiltroPeriodoNominaProps {
  mes: number | undefined;
  anio: number | undefined;
  empleadoId: string | undefined;
  estado: 'Calculada' | 'Aprobada' | 'Pagada' | undefined;
  onMesChange: (mes: number | undefined) => void;
  onAnioChange: (anio: number | undefined) => void;
  onEmpleadoChange: (empleadoId: string | undefined) => void;
  onEstadoChange: (estado: 'Calculada' | 'Aprobada' | 'Pagada' | undefined) => void;
  empleados?: Array<{ _id: string; nombre: string }>;
}

export default function FiltroPeriodoNomina({
  mes,
  anio,
  empleadoId,
  estado,
  onMesChange,
  onAnioChange,
  onEmpleadoChange,
  onEstadoChange,
  empleados = [],
}: FiltroPeriodoNominaProps) {
  const meses = [
    'Todos',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const estados = ['Todos', 'Calculada', 'Aprobada', 'Pagada'];
  const anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-slate-600" />
          <h3 className="text-sm font-medium text-slate-700">Filtros de Búsqueda</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mes
            </label>
            <select
              value={mes || 0}
              onChange={(e) => onMesChange(e.target.value === '0' ? undefined : Number(e.target.value))}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              {meses.map((nombreMes, index) => (
                <option key={index} value={index}>
                  {nombreMes}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Año
            </label>
            <select
              value={anio || 0}
              onChange={(e) => onAnioChange(e.target.value === '0' ? undefined : Number(e.target.value))}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value={0}>Todos</option>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Empleado
            </label>
            <select
              value={empleadoId || ''}
              onChange={(e) => onEmpleadoChange(e.target.value || undefined)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="">Todos</option>
              {empleados.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado
            </label>
            <select
              value={estado || ''}
              onChange={(e) => onEstadoChange(e.target.value || undefined)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="">Todos</option>
              {estados.slice(1).map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}



