export default function DriverTripsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Мої рейси</h1>
                <p className="text-slate-600 mt-2">Перегляд всіх ваших рейсів</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                    Активні
                </button>
                <button className="px-4 py-2 bg-white text-slate-600 rounded-lg font-medium hover:bg-slate-50">
                    Завершені
                </button>
            </div>

            {/* Trips List */}
            <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Київ → Львів</h3>
                            <p className="text-sm text-slate-600 mt-1">Рейс #001</p>
                        </div>
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            В дорозі
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-slate-600">Транспорт</p>
                            <p className="font-semibold text-slate-900">AA 1234 BB</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Відстань</p>
                            <p className="font-semibold text-slate-900">540 км</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Дата початку</p>
                            <p className="font-semibold text-slate-900">12.01.2026</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Прогрес</p>
                            <p className="font-semibold text-slate-900">65%</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                            Переглянути маршрут
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                            Завершити рейс
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Одеса → Харків</h3>
                            <p className="text-sm text-slate-600 mt-1">Рейс #002</p>
                        </div>
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                            Запланований
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-slate-600">Транспорт</p>
                            <p className="font-semibold text-slate-900">BB 5678 CC</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Відстань</p>
                            <p className="font-semibold text-slate-900">480 км</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Дата початку</p>
                            <p className="font-semibold text-slate-900">13.01.2026</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Прогрес</p>
                            <p className="font-semibold text-slate-900">0%</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                            Переглянути маршрут
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Почати рейс
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}