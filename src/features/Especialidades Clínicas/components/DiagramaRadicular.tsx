import { ConductoRadicular } from '../api/endodonciaApi';

interface DiagramaRadicularProps {
  numeroDiente: number;
  conductos: ConductoRadicular[];
}

export default function DiagramaRadicular({ numeroDiente, conductos }: DiagramaRadicularProps) {
  // Función para determinar el tipo de diente según el número
  const getTipoDiente = (numero: number): 'incisivo' | 'canino' | 'premolar' | 'molar' => {
    const digitos = Math.floor(numero / 10);
    const unidad = numero % 10;
    
    if (unidad >= 1 && unidad <= 3) return 'incisivo';
    if (unidad === 3) return 'canino';
    if (unidad >= 4 && unidad <= 5) return 'premolar';
    if (unidad >= 6 && unidad <= 8) return 'molar';
    return 'incisivo';
  };

  const tipoDiente = getTipoDiente(numeroDiente);
  const esSuperior = numeroDiente >= 11 && numeroDiente <= 28;

  // Renderizar diagrama según el tipo de diente
  const renderDiagrama = () => {
    switch (tipoDiente) {
      case 'molar':
        return (
          <div className="relative w-full h-64">
            {/* Corona */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-gray-300 rounded-t-lg"></div>
            
            {/* Raíz con conductos */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-24 h-44 bg-gradient-to-b from-amber-50 to-white border-2 border-gray-300 rounded-b-lg">
              {conductos.map((conducto, index) => {
                const positions = [
                  { top: '5%', left: '30%' }, // Mesial/Mesiobucal
                  { top: '5%', left: '70%' }, // Distal/Distobucal
                  { top: '5%', left: '50%' }, // Palatino/Lingual (central)
                ];
                const pos = positions[index % positions.length];
                return (
                  <div
                    key={index}
                    className="absolute w-2 h-32 bg-blue-600 rounded-full opacity-80"
                    style={{ ...pos, transform: 'translate(-50%, 0)' }}
                    title={`${conducto.nombreConducto} - ${conducto.longitudTrabajo}mm`}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-700 whitespace-nowrap">
                      {conducto.nombreConducto}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="absolute bottom-0 left-0 right-0 mt-2 text-xs text-gray-600 text-center">
              Diente #{numeroDiente} - {conductos.length} conducto{conductos.length !== 1 ? 's' : ''}
            </div>
          </div>
        );

      case 'premolar':
        return (
          <div className="relative w-full h-56">
            {/* Corona */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-gray-300 rounded-t-lg"></div>
            
            {/* Raíz */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-36 bg-gradient-to-b from-amber-50 to-white border-2 border-gray-300 rounded-b-lg">
              {conductos.map((conducto, index) => {
                const positions = [
                  { top: '5%', left: '50%' }, // Central
                  { top: '5%', left: index === 0 ? '30%' : '70%' }, // Lateral
                ];
                const pos = positions[index % positions.length];
                return (
                  <div
                    key={index}
                    className="absolute w-2 h-28 bg-blue-600 rounded-full opacity-80"
                    style={{ ...pos, transform: 'translate(-50%, 0)' }}
                    title={`${conducto.nombreConducto} - ${conducto.longitudTrabajo}mm`}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-700 whitespace-nowrap">
                      {conducto.nombreConducto}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 mt-2 text-xs text-gray-600 text-center">
              Diente #{numeroDiente} - {conductos.length} conducto{conductos.length !== 1 ? 's' : ''}
            </div>
          </div>
        );

      default: // incisivo o canino
        return (
          <div className="relative w-full h-48">
            {/* Corona */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-gray-300 rounded-t-lg"></div>
            
            {/* Raíz */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-12 h-32 bg-gradient-to-b from-amber-50 to-white border-2 border-gray-300 rounded-b-lg">
              {conductos.map((conducto, index) => (
                <div
                  key={index}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-24 bg-blue-600 rounded-full opacity-80"
                  title={`${conducto.nombreConducto} - ${conducto.longitudTrabajo}mm`}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-700 whitespace-nowrap">
                    {conducto.nombreConducto}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 mt-2 text-xs text-gray-600 text-center">
              Diente #{numeroDiente} - {conductos.length} conducto{conductos.length !== 1 ? 's' : ''}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Diagrama Radicular
      </h3>
      <div className="flex justify-center items-center min-h-[300px]">
        {renderDiagrama()}
      </div>
      {conductos.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Agregue conductos para ver el diagrama
        </p>
      )}
    </div>
  );
}


