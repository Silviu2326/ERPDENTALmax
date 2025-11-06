import { useState, useEffect } from 'react';
import { Users, Download, Bookmark, Mail, MessageSquare, Send } from 'lucide-react';
import {
  FiltrosPacientes,
  PacienteLista,
  OrdenFiltros,
} from '../api/listasPacientesApi';
import FiltrosAvanzadosPacientes from '../components/FiltrosAvanzadosPacientes';
import TablaResultadosPacientes from '../components/TablaResultadosPacientes';
import ModalExportarLista from '../components/ModalExportarLista';
import PanelListasGuardadas from '../components/PanelListasGuardadas';

export default function ListasPacientesPage() {
  const [pacientes, setPacientes] = useState<PacienteLista[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPacientes>({});
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    limite: 20,
  });
  const [orden, setOrden] = useState<OrdenFiltros>({
    campo: 'apellidos',
    direccion: 'asc',
  });
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pacientesSeleccionados, setPacientesSeleccionados] = useState<Set<string>>(new Set());
  const [mostrarModalExportar, setMostrarModalExportar] = useState(false);
  const [mostrarPanelListas, setMostrarPanelListas] = useState(false);

  useEffect(() => {
    realizarBusqueda();
  }, [filtros, paginacion, orden]);

  const realizarBusqueda = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Datos falsos completos de pacientes
      const datosFalsos: PacienteLista[] = [
        {
          _id: '1',
          nombre: 'María',
          apellidos: 'García López',
          dni: '12345678A',
          email: 'maria.garcia@email.com',
          telefono: '+34 612 345 678',
          fechaNacimiento: '1985-05-15',
          ultimaVisita: '2024-03-10',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '2',
          nombre: 'Carlos',
          apellidos: 'Martínez Ruiz',
          dni: '23456789B',
          email: 'carlos.martinez@email.com',
          telefono: '+34 623 456 789',
          fechaNacimiento: '1990-08-22',
          ultimaVisita: '2024-02-28',
          saldo: 150.50,
          sedeId: '1',
        },
        {
          _id: '3',
          nombre: 'Ana',
          apellidos: 'Fernández Sánchez',
          dni: '34567890C',
          email: 'ana.fernandez@email.com',
          telefono: '+34 634 567 890',
          fechaNacimiento: '1988-12-05',
          ultimaVisita: '2024-03-15',
          saldo: 0,
          sedeId: '2',
        },
        {
          _id: '4',
          nombre: 'Pedro',
          apellidos: 'González Torres',
          dni: '45678901D',
          email: 'pedro.gonzalez@email.com',
          telefono: '+34 645 678 901',
          fechaNacimiento: '1992-03-18',
          ultimaVisita: '2023-12-20',
          saldo: 320.75,
          sedeId: '2',
        },
        {
          _id: '5',
          nombre: 'Lucía',
          apellidos: 'Moreno Díaz',
          dni: '56789012E',
          email: 'lucia.moreno@email.com',
          telefono: '+34 656 789 012',
          fechaNacimiento: '1987-07-30',
          ultimaVisita: '2024-03-18',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '6',
          nombre: 'Roberto',
          apellidos: 'Jiménez Vázquez',
          dni: '67890123F',
          email: 'roberto.jimenez@email.com',
          telefono: '+34 667 890 123',
          fechaNacimiento: '1995-11-12',
          ultimaVisita: '2024-01-15',
          saldo: 85.25,
          sedeId: '3',
        },
        {
          _id: '7',
          nombre: 'Sofía',
          apellidos: 'Ruiz Martín',
          dni: '78901234G',
          email: 'sofia.ruiz@email.com',
          telefono: '+34 678 901 234',
          fechaNacimiento: '1983-04-25',
          ultimaVisita: '2024-03-20',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '8',
          nombre: 'David',
          apellidos: 'Hernández Castro',
          dni: '89012345H',
          email: 'david.hernandez@email.com',
          telefono: '+34 689 012 345',
          fechaNacimiento: '1991-09-08',
          ultimaVisita: '2023-11-10',
          saldo: 450.00,
          sedeId: '2',
        },
        {
          _id: '9',
          nombre: 'Elena',
          apellidos: 'Torres Ramírez',
          dni: '90123456I',
          email: 'elena.torres@email.com',
          telefono: '+34 690 123 456',
          fechaNacimiento: '1989-06-14',
          ultimaVisita: '2024-03-12',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '10',
          nombre: 'Javier',
          apellidos: 'Morales Serrano',
          dni: '01234567J',
          email: 'javier.morales@email.com',
          telefono: '+34 601 234 567',
          fechaNacimiento: '1986-02-28',
          ultimaVisita: '2024-02-05',
          saldo: 125.00,
          sedeId: '3',
        },
        {
          _id: '11',
          nombre: 'Patricia',
          apellidos: 'López Gutiérrez',
          dni: '12345078K',
          email: 'patricia.lopez@email.com',
          telefono: '+34 612 345 678',
          fechaNacimiento: '1993-10-03',
          ultimaVisita: '2024-03-22',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '12',
          nombre: 'Miguel',
          apellidos: 'Ángel Pérez',
          dni: '23456189L',
          email: 'miguel.angel@email.com',
          telefono: '+34 623 456 789',
          fechaNacimiento: '1984-01-20',
          ultimaVisita: '2023-10-15',
          saldo: 280.50,
          sedeId: '2',
        },
        {
          _id: '13',
          nombre: 'Carmen',
          apellidos: 'López Gutiérrez',
          dni: '34567290M',
          email: 'carmen.lopez@email.com',
          telefono: '+34 634 567 890',
          fechaNacimiento: '1994-07-11',
          ultimaVisita: '2024-03-08',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '14',
          nombre: 'Francisco',
          apellidos: 'Javier Ruiz',
          dni: '45678301N',
          email: 'francisco.javier@email.com',
          telefono: '+34 645 678 901',
          fechaNacimiento: '1982-12-25',
          ultimaVisita: '2024-01-30',
          saldo: 95.75,
          sedeId: '3',
        },
        {
          _id: '15',
          nombre: 'Isabel',
          apellidos: 'Martínez Díaz',
          dni: '56789412O',
          email: 'isabel.martinez@email.com',
          telefono: '+34 656 789 012',
          fechaNacimiento: '1996-03-08',
          ultimaVisita: '2024-03-25',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '16',
          nombre: 'Laura',
          apellidos: 'Sánchez Pérez',
          dni: '67890523P',
          email: 'laura.sanchez@email.com',
          telefono: '+34 667 890 123',
          fechaNacimiento: '1981-09-17',
          ultimaVisita: '2023-09-20',
          saldo: 520.00,
          sedeId: '2',
        },
        {
          _id: '17',
          nombre: 'Antonio',
          apellidos: 'García López',
          dni: '78901634Q',
          email: 'antonio.garcia@email.com',
          telefono: '+34 678 901 234',
          fechaNacimiento: '1980-05-22',
          ultimaVisita: '2024-02-18',
          saldo: 0,
          sedeId: '1',
        },
        {
          _id: '18',
          nombre: 'Patricia',
          apellidos: 'Ruiz Martínez',
          dni: '89012745R',
          email: 'patricia.ruiz@email.com',
          telefono: '+34 689 012 345',
          fechaNacimiento: '1997-11-30',
          ultimaVisita: '2024-03-14',
          saldo: 75.25,
          sedeId: '3',
        },
        {
          _id: '19',
          nombre: 'Manuel',
          apellidos: 'Fernández Torres',
          dni: '90123856S',
          email: 'manuel.fernandez@email.com',
          telefono: '+34 690 123 456',
          fechaNacimiento: '1983-08-05',
          ultimaVisita: '2023-11-25',
          saldo: 210.50,
          sedeId: '2',
        },
        {
          _id: '20',
          nombre: 'Cristina',
          apellidos: 'Moreno Díaz',
          dni: '01234967T',
          email: 'cristina.moreno@email.com',
          telefono: '+34 601 234 567',
          fechaNacimiento: '1998-04-12',
          ultimaVisita: '2024-03-19',
          saldo: 0,
          sedeId: '1',
        },
      ];
      
      // Aplicar filtros básicos (simplificado)
      let pacientesFiltrados = [...datosFalsos];
      
      if (filtros.demograficos?.nombre) {
        pacientesFiltrados = pacientesFiltrados.filter(p => 
          p.nombre.toLowerCase().includes(filtros.demograficos!.nombre!.toLowerCase())
        );
      }
      
      if (filtros.demograficos?.apellidos) {
        pacientesFiltrados = pacientesFiltrados.filter(p => 
          p.apellidos.toLowerCase().includes(filtros.demograficos!.apellidos!.toLowerCase())
        );
      }
      
      if (filtros.sedeId) {
        pacientesFiltrados = pacientesFiltrados.filter(p => p.sedeId === filtros.sedeId);
      }
      
      // Aplicar orden
      if (orden.campo === 'apellidos') {
        pacientesFiltrados.sort((a, b) => {
          const comparison = a.apellidos.localeCompare(b.apellidos);
          return orden.direccion === 'asc' ? comparison : -comparison;
        });
      } else if (orden.campo === 'nombre') {
        pacientesFiltrados.sort((a, b) => {
          const comparison = a.nombre.localeCompare(b.nombre);
          return orden.direccion === 'asc' ? comparison : -comparison;
        });
      }
      
      // Paginación
      const total = pacientesFiltrados.length;
      const totalPaginas = Math.ceil(total / paginacion.limite);
      const startIndex = (paginacion.pagina - 1) * paginacion.limite;
      const endIndex = startIndex + paginacion.limite;
      const pacientesPaginados = pacientesFiltrados.slice(startIndex, endIndex);
      
      setPacientes(pacientesPaginados);
      setTotal(total);
      setTotalPaginas(totalPaginas);
      setPaginacion(prev => ({ ...prev, pagina: paginacion.pagina }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al filtrar pacientes');
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosPacientes) => {
    setFiltros(nuevosFiltros);
    setPaginacion(prev => ({ ...prev, pagina: 1 }));
    setPacientesSeleccionados(new Set());
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
    setPaginacion(prev => ({ ...prev, pagina: 1 }));
    setPacientesSeleccionados(new Set());
  };

  const handleOrdenar = (campo: string, direccion: 'asc' | 'desc') => {
    setOrden({ campo, direccion });
    setPaginacion(prev => ({ ...prev, pagina: 1 }));
  };

  const handleToggleSeleccionar = (pacienteId: string) => {
    setPacientesSeleccionados(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(pacienteId)) {
        nuevo.delete(pacienteId);
      } else {
        nuevo.add(pacienteId);
      }
      return nuevo;
    });
  };

  const handleToggleSeleccionarTodos = () => {
    if (pacientesSeleccionados.size === pacientes.length) {
      setPacientesSeleccionados(new Set());
    } else {
      setPacientesSeleccionados(new Set(pacientes.map(p => p._id)));
    }
  };

  const handlePageChange = (nuevaPagina: number) => {
    setPaginacion(prev => ({ ...prev, pagina: nuevaPagina }));
    setPacientesSeleccionados(new Set());
  };

  const handleExportar = async (formato: 'csv' | 'pdf') => {
    // TODO: Implementar exportación real
    console.log(`Exportando ${pacientesSeleccionados.size || total} pacientes en formato ${formato}`);
    alert(`La exportación en formato ${formato.toUpperCase()} se está procesando. Esto puede tomar unos momentos para listas grandes.`);
    setMostrarModalExportar(false);
  };

  const handleGuardarLista = async (nombre: string, filtrosGuardar: FiltrosPacientes) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 600));
    // Simular guardado
    console.log('Guardando lista:', nombre, filtrosGuardar);
    alert(`Lista "${nombre}" guardada correctamente`);
  };

  const handleCargarLista = (filtrosGuardados: FiltrosPacientes) => {
    setFiltros(filtrosGuardados);
    setPaginacion(prev => ({ ...prev, pagina: 1 }));
    setPacientesSeleccionados(new Set());
  };

  const handleAccionMasiva = (accion: string) => {
    if (pacientesSeleccionados.size === 0) {
      alert('Por favor, selecciona al menos un paciente');
      return;
    }

    switch (accion) {
      case 'email':
        // TODO: Implementar envío de email masivo
        alert(`Se enviará un email a ${pacientesSeleccionados.size} paciente(s)`);
        break;
      case 'sms':
        // TODO: Implementar envío de SMS masivo
        alert(`Se enviará un SMS a ${pacientesSeleccionados.size} paciente(s)`);
        break;
      default:
        console.log(`Acción ${accion} para ${pacientesSeleccionados.size} pacientes`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Listas de Pacientes</h1>
              <p className="text-gray-600 mt-1">
                Crea y gestiona listas dinámicas de pacientes basadas en criterios avanzados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarPanelListas(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              <Bookmark className="w-5 h-5" />
              Listas Guardadas
            </button>
            <button
              onClick={() => setMostrarModalExportar(true)}
              disabled={pacientes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filtros Avanzados */}
        <FiltrosAvanzadosPacientes
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpiarFiltros={handleLimpiarFiltros}
        />

        {/* Acciones Masivas */}
        {pacientesSeleccionados.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                {pacientesSeleccionados.size} paciente(s) seleccionado(s)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAccionMasiva('email')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Enviar Email
                </button>
                <button
                  onClick={() => handleAccionMasiva('sms')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Enviar SMS
                </button>
                <button
                  onClick={() => handleAccionMasiva('campaña')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Añadir a Campaña
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error al cargar los pacientes</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Tabla de resultados */}
        <TablaResultadosPacientes
          pacientes={pacientes}
          loading={loading}
          pacientesSeleccionados={pacientesSeleccionados}
          onToggleSeleccionar={handleToggleSeleccionar}
          onToggleSeleccionarTodos={handleToggleSeleccionarTodos}
          onOrdenar={handleOrdenar}
          ordenCampo={orden.campo}
          ordenDireccion={orden.direccion}
        />

        {/* Paginación */}
        {!loading && pacientes.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600">
              Mostrando {((paginacion.pagina - 1) * paginacion.limite) + 1} -{' '}
              {Math.min(paginacion.pagina * paginacion.limite, total)} de {total} pacientes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(paginacion.pagina - 1)}
                disabled={paginacion.pagina === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let paginaNum;
                  if (totalPaginas <= 5) {
                    paginaNum = i + 1;
                  } else if (paginacion.pagina <= 3) {
                    paginaNum = i + 1;
                  } else if (paginacion.pagina >= totalPaginas - 2) {
                    paginaNum = totalPaginas - 4 + i;
                  } else {
                    paginaNum = paginacion.pagina - 2 + i;
                  }
                  return (
                    <button
                      key={paginaNum}
                      onClick={() => handlePageChange(paginaNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        paginacion.pagina === paginaNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {paginaNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(paginacion.pagina + 1)}
                disabled={paginacion.pagina >= totalPaginas}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Modales */}
        <ModalExportarLista
          isOpen={mostrarModalExportar}
          onClose={() => setMostrarModalExportar(false)}
          totalPacientes={total}
          pacientesSeleccionados={pacientesSeleccionados.size}
          onExportar={handleExportar}
        />

        <PanelListasGuardadas
          isOpen={mostrarPanelListas}
          onClose={() => setMostrarPanelListas(false)}
          onCargarLista={handleCargarLista}
          onGuardarLista={async (nombre) => {
            await handleGuardarLista(nombre, filtros);
          }}
          filtrosActuales={filtros}
        />
      </div>
    </div>
  );
}

