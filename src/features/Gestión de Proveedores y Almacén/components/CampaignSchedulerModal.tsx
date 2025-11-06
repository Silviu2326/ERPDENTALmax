import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface CampaignSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduledAt: string) => void;
  campaignName?: string;
  recipientCount?: number;
}

export default function CampaignSchedulerModal({
  isOpen,
  onClose,
  onSchedule,
  campaignName,
  recipientCount,
}: CampaignSchedulerModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  if (!isOpen) return null;

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
      onSchedule(scheduledAt);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Programar Campaña</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {campaignName && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Campaña</p>
              <p className="font-medium text-gray-900">{campaignName}</p>
            </div>
          )}

          {recipientCount !== undefined && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Destinatarios</p>
              <p className="font-medium text-gray-900">{recipientCount} pacientes</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha
                </div>
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedDate}
                min={minDateTime.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora
                </div>
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Programar Campaña
          </button>
        </div>
      </div>
    </div>
  );
}


