import { useEffect, FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Authorized Access Only</p>
            </div>

            {status && <div className="mb-6 font-bold text-sm text-emerald-600 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 italic">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Email Address" className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="e.g. admin@temple.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <InputLabel htmlFor="password" value="Security Key" className="text-[10px] font-black uppercase tracking-widest text-slate-400" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-black text-orange-600 hover:text-orange-700 transition-colors"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-lg border-slate-200 text-orange-600 focus:ring-orange-500 transition-all"
                        />
                        <span className="ms-2 text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Keep me signed in</span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-100 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? 'Verifying...' : (
                            <>
                                Access Dashboard <ArrowRight size={18} />
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-10 border-t border-slate-50 pt-8 text-center px-4">
                <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                    If you are having trouble logging in, please contact the <span className="text-orange-600">Temple IT Administrator</span>.
                </p>
            </div>
        </GuestLayout>
    );
}
