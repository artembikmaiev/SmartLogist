import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">SL</span>
                            </div>
                            <span className="font-bold text-white text-lg">SmartLogist</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Інтелектуальна система управління автопарком для сучасних
                            логістичних компаній.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Продукт</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#features" className="text-sm hover:text-white transition-colors">
                                    Можливості
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Тарифи
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    API
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Компанія</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Про нас
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Блог
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Контакти
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Access */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Доступ</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/driver" className="text-sm hover:text-white transition-colors">
                                    Кабінет водія
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 text-center">
                    <p className="text-sm text-slate-500">
                        © 2026 SmartLogist. Всі права захищені.
                    </p>
                </div>
            </div>
        </footer>
    );
}
