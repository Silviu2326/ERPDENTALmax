export default function PanelLeyenda() {
  const estados = [
    { estado: 'diagnostico', color: '#fbbf24', label: 'Diagnóstico', descripcion: 'Hallazgo identificado' },
    { estado: 'planificado', color: '#3b82f6', label: 'Planificado', descripcion: 'Tratamiento planificado' },
    { estado: 'realizado', color: '#10b981', label: 'Realizado', descripcion: 'Tratamiento completado' },
    { estado: 'en_progreso', color: '#f59e0b', label: 'En Progreso', descripcion: 'Tratamiento en curso' },
    { estado: 'descartado', color: '#ef4444', label: 'Descartado', descripcion: 'Tratamiento descartado' },
    { estado: 'ausente', color: '#6b7280', label: 'Ausente', descripcion: 'Pieza dental ausente' },
  ];

  const superficies = [
    { codigo: 'O', nombre: 'Oclusal', descripcion: 'Superficie de masticación' },
    { codigo: 'M', nombre: 'Mesial', descripcion: 'Hacia la línea media' },
    { codigo: 'D', nombre: 'Distal', descripcion: 'Alejado de la línea media' },
    { codigo: 'V', nombre: 'Vestibular', descripcion: 'Hacia los labios/mejillas' },
    { codigo: 'L', nombre: 'Lingual', descripcion: 'Hacia la lengua' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h4 className="font-semibold text-gray-900 mb-4 text-lg">Leyenda del Odontograma</h4>
      
      <div className="space-y-6">
        {/* Estados */}
        <div>
          <h5 className="font-medium text-gray-700 mb-3">Estados de Tratamiento</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {estados.map((item) => (
              <div key={item.estado} className="flex items-start gap-2">
                <div
                  className="w-6 h-6 rounded flex-shrink-0 border border-gray-300"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Superficies */}
        <div>
          <h5 className="font-medium text-gray-700 mb-3">Superficies Dentales</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {superficies.map((superficie) => (
              <div key={superficie.codigo} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-semibold text-gray-700 text-xs">
                  {superficie.codigo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{superficie.nombre}</p>
                  <p className="text-xs text-gray-500">{superficie.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



