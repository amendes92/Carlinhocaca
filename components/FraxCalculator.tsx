
import React, { useState } from 'react';
import { Bone, Info, AlertTriangle, CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';

const FraxCalculator: React.FC = () => {
  const [result, setResult] = useState<'low' | 'medium' | 'high' | null>(null);
  
  // Inputs
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [fractureHistory, setFractureHistory] = useState(false);
  const [parentHip, setParentHip] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [glucocorticoids, setGlucocorticoids] = useState(false);
  const [ra, setRa] = useState(false);

  const calculateRisk = () => {
      let riskScore = 0;
      const ageNum = parseInt(age);
      
      if (ageNum > 65) riskScore += 2;
      else if (ageNum > 50) riskScore += 1;

      if (fractureHistory) riskScore += 2;
      if (parentHip) riskScore += 1;
      if (smoking) riskScore += 1;
      if (glucocorticoids) riskScore += 1;
      if (ra) riskScore += 1;
      if (parseInt(weight) < 60) riskScore += 1;

      if (riskScore >= 4) setResult('high');
      else if (riskScore >= 2) setResult('medium');
      else setResult('low');
  };

  const getResultData = () => {
      switch(result) {
          case 'high': return { label: 'Alto Risco', bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', icon: AlertTriangle, msg: 'Intervenção Farmacológica Indicada' };
          case 'medium': return { label: 'Risco Médio', bg: 'bg-amber-400', text: 'text-amber-950', border: 'border-amber-500', icon: Info, msg: 'Solicitar Densitometria (DXA)' };
          case 'low': return { label: 'Baixo Risco', bg: 'bg-green-500', text: 'text-white', border: 'border-green-600', icon: CheckCircle2, msg: 'Manter Prevenção Básica' };
          default: return { label: '', bg: '', text: '', border: '', icon: Info, msg: '' };
      }
  };

  // iOS Style Toggle
  const Toggle = ({ label, value, onChange }: any) => (
      <div 
        onClick={() => onChange(!value)}
        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-slate-200 transition-colors active:scale-[0.99]"
      >
          <span className="text-sm font-bold text-slate-700">{label}</span>
          <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out relative ${value ? 'bg-green-500' : 'bg-slate-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out transform ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
      </div>
  );

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl px-6 py-6 border-b border-slate-200 sticky top-0 z-20 shadow-sm">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Bone className="w-5 h-5" /></div>
                FRAX Calc
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium ml-11">Risco de fratura (10 anos).</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            
            {result ? (
                <div className="flex flex-col items-center pt-4 animate-scaleIn">
                    {/* Result Card */}
                    <div className={`w-full p-8 rounded-[2rem] shadow-xl mb-8 text-center relative overflow-hidden ${getResultData().bg} ${getResultData().text}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-4 shadow-sm">
                                {React.createElement(getResultData().icon, { className: "w-8 h-8" })}
                            </div>
                            <h2 className="text-3xl font-black mb-2 tracking-tight">{getResultData().label}</h2>
                            <div className="h-1 w-16 bg-white/30 rounded-full mb-4"></div>
                            <p className="font-bold text-sm opacity-90 uppercase tracking-wide">{getResultData().msg}</p>
                        </div>
                    </div>
                    
                    <div className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
                        <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide border-b border-slate-50 pb-2">Recomendações Clínicas</h3>
                        <ul className="space-y-4 text-sm text-slate-600 font-medium">
                            <li className="flex gap-3 items-start">
                                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle2 className="w-3 h-3" /></div>
                                Suplementação de Cálcio (1.200mg) e Vitamina D (800UI).
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle2 className="w-3 h-3" /></div>
                                Exercícios de fortalecimento muscular e equilíbrio.
                            </li>
                            {result === 'high' && (
                                <li className="flex gap-3 items-start p-3 bg-red-50 rounded-xl border border-red-100 text-red-800">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    Avaliar Bisfosfonatos (Alendronato/Risedronato) ou Denosumabe.
                                </li>
                            )}
                        </ul>
                    </div>

                    <button 
                        onClick={() => setResult(null)}
                        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200"
                    >
                        <RotateCcw className="w-4 h-4" /> Novo Cálculo
                    </button>
                </div>
            ) : (
                <div className="max-w-lg mx-auto pb-8">
                    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dados do Paciente</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-amber-500 uppercase">Idade</label>
                                <input 
                                    type="number" 
                                    value={age} 
                                    onChange={e => setAge(e.target.value)} 
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-bold text-lg text-slate-800 transition-all text-center placeholder:text-slate-300"
                                    placeholder="00"
                                />
                                <span className="absolute right-4 top-4 text-xs font-bold text-slate-400">Anos</span>
                            </div>
                            <div className="relative group">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-amber-500 uppercase">Peso</label>
                                <input 
                                    type="number" 
                                    value={weight} 
                                    onChange={e => setWeight(e.target.value)} 
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-bold text-lg text-slate-800 transition-all text-center placeholder:text-slate-300"
                                    placeholder="00"
                                />
                                <span className="absolute right-4 top-4 text-xs font-bold text-slate-400">Kg</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Fatores de Risco</h3>
                    <div className="space-y-3 mb-8">
                        <Toggle label="Fratura Prévia (após 50 anos)" value={fractureHistory} onChange={setFractureHistory} />
                        <Toggle label="Pais com Fratura de Quadril" value={parentHip} onChange={setParentHip} />
                        <Toggle label="Tabagismo Ativo" value={smoking} onChange={setSmoking} />
                        <Toggle label="Uso de Corticoides (>3 meses)" value={glucocorticoids} onChange={setGlucocorticoids} />
                        <Toggle label="Artrite Reumatoide" value={ra} onChange={setRa} />
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl text-xs text-blue-700 flex gap-3 items-start border border-blue-100/50 mb-6">
                        <Info className="w-5 h-5 shrink-0" />
                        <p className="leading-relaxed">Ferramenta de triagem baseada nos critérios NOGG (National Osteoporosis Guideline Group). Não substitui o julgamento clínico.</p>
                    </div>

                    <button 
                        onClick={calculateRisk}
                        disabled={!age || !weight}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:transform-none flex items-center justify-center gap-2 text-sm"
                    >
                        Calcular Risco <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default FraxCalculator;
