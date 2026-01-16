export default function DriverDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Вітаємо, Іване!</h1>
        <p className="text-slate-600 mt-2">Ваш особистий кабінет водія</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Активні рейси</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">2</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Завершено</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">48</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Рейтинг</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">4.8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Trips */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Активні рейси</h2>
        <div className="space-y-4">
          <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Київ → Львів</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                В дорозі
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Транспорт:</p>
                <p className="font-medium text-slate-900">AA 1234 BB</p>
              </div>
              <div>
                <p className="text-slate-600">Відстань:</p>
                <p className="font-medium text-slate-900">540 км</p>
              </div>
              <div>
                <p className="text-slate-600">Дата:</p>
                <p className="font-medium text-slate-900">12.01.2026</p>
              </div>
              <div>
                <p className="text-slate-600">Прогрес:</p>
                <p className="font-medium text-slate-900">65%</p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Одеса → Харків</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Запланований
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Транспорт:</p>
                <p className="font-medium text-slate-900">BB 5678 CC</p>
              </div>
              <div>
                <p className="text-slate-600">Відстань:</p>
                <p className="font-medium text-slate-900">480 км</p>
              </div>
              <div>
                <p className="text-slate-600">Дата:</p>
                <p className="font-medium text-slate-900">13.01.2026</p>
              </div>
              <div>
                <p className="text-slate-600">Прогрес:</p>
                <p className="font-medium text-slate-900">0%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
