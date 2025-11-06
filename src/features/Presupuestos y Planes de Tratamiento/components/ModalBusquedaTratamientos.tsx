import { useState, useEffect } from 'react';
import { Search, X, Plus, Loader2 } from 'lucide-react';
import { Tratamiento, obtenerTratamientos } from '../api/presupuestosApi';

interface ModalBusquedaTratamientosProps {
  isOpen: boolean;
  onClose: () => void;
  onTratamientoSeleccionado: (tratamiento: Tratamiento) => void;
}

export default function ModalBusquedaTratamientos({
  isOpen,
  onClose,
  onTratamientoSeleccionado,
}: ModalBusquedaTratamientosProps) {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [tratamientosFiltrados, setTratamientosFiltrados] = useState<Tratamiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      cargarTratamientos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setTratamientosFiltrados(tratamientos);
    } else {
      const termino = busqueda.toLowerCase();
      const filtrados = tratamientos.filter(
        (tratamiento) =>
          tratamiento.nombre.toLowerCase().includes(termino) ||
          tratamiento.codigo.toLowerCase().includes(termino) ||
          (tratamiento.area && tratamiento.area.toLowerCase().includes(termino)) ||
          (tratamiento.especialidad && tratamiento.especialidad.toLowerCase().includes(termino))
      );
      setTratamientosFiltrados(filtrados);
    }
  }, [busqueda, tratamientos]);

  const cargarTratamientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerTratamientos();
      setTratamientos(datos);
      setTratamientosFiltrados(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los tratamientos');
      // Datos mock enriquecidos para desarrollo
      const datosMock: Tratamiento[] = [
        {
          _id: '1',
          codigo: 'LIMP-001',
          nombre: 'Limpieza dental profesional con ultrasonidos',
          precioBase: 60,
          area: 'Higiene',
          especialidad: 'Prevención',
        },
        {
          _id: '2',
          codigo: 'REV-001',
          nombre: 'Revisión general y diagnóstico completo',
          precioBase: 50,
          area: 'Consulta',
          especialidad: 'Odontología General',
        },
        {
          _id: '3',
          codigo: 'RAD-001',
          nombre: 'Radiografía panorámica digital',
          precioBase: 45,
          area: 'Diagnóstico',
          especialidad: 'Radiología',
        },
        {
          _id: '4',
          codigo: 'FLU-001',
          nombre: 'Fluorización tópica',
          precioBase: 25,
          area: 'Prevención',
          especialidad: 'Odontología General',
        },
        {
          _id: '5',
          codigo: 'ORT-001',
          nombre: 'Ortodoncia invisible (Invisalign)',
          precioBase: 3500,
          area: 'Ortodoncia',
          especialidad: 'Ortodoncia',
        },
        {
          _id: '6',
          codigo: 'ORT-002',
          nombre: 'Brackets metálicos (2 arcadas)',
          precioBase: 1800,
          area: 'Ortodoncia',
          especialidad: 'Ortodoncia',
        },
        {
          _id: '7',
          codigo: 'ORT-003',
          nombre: 'Estudio ortodóncico completo 3D',
          precioBase: 200,
          area: 'Ortodoncia',
          especialidad: 'Ortodoncia',
        },
        {
          _id: '8',
          codigo: 'IMP-001',
          nombre: 'Implante dental titanio',
          precioBase: 1500,
          area: 'Cirugía',
          especialidad: 'Implantología',
        },
        {
          _id: '9',
          codigo: 'COR-001',
          nombre: 'Corona cerámica sobre implante',
          precioBase: 650,
          area: 'Prostodoncia',
          especialidad: 'Prostodoncia',
        },
        {
          _id: '10',
          codigo: 'ENDO-001',
          nombre: 'Endodoncia molar',
          precioBase: 280,
          area: 'Endodoncia',
          especialidad: 'Endodoncia',
        },
        {
          _id: '11',
          codigo: 'COMP-001',
          nombre: 'Obturación composite',
          precioBase: 95,
          area: 'Restauración',
          especialidad: 'Odontología General',
        },
        {
          _id: '12',
          codigo: 'BLA-001',
          nombre: 'Blanqueamiento dental profesional',
          precioBase: 350,
          area: 'Estética',
          especialidad: 'Odontología Estética',
        },
        {
          _id: '13',
          codigo: 'CAR-001',
          nombre: 'Carillas de porcelana',
          precioBase: 400,
          area: 'Estética',
          especialidad: 'Odontología Estética',
        },
        {
          _id: '14',
          codigo: 'PER-001',
          nombre: 'Periodoncia básica (4 sesiones)',
          precioBase: 320,
          area: 'Periodoncia',
          especialidad: 'Periodoncia',
        },
        {
          _id: '15',
          codigo: 'PRO-001',
          nombre: 'Prótesis parcial removible (6 piezas)',
          precioBase: 850,
          area: 'Prostodoncia',
          especialidad: 'Prostodoncia',
        },
        {
          _id: '16',
          codigo: 'EXT-001',
          nombre: 'Extracción de muela del juicio',
          precioBase: 120,
          area: 'Cirugía',
          especialidad: 'Cirugía Oral',
        },
        {
          _id: '17',
          codigo: 'CBCT-001',
          nombre: 'Radiografía 3D (CBCT)',
          precioBase: 90,
          area: 'Diagnóstico',
          especialidad: 'Radiología',
        },
        {
          _id: '18',
          codigo: 'CIR-PER-001',
          nombre: 'Cirugía periodontal (4 cuadrantes)',
          precioBase: 1200,
          area: 'Periodoncia',
          especialidad: 'Periodoncia',
        },
        {
          _id: '19',
          codigo: 'INJ-001',
          nombre: 'Injerto de encía',
          precioBase: 400,
          area: 'Periodoncia',
          especialidad: 'Periodoncia',
        },
        {
          _id: '20',
          codigo: 'REC-001',
          nombre: 'Reconstrucción con composite',
          precioBase: 95,
          area: 'Restauración',
          especialidad: 'Odontología General',
        },
        {
          _id: '21',
          codigo: 'SELL-001',
          nombre: 'Sellado de fisuras (por pieza)',
          precioBase: 40,
          area: 'Prevención',
          especialidad: 'Odontología General',
        },
        {
          _id: '22',
          codigo: 'CAR-COMP-001',
          nombre: 'Carillas de composite directo (por unidad)',
          precioBase: 300,
          area: 'Estética',
          especialidad: 'Odontología Estética',
        },
        {
          _id: '23',
          codigo: 'ORT-CER-001',
          nombre: 'Brackets estéticos cerámicos (arcada)',
          precioBase: 2200,
          area: 'Ortodoncia',
          especialidad: 'Ortodoncia',
        },
        {
          _id: '24',
          codigo: 'GING-001',
          nombre: 'Gingivectomía estética (por pieza)',
          precioBase: 90,
          area: 'Periodoncia',
          especialidad: 'Periodoncia',
        },
        {
          _id: '25',
          codigo: 'CONT-001',
          nombre: 'Contorneado estético de encías',
          precioBase: 280,
          area: 'Periodoncia',
          especialidad: 'Periodoncia',
        },
        {
          _id: '26',
          codigo: 'PROT-COMP-001',
          nombre: 'Prótesis completa acrílica (arcada)',
          precioBase: 1200,
          area: 'Prostodoncia',
          especialidad: 'Prostodoncia',
        },
        {
          _id: '27',
          codigo: 'INJ-OSE-001',
          nombre: 'Injerto óseo con biomaterial',
          precioBase: 450,
          area: 'Cirugía',
          especialidad: 'Implantología',
        },
        {
          _id: '28',
          codigo: 'ENDO-PREM-001',
          nombre: 'Endodoncia premolar',
          precioBase: 250,
          area: 'Endodoncia',
          especialidad: 'Endodoncia',
        },
        {
          _id: '29',
          codigo: 'RAD-PER-001',
          nombre: 'Radiografía periapical',
          precioBase: 25,
          area: 'Diagnóstico',
          especialidad: 'Radiología',
        },
        {
          _id: '30',
          codigo: 'RAD-CEF-001',
          nombre: 'Radiografía cefalométrica',
          precioBase: 60,
          area: 'Diagnóstico',
          especialidad: 'Radiología',
        },
        {
          _id: '31',
          codigo: 'RET-001',
          nombre: 'Retenedores fijos y removibles',
          precioBase: 350,
          area: 'Ortodoncia',
          especialidad: 'Ortodoncia',
        },
        {
          _id: '32',
          codigo: 'CURET-001',
          nombre: 'Curetaje periodontal profundo',
          precioBase: 320,
          area: 'Periodoncia',
          especialidad: 'Periodoncia',
        },
        {
          _id: '33',
          codigo: 'ANTIB-LOC-001',
          nombre: 'Aplicación de antibiótico local',
          precioBase: 120,
          area: 'Periodoncia',
          especialidad: 'Periodoncia',
        },
        {
          _id: '34',
          codigo: 'FOTO-001',
          nombre: 'Fotografías clínicas',
          precioBase: 30,
          area: 'Diagnóstico',
          especialidad: 'Odontología General',
        },
        {
          _id: '35',
          codigo: 'AJUST-001',
          nombre: 'Ajustes y controles post-entrega',
          precioBase: 50,
          area: 'Prostodoncia',
          especialidad: 'Prostodoncia',
        },
      ];
      setTratamientos(datosMock);
      setTratamientosFiltrados(datosMock);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTratamiento = (tratamiento: Tratamiento) => {
    onTratamientoSeleccionado(tratamiento);
    setBusqueda('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Buscar Tratamiento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, código, área o especialidad..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Lista de tratamientos */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : tratamientosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron tratamientos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tratamientosFiltrados.map((tratamiento) => (
                <button
                  key={tratamiento._id}
                  onClick={() => handleSelectTratamiento(tratamiento)}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{tratamiento.nombre}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {tratamiento.codigo}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        {tratamiento.area && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {tratamiento.area}
                          </span>
                        )}
                        {tratamiento.especialidad && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {tratamiento.especialidad}
                          </span>
                        )}
                      </div>
                      {tratamiento.descripcion && (
                        <p className="mt-2 text-sm text-gray-500">{tratamiento.descripcion}</p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        €{tratamiento.precioBase.toFixed(2)}
                      </div>
                      <button className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                        <Plus className="h-4 w-4" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


