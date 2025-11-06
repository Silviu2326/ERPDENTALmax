import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw } from 'lucide-react';
import {
  Nomina,
  FiltrosNominas,
  obtenerNominas,
  obtenerNominaPorId,
  RespuestaNominas,
} from '../api/nominasApi';
import TablaNominas from '../components/nominas/TablaNominas';
import ModalDetalleNomina from '../components/nominas/ModalDetalleNomina';
import PanelControlNominas from '../components/nominas/PanelControlNominas';
import FiltroPeriodoNomina from '../components/nominas/FiltroPeriodoNomina';

export default function NominasSalariosPage() {
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState({
    totalPaginas: 1,
    paginaActual: 1,
    totalResultados: 0,
  });
  const [nominaSeleccionada, setNominaSeleccionada] = useState<Nomina | null>(null);
  const [filtros, setFiltros] = useState<FiltrosNominas>({
    page: 1,
    limit: 20,
  });

  // Datos falsos para empleados
  const empleados = [
    { _id: 'emp1', nombre: 'Dr. Juan Pérez García' },
    { _id: 'emp2', nombre: 'Dra. María López Sánchez' },
    { _id: 'emp3', nombre: 'Carlos Martínez Ruiz' },
    { _id: 'emp4', nombre: 'Ana García Fernández' },
    { _id: 'emp5', nombre: 'Pedro Sánchez Torres' },
    { _id: 'emp6', nombre: 'Dra. Lucía Fernández Moreno' },
    { _id: 'emp7', nombre: 'Roberto García López' },
    { _id: 'emp8', nombre: 'Sandra Martín Díaz' },
  ];

  const cargarNominas = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Datos falsos completos de nóminas
      const datosFalsos: Nomina[] = [
        {
          _id: '1',
          empleadoId: 'emp1',
          empleadoNombre: 'Dr. Juan Pérez García',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 4500,
          totalComisiones: 3250,
          totalPercepciones: 7750,
          totalDeducciones: 1850,
          netoAPagar: 5900,
          estado: 'Pagada',
          desgloseComisiones: [
            {
              tratamientoId: 'trat1',
              paciente: 'María García López',
              montoTratamiento: 1200,
              porcentajeComision: 25,
              montoComision: 300,
            },
            {
              tratamientoId: 'trat2',
              paciente: 'Carlos Martínez Ruiz',
              montoTratamiento: 2500,
              porcentajeComision: 25,
              montoComision: 625,
            },
            {
              tratamientoId: 'trat3',
              paciente: 'Ana Fernández Sánchez',
              montoTratamiento: 1800,
              porcentajeComision: 25,
              montoComision: 450,
            },
            {
              tratamientoId: 'trat4',
              paciente: 'Pedro González Torres',
              montoTratamiento: 3200,
              porcentajeComision: 25,
              montoComision: 800,
            },
            {
              tratamientoId: 'trat5',
              paciente: 'Lucía Moreno Díaz',
              montoTratamiento: 1500,
              porcentajeComision: 25,
              montoComision: 375,
            },
            {
              tratamientoId: 'trat6',
              paciente: 'Roberto Jiménez Vázquez',
              montoTratamiento: 2800,
              porcentajeComision: 25,
              montoComision: 700,
            },
          ],
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 1200 },
            { concepto: 'Seguridad Social', monto: 450 },
            { concepto: 'Descuento por ausencias', monto: 200 },
          ],
        },
        {
          _id: '2',
          empleadoId: 'emp2',
          empleadoNombre: 'Dra. María López Sánchez',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 4800,
          totalComisiones: 4200,
          totalPercepciones: 9000,
          totalDeducciones: 2100,
          netoAPagar: 6900,
          estado: 'Pagada',
          desgloseComisiones: [
            {
              tratamientoId: 'trat7',
              paciente: 'Sofía Ruiz Martín',
              montoTratamiento: 3500,
              porcentajeComision: 30,
              montoComision: 1050,
            },
            {
              tratamientoId: 'trat8',
              paciente: 'David Hernández Castro',
              montoTratamiento: 2800,
              porcentajeComision: 30,
              montoComision: 840,
            },
            {
              tratamientoId: 'trat9',
              paciente: 'Elena Torres Ramírez',
              montoTratamiento: 4200,
              porcentajeComision: 30,
              montoComision: 1260,
            },
            {
              tratamientoId: 'trat10',
              paciente: 'Javier Morales Serrano',
              montoTratamiento: 3500,
              porcentajeComision: 30,
              montoComision: 1050,
            },
          ],
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 1500 },
            { concepto: 'Seguridad Social', monto: 480 },
            { concepto: 'Descuento por material', monto: 120 },
          ],
        },
        {
          _id: '3',
          empleadoId: 'emp3',
          empleadoNombre: 'Carlos Martínez Ruiz',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 2200,
          totalComisiones: 0,
          totalPercepciones: 2200,
          totalDeducciones: 440,
          netoAPagar: 1760,
          estado: 'Pagada',
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 220 },
            { concepto: 'Seguridad Social', monto: 220 },
          ],
        },
        {
          _id: '4',
          empleadoId: 'emp4',
          empleadoNombre: 'Ana García Fernández',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 1800,
          totalComisiones: 0,
          totalPercepciones: 1800,
          totalDeducciones: 360,
          netoAPagar: 1440,
          estado: 'Pagada',
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 180 },
            { concepto: 'Seguridad Social', monto: 180 },
          ],
        },
        {
          _id: '5',
          empleadoId: 'emp5',
          empleadoNombre: 'Pedro Sánchez Torres',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 1900,
          totalComisiones: 0,
          totalPercepciones: 1900,
          totalDeducciones: 380,
          netoAPagar: 1520,
          estado: 'Aprobada',
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 190 },
            { concepto: 'Seguridad Social', monto: 190 },
          ],
        },
        {
          _id: '6',
          empleadoId: 'emp6',
          empleadoNombre: 'Dra. Lucía Fernández Moreno',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 4600,
          totalComisiones: 2800,
          totalPercepciones: 7400,
          totalDeducciones: 1750,
          netoAPagar: 5650,
          estado: 'Pagada',
          desgloseComisiones: [
            {
              tratamientoId: 'trat11',
              paciente: 'Miguel Ángel Pérez',
              montoTratamiento: 2000,
              porcentajeComision: 25,
              montoComision: 500,
            },
            {
              tratamientoId: 'trat12',
              paciente: 'Carmen López Gutiérrez',
              montoTratamiento: 3200,
              porcentajeComision: 25,
              montoComision: 800,
            },
            {
              tratamientoId: 'trat13',
              paciente: 'Francisco Javier Ruiz',
              montoTratamiento: 2800,
              porcentajeComision: 25,
              montoComision: 700,
            },
            {
              tratamientoId: 'trat14',
              paciente: 'Isabel Martínez Díaz',
              montoTratamiento: 3200,
              porcentajeComision: 25,
              montoComision: 800,
            },
          ],
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 1200 },
            { concepto: 'Seguridad Social', monto: 450 },
            { concepto: 'Descuento por tardanzas', monto: 100 },
          ],
        },
        {
          _id: '7',
          empleadoId: 'emp7',
          empleadoNombre: 'Roberto García López',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 5500,
          totalComisiones: 0,
          totalPercepciones: 5500,
          totalDeducciones: 1375,
          netoAPagar: 4125,
          estado: 'Pagada',
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 1100 },
            { concepto: 'Seguridad Social', monto: 275 },
          ],
        },
        {
          _id: '8',
          empleadoId: 'emp8',
          empleadoNombre: 'Sandra Martín Díaz',
          periodo: { mes: 3, anio: 2024 },
          fechaCalculo: '2024-03-31T10:00:00Z',
          salarioBase: 2500,
          totalComisiones: 0,
          totalPercepciones: 2500,
          totalDeducciones: 500,
          netoAPagar: 2000,
          estado: 'Calculada',
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 250 },
            { concepto: 'Seguridad Social', monto: 250 },
          ],
        },
        {
          _id: '9',
          empleadoId: 'emp1',
          empleadoNombre: 'Dr. Juan Pérez García',
          periodo: { mes: 2, anio: 2024 },
          fechaCalculo: '2024-02-29T10:00:00Z',
          salarioBase: 4500,
          totalComisiones: 2950,
          totalPercepciones: 7450,
          totalDeducciones: 1780,
          netoAPagar: 5670,
          estado: 'Pagada',
          desgloseComisiones: [
            {
              tratamientoId: 'trat15',
              paciente: 'Laura Sánchez Pérez',
              montoTratamiento: 1500,
              porcentajeComision: 25,
              montoComision: 375,
            },
            {
              tratamientoId: 'trat16',
              paciente: 'Antonio García López',
              montoTratamiento: 2200,
              porcentajeComision: 25,
              montoComision: 550,
            },
            {
              tratamientoId: 'trat17',
              paciente: 'Patricia Ruiz Martínez',
              montoTratamiento: 3200,
              porcentajeComision: 25,
              montoComision: 800,
            },
            {
              tratamientoId: 'trat18',
              paciente: 'Manuel Fernández Torres',
              montoTratamiento: 2800,
              porcentajeComision: 25,
              montoComision: 700,
            },
            {
              tratamientoId: 'trat19',
              paciente: 'Cristina Moreno Díaz',
              montoTratamiento: 2100,
              porcentajeComision: 25,
              montoComision: 525,
            },
          ],
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 1200 },
            { concepto: 'Seguridad Social', monto: 450 },
            { concepto: 'Descuento por material', monto: 130 },
          ],
        },
        {
          _id: '10',
          empleadoId: 'emp2',
          empleadoNombre: 'Dra. María López Sánchez',
          periodo: { mes: 2, anio: 2024 },
          fechaCalculo: '2024-02-29T10:00:00Z',
          salarioBase: 4800,
          totalComisiones: 3900,
          totalPercepciones: 8700,
          totalDeducciones: 2030,
          netoAPagar: 6670,
          estado: 'Pagada',
          desgloseComisiones: [
            {
              tratamientoId: 'trat20',
              paciente: 'Fernando Jiménez Vázquez',
              montoTratamiento: 3000,
              porcentajeComision: 30,
              montoComision: 900,
            },
            {
              tratamientoId: 'trat21',
              paciente: 'Marta González Serrano',
              montoTratamiento: 3500,
              porcentajeComision: 30,
              montoComision: 1050,
            },
            {
              tratamientoId: 'trat22',
              paciente: 'Jorge Ramírez Castro',
              montoTratamiento: 4000,
              porcentajeComision: 30,
              montoComision: 1200,
            },
            {
              tratamientoId: 'trat23',
              paciente: 'Natalia Morales Hernández',
              montoTratamiento: 2500,
              porcentajeComision: 30,
              montoComision: 750,
            },
          ],
          desgloseDeducciones: [
            { concepto: 'IRPF (Retención)', monto: 1500 },
            { concepto: 'Seguridad Social', monto: 480 },
            { concepto: 'Descuento por ausencias', monto: 50 },
          ],
        },
      ];

      // Aplicar filtros
      let nominasFiltradas = [...datosFalsos];
      
      if (filtros.mes) {
        nominasFiltradas = nominasFiltradas.filter(n => n.periodo.mes === filtros.mes);
      }
      
      if (filtros.anio) {
        nominasFiltradas = nominasFiltradas.filter(n => n.periodo.anio === filtros.anio);
      }
      
      if (filtros.empleadoId) {
        nominasFiltradas = nominasFiltradas.filter(n => n.empleadoId === filtros.empleadoId);
      }
      
      if (filtros.estado) {
        nominasFiltradas = nominasFiltradas.filter(n => n.estado === filtros.estado);
      }

      // Paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 20;
      const total = nominasFiltradas.length;
      const totalPaginas = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const nominasPaginadas = nominasFiltradas.slice(startIndex, endIndex);

      setNominas(nominasPaginadas);
      setPaginacion({
        totalPaginas,
        paginaActual: page,
        totalResultados: total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las nóminas');
      setNominas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNominas();
  }, [filtros]);

  const handleVerDetalle = async (nomina: Nomina) => {
    if (nomina._id) {
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 400));
        // Usar la nómina directamente ya que tiene todos los datos
        setNominaSeleccionada(nomina);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
        setNominaSeleccionada(nomina);
      }
    } else {
      setNominaSeleccionada(nomina);
    }
  };

  const handleCerrarModal = () => {
    setNominaSeleccionada(null);
  };

  const handleActualizarDespuesCambio = () => {
    cargarNominas();
  };

  const handleFiltroChange = (nuevosFiltros: Partial<FiltrosNominas>) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros, page: 1 }));
  };

  const handlePageChange = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: nuevaPagina }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nóminas y Salarios</h1>
              <p className="text-gray-600 mt-1">
                Gestión y cálculo de nóminas para empleados de la clínica
              </p>
            </div>
          </div>
          <button
            onClick={cargarNominas}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Panel de Control */}
        <PanelControlNominas onCalcularCompletado={handleActualizarDespuesCambio} />

        {/* Filtros */}
        <FiltroPeriodoNomina
          mes={filtros.mes}
          anio={filtros.anio}
          empleadoId={filtros.empleadoId}
          estado={filtros.estado}
          onMesChange={(mes) => handleFiltroChange({ mes })}
          onAnioChange={(anio) => handleFiltroChange({ anio })}
          onEmpleadoChange={(empleadoId) => handleFiltroChange({ empleadoId })}
          onEstadoChange={(estado) => handleFiltroChange({ estado })}
          empleados={empleados}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">Error al cargar los datos</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Tabla de Nóminas */}
        <TablaNominas nominas={nominas} loading={loading} onVerDetalle={handleVerDetalle} />

        {/* Paginación */}
        {paginacion.totalPaginas > 1 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando página {paginacion.paginaActual} de {paginacion.totalPaginas} (
              {paginacion.totalResultados} resultados)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(paginacion.paginaActual - 1)}
                disabled={paginacion.paginaActual === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(paginacion.paginaActual + 1)}
                disabled={paginacion.paginaActual === paginacion.totalPaginas}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Modal de Detalle */}
        <ModalDetalleNomina
          nomina={nominaSeleccionada}
          onClose={handleCerrarModal}
          onActualizar={handleActualizarDespuesCambio}
        />
      </div>
    </div>
  );
}


