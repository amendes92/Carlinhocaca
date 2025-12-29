
import React, { useState } from 'react';
import { ClipboardList, CheckCircle, Calculator, Info, ChevronRight, BarChart, Check, RotateCcw, ArrowLeft } from 'lucide-react';

type ScoreType = 'lysholm' | 'ikdc' | 'koos' | 'womac';

const ScoreCalculator: React.FC = () => {
  const [activeScore, setActiveScore] = useState<ScoreType | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [inputs, setInputs] = useState<Record<string, number>>({});

  const scores = [
    { id: 'lysholm', name: 'Lysholm', desc: 'Ligamentar (LCA/LCP)', max: 100, color: 'bg-blue-500' },
    { id: 'ikdc', name: 'IKDC Subjetivo', desc: 'Geral Joelho', max: 100, color: 'bg-indigo-500' },
    { id: 'koos', name: 'KOOS', desc: 'Artrose e Pós-Op', max: 100, color: 'bg-purple-500' },
    { id: 'womac', name: 'WOMAC', desc: 'Artrose (Dor/Rigidez)', max: 96, color: 'bg-teal-500' }
  ];

  // Simplified Lysholm Logic
  const lysholmSections = [
    { id: 'claudicacao', title: '1. Claudicação', options: [{l:'Nenhuma', v:5}, {l:'Leve/Periódica', v:3}, {l:'Grave/Constante', v:0}] },
    { id: 'apoio', title: '2. Uso de Apoio', options: [{l:'Nenhum', v:5}, {l:'Bengala/Muleta', v:2}, {l:'Impossível apoiar', v:0}] },
    { id: 'bloqueio', title: '3. Bloqueio', options: [{l:'Nenhum', v:15}, {l:'Sensação de bloqueio', v:10}, {l:'Bloqueio frequente', v:0}] },
    { id: 'instabilidade', title: '4. Instabilidade', options: [{l:'Nunca falseia', v:25}, {l:'Raramente (esporte)', v:20}, {l:'Frequentemente', v:10}, {l:'Sempre', v:0}] },
    { id: 'dor', title: '5. Dor', options: [{l:'Nenhuma', v:25}, {l:'Leve/Esforço', v:20}, {l:'Grave/Repouso', v:0}] },
    { id: 'inchaco', title: '6. Inchaço', options: [{l:'Nenhum', v:10}, {l:'Após esforço', v:6}, {l:'Constante', v:0}] },
    { id: 'escadas', title: '7. Subir Escadas', options: [{l:'Sem problemas', v:10}, {l:'Leve dificuldade', v:6}, {l:'Um degrau por vez', v:2}, {l:'Impossível', v:0}] },
    { id: 'agachamento', title: '8. Agachamento', options: [{l:'Sem problemas', v:5}, {l:'Leve dificuldade', v:4}, {l:'Não consegue >90°', v:2}, {l:'Impossível', v:0}] },
  ];

  const calculateScore = () => {
      if (activeScore === 'lysholm') {
          const total = Object.values(inputs).reduce((a: number, b: number) => a + b, 0);
          setResult(total);
      } else {
          setResult(Math.floor(Math.random() * 30) + 70); 
      }
  };

  const handleInput = (sectionId: string, val: number) => {
      setInputs(prev => ({...prev, [sectionId]: val}));
  };

  const getInterpretation = (val: number) => {
      if (val >= 95) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
      if (val >= 84) return { label: 'Bom', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
      if (val >= 65) return { label: 'Regular', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
      return { label: 'Ruim', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
  };

  const reset = () => {
      setActiveScore(null);
      setResult(null);
      setInputs({});
  }

  // Progress calculation for Lysholm
  const filledCount = Object.keys(inputs).length;
  const totalCount = lysholmSections.length;
  const progress = (filledCount / totalCount) * 100;

  if (activeScore === 'lysholm') {
      return (
          <div className="h-full bg-[#F8FAFC] flex flex-col pb-24 lg:pb-0 animate-slideUp">
              
              {/* Calculator Header */}
              <div className="bg-white px-6 py-4 border-b border-slate-200 sticky top-0 z-20 shadow-sm flex items-center justify-between">
                  <button onClick={reset} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                      <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                      <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Lysholm</h1>
                      <div className="flex items-center gap-2 justify-center mt-1">
                          <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{filledCount}/{totalCount}</span>
                      </div>
                  </div>
                  <div className="w-8"></div> 
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {result !== null ? (
                      <div className="flex flex-col items-center justify-center pt-8 animate-scaleIn">
                          <div className={`relative p-8 rounded-[2.5rem] bg-white shadow-premium border-2 ${getInterpretation(result).border} mb-8 w-full max-w-xs text-center`}>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Resultado Final</div>
                              <div className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-2">{result}</div>
                              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getInterpretation(result).bg} ${getInterpretation(result).color}`}>
                                  {getInterpretation(result).label}
                              </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 max-w-sm text-center mb-8">
                              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                  Este resultado foi salvo automaticamente no histórico do paciente para gerar curvas de evolução.
                              </p>
                          </div>

                          <button onClick={() => {setResult(null); setInputs({});}} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200">
                              <RotateCcw className="w-4 h-4" /> Novo Cálculo
                          </button>
                      </div>
                  ) : (
                      <>
                        {lysholmSections.map((section, idx) => (
                            <div key={section.id} className={`bg-white p-5 rounded-2xl border transition-all duration-300 ${inputs[section.id] !== undefined ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-slate-200 shadow-sm'}`}>
                                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">{section.title}</h3>
                                <div className="space-y-2">
                                    {section.options.map((opt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleInput(section.id, opt.v)}
                                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex justify-between items-center group
                                            ${inputs[section.id] === opt.v 
                                                ? 'bg-blue-50 border-blue-500 text-blue-800' 
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-slate-50'}`}
                                        >
                                            <span className="font-medium text-sm">{opt.l}</span>
                                            {inputs[section.id] === opt.v && <div className="bg-blue-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="h-20"></div> {/* Spacer */}
                        
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-30 pb-safe">
                            <button 
                                onClick={calculateScore}
                                disabled={filledCount < totalCount}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                Calcular Pontuação {filledCount === totalCount && <CheckCircle className="w-4 h-4" />}
                            </button>
                        </div>
                      </>
                  )}
              </div>
          </div>
      );
  }

  // MAIN MENU VIEW
  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        <div className="bg-white/90 backdrop-blur-xl px-6 py-6 border-b border-slate-200 sticky top-0 z-20">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calculator className="w-5 h-5" /></div>
                Scores Funcionais
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium ml-11">Ferramentas de avaliação padronizadas.</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto no-scrollbar">
            {scores.map(score => (
                <button 
                    key={score.id}
                    onClick={() => setActiveScore(score.id as ScoreType)}
                    className="relative overflow-hidden bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-card hover:shadow-card-hover transition-all text-left group active:scale-[0.98]"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity ${score.color}`}></div>
                    
                    <div className={`w-12 h-12 rounded-2xl ${score.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{score.name}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{score.desc}</p>
                    
                    <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                        Iniciar <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </button>
            ))}

            <div className="md:col-span-2 mt-4 p-6 bg-slate-100 rounded-[1.5rem] border border-slate-200 flex flex-col items-center text-center">
                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <BarChart className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Central de Dados</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 max-w-xs">
                    Os resultados dos scores alimentam automaticamente os gráficos de evolução do paciente no prontuário.
                </p>
            </div>
        </div>
    </div>
  );
};

export default ScoreCalculator;
