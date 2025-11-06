import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Package } from 'lucide-react';
import {
  obtenerStockCompleto,
  ProductoInventario,
  FiltrosStock,
} from '../api/stockApi';
import CardResumenStock from '../components/CardResumenStock';
import FiltrosStock from '../components/FiltrosStock';
import TablaStockPrincipal from '../components/TablaStockPrincipal';
import ModalNuevoProducto from '../components/ModalNuevoProducto';
import ModalAjusteStock from '../components/ModalAjusteStock';
import { useAuth } from '../../../contexts/AuthContext';

interface ControlStockPageProps {
  onVerDetalle: (productoId: string) => void;
}

export default function ControlStockPage({ onVerDetalle }: ControlStockPageProps) {
  const { user } = useAuth();
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosStock>({
    page: 1,
    limit: 20,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [productoAjustar, setProductoAjustar] = useState<ProductoInventario | null>(null);

  // Datos mock para categorías, proveedores y sedes (en producción vendrían de APIs)
  const categorias = [
    'Consumibles',
    'Materiales de Restauración',
    'Anestésicos',
    'Implantes',
    'Instrumental',
    'Equipamiento',
    'Insumos Médicos',
  ];
  const proveedores = [
    { _id: '1', nombre: 'Dental Supply S.A.' },
    { _id: '2', nombre: 'Farmacéutica Dental' },
    { _id: '3', nombre: 'Suministros Médicos' },
    { _id: '4', nombre: 'Tecnología Dental' },
  ];
  const sedes = [
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  useEffect(() => {
    cargarStock();
  }, [filtros]);

  const cargarStock = async () => {
    setLoading(true);
    setError(null);
    try {
      // Datos falsos completos - NO usar API
      const productosMock: ProductoInventario[] = [
        {
          _id: '1',
          nombre: 'Resina Composite A2',
          sku: 'COMP-A2-001',
          descripcion: 'Resina composite de alta calidad para restauraciones estéticas clase II',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 45,
          puntoReorden: 20,
          costoUnitario: 12.50,
          fechaCaducidad: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '2',
          nombre: 'Anestésico Lidocaína 2%',
          sku: 'ANES-LID-002',
          descripcion: 'Anestésico local para procedimientos dentales, ampollas de 1.8ml',
          categoria: 'Anestésicos',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'ampollas',
          cantidadActual: 8,
          puntoReorden: 15,
          costoUnitario: 8.75,
          fechaCaducidad: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento B',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '3',
          nombre: 'Implante Dental Titanio',
          sku: 'IMPL-TIT-003',
          descripcion: 'Implante dental de titanio grado médico, diámetro 4.1mm, longitud 10mm',
          categoria: 'Implantes',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 0,
          puntoReorden: 5,
          costoUnitario: 250.00,
          ubicacion: 'Almacén B - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '4',
          nombre: 'Guantes de Nitrilo',
          sku: 'GUANT-NIT-M',
          descripcion: 'Guantes desechables de nitrilo, talla M, caja de 100 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'cajas',
          cantidadActual: 120,
          puntoReorden: 50,
          costoUnitario: 15.00,
          ubicacion: 'Almacén A - Estantería 5',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '5',
          nombre: 'Cemento de Ionómero de Vidrio',
          sku: 'CEM-IV-005',
          descripcion: 'Cemento de ionómero de vidrio para restauraciones temporales',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 32,
          puntoReorden: 25,
          costoUnitario: 18.90,
          fechaCaducidad: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '6',
          nombre: 'Agujas Desechables 27G',
          sku: 'AGU-27G-006',
          descripcion: 'Agujas desechables estériles calibre 27G, caja de 100 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'cajas',
          cantidadActual: 15,
          puntoReorden: 20,
          costoUnitario: 22.50,
          ubicacion: 'Almacén A - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '7',
          nombre: 'Brackets Metálicos Autoligantes',
          sku: 'BRAC-MET-007',
          descripcion: 'Brackets metálicos autoligantes para ortodoncia, juego completo',
          categoria: 'Equipamiento',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 8,
          puntoReorden: 10,
          costoUnitario: 185.00,
          ubicacion: 'Almacén B - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '8',
          nombre: 'Hilo Dental Super Floss',
          sku: 'HILO-SF-008',
          descripcion: 'Hilo dental super floss para pacientes con aparatos ortodóncicos',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'unidades',
          cantidadActual: 85,
          puntoReorden: 40,
          costoUnitario: 3.25,
          ubicacion: 'Almacén A - Estantería 6',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '9',
          nombre: 'Radiografía Digital Sensor',
          sku: 'RAD-SEN-009',
          descripcion: 'Sensor digital para radiografías intraorales, tamaño 2',
          categoria: 'Equipamiento',
          proveedor: { _id: '4', nombre: 'Tecnología Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 2,
          puntoReorden: 3,
          costoUnitario: 1250.00,
          ubicacion: 'Almacén B - Estantería 2',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '10',
          nombre: 'Gel Desinfectante Clorhexidina',
          sku: 'GEL-CHX-010',
          descripcion: 'Gel desinfectante con clorhexidina al 0.12%, tubo de 500ml',
          categoria: 'Insumos Médicos',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'tubos',
          cantidadActual: 25,
          puntoReorden: 15,
          costoUnitario: 9.80,
          fechaCaducidad: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '11',
          nombre: 'Fresas de Carburo Tungsteno',
          sku: 'FRES-CT-011',
          descripcion: 'Juego de fresas de carburo de tungsteno, 6 piezas',
          categoria: 'Instrumental',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 12,
          puntoReorden: 8,
          costoUnitario: 45.00,
          ubicacion: 'Almacén B - Estantería 4',
          sede: { _id: '2', nombre: 'Sede Norte' },
          activo: true,
        },
        {
          _id: '12',
          nombre: 'Lámpara de Polimerización LED',
          sku: 'LAMP-LED-012',
          descripcion: 'Lámpara LED de polimerización de alta intensidad, 1200mW/cm²',
          categoria: 'Equipamiento',
          proveedor: { _id: '4', nombre: 'Tecnología Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 5,
          puntoReorden: 4,
          costoUnitario: 320.00,
          ubicacion: 'Almacén B - Estantería 5',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '13',
          nombre: 'Mascarillas Quirúrgicas N95',
          sku: 'MASC-N95-013',
          descripcion: 'Mascarillas quirúrgicas N95, caja de 20 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'cajas',
          cantidadActual: 18,
          puntoReorden: 25,
          costoUnitario: 28.50,
          ubicacion: 'Almacén A - Estantería 7',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '14',
          nombre: 'Seda Dental',
          sku: 'SEDA-014',
          descripcion: 'Seda dental encerada, rollo de 50 metros',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'rollos',
          cantidadActual: 65,
          puntoReorden: 30,
          costoUnitario: 2.15,
          ubicacion: 'Almacén A - Estantería 6',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '15',
          nombre: 'Cofferdam Látex',
          sku: 'COFF-LAT-015',
          descripcion: 'Cofferdam de látex, tamaño mediano, caja de 25 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'cajas',
          cantidadActual: 7,
          puntoReorden: 12,
          costoUnitario: 35.00,
          ubicacion: 'Almacén A - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '16',
          nombre: 'Resina Composite B1',
          sku: 'COMP-B1-016',
          descripcion: 'Resina composite color B1 para restauraciones anteriores',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 28,
          puntoReorden: 15,
          costoUnitario: 13.20,
          fechaCaducidad: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '17',
          nombre: 'Anestésico Articaina 4%',
          sku: 'ANES-ART-017',
          descripcion: 'Anestésico local articaina 4% con epinefrina 1:100.000',
          categoria: 'Anestésicos',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'ampollas',
          cantidadActual: 12,
          puntoReorden: 10,
          costoUnitario: 9.50,
          fechaCaducidad: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento A',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '18',
          nombre: 'Implante Dental Zirconio',
          sku: 'IMPL-ZIR-018',
          descripcion: 'Implante dental de zirconio, diámetro 3.5mm, longitud 8mm',
          categoria: 'Implantes',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 3,
          puntoReorden: 5,
          costoUnitario: 320.00,
          ubicacion: 'Almacén B - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '19',
          nombre: 'Guantes de Nitrilo Talla L',
          sku: 'GUANT-NIT-L',
          descripcion: 'Guantes desechables de nitrilo, talla L, caja de 100 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'cajas',
          cantidadActual: 95,
          puntoReorden: 50,
          costoUnitario: 15.50,
          ubicacion: 'Almacén A - Estantería 5',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '20',
          nombre: 'Gutapercha',
          sku: 'GUT-020',
          descripcion: 'Conos de gutapercha para endodoncia, calibre 25',
          categoria: 'Instrumental',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'conos',
          cantidadActual: 150,
          puntoReorden: 100,
          costoUnitario: 0.85,
          ubicacion: 'Almacén B - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '21',
          nombre: 'Limas Endodóncicas',
          sku: 'LIM-END-021',
          descripcion: 'Juego de limas endodóncicas rotatorias, 6 piezas',
          categoria: 'Instrumental',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 10,
          puntoReorden: 8,
          costoUnitario: 85.00,
          ubicacion: 'Almacén B - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '22',
          nombre: 'Alambre Ortodóncico',
          sku: 'ALAM-ORT-022',
          descripcion: 'Alambre de acero inoxidable para ortodoncia, 0.016 pulgadas',
          categoria: 'Instrumental',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'metros',
          cantidadActual: 45,
          puntoReorden: 30,
          costoUnitario: 12.50,
          ubicacion: 'Almacén B - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '23',
          nombre: 'Ligaduras Elásticas',
          sku: 'LIG-ELAS-023',
          descripcion: 'Ligaduras elásticas para ortodoncia, caja de 200 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'cajas',
          cantidadActual: 18,
          puntoReorden: 15,
          costoUnitario: 28.00,
          ubicacion: 'Almacén B - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '24',
          nombre: 'Curetas Periodontales',
          sku: 'CUR-PER-024',
          descripcion: 'Juego de curetas periodontales, 6 piezas',
          categoria: 'Instrumental',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 8,
          puntoReorden: 6,
          costoUnitario: 95.00,
          ubicacion: 'Almacén B - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '25',
          nombre: 'Antiséptico Bucal Clorhexidina',
          sku: 'ANT-BUC-025',
          descripcion: 'Enjuague bucal con clorhexidina al 0.12%, botella de 500ml',
          categoria: 'Insumos Médicos',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'botellas',
          cantidadActual: 22,
          puntoReorden: 20,
          costoUnitario: 11.50,
          fechaCaducidad: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '26',
          nombre: 'Gasa Estéril',
          sku: 'GASA-EST-026',
          descripcion: 'Gasa estéril para procedimientos quirúrgicos, paquete de 10 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'paquetes',
          cantidadActual: 35,
          puntoReorden: 25,
          costoUnitario: 8.25,
          ubicacion: 'Almacén A - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '27',
          nombre: 'Algodón Estéril',
          sku: 'ALG-EST-027',
          descripcion: 'Algodón estéril para procedimientos dentales, paquete de 50 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'paquetes',
          cantidadActual: 28,
          puntoReorden: 20,
          costoUnitario: 6.50,
          ubicacion: 'Almacén A - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '28',
          nombre: 'Gel Blanqueador',
          sku: 'GEL-BLAN-028',
          descripcion: 'Gel blanqueador dental profesional, tubo de 30ml',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'tubos',
          cantidadActual: 15,
          puntoReorden: 10,
          costoUnitario: 45.00,
          fechaCaducidad: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '29',
          nombre: 'Férulas Personalizadas',
          sku: 'FER-PER-029',
          descripcion: 'Férulas de blanqueamiento personalizadas, unidad',
          categoria: 'Equipamiento',
          proveedor: { _id: '4', nombre: 'Tecnología Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 12,
          puntoReorden: 8,
          costoUnitario: 75.00,
          ubicacion: 'Almacén B - Estantería 5',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '30',
          nombre: 'Pilar de Cicatrización',
          sku: 'PIL-CIC-030',
          descripcion: 'Pilar de cicatrización para implantes dentales, altura 4mm',
          categoria: 'Implantes',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 18,
          puntoReorden: 12,
          costoUnitario: 45.00,
          ubicacion: 'Almacén B - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '31',
          nombre: 'Fresas Quirúrgicas',
          sku: 'FRES-QUI-031',
          descripcion: 'Juego de fresas quirúrgicas para implantes, 8 piezas',
          categoria: 'Instrumental',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 6,
          puntoReorden: 5,
          costoUnitario: 125.00,
          ubicacion: 'Almacén B - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '32',
          nombre: 'Cemento Endodóncico',
          sku: 'CEM-END-032',
          descripcion: 'Cemento sellador endodóncico, tubo de 5ml',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'tubos',
          cantidadActual: 20,
          puntoReorden: 15,
          costoUnitario: 28.50,
          fechaCaducidad: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '33',
          nombre: 'Resina Composite D3',
          sku: 'COMP-D3-033',
          descripcion: 'Resina composite color D3 para restauraciones posteriores',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 38,
          puntoReorden: 20,
          costoUnitario: 12.80,
          fechaCaducidad: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '34',
          nombre: 'Anestésico Mepivacaína 3%',
          sku: 'ANES-MEP-034',
          descripcion: 'Anestésico local mepivacaína 3% sin vasoconstrictor, ampollas de 1.8ml',
          categoria: 'Anestésicos',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'ampollas',
          cantidadActual: 10,
          puntoReorden: 12,
          costoUnitario: 9.25,
          fechaCaducidad: new Date(Date.now() + 190 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento C',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '35',
          nombre: 'Implante Dental Titanio 3.5mm',
          sku: 'IMPL-TIT-35',
          descripcion: 'Implante dental de titanio grado médico, diámetro 3.5mm, longitud 8mm',
          categoria: 'Implantes',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 5,
          puntoReorden: 4,
          costoUnitario: 235.00,
          ubicacion: 'Almacén B - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '36',
          nombre: 'Guantes de Nitrilo Talla S',
          sku: 'GUANT-NIT-S',
          descripcion: 'Guantes desechables de nitrilo, talla S, caja de 100 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'cajas',
          cantidadActual: 88,
          puntoReorden: 50,
          costoUnitario: 15.00,
          ubicacion: 'Almacén A - Estantería 5',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '37',
          nombre: 'Cemento de Fosfato de Zinc',
          sku: 'CEM-FOS-037',
          descripcion: 'Cemento de fosfato de zinc para cementación de coronas y puentes',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 24,
          puntoReorden: 18,
          costoUnitario: 22.40,
          fechaCaducidad: new Date(Date.now() + 220 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '38',
          nombre: 'Agujas Desechables 30G',
          sku: 'AGU-30G-038',
          descripcion: 'Agujas desechables estériles calibre 30G, caja de 100 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'cajas',
          cantidadActual: 22,
          puntoReorden: 20,
          costoUnitario: 24.00,
          ubicacion: 'Almacén A - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '39',
          nombre: 'Brackets Cerámicos Estéticos',
          sku: 'BRAC-CER-039',
          descripcion: 'Brackets cerámicos estéticos para ortodoncia, juego completo',
          categoria: 'Equipamiento',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 6,
          puntoReorden: 8,
          costoUnitario: 245.00,
          ubicacion: 'Almacén B - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '40',
          nombre: 'Hilo Retractor',
          sku: 'HILO-RET-040',
          descripcion: 'Hilo retractor gingival, rollo de 25 metros',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'rollos',
          cantidadActual: 42,
          puntoReorden: 30,
          costoUnitario: 18.75,
          ubicacion: 'Almacén A - Estantería 6',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '41',
          nombre: 'Resina Flow',
          sku: 'RES-FLOW-041',
          descripcion: 'Resina flow de baja viscosidad para sellado de fisuras',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 18,
          puntoReorden: 12,
          costoUnitario: 28.50,
          fechaCaducidad: new Date(Date.now() + 280 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '42',
          nombre: 'Brackets Linguales',
          sku: 'BRAC-LIN-042',
          descripcion: 'Brackets linguales para ortodoncia invisible, juego completo',
          categoria: 'Equipamiento',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 4,
          puntoReorden: 5,
          costoUnitario: 380.00,
          ubicacion: 'Almacén B - Estantería 3',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '43',
          nombre: 'Cemento de Resina',
          sku: 'CEM-RES-043',
          descripcion: 'Cemento de resina para cementación definitiva',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 16,
          puntoReorden: 12,
          costoUnitario: 35.80,
          fechaCaducidad: new Date(Date.now() + 250 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '44',
          nombre: 'Anestésico Prilocaína 4%',
          sku: 'ANES-PRI-044',
          descripcion: 'Anestésico local prilocaína 4% con felipresina, ampollas de 1.8ml',
          categoria: 'Anestésicos',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'ampollas',
          cantidadActual: 6,
          puntoReorden: 10,
          costoUnitario: 9.90,
          fechaCaducidad: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Refrigerador - Compartimento A',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '45',
          nombre: 'Implante Dental Mini',
          sku: 'IMPL-MINI-045',
          descripcion: 'Implante dental mini de titanio, diámetro 2.9mm, longitud 8mm',
          categoria: 'Implantes',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'unidades',
          cantidadActual: 2,
          puntoReorden: 3,
          costoUnitario: 195.00,
          ubicacion: 'Almacén B - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '46',
          nombre: 'Guantes de Nitrilo Talla XL',
          sku: 'GUANT-NIT-XL',
          descripcion: 'Guantes desechables de nitrilo, talla XL, caja de 100 unidades',
          categoria: 'Consumibles',
          proveedor: { _id: '3', nombre: 'Suministros Médicos' },
          unidadMedida: 'cajas',
          cantidadActual: 72,
          puntoReorden: 50,
          costoUnitario: 16.00,
          ubicacion: 'Almacén A - Estantería 5',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '47',
          nombre: 'Fresas de Diamante Estándar',
          sku: 'FRES-DIA-047',
          descripcion: 'Juego de fresas de diamante estándar, 10 piezas',
          categoria: 'Instrumental',
          proveedor: { _id: '1', nombre: 'Dental Supply S.A.' },
          unidadMedida: 'juegos',
          cantidadActual: 7,
          puntoReorden: 6,
          costoUnitario: 75.00,
          ubicacion: 'Almacén B - Estantería 4',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '48',
          nombre: 'Gel Anestésico Tópico',
          sku: 'GEL-ANES-048',
          descripcion: 'Gel anestésico tópico benzocaína 20%, tubo de 10g',
          categoria: 'Anestésicos',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'tubos',
          cantidadActual: 28,
          puntoReorden: 20,
          costoUnitario: 6.50,
          fechaCaducidad: new Date(Date.now() + 160 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 1',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '49',
          nombre: 'Cemento de Policarboxilato',
          sku: 'CEM-POL-049',
          descripcion: 'Cemento de policarboxilato para cementación temporal',
          categoria: 'Materiales de Restauración',
          proveedor: { _id: '2', nombre: 'Farmacéutica Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 14,
          puntoReorden: 10,
          costoUnitario: 19.50,
          fechaCaducidad: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString(),
          ubicacion: 'Almacén A - Estantería 2',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
        {
          _id: '50',
          nombre: 'Lámpara de Polimerización Halógena',
          sku: 'LAMP-HAL-050',
          descripcion: 'Lámpara halógena de polimerización portátil, 600mW/cm²',
          categoria: 'Equipamiento',
          proveedor: { _id: '4', nombre: 'Tecnología Dental' },
          unidadMedida: 'unidades',
          cantidadActual: 3,
          puntoReorden: 3,
          costoUnitario: 185.00,
          ubicacion: 'Almacén B - Estantería 5',
          sede: { _id: '1', nombre: 'Sede Central' },
          activo: true,
        },
      ];

      // Aplicar filtros
      let productosFiltrados = [...productosMock];

      if (filtros.search) {
        const busqueda = filtros.search.toLowerCase();
        productosFiltrados = productosFiltrados.filter(
          (p) =>
            p.nombre.toLowerCase().includes(busqueda) ||
            p.sku.toLowerCase().includes(busqueda) ||
            p.descripcion?.toLowerCase().includes(busqueda)
        );
      }

      if (filtros.categoria) {
        productosFiltrados = productosFiltrados.filter((p) => p.categoria === filtros.categoria);
      }

      if (filtros.proveedorId) {
        productosFiltrados = productosFiltrados.filter((p) => p.proveedor._id === filtros.proveedorId);
      }

      if (filtros.sedeId) {
        productosFiltrados = productosFiltrados.filter((p) => p.sede._id === filtros.sedeId);
      }

      if (filtros.bajo_stock !== undefined) {
        productosFiltrados = productosFiltrados.filter((p) => {
          const bajoStock = p.cantidadActual <= p.puntoReorden;
          return filtros.bajo_stock ? bajoStock : !bajoStock;
        });
      }

      // Paginación
      const limit = filtros.limit || 20;
      const page = filtros.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      setProductos(productosFiltrados.slice(startIndex, endIndex));
      setTotal(productosFiltrados.length);
      setTotalPages(Math.ceil(productosFiltrados.length / limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el stock');
    } finally {
      setLoading(false);
    }
  };

  const handleAjustarStock = (producto: ProductoInventario) => {
    setProductoAjustar(producto);
  };

  const handleEditar = (producto: ProductoInventario) => {
    // TODO: Implementar edición de producto
    console.log('Editar producto:', producto);
  };

  const handleAjusteCompletado = () => {
    cargarStock();
  };

  const handleProductoCreado = () => {
    cargarStock();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Control de Stock</h1>
                <p className="text-gray-600 mt-1">Gestión de inventario y materiales</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={cargarStock}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Actualizar
              </button>
              <button
                onClick={() => setMostrarModalNuevo(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Producto
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Resumen */}
        <CardResumenStock productos={productos} />

        {/* Filtros */}
        <FiltrosStock
          filtros={filtros}
          onFiltrosChange={setFiltros}
          categorias={categorias}
          proveedores={proveedores}
          sedes={sedes}
        />

        {/* Tabla */}
        <TablaStockPrincipal
          productos={productos}
          loading={loading}
          onVerDetalle={onVerDetalle}
          onAjustarStock={handleAjustarStock}
          onEditar={handleEditar}
        />

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-700">
              Mostrando {((filtros.page || 1) - 1) * (filtros.limit || 20) + 1} a{' '}
              {Math.min((filtros.page || 1) * (filtros.limit || 20), total)} de {total} productos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) - 1 })}
                disabled={filtros.page === 1 || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {filtros.page || 1} de {totalPages}
              </span>
              <button
                onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) + 1 })}
                disabled={(filtros.page || 1) >= totalPages || loading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Modales */}
        {mostrarModalNuevo && (
          <ModalNuevoProducto
            onClose={() => setMostrarModalNuevo(false)}
            onProductoCreado={handleProductoCreado}
            proveedores={proveedores}
            sedes={sedes}
            categorias={categorias}
          />
        )}

        {productoAjustar && user && (
          <ModalAjusteStock
            producto={productoAjustar}
            onClose={() => setProductoAjustar(null)}
            onAjusteCompletado={handleAjusteCompletado}
            usuarioId={user.id}
          />
        )}
      </div>
    </div>
  );
}

