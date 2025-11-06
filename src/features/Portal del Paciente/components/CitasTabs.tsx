interface CitasTabsProps {
  activeTab: 'proximas' | 'pasadas';
  onTabChange: (tab: 'proximas' | 'pasadas') => void;
}

export default function CitasTabs({ activeTab, onTabChange }: CitasTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onClick={() => onTabChange('proximas')}
          className={`${
            activeTab === 'proximas'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
        >
          Próximas Citas
        </button>
        <button
          onClick={() => onTabChange('pasadas')}
          className={`${
            activeTab === 'pasadas'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
        >
          Citas Pasadas
        </button>
      </nav>
    </div>
  );
}


