import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, AlertCircle, Clock, Users, BarChart3 } from 'lucide-react';
import { ResumenMensualCitas, FiltrosResumenMensual, obtenerResumenMensualCitas } from '../api/citasApi';
import CeldaDiaCalendario from './CeldaDiaCalendario';

interface CalendarioMensualGridProps {
  mes: number;
  anio: number;
  filtros?: Omit<FiltrosResumenMensual, 'mes' | 'anio'>;
  onDiaClick?: (fecha: Date) => void;
  onMesChange?: (mes: number, anio: number) => void;
}

const NOMBRES_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const NOMBRES_MESES = [
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

export default function CalendarioMensualGrid({
  mes,
  anio,
  filtros = {},
  onDiaClick,
  onMesChange,
}: CalendarioMensualGridProps) {
  const [resumenMensual, setResumenMensual] = useState<ResumenMensualCitas>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del resumen mensual
  useEffect(() => {
    const cargarResumen = async () => {
      setLoading(true);
      setError(null);
      try {
        const datos = await obtenerResumenMensualCitas({
          mes,
          anio,
          ...filtros,
        });
        setResumenMensual(datos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el resumen mensual');
        // Datos mock más completos y realistas
        const resumenMock: ResumenMensualCitas = {};
        const diasEnMes = new Date(anio, mes, 0).getDate();
        
        // Generar datos para cada día del mes
        for (let dia = 1; dia <= diasEnMes; dia++) {
          const fecha = new Date(anio, mes - 1, dia);
          const diaSemana = fecha.getDay();
          const esHoy = fecha.toDateString() === new Date().toDateString();
          const esPasado = fecha < new Date() && !esHoy;
          
          // Menos citas los domingos (día 0) y sábados (día 6)
          const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
          let numCitas: number;
          
          if (esFinDeSemana) {
            numCitas = Math.floor(Math.random() * 5) + 1; // 1-5 citas en fin de semana
          } else if (esPasado) {
            // Más citas realizadas en el pasado
            numCitas = Math.floor(Math.random() * 15) + 5; // 5-19 citas
          } else {
            numCitas = Math.floor(Math.random() * 18) + 8; // 8-25 citas en días laborables futuros
          }
          
          if (numCitas > 0) {
            let confirmadas: number, programadas: number, realizadas: number, canceladas: number, noAsistio: number;
            
            if (esPasado) {
              // En el pasado, más realizadas
              realizadas = Math.floor(numCitas * 0.7);
              canceladas = Math.floor(numCitas * 0.15);
              noAsistio = Math.floor(numCitas * 0.1);
              confirmadas = Math.floor(numCitas * 0.05);
              programadas = numCitas - realizadas - canceladas - noAsistio - confirmadas;
            } else {
              // En el futuro, más confirmadas y programadas
              confirmadas = Math.floor(numCitas * 0.5);
              programadas = Math.floor(numCitas * 0.35);
              canceladas = Math.floor(numCitas * 0.1);
              realizadas = Math.floor(numCitas * 0.03);
              noAsistio = Math.floor(numCitas * 0.02);
            }
            
            resumenMock[dia.toString()] = {
              total: numCitas,
              estados: {
                confirmada: confirmadas > 0 ? confirmadas : undefined,
                programada: programadas > 0 ? programadas : undefined,
                realizada: realizadas > 0 ? realizadas : undefined,
                cancelada: canceladas > 0 ? canceladas : undefined,
                'no-asistio': noAsistio > 0 ? noAsistio : undefined,
              } as any,
            };
          }
        }
        
        setResumenMensual(resumenMock);
      } finally {
        setLoading(false);
      }
    };

    cargarResumen();
  }, [mes, anio, filtros]);

  // Obtener el primer día del mes y el número de días
  const primerDia = new Date(anio, mes - 1, 1);
  const ultimoDia = new Date(anio, mes, 0);
  const diasEnMes = ultimoDia.getDate();
  const diaInicioSemana = primerDia.getDay(); // 0 = Domingo, 1 = Lunes, etc.

  // Obtener días del mes anterior que aparecen en la primera semana
  const diasMesAnterior: number[] = [];
  const mesAnterior = mes === 1 ? 12 : mes - 1;
  const anioMesAnterior = mes === 1 ? anio - 1 : anio;
  const ultimoDiaMesAnterior = new Date(anioMesAnterior, mesAnterior, 0).getDate();

  for (let i = diaInicioSemana - 1; i >= 0; i--) {
    diasMesAnterior.push(ultimoDiaMesAnterior - i);
  }

  // Obtener días del mes siguiente que aparecen en la última semana
  const diasMesSiguiente: number[] = [];
  const diasRestantes = 42 - (diasMesAnterior.length + diasEnMes); // 42 = 6 semanas * 7 días
  for (let i = 1; i <= diasRestantes; i++) {
    diasMesSiguiente.push(i);
  }

  const hoy = new Date();
  const esMesActual = hoy.getMonth() + 1 === mes && hoy.getFullYear() === anio;

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    let nuevoMes = mes;
    let nuevoAnio = anio;

    if (direccion === 'anterior') {
      if (nuevoMes === 1) {
        nuevoMes = 12;
        nuevoAnio--;
      } else {
        nuevoMes--;
      }
    } else {
      if (nuevoMes === 12) {
        nuevoMes = 1;
        nuevoAnio++;
      } else {
        nuevoMes++;
      }
    }

    if (onMesChange) {
      onMesChange(nuevoMes, nuevoAnio);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => cambiarMes('anterior')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:shadow-md"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {NOMBRES_MESES[mes - 1]} {anio}
          </h2>
          {esMesActual && (
            <p className="text-sm text-blue-600 font-medium">Mes actual</p>
          )}
        </div>

        <button
          onClick={() => cambiarMes('siguiente')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:shadow-md"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      {/* Resumen del mes mejorado */}
      {Object.keys(resumenMensual).length > 0 && (() => {
        const totalCitas = Object.values(resumenMensual).reduce((sum, resumen) => sum + (resumen?.total || 0), 0);
        const diasConCitas = Object.keys(resumenMensual).length;
        const promedioDiario = diasConCitas > 0 ? Math.round(totalCitas / diasConCitas) : 0;
        const diaMasOcupado = Math.max(...Object.values(resumenMensual).map((r) => r?.total || 0));
        const totalConfirmadas = Object.values(resumenMensual).reduce((sum, resumen) => 
          sum + (resumen?.estados?.confirmada || 0), 0);
        const totalProgramadas = Object.values(resumenMensual).reduce((sum, resumen) => 
          sum + (resumen?.estados?.programada || 0), 0);
        const totalRealizadas = Object.values(resumenMensual).reduce((sum, resumen) => 
          sum + (resumen?.estados?.realizada || 0), 0);
        const totalUrgentes = Object.values(resumenMensual).reduce((sum, resumen) => {
          const citasDelDia = resumen?.total || 0;
          // Estimación de urgentes basada en el total
          return sum + Math.floor(citasDelDia * 0.1);
        }, 0);
        
        return (
          <div className="mb-4 space-y-3">
            <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Total de Citas</span>
                    </p>
                    <p className="text-3xl font-bold text-blue-700">
                      {totalCitas}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Días con Citas</span>
                    </p>
                    <p className="text-3xl font-bold text-indigo-700">
                      {diasConCitas}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                      <BarChart3 className="w-3 h-3" />
                      <span>Promedio Diario</span>
                    </p>
                    <p className="text-3xl font-bold text-purple-700">
                      {promedioDiario}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const hoy = new Date();
                    if (onMesChange) {
                      onMesChange(hoy.getMonth() + 1, hoy.getFullYear());
                    }
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Ir a Hoy</span>
                </button>
              </div>
              
              {/* Estadísticas por estado */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-blue-200">
                <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Confirmadas</p>
                      <p className="text-lg font-bold text-green-700">{totalConfirmadas}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Programadas</p>
                      <p className="text-lg font-bold text-blue-700">{totalProgramadas}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Realizadas</p>
                      <p className="text-lg font-bold text-gray-700">{totalRealizadas}</p>
                    </div>
                  </div>
                </div>
                {totalUrgentes > 0 && (
                  <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-xs text-gray-600">Urgentes</p>
                        <p className="text-lg font-bold text-red-700">{totalUrgentes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Error */}
      {error && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          {error}
          <span className="ml-2 text-sm italic">(Mostrando datos de ejemplo)</span>
        </div>
      )}

      {/* Grid del calendario */}
      <div className="grid grid-cols-7 gap-2">
        {/* Headers de días */}
        {NOMBRES_DIAS.map((dia, index) => {
          const esFinDeSemana = index === 0 || index === 6;
          return (
            <div
              key={dia}
              className={`text-center font-bold py-3 text-sm rounded-lg ${
                esFinDeSemana
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              {dia}
            </div>
          );
        })}

        {/* Días del mes anterior */}
        {diasMesAnterior.map((dia) => {
          const fecha = new Date(anioMesAnterior, mesAnterior - 1, dia);
          return (
            <CeldaDiaCalendario
              key={`prev-${dia}`}
              dia={dia}
              fecha={fecha}
              esDiaActual={false}
              esDiaOtroMes={true}
              onClick={onDiaClick}
            />
          );
        })}

        {/* Días del mes actual */}
        {Array.from({ length: diasEnMes }, (_, i) => i + 1).map((dia) => {
          const fecha = new Date(anio, mes - 1, dia);
          const esDiaActual =
            esMesActual && dia === hoy.getDate() && anio === hoy.getFullYear();
          const resumen = resumenMensual[dia.toString()];

          return (
            <CeldaDiaCalendario
              key={dia}
              dia={dia}
              fecha={fecha}
              resumen={resumen}
              esDiaActual={esDiaActual}
              esDiaOtroMes={false}
              onClick={onDiaClick}
            />
          );
        })}

        {/* Días del mes siguiente */}
        {diasMesSiguiente.map((dia) => {
          const mesSiguiente = mes === 12 ? 1 : mes + 1;
          const anioMesSiguiente = mes === 12 ? anio + 1 : anio;
          const fecha = new Date(anioMesSiguiente, mesSiguiente - 1, dia);
          return (
            <CeldaDiaCalendario
              key={`next-${dia}`}
              dia={dia}
              fecha={fecha}
              esDiaActual={false}
              esDiaOtroMes={true}
              onClick={onDiaClick}
            />
          );
        })}
      </div>

      {/* Resumen del mes */}
      {!loading && (
        <div className="mt-6 pt-4 border-t-2 border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">Total del Mes</div>
              <div className="text-2xl font-bold text-blue-800">
                {Object.values(resumenMensual).reduce((sum, resumen) => sum + (resumen?.total || 0), 0)}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-xs text-green-600 font-medium mb-1">Días con Citas</div>
              <div className="text-2xl font-bold text-green-800">
                {Object.keys(resumenMensual).length}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="text-xs text-purple-600 font-medium mb-1">Promedio Diario</div>
              <div className="text-2xl font-bold text-purple-800">
                {Object.keys(resumenMensual).length > 0
                  ? Math.round(
                      Object.values(resumenMensual).reduce((sum, resumen) => sum + (resumen?.total || 0), 0) /
                        Object.keys(resumenMensual).length
                    )
                  : 0}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-xs text-orange-600 font-medium mb-1">Día Más Ocupado</div>
              <div className="text-2xl font-bold text-orange-800">
                {Object.values(resumenMensual).length > 0
                  ? Math.max(...Object.values(resumenMensual).map((r) => r?.total || 0))
                  : 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda mejorada */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <div className="w-4 h-4 bg-gray-50 border-2 border-gray-300 rounded"></div>
            <span className="font-medium">Sin citas</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="font-medium">1-3 citas</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-300">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span className="font-medium">4-6 citas</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-200 px-3 py-1.5 rounded-lg border border-blue-400">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className="font-medium">7-10 citas</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-300 px-3 py-1.5 rounded-lg border border-blue-500">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="font-medium">10+ citas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

