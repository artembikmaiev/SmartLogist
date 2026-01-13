import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Нове: Інтеграція з OpenStreetMap API
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                            Інтелектуальна логістика{' '}
                            <span className="text-blue-600">автопарком</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Оптимізуємо маршрути, розраховуємо витрати пального та керуємо
                            рейсами в реальному часі за допомогою сучасних веб-технологій.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <a
                                href="#features"
                                className="driver-login-button inline-flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-slate-800 transition-all hover:shadow-lg mt-4"
                            >
                                Дізнатись більше
                            </a>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10">
                            <Image
                                src="/map.png"
                                alt="Map illustration"
                                width={600}
                                height={450}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-slate-900 rounded-full opacity-5 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
