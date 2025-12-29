
import React, { useState, useEffect } from 'react';
import { RTSMetrics, RTSHistoryEntry } from '../types';
import { Activity, Dumbbell, Brain, Ruler, CheckCircle, AlertTriangle, XCircle, Share2, Info, Save, History, ChevronRight } from 'lucide-react';

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
      if (s >= 90) return { label: 'Apto', color: 'text-green-600', stroke: '#16a34a', bg: 'bg-green-100', icon: CheckCircle, desc: 'Alta' };
      if (s >= 75) return { label: 'Treino', color: 'text-yellow-600', stroke: '#ca8a04', bg: 'bg-yellow-100', icon: AlertTriangle, desc: 'Prog.' };
      return { label: 'Inapto', color: 'text-red-600', stroke: '#dc2626', bg: 'bg-red-100', icon: XCircle, desc: 'Reab' };
  };

  const status = getStatus(score);

  const CustomSlider = ({ label, value, min, max, onChange, unit = '' }: any) => (
    <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
            <span className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-lg min-w-[3rem] text-center shadow-sm">
                {value}{unit}
            </span>
        </div>
        <input 
            type="range" min={min} max={max} 
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600 touch-none"
        />
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fadeIn pb-24 lg:pb-0 font-sans bg-slate-50">
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
            
            {/* Context Bar & History Toggle */}
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocolo ACL-RSI</span>
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all border active:scale-95 ${showHistory ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                    {showHistory ? (
                        <>Voltar <ChevronRight className="w-3 h-3" /></>
                    ) : (
                        <><History className="w-3 h-3" /> Histórico</>
                    )}
                </button>
            </div>

            {showHistory ? (
                <div className="space-y-3 animate-slideUp">
                    {history.length === 0 && (
                        <div className="text-center py-10">
                            <History className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-medium">Nenhum cálculo salvo.</p>
                        </div>
                    )}
                    {history.map(entry => (
                        <div key={entry.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{entry.patientName}</h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                            <div className={`text-lg font-black ${entry.score >= 90 ? 'text-green-500' : 'text-slate-700'}`}>
                                {entry.score}%
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4 animate-slideUp">
                    {/* Patient Input */}
                    <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <input 
                            type="text"
                            placeholder="Nome do Paciente"
                            value={metrics.patientName}
                            onChange={(e) => setMetrics({...metrics, patientName: e.target.value})}
                            className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-bold text-slate-700 placeholder:text-slate-300 h-full"
                        />
                    </div>

                    {/* Compact Score Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide mb-3 ${status.bg} ${status.color}`}>
                                <status.icon className="w-3 h-3" /> {status.label}
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 leading-none tracking-tighter">
                                {score}<span className="text-2xl text-slate-300">%</span>
                            </h2>
                            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Índice de Retorno</p>
                        </div>

                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90">
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
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-slate-50 ${status.color}`}>
                                    <Activity className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Form */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <CustomSlider label="Simetria de Membros (LSI)" value={metrics.limbSymmetry} min={0} max={100} unit="%" onChange={(v: number) => setMetrics({...metrics, limbSymmetry: v})} />
                        <CustomSlider label="Hop Test (Salto)" value={metrics.hopTest} min={0} max={100} unit="%" onChange={(v: number) => setMetrics({...metrics, hopTest: v})} />
                        <CustomSlider label="Psicológico (ACL-RSI)" value={metrics.psychologicalReadiness} min={0} max={100} unit="" onChange={(v: number) => setMetrics({...metrics, psychologicalReadiness: v})} />
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escala de Dor (EVA)</label>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${metrics.painScore > 3 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{metrics.painScore}</span>
                            </div>
                            <div className="flex gap-1 h-8">
                                {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                                    <button 
                                        key={v} 
                                        onClick={() => setMetrics({...metrics, painScore: v})} 
                                        className={`flex-1 rounded-md text-[8px] font-bold transition-all ${metrics.painScore === v ? 'bg-slate-900 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 pt-2">
                            <CustomSlider label="Flexão Joelho" value={metrics.romFlexion} min={0} max={150} unit="°" onChange={(v: number) => setMetrics({...metrics, romFlexion: v})} />
                            <CustomSlider label="Extensão" value={metrics.romExtension} min={0} max={10} unit="°" onChange={(v: number) => setMetrics({...metrics, romExtension: v})} />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] mb-4
                        ${saveStatus === 'saved' ? 'bg-green-600 text-white shadow-green-500/30' : 'bg-slate-900 text-white shadow-slate-900/30 hover:bg-slate-800'}`}
                    >
                        {saveStatus === 'saved' ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {saveStatus === 'saved' ? 'Salvo no Histórico!' : 'Salvar Resultado'}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default ReturnToSportCalculator;
