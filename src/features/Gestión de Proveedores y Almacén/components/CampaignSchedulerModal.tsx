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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 ring-1 ring-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Programar Campaña</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {campaignName && (
            <div>
              <p className="text-sm text-slate-600 mb-1">Campaña</p>
              <p className="font-medium text-gray-900">{campaignName}</p>
            </div>
          )}

          {recipientCount !== undefined && (
            <div>
              <p className="text-sm text-slate-600 mb-1">Destinatarios</p>
              <p className="font-medium text-gray-900">{recipientCount} pacientes</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Fecha
                </div>
              </label>
              <input
                type="date"
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                value={selectedDate}
                min={minDateTime.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  Hora
                </div>
              </label>
              <input
                type="time"
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t border-gray-200/60 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
          >
            Programar Campaña
          </button>
        </div>
      </div>
    </div>
  );
}



