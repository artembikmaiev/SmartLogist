export default function AnalyticsPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Аналітика</h1>
                <p className="text-slate-600 mt-2">Статистика та звіти по автопарку</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Загальна відстань (місяць)</p>
                    <p className="text-3xl font-bold text-slate-900">12,450 км</p>
                    <p className="text-sm text-green-600 mt-2">↑ 15% від минулого місяця</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Витрати пального</p>
                    <p className="text-3xl font-bold text-slate-900">3,200 л</p>
                    <p className="text-sm text-red-600 mt-2">↑ 8% від минулого місяця</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Завершено рейсів</p>
                    <p className="text-3xl font-bold text-slate-900">48</p>
                    <p className="text-sm text-green-600 mt-2">↑ 12% від минулого місяця</p>
                </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Рейси по місяцях</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                        <p className="text-slate-400">Графік буде тут</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Витрати пального</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                        <p className="text-slate-400">Графік буде тут</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Топ водіїв</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                <span className="font-medium text-slate-900">Іван Петренко</span>
                            </div>
                            <span className="text-slate-600">48 рейсів</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                                <span className="font-medium text-slate-900">Олег Коваленко</span>
                            </div>
                            <span className="text-slate-600">35 рейсів</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Найактивніший транспорт</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">🚛</div>
                                <span className="font-medium text-slate-900">AA 1234 BB</span>
                            </div>
                            <span className="text-slate-600">5,200 км</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">🚚</div>
                                <span className="font-medium text-slate-900">BB 5678 CC</span>
                            </div>
                            <span className="text-slate-600">4,800 км</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}