import { useState, useEffect, useMemo } from 'react';
import { Package, RefreshCw, Plus, AlertCircle } from 'lucide-react';
import {
  obtenerMateriales,
  FiltrosMateriales,
  RespuestaMateriales,
  Material,
} from '../api/materialesApi';
import TablaMateriales from '../components/TablaMateriales';
import FiltrosMaterialesComponent from '../components/FiltrosMateriales';
import PaginacionTabla from '../components/PaginacionTabla';
import MetricCards from '../components/MetricCards';

interface ListadoMaterialesPageProps {
  onNuevoMaterial?: () => void;
}

export default function ListadoMaterialesPage({ onNuevoMaterial }: ListadoMaterialesPageProps = {}) {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosMateriales>({
    page: 1,
    limit: 20,
    sortBy: 'nombre',
    sortOrder: 'asc',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [todosLosMateriales, setTodosLosMateriales] = useState<Material[]>([]);

  // Datos mock para categorías (en producción vendrían de una API)
  const categorias = [
    { _id: '1', nombre: 'Consumibles' },
    { _id: '2', nombre: 'Materiales de Restauración' },
    { _id: '3', nombre: 'Anestésicos' },
    { _id: '4', nombre: 'Implantes' },
    { _id: '5', nombre: 'Instrumental' },
    { _id: '6', nombre: 'Equipamiento' },
    { _id: '7', nombre: 'Insumos Médicos' },
    { _id: '8', nombre: 'Ortodoncia' },
  ];

  // Calcular estadísticas para KPIs
  const estadisticas = useMemo(() => {
    const totalMateriales = todosLosMateriales.length;
    const valorTotalInventario = todosLosMateriales.reduce(
      (sum, m) => sum + m.stockActual * m.costoUnitario,
      0
    );
    const materialesBajoStock = todosLosMateriales.filter(
      (m) => m.stockActual < m.stockMinimo && m.stockActual > 0
    ).length;
    const materialesAgotados = todosLosMateriales.filter((m) => m.stockActual === 0).length;

    return {
      totalMateriales,
      valorTotalInventario,
      materialesBajoStock,
      materialesAgotados,
    };
  }, [todosLosMateriales]);

  const cargarMateriales = async () => {
    setLoading(true);
    setError(null);
    try {
      // En producción, esto llamaría a la API real
      // const respuesta: RespuestaMateriales = await obtenerMateriales(filtros);
      // setMateriales(respuesta.data);
      // setTotal(respuesta.total);
      // setTotalPages(Math.ceil(respuesta.total / (filtros.limit || 20)));

      // Datos falsos completos - NO usar API - Ampliado con más materiales
      const materialesMock: Material[] = [
        {
          _id: '1',
          codigoSKU: 'MAT-001',
          nombre: 'Resina Composite A2',
          descripcion: 'Resina composite de alta calidad para restauraciones estéticas clase II',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 45,
          stockMinimo: 20,
          unidadMedida: 'unidades',
          costoUnitario: 12.50,
          fechaCaducidad: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '2',
          codigoSKU: 'MAT-002',
          nombre: 'Anestésico Lidocaína 2%',
          descripcion: 'Anestésico local para procedimientos dentales, ampollas de 1.8ml',
          categoria: { _id: '3', nombre: 'Anestésicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 8,
          stockMinimo: 15,
          unidadMedida: 'ampollas',
          costoUnitario: 8.75,
          fechaCaducidad: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento B',
          estado: 'activo',
          createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '3',
          codigoSKU: 'MAT-003',
          nombre: 'Implante Dental Titanio',
          descripcion: 'Implante dental de titanio grado médico, diámetro 4.1mm, longitud 10mm',
          categoria: { _id: '4', nombre: 'Implantes' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 0,
          stockMinimo: 5,
          unidadMedida: 'unidades',
          costoUnitario: 250.00,
          ubicacion: 'Almacén B - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '4',
          codigoSKU: 'MAT-004',
          nombre: 'Guantes de Nitrilo',
          descripcion: 'Guantes desechables de nitrilo, talla M, caja de 100 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 120,
          stockMinimo: 50,
          unidadMedida: 'cajas',
          costoUnitario: 15.00,
          ubicacion: 'Almacén A - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '5',
          codigoSKU: 'MAT-005',
          nombre: 'Cemento de Ionómero de Vidrio',
          descripcion: 'Cemento de ionómero de vidrio para restauraciones temporales',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 32,
          stockMinimo: 25,
          unidadMedida: 'unidades',
          costoUnitario: 18.90,
          fechaCaducidad: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          estado: 'activo',
          createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '6',
          codigoSKU: 'MAT-006',
          nombre: 'Agujas Desechables 27G',
          descripcion: 'Agujas desechables estériles calibre 27G, caja de 100 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 15,
          stockMinimo: 20,
          unidadMedida: 'cajas',
          costoUnitario: 22.50,
          ubicacion: 'Almacén A - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '7',
          codigoSKU: 'MAT-007',
          nombre: 'Brackets Metálicos Autoligantes',
          descripcion: 'Brackets metálicos autoligantes para ortodoncia, juego completo',
          categoria: { _id: '8', nombre: 'Ortodoncia' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 8,
          stockMinimo: 10,
          unidadMedida: 'juegos',
          costoUnitario: 185.00,
          ubicacion: 'Almacén B - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '8',
          codigoSKU: 'MAT-008',
          nombre: 'Hilo Dental Super Floss',
          descripcion: 'Hilo dental super floss para pacientes con aparatos ortodóncicos',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 85,
          stockMinimo: 40,
          unidadMedida: 'unidades',
          costoUnitario: 3.25,
          ubicacion: 'Almacén A - Estantería 6',
          estado: 'activo',
          createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '9',
          codigoSKU: 'MAT-009',
          nombre: 'Gel Desinfectante Clorhexidina',
          descripcion: 'Gel desinfectante con clorhexidina al 0.12%, tubo de 500ml',
          categoria: { _id: '7', nombre: 'Insumos Médicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 25,
          stockMinimo: 15,
          unidadMedida: 'tubos',
          costoUnitario: 9.80,
          fechaCaducidad: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '10',
          codigoSKU: 'MAT-010',
          nombre: 'Fresas de Carburo Tungsteno',
          descripcion: 'Juego de fresas de carburo de tungsteno, 6 piezas',
          categoria: { _id: '5', nombre: 'Instrumental' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 12,
          stockMinimo: 8,
          unidadMedida: 'juegos',
          costoUnitario: 45.00,
          ubicacion: 'Almacén B - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '11',
          codigoSKU: 'MAT-011',
          nombre: 'Mascarillas Quirúrgicas N95',
          descripcion: 'Mascarillas quirúrgicas N95, caja de 20 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 18,
          stockMinimo: 25,
          unidadMedida: 'cajas',
          costoUnitario: 28.50,
          ubicacion: 'Almacén A - Estantería 7',
          estado: 'activo',
          createdAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '12',
          codigoSKU: 'MAT-012',
          nombre: 'Seda Dental',
          descripcion: 'Seda dental encerada, rollo de 50 metros',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 65,
          stockMinimo: 30,
          unidadMedida: 'rollos',
          costoUnitario: 2.15,
          ubicacion: 'Almacén A - Estantería 6',
          estado: 'activo',
          createdAt: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '13',
          codigoSKU: 'MAT-013',
          nombre: 'Resina Composite B1',
          descripcion: 'Resina composite color B1 para restauraciones anteriores',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 28,
          stockMinimo: 15,
          unidadMedida: 'unidades',
          costoUnitario: 13.20,
          fechaCaducidad: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '14',
          codigoSKU: 'MAT-014',
          nombre: 'Anestésico Articaina 4%',
          descripcion: 'Anestésico local articaina 4% con epinefrina 1:100.000',
          categoria: { _id: '3', nombre: 'Anestésicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 12,
          stockMinimo: 10,
          unidadMedida: 'ampollas',
          costoUnitario: 9.50,
          fechaCaducidad: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento A',
          estado: 'activo',
          createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '15',
          codigoSKU: 'MAT-015',
          nombre: 'Implante Dental Zirconio',
          descripcion: 'Implante dental de zirconio, diámetro 3.5mm, longitud 8mm',
          categoria: { _id: '4', nombre: 'Implantes' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 3,
          stockMinimo: 5,
          unidadMedida: 'unidades',
          costoUnitario: 320.00,
          ubicacion: 'Almacén B - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '16',
          codigoSKU: 'MAT-016',
          nombre: 'Guantes de Nitrilo Talla L',
          descripcion: 'Guantes desechables de nitrilo, talla L, caja de 100 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 95,
          stockMinimo: 50,
          unidadMedida: 'cajas',
          costoUnitario: 15.50,
          ubicacion: 'Almacén A - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '17',
          codigoSKU: 'MAT-017',
          nombre: 'Cofferdam Látex',
          descripcion: 'Cofferdam de látex, tamaño mediano, caja de 25 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 7,
          stockMinimo: 12,
          unidadMedida: 'cajas',
          costoUnitario: 35.00,
          ubicacion: 'Almacén A - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '18',
          codigoSKU: 'MAT-018',
          nombre: 'Lámpara de Polimerización LED',
          descripcion: 'Lámpara LED de polimerización de alta intensidad, 1200mW/cm²',
          categoria: { _id: '6', nombre: 'Equipamiento' },
          proveedorPrincipal: { _id: '4', nombre: 'Tecnología Dental' },
          stockActual: 5,
          stockMinimo: 4,
          unidadMedida: 'unidades',
          costoUnitario: 320.00,
          ubicacion: 'Almacén B - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '19',
          codigoSKU: 'MAT-019',
          nombre: 'Radiografía Digital Sensor',
          descripcion: 'Sensor digital para radiografías intraorales, tamaño 2',
          categoria: { _id: '6', nombre: 'Equipamiento' },
          proveedorPrincipal: { _id: '4', nombre: 'Tecnología Dental' },
          stockActual: 2,
          stockMinimo: 3,
          unidadMedida: 'unidades',
          costoUnitario: 1250.00,
          ubicacion: 'Almacén B - Estantería 2',
          estado: 'activo',
          createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '20',
          codigoSKU: 'MAT-020',
          nombre: 'Gutapercha',
          descripcion: 'Conos de gutapercha para endodoncia, calibre 25',
          categoria: { _id: '5', nombre: 'Instrumental' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 150,
          stockMinimo: 100,
          unidadMedida: 'conos',
          costoUnitario: 0.85,
          ubicacion: 'Almacén B - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '21',
          codigoSKU: 'MAT-021',
          nombre: 'Limas Endodóncicas',
          descripcion: 'Juego de limas endodóncicas rotatorias, 6 piezas',
          categoria: { _id: '5', nombre: 'Instrumental' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 10,
          stockMinimo: 8,
          unidadMedida: 'juegos',
          costoUnitario: 85.00,
          ubicacion: 'Almacén B - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '22',
          codigoSKU: 'MAT-022',
          nombre: 'Alambre Ortodóncico',
          descripcion: 'Alambre de acero inoxidable para ortodoncia, 0.016 pulgadas',
          categoria: { _id: '8', nombre: 'Ortodoncia' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 45,
          stockMinimo: 30,
          unidadMedida: 'metros',
          costoUnitario: 12.50,
          ubicacion: 'Almacén B - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '23',
          codigoSKU: 'MAT-023',
          nombre: 'Ligaduras Elásticas',
          descripcion: 'Ligaduras elásticas para ortodoncia, caja de 200 unidades',
          categoria: { _id: '8', nombre: 'Ortodoncia' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 18,
          stockMinimo: 15,
          unidadMedida: 'cajas',
          costoUnitario: 28.00,
          ubicacion: 'Almacén B - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '24',
          codigoSKU: 'MAT-024',
          nombre: 'Curetas Periodontales',
          descripcion: 'Juego de curetas periodontales, 6 piezas',
          categoria: { _id: '5', nombre: 'Instrumental' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 8,
          stockMinimo: 6,
          unidadMedida: 'juegos',
          costoUnitario: 95.00,
          ubicacion: 'Almacén B - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '25',
          codigoSKU: 'MAT-025',
          nombre: 'Antiséptico Bucal Clorhexidina',
          descripcion: 'Enjuague bucal con clorhexidina al 0.12%, botella de 500ml',
          categoria: { _id: '7', nombre: 'Insumos Médicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 22,
          stockMinimo: 20,
          unidadMedida: 'botellas',
          costoUnitario: 11.50,
          fechaCaducidad: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '26',
          codigoSKU: 'MAT-026',
          nombre: 'Gasa Estéril',
          descripcion: 'Gasa estéril para procedimientos quirúrgicos, paquete de 10 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 35,
          stockMinimo: 25,
          unidadMedida: 'paquetes',
          costoUnitario: 8.25,
          ubicacion: 'Almacén A - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '27',
          codigoSKU: 'MAT-027',
          nombre: 'Algodón Estéril',
          descripcion: 'Algodón estéril para procedimientos dentales, paquete de 50 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 28,
          stockMinimo: 20,
          unidadMedida: 'paquetes',
          costoUnitario: 6.50,
          ubicacion: 'Almacén A - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '28',
          codigoSKU: 'MAT-028',
          nombre: 'Gel Blanqueador',
          descripcion: 'Gel blanqueador dental profesional, tubo de 30ml',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 15,
          stockMinimo: 10,
          unidadMedida: 'tubos',
          costoUnitario: 45.00,
          fechaCaducidad: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          estado: 'activo',
          createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '29',
          codigoSKU: 'MAT-029',
          nombre: 'Férulas Personalizadas',
          descripcion: 'Férulas de blanqueamiento personalizadas, unidad',
          categoria: { _id: '6', nombre: 'Equipamiento' },
          proveedorPrincipal: { _id: '4', nombre: 'Tecnología Dental' },
          stockActual: 12,
          stockMinimo: 8,
          unidadMedida: 'unidades',
          costoUnitario: 75.00,
          ubicacion: 'Almacén B - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '30',
          codigoSKU: 'MAT-030',
          nombre: 'Pilar de Cicatrización',
          descripcion: 'Pilar de cicatrización para implantes dentales, altura 4mm',
          categoria: { _id: '4', nombre: 'Implantes' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 18,
          stockMinimo: 12,
          unidadMedida: 'unidades',
          costoUnitario: 45.00,
          ubicacion: 'Almacén B - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '31',
          codigoSKU: 'MAT-031',
          nombre: 'Fresas Quirúrgicas',
          descripcion: 'Juego de fresas quirúrgicas para implantes, 8 piezas',
          categoria: { _id: '5', nombre: 'Instrumental' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 6,
          stockMinimo: 5,
          unidadMedida: 'juegos',
          costoUnitario: 125.00,
          ubicacion: 'Almacén B - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '32',
          codigoSKU: 'MAT-032',
          nombre: 'Cemento Endodóncico',
          descripcion: 'Cemento sellador endodóncico, tubo de 5ml',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 20,
          stockMinimo: 15,
          unidadMedida: 'tubos',
          costoUnitario: 28.50,
          fechaCaducidad: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          estado: 'activo',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '33',
          codigoSKU: 'MAT-033',
          nombre: 'Resina Composite D3',
          descripcion: 'Resina composite color D3 para restauraciones posteriores',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 38,
          stockMinimo: 20,
          unidadMedida: 'unidades',
          costoUnitario: 12.80,
          fechaCaducidad: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '34',
          codigoSKU: 'MAT-034',
          nombre: 'Anestésico Mepivacaína 3%',
          descripcion: 'Anestésico local mepivacaína 3% sin vasoconstrictor, ampollas de 1.8ml',
          categoria: { _id: '3', nombre: 'Anestésicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 10,
          stockMinimo: 12,
          unidadMedida: 'ampollas',
          costoUnitario: 9.25,
          fechaCaducidad: new Date(Date.now() + 190 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento C',
          estado: 'activo',
          createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '35',
          codigoSKU: 'MAT-035',
          nombre: 'Implante Dental Titanio 3.5mm',
          descripcion: 'Implante dental de titanio grado médico, diámetro 3.5mm, longitud 8mm',
          categoria: { _id: '4', nombre: 'Implantes' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 5,
          stockMinimo: 4,
          unidadMedida: 'unidades',
          costoUnitario: 235.00,
          ubicacion: 'Almacén B - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '36',
          codigoSKU: 'MAT-036',
          nombre: 'Guantes de Nitrilo Talla S',
          descripcion: 'Guantes desechables de nitrilo, talla S, caja de 100 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 88,
          stockMinimo: 50,
          unidadMedida: 'cajas',
          costoUnitario: 15.00,
          ubicacion: 'Almacén A - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 142 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '37',
          codigoSKU: 'MAT-037',
          nombre: 'Cemento de Fosfato de Zinc',
          descripcion: 'Cemento de fosfato de zinc para cementación de coronas y puentes',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 24,
          stockMinimo: 18,
          unidadMedida: 'unidades',
          costoUnitario: 22.40,
          fechaCaducidad: new Date(Date.now() + 220 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          estado: 'activo',
          createdAt: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '38',
          codigoSKU: 'MAT-038',
          nombre: 'Agujas Desechables 30G',
          descripcion: 'Agujas desechables estériles calibre 30G, caja de 100 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 22,
          stockMinimo: 20,
          unidadMedida: 'cajas',
          costoUnitario: 24.00,
          ubicacion: 'Almacén A - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '39',
          codigoSKU: 'MAT-039',
          nombre: 'Brackets Cerámicos Estéticos',
          descripcion: 'Brackets cerámicos estéticos para ortodoncia, juego completo',
          categoria: { _id: '8', nombre: 'Ortodoncia' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 6,
          stockMinimo: 8,
          unidadMedida: 'juegos',
          costoUnitario: 245.00,
          ubicacion: 'Almacén B - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '40',
          codigoSKU: 'MAT-040',
          nombre: 'Hilo Retractor',
          descripcion: 'Hilo retractor gingival, rollo de 25 metros',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 42,
          stockMinimo: 30,
          unidadMedida: 'rollos',
          costoUnitario: 18.75,
          ubicacion: 'Almacén A - Estantería 6',
          estado: 'activo',
          createdAt: new Date(Date.now() - 108 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '41',
          codigoSKU: 'MAT-041',
          nombre: 'Gel Desinfectante Povidona Yodada',
          descripcion: 'Gel desinfectante con povidona yodada al 10%, tubo de 500ml',
          categoria: { _id: '7', nombre: 'Insumos Médicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 19,
          stockMinimo: 15,
          unidadMedida: 'tubos',
          costoUnitario: 10.50,
          fechaCaducidad: new Date(Date.now() + 110 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '42',
          codigoSKU: 'MAT-042',
          nombre: 'Fresas de Diamante',
          descripcion: 'Juego de fresas de diamante para preparación, 8 piezas',
          categoria: { _id: '5', nombre: 'Instrumental' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 9,
          stockMinimo: 7,
          unidadMedida: 'juegos',
          costoUnitario: 68.00,
          ubicacion: 'Almacén B - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 128 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '43',
          codigoSKU: 'MAT-043',
          nombre: 'Lámpara de Polimerización Halógena',
          descripcion: 'Lámpara halógena de polimerización, 600mW/cm²',
          categoria: { _id: '6', nombre: 'Equipamiento' },
          proveedorPrincipal: { _id: '4', nombre: 'Tecnología Dental' },
          stockActual: 3,
          stockMinimo: 3,
          unidadMedida: 'unidades',
          costoUnitario: 185.00,
          ubicacion: 'Almacén B - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '44',
          codigoSKU: 'MAT-044',
          nombre: 'Mascarillas Quirúrgicas Tipo IIR',
          descripcion: 'Mascarillas quirúrgicas tipo IIR, caja de 50 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 28,
          stockMinimo: 30,
          unidadMedida: 'cajas',
          costoUnitario: 18.90,
          ubicacion: 'Almacén A - Estantería 7',
          estado: 'activo',
          createdAt: new Date(Date.now() - 138 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '45',
          codigoSKU: 'MAT-045',
          nombre: 'Seda Dental No Encerada',
          descripcion: 'Seda dental no encerada, rollo de 50 metros',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 58,
          stockMinimo: 30,
          unidadMedida: 'rollos',
          costoUnitario: 2.00,
          ubicacion: 'Almacén A - Estantería 6',
          estado: 'activo',
          createdAt: new Date(Date.now() - 158 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '46',
          codigoSKU: 'MAT-046',
          nombre: 'Cofferdam No Látex',
          descripcion: 'Cofferdam de material sintético, tamaño grande, caja de 25 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 9,
          stockMinimo: 12,
          unidadMedida: 'cajas',
          costoUnitario: 38.50,
          ubicacion: 'Almacén A - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 73 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '47',
          codigoSKU: 'MAT-047',
          nombre: 'Resina Composite A1',
          descripcion: 'Resina composite color A1 para restauraciones anteriores',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 35,
          stockMinimo: 15,
          unidadMedida: 'unidades',
          costoUnitario: 13.50,
          fechaCaducidad: new Date(Date.now() + 310 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 83 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '48',
          codigoSKU: 'MAT-048',
          nombre: 'Anestésico Prilocaína 3%',
          descripcion: 'Anestésico local prilocaína 3% con felipresina, ampollas de 1.8ml',
          categoria: { _id: '3', nombre: 'Anestésicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 14,
          stockMinimo: 10,
          unidadMedida: 'ampollas',
          costoUnitario: 8.90,
          fechaCaducidad: new Date(Date.now() + 195 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento A',
          estado: 'activo',
          createdAt: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '49',
          codigoSKU: 'MAT-049',
          nombre: 'Implante Dental Zirconio 4.0mm',
          descripcion: 'Implante dental de zirconio, diámetro 4.0mm, longitud 10mm',
          categoria: { _id: '4', nombre: 'Implantes' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 4,
          stockMinimo: 5,
          unidadMedida: 'unidades',
          costoUnitario: 345.00,
          ubicacion: 'Almacén B - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '50',
          codigoSKU: 'MAT-050',
          nombre: 'Guantes de Nitrilo Talla XL',
          descripcion: 'Guantes desechables de nitrilo, talla XL, caja de 100 unidades',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 72,
          stockMinimo: 50,
          unidadMedida: 'cajas',
          costoUnitario: 16.00,
          ubicacion: 'Almacén A - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 143 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '51',
          codigoSKU: 'MAT-051',
          nombre: 'Resina Flow',
          descripcion: 'Resina flow de baja viscosidad para sellado de fisuras',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 18,
          stockMinimo: 12,
          unidadMedida: 'unidades',
          costoUnitario: 28.50,
          fechaCaducidad: new Date(Date.now() + 280 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '52',
          codigoSKU: 'MAT-052',
          nombre: 'Cemento de Resina',
          descripcion: 'Cemento de resina para cementación definitiva',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 16,
          stockMinimo: 12,
          unidadMedida: 'unidades',
          costoUnitario: 35.80,
          fechaCaducidad: new Date(Date.now() + 250 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          estado: 'activo',
          createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '53',
          codigoSKU: 'MAT-053',
          nombre: 'Gel Anestésico Tópico',
          descripcion: 'Gel anestésico tópico benzocaína 20%, tubo de 10g',
          categoria: { _id: '3', nombre: 'Anestésicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 28,
          stockMinimo: 20,
          unidadMedida: 'tubos',
          costoUnitario: 6.50,
          fechaCaducidad: new Date(Date.now() + 160 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '54',
          codigoSKU: 'MAT-054',
          nombre: 'Cemento de Policarboxilato',
          descripcion: 'Cemento de policarboxilato para cementación temporal',
          categoria: { _id: '2', nombre: 'Materiales de Restauración' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 14,
          stockMinimo: 10,
          unidadMedida: 'unidades',
          costoUnitario: 19.50,
          fechaCaducidad: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          estado: 'activo',
          createdAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '55',
          codigoSKU: 'MAT-055',
          nombre: 'Brackets Linguales',
          descripcion: 'Brackets linguales para ortodoncia invisible, juego completo',
          categoria: { _id: '8', nombre: 'Ortodoncia' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 4,
          stockMinimo: 5,
          unidadMedida: 'juegos',
          costoUnitario: 380.00,
          ubicacion: 'Almacén B - Estantería 3',
          estado: 'activo',
          createdAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '56',
          codigoSKU: 'MAT-056',
          nombre: 'Implante Dental Mini',
          descripcion: 'Implante dental mini de titanio, diámetro 2.9mm, longitud 8mm',
          categoria: { _id: '4', nombre: 'Implantes' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 2,
          stockMinimo: 3,
          unidadMedida: 'unidades',
          costoUnitario: 195.00,
          ubicacion: 'Almacén B - Estantería 1',
          estado: 'activo',
          createdAt: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '57',
          codigoSKU: 'MAT-057',
          nombre: 'Fresas de Diamante Estándar',
          descripcion: 'Juego de fresas de diamante estándar, 10 piezas',
          categoria: { _id: '5', nombre: 'Instrumental' },
          proveedorPrincipal: { _id: '1', nombre: 'Dental Supply S.A.' },
          stockActual: 7,
          stockMinimo: 6,
          unidadMedida: 'juegos',
          costoUnitario: 75.00,
          ubicacion: 'Almacén B - Estantería 4',
          estado: 'activo',
          createdAt: new Date(Date.now() - 134 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '58',
          codigoSKU: 'MAT-058',
          nombre: 'Lámpara de Polimerización Halógena',
          descripcion: 'Lámpara halógena de polimerización portátil, 600mW/cm²',
          categoria: { _id: '6', nombre: 'Equipamiento' },
          proveedorPrincipal: { _id: '4', nombre: 'Tecnología Dental' },
          stockActual: 3,
          stockMinimo: 3,
          unidadMedida: 'unidades',
          costoUnitario: 185.00,
          ubicacion: 'Almacén B - Estantería 5',
          estado: 'activo',
          createdAt: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '59',
          codigoSKU: 'MAT-059',
          nombre: 'Anestésico Prilocaína 4%',
          descripcion: 'Anestésico local prilocaína 4% con felipresina, ampollas de 1.8ml',
          categoria: { _id: '3', nombre: 'Anestésicos' },
          proveedorPrincipal: { _id: '2', nombre: 'Farmacéutica Dental' },
          stockActual: 6,
          stockMinimo: 10,
          unidadMedida: 'ampollas',
          costoUnitario: 9.90,
          fechaCaducidad: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento A',
          estado: 'activo',
          createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '60',
          codigoSKU: 'MAT-060',
          nombre: 'Hilo Retractor',
          descripcion: 'Hilo retractor gingival, rollo de 25 metros',
          categoria: { _id: '1', nombre: 'Consumibles' },
          proveedorPrincipal: { _id: '3', nombre: 'Suministros Médicos' },
          stockActual: 42,
          stockMinimo: 30,
          unidadMedida: 'rollos',
          costoUnitario: 18.75,
          ubicacion: 'Almacén A - Estantería 6',
          estado: 'activo',
          createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Aplicar filtros básicos en el mock
      let materialesFiltrados = [...materialesMock];

      if (filtros.search) {
        const busqueda = filtros.search.toLowerCase();
        materialesFiltrados = materialesFiltrados.filter(
          (m) =>
            m.nombre.toLowerCase().includes(busqueda) ||
            m.codigoSKU.toLowerCase().includes(busqueda)
        );
      }

      if (filtros.categoria) {
        materialesFiltrados = materialesFiltrados.filter(
          (m) => m.categoria?._id === filtros.categoria
        );
      }

      if (filtros.estado) {
        materialesFiltrados = materialesFiltrados.filter((m) => {
          const estado = m.stockActual <= 0 ? 'agotado' : m.stockActual < m.stockMinimo ? 'bajo_stock' : 'en_stock';
          return estado === filtros.estado;
        });
      }

      // Ordenar
      if (filtros.sortBy) {
        materialesFiltrados.sort((a, b) => {
          let aVal: any = a[filtros.sortBy as keyof Material];
          let bVal: any = b[filtros.sortBy as keyof Material];

          if (filtros.sortBy === 'categoria') {
            aVal = a.categoria?.nombre || '';
            bVal = b.categoria?.nombre || '';
          } else if (filtros.sortBy === 'proveedorPrincipal') {
            aVal = a.proveedorPrincipal?.nombre || '';
            bVal = b.proveedorPrincipal?.nombre || '';
          }

          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }

          const comparacion = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return filtros.sortOrder === 'desc' ? -comparacion : comparacion;
        });
      }

      // Paginación
      const limit = filtros.limit || 20;
      const page = filtros.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      setMateriales(materialesFiltrados.slice(startIndex, endIndex));
      setTodosLosMateriales(materialesFiltrados);
      setTotal(materialesFiltrados.length);
      setTotalPages(Math.ceil(materialesFiltrados.length / limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMateriales();
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosMateriales) => {
    setFiltros(nuevosFiltros);
  };

  const handlePageChange = (page: number) => {
    setFiltros({ ...filtros, page });
  };

  const handleMaterialEliminado = () => {
    cargarMateriales();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Package size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Listado de Materiales Dentales
                </h1>
                <p className="text-gray-600">
                  Gestiona y visualiza todos los materiales e insumos del inventario
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={cargarMateriales}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 bg-white shadow-sm ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
              {onNuevoMaterial && (
                <button
                  onClick={onNuevoMaterial}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
                >
                  <Plus size={20} />
                  Nuevo Material
                </button>
              )}
            </div>
          </div>

          {/* KPIs/Métricas */}
          <MetricCards
            data={[
              {
                id: 'total-materiales',
                title: 'Total Materiales',
                value: estadisticas.totalMateriales,
                color: 'info',
              },
              {
                id: 'valor-inventario',
                title: 'Valor Total Inventario',
                value: `$${estadisticas.valorTotalInventario.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
                color: 'success',
              },
              {
                id: 'bajo-stock',
                title: 'Bajo Stock',
                value: estadisticas.materialesBajoStock,
                color: 'warning',
              },
              {
                id: 'agotados',
                title: 'Agotados',
                value: estadisticas.materialesAgotados,
                color: 'danger',
              },
            ]}
          />

          {/* Mensaje de error */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 flex-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Filtros */}
          <FiltrosMaterialesComponent
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            categorias={categorias}
          />

          {/* Tabla */}
          <TablaMateriales
            materiales={materiales}
            loading={loading}
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            onMaterialEliminado={handleMaterialEliminado}
          />

          {/* Paginación */}
          {!loading && materiales.length > 0 && (
            <PaginacionTabla
              page={filtros.page || 1}
              totalPages={totalPages}
              total={total}
              limit={filtros.limit || 20}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

