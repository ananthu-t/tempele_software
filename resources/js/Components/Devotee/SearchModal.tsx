import React, { useState, useEffect, useRef, useMemo } from 'react';
import Modal from '@/Components/Modal';
import { Search, X, User, Zap, Star, Phone, ChevronRight } from 'lucide-react';
import { debounce } from 'lodash';
import axios from 'axios';
import { Devotee } from '@/types';
import { fetchMalayalamTransliteration } from '@/Services/MalayalamService';

interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (devotee: Devotee) => void;
}

export default function DevoteeSearchModal({ show, onClose, onSelect }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Devotee[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (show) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [show]);

    useEffect(() => {
        const fetchDevotees = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(route('api.devotees.search'), { params: { q: query } });
                setResults(response.data);
            } catch (error) {
                console.error('Failed to fetch devotees', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchDevotees, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="bg-slate-50 p-8 sm:p-10 relative overflow-hidden h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Search Devotee</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Identify profile for sacred offering</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative group shrink-0 mb-6">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="NAME, PHONE NUMBER, OR STAR..."
                        className="w-full bg-white border-slate-100 rounded-3xl py-6 pl-16 pr-6 font-black text-slate-900 uppercase tracking-wider text-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
                    />
                    {loading && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-200 border-t-orange-500"></div>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {results.length > 0 ? (
                        results.map((devotee) => (
                            <button
                                key={devotee.id}
                                onClick={() => onSelect(devotee)}
                                className="w-full text-left bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 uppercase tracking-tight text-lg flex items-center gap-3">
                                            {devotee.name}
                                            {devotee.name_ml && <span className="text-orange-600 font-medium text-sm ml-2 font-malayalam">{devotee.name_ml}</span>}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                <Phone size={10} /> {devotee.phone}
                                            </div>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                <Star size={10} /> {devotee.star || 'RASHICHAKRAM'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 group-hover:bg-orange-600 group-hover:text-white p-3 rounded-2xl transition-all shadow-sm">
                                    <ChevronRight size={18} />
                                </div>
                            </button>
                        ))
                    ) : query.length >= 2 && !loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                            <div className="bg-slate-100 p-6 rounded-[2.5rem] text-slate-300">
                                <Search size={48} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl">No Devotee Found</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Try searching different spelling or phone</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-30">
                            <div className="bg-slate-100 p-6 rounded-[2.5rem] text-slate-300">
                                <Zap size={48} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Start Searching</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Minimum 2 characters required</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
