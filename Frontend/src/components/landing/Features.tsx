// Секція з описом ключових переваг та функціональних можливостей платформи SmartLogist.
import { Route, DollarSign, User, Zap, BarChart3, Shield } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: Route,
            title: 'Оптимальні маршрути',
            description:
                'Обираємо точки на карті, а система автоматично побудує найвигідніший та найекономічніший шлях використовуючи OpenStreetMap.',
            color: 'bg-blue-50 text-blue-600',
            iconBg: 'bg-blue-100',
        },
        {
            icon: DollarSign,
            title: 'Розрахунок вартості',
            description:
                'Автоматизований алгоритм розраховує витрати пального та загальну вартість рейсу.',
            color: 'bg-green-50 text-green-600',
            iconBg: 'bg-green-100',
        },
        {
            icon: User,
            title: 'Кабінет водія',
            description:
                'Зручний інтерфейс для водіїв: прийом замовлень, перегляд маршруту та статус виконання рейсу.',
            color: 'bg-purple-50 text-purple-600',
            iconBg: 'bg-purple-100',
        },
    ];

    return (
        <section id="features" className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        Потужний функціонал
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Все необхідне для ефективного управління перевезеннями в одній
                        системі.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 bg-white"
                        >
                            {/* Icon */}
                            <div
                                className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                            >
                                <feature.icon className={`w-7 h-7 ${feature.color.split(' ')[1]}`} />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
