import Link from 'next/link';

export default function CTA() {
    return (
        <section className="py-20 px-6 bg-slate-950 relative overflow-hidden">
            {/* Geometric Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 border border-white/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/3 w-48 h-48 border border-white/20 rounded-full translate-y-1/2"></div>
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                    Готові оптимізувати свій автопарк?
                </h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                    Приєднуйтесь до компаній, які вже використовують SmartLogist для
                    ефективного управління логістикою.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="#contact"
                        className="inline-flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-lg text-base font-semibold hover:bg-slate-100 transition-all hover:shadow-xl hover:shadow-white/20"
                    >
                        Зв'язатися з нами
                    </a>
                </div>
            </div>
        </section>
    );
}
