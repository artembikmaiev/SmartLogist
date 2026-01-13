export default function ManagerDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Панель управління</h1>
        <p className="text-slate-600 mt-2">Вітаємо в системі управління автопарком</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Активні рейси</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Водії</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Транспорт</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">18</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚛</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Завершено сьогодні</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Швидкі дії</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
            <div className="text-2xl mb-2">➕</div>
            <p className="font-semibold text-slate-900">Створити рейс</p>
            <p className="text-sm text-slate-600 mt-1">Додати новий рейс</p>
          </button>

          <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all text-left">
            <div className="text-2xl mb-2">👤</div>
            <p className="font-semibold text-slate-900">Додати водія</p>
            <p className="text-sm text-slate-600 mt-1">Зареєструвати нового водія</p>
          </button>

          <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all text-left">
            <div className="text-2xl mb-2">🚛</div>
            <p className="font-semibold text-slate-900">Додати транспорт</p>
            <p className="text-sm text-slate-600 mt-1">Зареєструвати новий автомобіль</p>
          </button>
        </div>
      </div>
    </div>
  );
}
