import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Empleado, FiltrosEmpleados, obtenerEmpleados, desactivarEmpleado } from '../api/empleadosApi';
import TablaEmpleados from '../components/TablaEmpleados';
import FiltrosBusquedaEmpleados from '../components/FiltrosBusquedaEmpleados';
import ModalGestionEmpleado from '../components/ModalGestionEmpleado';
import PaginacionEmpleados from '../components/PaginacionEmpleados';
import BotonCrearEmpleado from '../components/BotonCrearEmpleado';
import FichaEmpleadoDetailPage from './FichaEmpleadoDetailPage';
import NuevoEmpleadoPage from './NuevoEmpleadoPage';

export default function ListadoEmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosEmpleados>({
    page: 1,
    limit: 10,
  });
  const [paginacion, setPaginacion] = useState({
    totalPaginas: 1,
    paginaActual: 1,
    totalResultados: 0,
  });
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarNuevoEmpleado, setMostrarNuevoEmpleado] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [empleadoParaDetalle, setEmpleadoParaDetalle] = useState<string | null>(null);

  // Datos mock para sedes y clínicas (en producción vendrían de una API)
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  const clinicas = [
    { _id: '1', nombre: 'Clínica Central' },
    { _id: '2', nombre: 'Clínica Norte' },
    { _id: '3', nombre: 'Clínica Sur' },
  ];

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos completos de empleados
      const datosFalsos: Empleado[] = [
        {
          _id: '1',
          nombre: 'Juan',
          apellidos: 'Pérez García',
          dni: '12345678A',
          fechaNacimiento: '1985-05-15',
          direccion: {
            calle: 'Calle Mayor 12',
            ciudad: 'Madrid',
            codigoPostal: '28001',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'juan.perez@clinica.com',
            telefono: '+34 612 345 678',
          },
          datosProfesionales: {
            rol: 'Odontologo',
            especialidad: 'Ortodoncia',
            numeroColegiado: 'CO-12345',
          },
          datosContractuales: {
            tipoContrato: 'Indefinido',
            salario: 4500,
            fechaInicio: '2020-01-15',
          },
          clinicasAsignadas: [
            { _id: '1', nombre: 'Clínica Central' },
          ],
          activo: true,
          estado: 'Activo',
        },
        {
          _id: '2',
          nombre: 'María',
          apellidos: 'López Sánchez',
          dni: '23456789B',
          fechaNacimiento: '1990-08-22',
          direccion: {
            calle: 'Avenida de la Paz 45',
            ciudad: 'Madrid',
            codigoPostal: '28028',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'maria.lopez@clinica.com',
            telefono: '+34 623 456 789',
          },
          datosProfesionales: {
            rol: 'Odontologo',
            especialidad: 'Implantología',
            numeroColegiado: 'CO-23456',
          },
          datosContractuales: {
            tipoContrato: 'Indefinido',
            salario: 4800,
            fechaInicio: '2019-03-10',
          },
          clinicasAsignadas: [
            { _id: '1', nombre: 'Clínica Central' },
            { _id: '2', nombre: 'Clínica Norte' },
          ],
          activo: true,
          estado: 'Activo',
        },
        {
          _id: '3',
          nombre: 'Carlos',
          apellidos: 'Martínez Ruiz',
          dni: '34567890C',
          fechaNacimiento: '1988-12-05',
          direccion: {
            calle: 'Calle Norte 78',
            ciudad: 'Madrid',
            codigoPostal: '28002',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'carlos.martinez@clinica.com',
            telefono: '+34 634 567 890',
          },
          datosProfesionales: {
            rol: 'Higienista',
          },
          datosContractuales: {
            tipoContrato: 'Indefinido',
            salario: 2200,
            fechaInicio: '2021-06-01',
          },
          clinicasAsignadas: [
            { _id: '2', nombre: 'Clínica Norte' },
          ],
          activo: true,
          estado: 'Activo',
        },
        {
          _id: '4',
          nombre: 'Ana',
          apellidos: 'García Fernández',
          dni: '45678901D',
          fechaNacimiento: '1992-03-18',
          direccion: {
            calle: 'Calle Sur 23',
            ciudad: 'Madrid',
            codigoPostal: '28041',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'ana.garcia@clinica.com',
            telefono: '+34 645 678 901',
          },
          datosProfesionales: {
            rol: 'Recepcionista',
          },
          datosContractuales: {
            tipoContrato: 'Indefinido',
            salario: 1800,
            fechaInicio: '2022-02-15',
          },
          clinicasAsignadas: [
            { _id: '3', nombre: 'Clínica Sur' },
          ],
          activo: true,
          estado: 'Activo',
        },
        {
          _id: '5',
          nombre: 'Pedro',
          apellidos: 'Sánchez Torres',
          dni: '56789012E',
          fechaNacimiento: '1987-07-30',
          direccion: {
            calle: 'Avenida del Este 56',
            ciudad: 'Madrid',
            codigoPostal: '28032',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'pedro.sanchez@clinica.com',
            telefono: '+34 656 789 012',
          },
          datosProfesionales: {
            rol: 'Asistente',
          },
          datosContractuales: {
            tipoContrato: 'Temporal',
            salario: 1900,
            fechaInicio: '2023-09-01',
            fechaFin: '2024-08-31',
          },
          clinicasAsignadas: [
            { _id: '1', nombre: 'Clínica Central' },
          ],
          activo: true,
          estado: 'Activo',
        },
        {
          _id: '6',
          nombre: 'Lucía',
          apellidos: 'Fernández Moreno',
          dni: '67890123F',
          fechaNacimiento: '1995-11-12',
          direccion: {
            calle: 'Calle Oeste 89',
            ciudad: 'Madrid',
            codigoPostal: '28015',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'lucia.fernandez@clinica.com',
            telefono: '+34 667 890 123',
          },
          datosProfesionales: {
            rol: 'Odontologo',
            especialidad: 'Endodoncia',
            numeroColegiado: 'CO-34567',
          },
          datosContractuales: {
            tipoContrato: 'Indefinido',
            salario: 4600,
            fechaInicio: '2021-11-20',
          },
          clinicasAsignadas: [
            { _id: '3', nombre: 'Clínica Sur' },
          ],
          activo: true,
          estado: 'Activo',
        },
        {
          _id: '7',
          nombre: 'Roberto',
          apellidos: 'García López',
          dni: '78901234G',
          fechaNacimiento: '1983-04-25',
          direccion: {
            calle: 'Polígono Industrial, Nave 5',
            ciudad: 'Getafe',
            codigoPostal: '28905',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'roberto.garcia@clinica.com',
            telefono: '+34 678 901 234',
          },
          datosProfesionales: {
            rol: 'Gerente',
          },
          datosContractuales: {
            tipoContrato: 'Indefinido',
            salario: 5500,
            fechaInicio: '2018-01-10',
          },
          clinicasAsignadas: [
            { _id: '1', nombre: 'Clínica Central' },
            { _id: '2', nombre: 'Clínica Norte' },
            { _id: '3', nombre: 'Clínica Sur' },
          ],
          activo: true,
          estado: 'Activo',
        },
        {
          _id: '8',
          nombre: 'Sandra',
          apellidos: 'Martín Díaz',
          dni: '89012345H',
          fechaNacimiento: '1991-09-08',
          direccion: {
            calle: 'Calle Comercio 34',
            ciudad: 'Madrid',
            codigoPostal: '28013',
            provincia: 'Madrid',
            pais: 'España',
          },
          contacto: {
            email: 'sandra.martin@clinica.com',
            telefono: '+34 689 012 345',
          },
          datosProfesionales: {
            rol: 'RR.HH.',
          },
          datosContractuales: {
            tipoContrato: 'Indefinido',
            salario: 2500,
            fechaInicio: '2020-05-20',
          },
          clinicasAsignadas: [
            { _id: '1', nombre: 'Clínica Central' },
          ],
          activo: true,
          estado: 'Activo',
        },
      ];
      
      // Aplicar filtros
      let empleadosFiltrados = [...datosFalsos];
      
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        empleadosFiltrados = empleadosFiltrados.filter(e => 
          e.nombre.toLowerCase().includes(searchLower) ||
          e.apellidos.toLowerCase().includes(searchLower) ||
          e.dni.toLowerCase().includes(searchLower) ||
          e.contacto?.email.toLowerCase().includes(searchLower)
        );
      }
      
      if (filtros.rol) {
        empleadosFiltrados = empleadosFiltrados.filter(e => 
          e.datosProfesionales?.rol === filtros.rol
        );
      }
      
      if (filtros.estado) {
        empleadosFiltrados = empleadosFiltrados.filter(e => e.estado === filtros.estado);
      }
      
      // Paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 10;
      const total = empleadosFiltrados.length;
      const totalPaginas = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const empleadosPaginados = empleadosFiltrados.slice(startIndex, endIndex);
      
      setEmpleados(empleadosPaginados);
      setPaginacion({
        totalPaginas,
        paginaActual: page,
        totalResultados: total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los empleados');
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, [filtros]);

  const handleEditar = (empleado: Empleado) => {
    setEmpleadoSeleccionado(empleado);
    setMostrarModalCrear(true);
  };

  const handleVerDetalle = (empleado: Empleado) => {
    if (empleado._id) {
      setEmpleadoParaDetalle(empleado._id);
    }
  };

  const handleVolverDetalle = () => {
    setEmpleadoParaDetalle(null);
    cargarEmpleados();
  };

  const handleDesactivar = async (empleadoId: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simular desactivación
      console.log('Desactivando empleado:', empleadoId);
      cargarEmpleados();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al desactivar el empleado');
    }
  };

  const handleGuardar = () => {
    setMostrarModalCrear(false);
    setEmpleadoSeleccionado(null);
    cargarEmpleados();
  };

  const handleCerrarModal = () => {
    setMostrarModalCrear(false);
    setEmpleadoSeleccionado(null);
  };

  const handleNuevoEmpleadoCreado = (empleado: any) => {
    setMostrarNuevoEmpleado(false);
    cargarEmpleados();
    // Opcional: redirigir al detalle del empleado creado
    if (empleado._id) {
      setEmpleadoParaDetalle(empleado._id);
    }
  };

  const handleVolverNuevoEmpleado = () => {
    setMostrarNuevoEmpleado(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Listado de Empleados
                </h1>
                <p className="text-gray-600 mt-1">
                  Administra el personal de la clínica dental
                </p>
              </div>
            </div>
            <BotonCrearEmpleado onClick={() => setMostrarNuevoEmpleado(true)} />
          </div>
        </div>

        {/* Error */}
        {error && !empleadoParaDetalle && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {mostrarNuevoEmpleado ? (
          <NuevoEmpleadoPage
            onVolver={handleVolverNuevoEmpleado}
            onEmpleadoCreado={handleNuevoEmpleadoCreado}
          />
        ) : empleadoParaDetalle ? (
          <FichaEmpleadoDetailPage
            empleadoId={empleadoParaDetalle}
            onVolver={handleVolverDetalle}
            clinicas={clinicas}
          />
        ) : (
          <>
            {/* Filtros */}
            <FiltrosBusquedaEmpleados
              filtros={filtros}
              onFiltrosChange={setFiltros}
              sedes={sedes}
            />

            {/* Tabla */}
            <TablaEmpleados
              empleados={empleados}
              loading={loading}
              onEditar={handleEditar}
              onVerDetalle={handleVerDetalle}
              onDesactivar={handleDesactivar}
            />

            {/* Paginación */}
            {!loading && empleados.length > 0 && (
              <div className="mt-6">
                <PaginacionEmpleados
                  paginaActual={paginacion.paginaActual}
                  totalPaginas={paginacion.totalPaginas}
                  totalResultados={paginacion.totalResultados}
                  onPageChange={(page) => setFiltros({ ...filtros, page })}
                />
              </div>
            )}

            {/* Modales */}
            {mostrarModalCrear && (
              <ModalGestionEmpleado
                empleado={empleadoSeleccionado}
                onClose={handleCerrarModal}
                onSave={handleGuardar}
                sedes={sedes}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

