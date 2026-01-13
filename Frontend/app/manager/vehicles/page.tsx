export default function VehiclesPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Управління транспортом</h1>
                <p className="text-slate-600 mt-2">Перегляд та керування автопарком</p>
            </div>

            {/* Actions */}
            <div className="mb-6">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                    + Додати транспорт
                </button>
            </div>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vehicle Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">🚛</div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Доступний
                        </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">AA 1234 BB</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Марка:</span>
                            <span className="font-semibold text-slate-900">MAN TGX</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Рік:</span>
                            <span className="font-semibold text-slate-900">2020</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Пробіг:</span>
                            <span className="font-semibold text-slate-900">145,000 км</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Витрата:</span>
                            <span className="font-semibold text-slate-900">28 л/100км</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">🚚</div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            В рейсі
                        </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">BB 5678 CC</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Марка:</span>
                            <span className="font-semibold text-slate-900">Volvo FH16</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Рік:</span>
                            <span className="font-semibold text-slate-900">2019</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Пробіг:</span>
                            <span className="font-semibold text-slate-900">198,500 км</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Витрата:</span>
                            <span className="font-semibold text-slate-900">30 л/100км</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}