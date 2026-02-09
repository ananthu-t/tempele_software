import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Sparkles, Flame, ShieldCheck } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans pt-6 pb-12 sm:pb-0">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/50 rounded-full blur-[120px]" />

            <div className="w-full max-w-5xl px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
                {/* Brand Section */}
                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
                    <div className="flex justify-center lg:justify-start">
                        <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-200 animate-bounce-slow">
                            <ApplicationLogo className="w-12 h-12 fill-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
                            Digitalizing <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">Divinity</span>.
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed italic">
                            Experience the future of temple management with precision, speed, and spiritual integrity.
                        </p>
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-6 py-8">
                        <Feature icon={<Sparkles className="text-orange-500" />} title="Modern UI" desc="Fast & Intuitive Counter" />
                        <Feature icon={<Flame className="text-amber-500" />} title="Pooja Manager" desc="Real-time Bookings" />
                        <Feature icon={<ShieldCheck className="text-emerald-500" />} title="Secure Ledger" desc="Audit-ready Finance" />
                    </div>
                </div>

                {/* Login Card Section */}
                <div className="w-full lg:w-[450px]">
                    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-white/50 animate-in fade-in zoom-in duration-700">
                        {children}
                    </div>

                    <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em] px-10 leading-relaxed">
                        © 2026 Temple Management System. <br /> Built for Sacred Efficiency.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s infinite;
                }
            `}</style>
        </div>
    );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="font-black text-sm text-slate-800 uppercase tracking-wider">{title}</p>
                <p className="text-xs text-slate-400 font-bold">{desc}</p>
            </div>
        </div>
    );
}
