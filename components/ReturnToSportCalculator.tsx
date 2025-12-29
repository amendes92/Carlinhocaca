
import React, { useState, useEffect } from 'react';
import { RTSMetrics, RTSHistoryEntry } from '../types';
import { Activity, CheckCircle, AlertTriangle, XCircle, Save, History, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

const ReturnToSportCalculator: React.FC = () => {
  const [metrics, setMetrics] = useState<RTSMetrics>({
    patientName: '',
    limbSymmetry: 85,
    painScore: 2,
    romExtension: 0,
    romFlexion: 135,
    hopTest: 80,
    psychologicalReadiness: 70
  });

  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<RTSHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('rts_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const painFactor = Math.max(0, 10 - metrics.painScore) * 10; 
    const romFactor = (metrics.romFlexion >= 130 && metrics.romExtension <= 5) ? 100 : 50;
    const calculated = (
        (metrics.limbSymmetry * 0.3) +
        (metrics.hopTest * 0.3) +
        (metrics.psychologicalReadiness * 0.2) +
        (painFactor * 0.1) +
        (romFactor * 0.1)
    );
    setScore(Math.round(calculated));
  }, [metrics]);

  const handleSave = () => {
      if (!metrics.patientName.trim()) {
          alert("Digite o nome do paciente para salvar.");
          return;
      }
      const newEntry: RTSHistoryEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          patientName: metrics.patientName,
          score: score,
          metrics: { ...metrics }
      };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('rts_history', JSON.stringify(updatedHistory));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const getStatus = (s: number) => {
      if (s >= 90) return { label: 'Apto', color: 'text-green-600', stroke: '#16a34a', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle };
      if (s >= 75) return { label: 'Treino', color: 'text-yellow-600', stroke: '#ca8a04', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle };
      return { label: 'Inapto', color: 'text-red-600', stroke: '#dc2626', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle };
  };

  const status = getStatus(score);

  // Premium Slider Component
  const PremiumSlider = ({ label, value, min, max, unit = '', onChange, colorClass = "bg-slate-900" }: any) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    return (
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
            <span className="text-sm font-black text-slate-800 bg-slate-50 px-2 py-1 rounded-lg min-w-[3rem] text-center border border-slate-100">
                {value}{unit}
            </span>
        </div>
        <div className="relative h-2 w-full bg-slate-100 rounded-full">
            <div 
                className={`absolute h-full rounded-full ${colorClass} transition-all duration-150`} 
                style={{ width: `${percentage}%` }}
            />
            <input 
                type="range" min={min} max={max} 
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
                className="absolute h-5 w-5 bg-white border-2 border-slate-200 rounded-full shadow-md top-1/2 -translate-y-1/2 pointer-events-none transition-all z-0"
                style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
            />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn bg-[#F8FAFC] pb-24 lg:pb-0">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl px-6 py-4 border-b border-slate-200 sticky top-0 z-20 flex justify-between items-center shadow-sm">
             <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 text-green-700 rounded-lg"><Activity className="w-4 h-4" /></div>
                    RTS Calc
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide ml-9">Protocolo ACL-RSI</p>
             </div>
             <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2.5 rounded-xl transition-all active:scale-95 border ${showHistory ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
             >
                 <History className="w-5 h-5" />
             </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
            
            {showHistory ? (
                <div className="animate-slideUp space-y-4">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Histórico de Pacientes</h2>
                    {history.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                            <p className="text-slate-400 text-sm font-medium">Nenhum cálculo salvo ainda.</p>
                        </div>
                    )}
                    {history.map(entry => (
                        <div key={entry.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">{entry.patientName}</h3>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{new Date(entry.date).toLocaleDateString()} às {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                            <div className={`text-xl font-black ${entry.score >= 90 ? 'text-green-600' : entry.score >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {entry.score}%
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                {/* Result Card */}
                <div className={`relative overflow-hidden rounded-[2rem] p-6 shadow-premium transition-all duration-500 border ${status.border} bg-white`}>
                    <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-20 ${status.bg.replace('bg-', 'bg-')}`}></div>
                    
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 ${status.bg} ${status.color} border border-current/10`}>
                                <status.icon className="w-3.5 h-3.5" /> {status.label}
                            </div>
                            <div className="flex items-baseline gap-1">
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                                    {score}
                                </h2>
                                <span className="text-2xl text-slate-400 font-bold">%</span>
                            </div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Score de Prontidão</p>
                        </div>

                        {/* Radial Chart */}
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                                <circle cx="56" cy="56" r="46" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                <circle 
                                    cx="56" cy="56" r="46" 
                                    stroke={status.stroke} 
                                    strokeWidth="8" 
                                    fill="transparent" 
                                    strokeDasharray="289" 
                                    strokeDashoffset={289 - (289 * score) / 100} 
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <status.icon className={`w-8 h-8 ${status.color}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <input 
                        type="text"
                        placeholder="Nome do Paciente"
                        value={metrics.patientName}
                        onChange={(e) => setMetrics({...metrics, patientName: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-base font-bold text-slate-800 placeholder:text-slate-300 transition-all"
                    />

                    <PremiumSlider label="LSI (Simetria Membros)" value={metrics.limbSymmetry} min={0} max={100} unit="%" colorClass="bg-blue-600" onChange={(v: number) => setMetrics({...metrics, limbSymmetry: v})} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PremiumSlider label="Hop Test" value={metrics.hopTest} min={0} max={100} unit="%" colorClass="bg-indigo-500" onChange={(v: number) => setMetrics({...metrics, hopTest: v})} />
                        <PremiumSlider label="ACL-RSI (Psicológico)" value={metrics.psychologicalReadiness} min={0} max={100} unit="" colorClass="bg-purple-500" onChange={(v: number) => setMetrics({...metrics, psychologicalReadiness: v})} />
                    </div>
                    
                    {/* Pain Scale */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Escala de Dor (EVA)</label>
                        <div className="flex justify-between items-center gap-1">
                            {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                                <button 
                                    key={v} 
                                    onClick={() => setMetrics({...metrics, painScore: v})} 
                                    className={`w-full aspect-square rounded-lg text-[10px] font-bold transition-all active:scale-90
                                    ${metrics.painScore === v 
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110' 
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PremiumSlider label="Flexão Joelho" value={metrics.romFlexion} min={0} max={150} unit="°" colorClass="bg-teal-500" onChange={(v: number) => setMetrics({...metrics, romFlexion: v})} />
                        <PremiumSlider label="Extensão" value={metrics.romExtension} min={0} max={10} unit="°" colorClass="bg-orange-500" onChange={(v: number) => setMetrics({...metrics, romExtension: v})} />
                    </div>
                </div>
                
                <button 
                    onClick={handleSave}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]
                    ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                    {saveStatus === 'saved' ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {saveStatus === 'saved' ? 'Salvo com Sucesso!' : 'Salvar Resultado'}
                </button>
                </>
            )}
        </div>
    </div>
  );
};

export default ReturnToSportCalculator;
