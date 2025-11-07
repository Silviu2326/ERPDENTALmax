import { useState } from 'react';

interface PreguntaTipoAbiertaProps {
  preguntaId: string;
  preguntaTexto: string;
  valor?: string;
  onChange: (valor: string) => void;
  requerida?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export default function PreguntaTipoAbierta({
  preguntaId,
  preguntaTexto,
  valor = '',
  onChange,
  requerida = false,
  placeholder = 'Escribe tu respuesta aquí...',
  maxLength = 1000,
}: PreguntaTipoAbiertaProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor={preguntaId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {preguntaTexto}
        {requerida && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={preguntaId}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        required={requerida}
      />
      <div className="mt-1 text-xs text-gray-500 text-right">
        {valor.length}/{maxLength} caracteres
      </div>
    </div>
  );
}



