export default function DriversPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Управління водіями</h1>
                <p className="text-slate-600 mt-2">Перегляд та керування водіями</p>
            </div>

            {/* Actions */}
            <div className="mb-6">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                    + Додати водія
                </button>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Driver Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">ІП</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Іван Петренко</h3>
                            <p className="text-sm text-slate-600">+380 67 123 4567</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Активних рейсів:</span>
                            <span className="font-semibold text-slate-900">2</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Завершено:</span>
                            <span className="font-semibold text-slate-900">48</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Рейтинг:</span>
                            <span className="font-semibold text-green-600">4.8 ⭐</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">ОК</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Олег Коваленко</h3>
                            <p className="text-sm text-slate-600">+380 50 987 6543</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Активних рейсів:</span>
                            <span className="font-semibold text-slate-900">1</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Завершено:</span>
                            <span className="font-semibold text-slate-900">35</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Рейтинг:</span>
                            <span className="font-semibold text-green-600">4.9 ⭐</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}