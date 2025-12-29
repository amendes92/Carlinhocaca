
import React, { useState, useRef, useEffect } from 'react';
import { PostCategory, Tone, PostState, PostFormat } from '../types';
import { 
    HeartPulse, BriefcaseMedical, Activity, User, ShieldCheck, HelpCircle, 
    Search, Sparkles, Image as ImageIcon, Smartphone, LayoutGrid, 
    AlertCircle, ArrowRight, ArrowLeft, Check, Wand2, Flame, Zap, FlaskConical, AlertTriangle
} from 'lucide-react';

interface PostWizardProps {
  onGenerate: (state: PostState) => void;
  isGenerating: boolean;
  initialState?: PostState | null;
}

const PostWizard: React.FC<PostWizardProps> = ({ onGenerate, isGenerating, initialState }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<PostCategory>(PostCategory.PATHOLOGY);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [format, setFormat] = useState<PostFormat>(PostFormat.FEED);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{topic?: string}>({});
  const [loadingStage, setLoadingStage] = useState(0); 

  const isTrendMode = !!initialState?.customInstructions && !initialState.evidence;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialState) {
        setCategory(initialState.category);
        setTopic(initialState.topic);
        setTone(initialState.tone);
        setFormat(initialState.format);
        if (initialState.customInstructions || initialState.evidence) {
            setStep(3);
        }
    }
  }, [initialState]);

  useEffect(() => {
      if (isGenerating) {
          setLoadingStage(1);
          const t1 = setTimeout(() => setLoadingStage(2), 2000);
          const t2 = setTimeout(() => setLoadingStage(3), 4000);
          return () => { clearTimeout(t1); clearTimeout(t2); };
      } else {
          setLoadingStage(0);
      }
  }, [isGenerating]);

  const validateStep2 = () => {
      if (!topic.trim()) {
          setErrors({ topic: 'Por favor, digite um tema para o post.' });
          if (navigator.vibrate) navigator.vibrate(200);
          return false;
      }
      if (topic.length < 3) {
          setErrors({ topic: 'O tema deve ter pelo menos 3 caracteres.' });
          return false;
      }
      setErrors({});
      return true;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    if (!topic.trim()) {
        setStep(2);
        setErrors({ topic: 'O tema é obrigatório.' });
        return;
    }
    const customInstructions = initialState?.customInstructions || '';
    onGenerate({ category, topic, tone, format, customInstructions, uploadedImage, evidence: initialState?.evidence });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    { id: PostCategory.PATHOLOGY, icon: HeartPulse, label: "Doenças", color: "text-rose-500", bg: "bg-rose-50" },
    { id: PostCategory.SURGERY, icon: BriefcaseMedical, label: "Cirurgias", color: "text-blue-500", bg: "bg-blue-50" },
    { id: PostCategory.SPORTS, icon: Activity, label: "Esporte", color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: PostCategory.REHAB, icon: User, label: "Reabilitação", color: "text-purple-500", bg: "bg-purple-50" },
    { id: PostCategory.LIFESTYLE, icon: ShieldCheck, label: "Vida", color: "text-orange-500", bg: "bg-orange-50" },
    { id: PostCategory.MYTHS, icon: HelpCircle, label: "Mitos", color: "text-cyan-500", bg: "bg-cyan-50" },
  ];

  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col h-full animate-fadeIn w-full">
        <div className="mb-6 px-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Passo {step} de 3</span>
                <span>{step === 1 ? 'Formato' : step === 2 ? 'Conteúdo' : 'Estilo'}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 transition-all duration-500 ease-out relative" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4">
            
            {step === 1 && (
                <div className="space-y-6 animate-slideUp">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Qual o formato?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setFormat(PostFormat.FEED)}
                            className={`relative p-6 rounded-[1.5rem] border-2 transition-all duration-300 text-left group active:scale-[0.98]
                            ${format === PostFormat.FEED 
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xl' 
                                : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <LayoutGrid className={`w-8 h-8 ${format === PostFormat.FEED ? 'text-white' : 'text-slate-300'}`} />
                                {format === PostFormat.FEED && <Check className="w-5 h-5 text-white bg-white/20 rounded-full p-1" />}
                            </div>
                            <span className="block font-bold text-lg">Feed (Quadrado)</span>
                            <span className={`text-xs mt-1 block ${format === PostFormat.FEED ? 'text-slate-400' : 'text-slate-500'}`}>Ideal para educação profunda.</span>
                        </button>

                        <button
                            onClick={() => setFormat(PostFormat.STORY)}
                            className={`relative p-6 rounded-[1.5rem] border-2 transition-all duration-300 text-left group active:scale-[0.98]
                            ${format === PostFormat.STORY 
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xl' 
                                : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Smartphone className={`w-8 h-8 ${format === PostFormat.STORY ? 'text-white' : 'text-slate-300'}`} />
                                {format === PostFormat.STORY && <Check className="w-5 h-5 text-white bg-white/20 rounded-full p-1" />}
                            </div>
                            <span className="block font-bold text-lg">Story (Vertical)</span>
                            <span className={`text-xs mt-1 block ${format === PostFormat.STORY ? 'text-slate-400' : 'text-slate-500'}`}>Rápido, viral e interativo.</span>
                        </button>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Imagem de Referência (Opcional)</label>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                        
                        {!uploadedImage ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-24 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all text-slate-400 active:scale-[0.98]"
                            >
                                <ImageIcon className="w-6 h-6 opacity-50" />
                                <span className="text-xs font-bold">Toque para carregar foto</span>
                            </div>
                        ) : (
                            <div className="relative w-full h-48 rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
                                <img src={uploadedImage} className="w-full h-full object-cover" />
                                <button onClick={() => setUploadedImage(null)} className="absolute top-2 right-2 bg-white/90 text-red-500 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-sm">Remover</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-slideUp">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">O que vamos abordar?</h2>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.96] min-h-[110px] shadow-sm
                                ${category === cat.id 
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl' 
                                    : 'border-slate-100 bg-white text-slate-600'}`}
                            >
                                <div className={`p-2 rounded-full ${category === cat.id ? 'bg-white/10 text-white' : `${cat.bg} ${cat.color}`}`}>
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-center leading-tight">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative pt-2">
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Tema Principal</label>
                        <div className={`relative transition-all ${errors.topic ? 'animate-bounce' : ''}`}>
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => { setTopic(e.target.value); if (errors.topic) setErrors({}); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                className={`w-full pl-5 pr-12 py-5 bg-white border-2 rounded-[1.25rem] outline-none text-lg font-bold shadow-sm transition-all placeholder:font-normal
                                ${errors.topic 
                                    ? 'border-red-400 focus:border-red-500 ring-4 ring-red-50' 
                                    : 'border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-100'}`} 
                                placeholder="Ex: Dor no menisco..."
                            />
                            {errors.topic ? (
                                <div className="absolute right-4 top-5 text-red-500">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                            ) : (
                                <div className="absolute right-4 top-5 text-slate-300">
                                    <Search className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        {errors.topic && <p className="text-red-500 text-xs font-bold mt-2 ml-2">{errors.topic}</p>}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-slideUp">
                    {/* Strategy Cards */}
                    {isTrendMode && (
                        <div className="bg-orange-50 p-5 rounded-[1.5rem] border border-orange-100 flex items-start gap-4">
                            <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-orange-900 text-sm">Modo Viral Ativado</h3>
                                <p className="text-xs text-orange-700 mt-1 leading-relaxed">Foco total em retenção e headline chamativa baseada nas trends.</p>
                            </div>
                        </div>
                    )}

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tom de Voz</h2>
                    <div className="space-y-3">
                        {Object.values(Tone).slice(0, 5).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98]
                                ${tone === t 
                                    ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-md ring-1 ring-slate-200' 
                                    : 'border-slate-100 bg-white text-slate-600'}`}
                            >
                                <span className="font-bold text-sm">{t}</span>
                                {tone === t && <Check className="w-5 h-5 text-slate-900" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="pt-4 border-t border-slate-200/60 flex items-center gap-4 bg-white/50 backdrop-blur-md md:bg-transparent -mx-4 px-6 pb-6">
            {isGenerating ? (
                <div className="w-full py-2 animate-fadeIn">
                    <div className="flex justify-between mb-2 px-1">
                        <span className={`text-[10px] font-bold uppercase transition-colors ${loadingStage >= 1 ? 'text-slate-900' : 'text-slate-300'}`}>1. Copy</span>
                        <span className={`text-[10px] font-bold uppercase transition-colors ${loadingStage >= 2 ? 'text-slate-900' : 'text-slate-300'}`}>2. Audit</span>
                        <span className={`text-[10px] font-bold uppercase transition-colors ${loadingStage >= 3 ? 'text-slate-900' : 'text-slate-300'}`}>3. Image</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent skeleton-bg w-full"></div>
                        <div className="h-full bg-slate-900 transition-all duration-[2000ms] ease-linear" style={{ width: `${loadingStage * 33}%` }}></div>
                    </div>
                    <p className="text-center text-xs text-slate-500 font-bold mt-3 animate-pulse">
                        {loadingStage === 1 && "Escrevendo legenda..."}
                        {loadingStage === 2 && "Verificando regras do CFM..."}
                        {loadingStage === 3 && "Gerando imagem exclusiva..."}
                    </p>
                </div>
            ) : (
                <>
                    {step > 1 && (
                        <button onClick={handleBack} className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 shadow-sm">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    
                    {step < 3 ? (
                        <button onClick={handleNext} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-[0.98]">
                            Próximo <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className={`flex-1 bg-gradient-to-r ${isTrendMode ? 'from-orange-500 to-red-600' : 'from-blue-600 to-indigo-600'} text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]`}>
                            <Sparkles className="w-5 h-5" />
                            {isTrendMode ? 'Gerar Post Viral' : 'Gerar Post'}
                        </button>
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default PostWizard;
