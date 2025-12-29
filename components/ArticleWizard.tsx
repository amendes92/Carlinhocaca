
import React, { useState, useEffect } from 'react';
import { ArticleLength, ArticleState, TargetAudience, Tone } from '../types';
import { FileText, Key, Sparkles, Users, ArrowRight, ArrowLeft, Check, PenTool, BookOpen, FlaskConical } from 'lucide-react';

interface ArticleWizardProps {
  onGenerate: (state: ArticleState) => void;
  isGenerating: boolean;
  initialState?: ArticleState | null; // Added initial state support
}

const ArticleWizard: React.FC<ArticleWizardProps> = ({ onGenerate, isGenerating, initialState }) => {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('Tratamento para Artrose');
  const [keywords, setKeywords] = useState('Artrose, Joelho, Tratamento');
  const [length, setLength] = useState<ArticleLength>(ArticleLength.MEDIUM);
  const [audience, setAudience] = useState<TargetAudience>(TargetAudience.PATIENT);
  const [tone, setTone] = useState<Tone>(Tone.EMPATHETIC);

  const isEvidenceMode = !!initialState?.evidence;

  // Pre-fill State from Evidence (Run once when initialState changes)
  useEffect(() => {
    if (initialState) {
        setTopic(initialState.topic);
        setTone(initialState.tone);
        // Pre-fill keywords if evidence exists
        if (initialState.evidence) {
            setKeywords(`Estudo Científico, ${initialState.evidence.source}, ${initialState.topic}`);
        }
    }
  }, [initialState]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    onGenerate({ 
        topic, keywords, length, audience, tone, 
        evidence: initialState?.evidence 
    });
  };

  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-24 lg:pb-0">
        
        {/* Progress */}
        <div className="mb-8">
             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-1">
            
            {/* Step 1: Topic */}
            {step === 1 && (
                <div className="space-y-6 animate-slideUp">
                     {/* Evidence Banner */}
                     {isEvidenceMode && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <FlaskConical className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Baseado em Evidência (RAG)</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{initialState?.evidence?.title}</p>
                            <p className="text-xs text-slate-500 mt-1">O artigo será citado como fonte principal.</p>
                        </div>
                     )}

                     <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-2">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Sobre o que vamos escrever?</h2>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Título ou Tema</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg font-medium"
                            placeholder="Ex: Tudo sobre Prótese de Joelho"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Palavras-Chave (SEO)</label>
                        <div className="relative">
                            <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all text-slate-600"
                                placeholder="Separe por vírgulas"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Audience */}
            {step === 2 && (
                <div className="space-y-6 animate-slideUp">
                    <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-2">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Para quem é esse texto?</h2>

                    <div className="space-y-3">
                         {Object.values(TargetAudience).map(a => (
                            <button
                                key={a}
                                onClick={() => setAudience(a)}
                                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between
                                ${audience === a ? 'border-purple-500 bg-purple-50 text-purple-900' : 'border-slate-100 bg-white hover:bg-slate-50'}`}
                            >
                                <span className="font-bold">{a}</span>
                                {audience === a && <Check className="w-5 h-5 text-purple-600" />}
                            </button>
                         ))}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Tom de Voz</label>
                         <div className="flex flex-wrap gap-2">
                            {Object.values(Tone).slice(0, 4).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`px-4 py-2 text-sm border rounded-full transition-all
                                    ${tone === t ? 'border-purple-500 bg-purple-600 text-white shadow-md' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {t.split('/')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Length */}
            {step === 3 && (
                <div className="space-y-6 animate-slideUp">
                    <h2 className="text-2xl font-bold text-slate-900">Qual o tamanho ideal?</h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                         {Object.values(ArticleLength).map(l => (
                            <button
                                key={l}
                                onClick={() => setLength(l)}
                                className={`p-6 rounded-2xl border-2 text-left transition-all
                                ${length === l ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                            >
                                <div className="font-bold text-slate-900 mb-1">{l.split('(')[0]}</div>
                                <div className="text-xs text-slate-500">{l.split('(')[1].replace(')', '')}</div>
                            </button>
                         ))}
                    </div>
                </div>
            )}
        </div>

        {/* Navigation / Loading Animation */}
        <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-3">
             {isGenerating ? (
                 <div className="w-full flex flex-col items-center justify-center py-4 animate-fadeIn">
                     <div className="relative mb-3">
                        <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <div className="relative bg-white p-4 rounded-full shadow-lg border border-blue-100">
                            <PenTool className="w-8 h-8 text-blue-600 animate-bounce" />
                        </div>
                     </div>
                     <p className="text-sm font-bold text-slate-700">Escrevendo Artigo...</p>
                     <p className="text-xs text-slate-400 animate-pulse">Otimizando SEO e Estrutura</p>
                 </div>
             ) : (
                 <>
                    {step > 1 && (
                        <button onClick={handleBack} className="p-4 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    
                    {step < 3 ? (
                        <button onClick={handleNext} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            Continuar <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all group">
                            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" /> Gerar Artigo
                        </button>
                    )}
                 </>
             )}
        </div>
    </div>
  );
};

export default ArticleWizard;
