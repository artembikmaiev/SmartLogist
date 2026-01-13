export default function TripsPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Управління рейсами</h1>
                <p className="text-slate-600 mt-2">Перегляд та керування всіма рейсами</p>
            </div>

            {/* Actions */}
            <div className="mb-6">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                    + Створити рейс
                </button>
            </div>

            {/* Trips List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Маршрут</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Водій</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Транспорт</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Статус</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Дата</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm text-slate-900">#001</td>
                                <td className="px-6 py-4 text-sm text-slate-900">Київ → Львів</td>
                                <td className="px-6 py-4 text-sm text-slate-600">Іван Петренко</td>
                                <td className="px-6 py-4 text-sm text-slate-600">AA 1234 BB</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        В дорозі
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">12.01.2026</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm text-slate-900">#002</td>
                                <td className="px-6 py-4 text-sm text-slate-900">Одеса → Харків</td>
                                <td className="px-6 py-4 text-sm text-slate-600">Олег Коваленко</td>
                                <td className="px-6 py-4 text-sm text-slate-600">BB 5678 CC</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        Запланований
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">13.01.2026</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}