export default function DriverProfilePage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
                <p className="text-slate-600 mt-2">Персональна інформація та статистика</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Особиста інформація</h2>

                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-3xl">ІП</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Іван Петренко</h3>
                                <p className="text-slate-600">Водій категорії C, CE</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-slate-600">Email</label>
                                <p className="font-medium text-slate-900">ivan.petrenko@smartlogist.ua</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Телефон</label>
                                <p className="font-medium text-slate-900">+380 67 123 4567</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Дата народження</label>
                                <p className="font-medium text-slate-900">15.03.1985</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Стаж водіння</label>
                                <p className="font-medium text-slate-900">18 років</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Посвідчення водія</label>
                                <p className="font-medium text-slate-900">ВВС 123456</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Дата прийняття на роботу</label>
                                <p className="font-medium text-slate-900">01.06.2022</p>
                            </div>
                        </div>

                        <button className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                            Редагувати профіль
                        </button>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Документи</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">📄</div>
                                    <div>
                                        <p className="font-medium text-slate-900">Посвідчення водія</p>
                                        <p className="text-sm text-slate-600">Дійсне до: 15.03.2030</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Активне
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">📋</div>
                                    <div>
                                        <p className="font-medium text-slate-900">Медична довідка</p>
                                        <p className="text-sm text-slate-600">Дійсна до: 01.12.2026</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Активна
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Статистика</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-600">Рейтинг</p>
                                <p className="text-3xl font-bold text-slate-900">4.8 ⭐</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Завершено рейсів</p>
                                <p className="text-2xl font-bold text-slate-900">48</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Загальна відстань</p>
                                <p className="text-2xl font-bold text-slate-900">24,500 км</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Активних рейсів</p>
                                <p className="text-2xl font-bold text-slate-900">2</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Досягнення</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">🏆</div>
                                <div>
                                    <p className="font-medium text-slate-900">Перші 10 рейсів</p>
                                    <p className="text-xs text-slate-600">Отримано 01.07.2022</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">⭐</div>
                                <div>
                                    <p className="font-medium text-slate-900">Високий рейтинг</p>
                                    <p className="text-xs text-slate-600">Рейтинг вище 4.5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}