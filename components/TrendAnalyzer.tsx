
import React, { useEffect, useState } from 'react';
import { TrendTopic, PostState, PostCategory, Tone, PostFormat } from '../types';
import { generateTrendSuggestions } from '../services/geminiService';
import { TrendingUp, ArrowUpRight, Flame, Loader2, Plus, RefreshCw, Search, Sparkles, Globe, Radio } from 'lucide-react';

interface TrendAnalyzerProps {
  onUseTrend: (partialState: Partial<PostState>) => void;
}

const TrendAnalyzer: React.FC<TrendAnalyzerProps> = ({ onUseTrend }) => {
  const [trends, setTrends] = useState<TrendTopic[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    try {
        const data = await generateTrendSuggestions();
        setTrends(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  // Loading Animation Component
  const RadarLoading = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-fadeIn">
        <div className="relative w-32 h-32 mb-8">
            {/* Pulsing Circles */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-4 border-4 border-blue-50 rounded-full"></div>
            
            {/* Spinning Radar Line */}
            <div className="absolute inset-0 rounded-full overflow-hidden animate-spin" style={{ animationDuration: '3s' }}>
                <div className="w-full h-1/2 bg-gradient-to-t from-blue-500/40 to-transparent blur-md origin-bottom"></div>
            </div>

            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-white m-8 rounded-full shadow-lg z-10">
                <Globe className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">Escaneando Trends...</h3>
        <p className="text-slate-500 text-sm max-w-xs text-center animate-pulse">
            Analisando volumes de busca no Google Brasil e identificando oportunidades virais.
        </p>

        {/* Fake Progress Steps */}
        <div className="mt-8 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fadeIn bg-slate-50">
        
        {/* Sticky Header with Controls */}
        <div className="bg-white/80 backdrop-blur-md px-5 py-4 border-b border-slate-100 sticky top-0 z-10 flex justify-between items-center">
            <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Radar de Trends
                </h1>
                <p className="text-xs text-slate-500 font-medium">Em alta no Google Brasil 🇧🇷</p>
            </div>
            <button 
                onClick={fetchTrends}
                disabled={loading}
                className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>

        {/* Content - Fully Scrollable without nested truncation */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
            
            {loading ? (
                <RadarLoading />
            ) : (
                <>
                    {/* Featured / Viral Trend */}
                    {trends.length > 0 && (
                        <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-900 text-white shadow-xl shadow-slate-900/10 group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
                            
                            <div className="relative p-6 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                                        <Flame className="w-3 h-3 fill-orange-400" /> Viral
                                    </span>
                                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                        {trends[0].growth}
                                    </span>
                                </div>
                                
                                <h2 className="text-2xl font-black leading-tight tracking-tight mt-1">
                                    {trends[0].keyword}
                                </h2>
                                
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 my-1">
                                    <p className="text-[10px] text-slate-300 uppercase font-bold mb-1">Sugestão de Post</p>
                                    <p className="text-sm font-medium italic text-white leading-relaxed">"{trends[0].suggestedHeadline}"</p>
                                </div>

                                <button 
                                    onClick={() => onUseTrend({ 
                                        topic: trends[0].keyword, 
                                        customInstructions: `Trend Viral: ${trends[0].keyword}. Headline: ${trends[0].suggestedHeadline}. Foco: ${trends[0].growth}`,
                                        category: PostCategory.LIFESTYLE,
                                        tone: Tone.EDUCATIONAL,
                                        format: PostFormat.FEED
                                    })}
                                    className="w-full bg-white text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg active:scale-[0.98] text-sm mt-1"
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    Criar Post Viral
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Standard Trends */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {trends.slice(1).map((trend, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-slate-50 text-slate-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-slate-100">
                                            {trend.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-md">
                                            <ArrowUpRight className="w-3 h-3" /> {trend.growth}
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">{trend.keyword}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${trend.volume.includes('Alta') ? 'w-3/4 bg-blue-500' : 'w-1/2 bg-blue-300'}`}></div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                                        <span className="font-bold text-slate-700">Ideia:</span> "{trend.suggestedHeadline}"
                                    </p>
                                </div>

                                <button 
                                    onClick={() => onUseTrend({ 
                                        topic: trend.keyword, 
                                        customInstructions: `Trend: ${trend.keyword}. Headline: ${trend.suggestedHeadline}`,
                                        category: PostCategory.LIFESTYLE,
                                        tone: Tone.EDUCATIONAL,
                                        format: PostFormat.FEED
                                    })}
                                    className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                                >
                                    <Plus className="w-3 h-3" /> Usar Pauta
                                </button>
                            </div>
                        ))}
                    </div>

                    {trends.length === 0 && !loading && (
                        <div className="text-center py-20 opacity-50">
                            <p>Clique em atualizar para buscar novas trends.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default TrendAnalyzer;
