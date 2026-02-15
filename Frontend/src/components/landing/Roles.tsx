// Компонент, що демонструє можливості системи для різних ролей: адміністраторів, менеджерів та водіїв.
import { Shield, Users, Truck, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


export default function Roles() {
    return (
        <section id="roles" className="roles-section py-20 px-6 bg-slate-50">
            <div className="roles-container max-w-7xl mx-auto space-y-24">
                {/* For Managers */}
                <div className="manager-section grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Screenshot */}
                    <div className="manager-image-container relative">
                        <div className="manager-image-wrapper rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 bg-slate-200 aspect-video">
                            <Image
                                src="/manager.jpg"
                                alt="Manager interface screenshot"
                                width={600}
                                height={338}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="manager-content space-y-6">
                        <h2 className="manager-title text-4xl font-bold text-slate-900">
                            Повний контроль над автопарком
                        </h2>
                        <p className="manager-description text-lg text-slate-600">
                            Керуємо транспортом, водіями та рейсами з єдиної панелі
                            управління. Отримуємо аналітику в реальному часі.
                        </p>

                        <ul className="manager-features-list space-y-4">
                            {[
                                'Управління транспортом та водіями',
                                'Створення та призначення рейсів',
                                'Аналітика та звіти',
                                'Моніторинг витрат пального',
                            ].map((item, index) => (
                                <li key={index} className="manager-feature-item flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* For Drivers */}
                <div className="driver-section grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="driver-content space-y-6">
                        <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                            Для водіїв
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900">
                            Простота та прозорість рейсів
                        </h2>
                        <p className="text-lg text-slate-600">
                            Водії отримують сповіщення про нові рейси, бачать деталізований
                            маршрут та можуть повідомляти про статус доставки прямо зі свого
                            смартфону.
                        </p>

                        <ul className="space-y-4">
                            {[
                                'Миттєве отримання замовлень',
                                'Чіткі навігації по точках маршруту',
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/auth/driver"
                            className="driver-login-button inline-flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-slate-800 transition-all hover:shadow-lg mt-4"
                        >
                            Увійти як водій
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="driver-image-container relative">
                        <div className="driver-image-wrapper rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 bg-slate-700 aspect-[4/3]">
                            <Image
                                src="/driver.png"
                                alt="Driver interface screenshot"
                                width={600}
                                height={400}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
