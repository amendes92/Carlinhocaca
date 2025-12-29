
import React, { useState, useRef, useEffect } from 'react';
import { PostCategory, Tone, PostState, PostFormat } from '../types';
import { 
    HeartPulse, 
    BriefcaseMedical, 
    Activity, 
    User, 
    ShieldCheck, 
    HelpCircle, 
    Search,
    Sparkles,
    Image as ImageIcon,
    Smartphone,
    LayoutGrid,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Check,
    Wand2,
    Flame,
    Zap,
    FlaskConical
} from 'lucide-react';

interface PostWizardProps {
  onGenerate: (state: PostState) => void;
  isGenerating: boolean;
  initialState?: PostState | null; // New Prop for Trends/Evidence
}

const PostWizard: React.FC<PostWizardProps> = ({ onGenerate, isGenerating, initialState }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<PostCategory>(PostCategory.PATHOLOGY);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [format, setFormat] = useState<PostFormat>(PostFormat.FEED);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{topic?: boolean}>({});
  
  // Detect if we are in "Trend Mode" (Viral Strategy)
  const isTrendMode = !!initialState?.customInstructions && !initialState.evidence;
  // Detect if Evidence Mode
  const isEvidenceMode = !!initialState?.evidence;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill State from Trends/Evidence (Run once when initialState changes)
  useEffect(() => {
    if (initialState) {
        setCategory(initialState.category);
        setTopic(initialState.topic);
        setTone(initialState.tone);
        setFormat(initialState.format);
        // If it's a trend or evidence, jump steps
        if (initialState.customInstructions || initialState.evidence) {
            setStep(3);
        }
    } else {
        // Reset defaults if opened fresh
        setStep(1);
        setCategory(PostCategory.PATHOLOGY);
        setTopic('');
        setTone(Tone.PROFESSIONAL);
        setFormat(PostFormat.FEED);
        setUploadedImage(null);
    }
  }, [initialState]);

  const handleNext = () => {
    if (step === 2 && !topic.trim()) {
        setErrors({ topic: true });
        return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    // If trend mode, preserve instructions
    const customInstructions = initialState?.customInstructions || '';
    // Pass evidence if exists
    onGenerate({ 
        category, topic, tone, format, customInstructions, uploadedImage,
        evidence: initialState?.evidence 
    });
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
    { id: PostCategory.PATHOLOGY, icon: <HeartPulse className="w-5 h-5" />, label: "Doenças" },
    { id: PostCategory.SURGERY, icon: <BriefcaseMedical className="w-5 h-5" />, label: "Cirurgias" },
    { id: PostCategory.SPORTS, icon: <Activity className="w-5 h-5" />, label: "Esporte" },
    { id: PostCategory.REHAB, icon: <User className="w-5 h-5" />, label: "Reabilitação" },
    { id: PostCategory.LIFESTYLE, icon: <ShieldCheck className="w-5 h-5" />, label: "Vida" },
    { id: PostCategory.MYTHS, icon: <HelpCircle className="w-5 h-5" />, label: "Mitos" },
  ];

  // Progress Bar
  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col h-full animate-fadeIn w-full">
        
        {/* Progress Header */}
        <div className="mb-8 px-1">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span>Passo {step} de 3</span>
                <span>{step === 1 ? 'Formato' : step === 2 ? 'Conteúdo' : 'Personalização'}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500 ease-out relative" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-1 pb-4">
            
            {/* STEP 1: FORMAT & MEDIA */}
            {step === 1 && (
                <div className="space-y-8 animate-slideUp">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Como será esse post?</h2>
                    
                    <div className="grid grid-cols-2 gap-5">
                        <button
                            onClick={() => setFormat(PostFormat.FEED)}
                            className={`relative p-6 rounded-3xl border-2 transition-all duration-300 text-left group active:scale-[0.98]
                            ${format === PostFormat.FEED 
                                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/20' 
                                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${format === PostFormat.FEED ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-50 text-slate-400'}`}>
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <span className="block font-bold text-slate-900 text-lg">Feed</span>
                            <span className="text-xs text-slate-500 mt-2 block font-medium leading-relaxed">Quadrado (1:1). Ideal para educação e detalhes.</span>
                            {format === PostFormat.FEED && <div className="absolute top-5 right-5 text-primary bg-white rounded-full p-1 shadow-sm"><Check className="w-4 h-4" /></div>}
                        </button>

                        <button
                            onClick={() => setFormat(PostFormat.STORY)}
                            className={`relative p-6 rounded-3xl border-2 transition-all duration-300 text-left group active:scale-[0.98]
                            ${format === PostFormat.STORY 
                                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/20' 
                                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${format === PostFormat.STORY ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-50 text-slate-400'}`}>
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <span className="block font-bold text-slate-900 text-lg">Story</span>
                            <span className="text-xs text-slate-500 mt-2 block font-medium leading-relaxed">Vertical (9:16). Rápido, direto e interativo.</span>
                             {format === PostFormat.STORY && <div className="absolute top-5 right-5 text-primary bg-white rounded-full p-1 shadow-sm"><Check className="w-4 h-4" /></div>}
                        </button>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Imagem de Referência (Opcional)</label>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                        
                        {!uploadedImage ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-slate-400 hover:text-primary group bg-white hover:shadow-sm active:scale-[0.99]"
                            >
                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors shadow-sm">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold">Carregar Raio-X ou Foto</span>
                            </div>
                        ) : (
                            <div className="relative w-full h-48 rounded-3xl overflow-hidden border border-slate-200 shadow-lg group">
                                <img src={uploadedImage} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                     <button onClick={() => setUploadedImage(null)} className="bg-white text-red-500 px-4 py-2 rounded-xl text-xs font-bold shadow-xl hover:scale-105 transition-transform">Remover Imagem</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: CONTENT */}
            {step === 2 && (
                <div className="space-y-8 animate-slideUp">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sobre o que vamos falar?</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-[0.98]
                                ${category === cat.id 
                                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' 
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}
                            >
                                <div className={`p-2 rounded-lg ${category === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{cat.icon}</div>
                                <span className="text-sm font-bold">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative pt-4">
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Tema Principal</label>
                        <div className="relative group">
                            <Search className={`absolute left-5 top-4 w-5 h-5 transition-colors ${errors.topic ? 'text-red-400' : 'text-slate-400 group-focus-within:text-primary'}`} />
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => { setTopic(e.target.value); setErrors({topic: false}); }}
                                autoFocus
                                className={`w-full pl-12 pr-5 py-4 bg-white border-2 rounded-2xl outline-none focus:ring-4 transition-all font-medium text-lg
                                ${errors.topic 
                                    ? 'border-red-100 focus:border-red-500 focus:ring-red-100 placeholder:text-red-300' 
                                    : 'border-slate-100 focus:border-primary focus:ring-primary/10 placeholder:text-slate-300 hover:border-slate-200'}`} 
                                placeholder="Ex: Dor no menisco ao agachar..."
                            />
                        </div>
                        {errors.topic && <p className="text-red-500 text-xs font-bold mt-2 ml-2 flex items-center gap-1 animate-slideUp"><AlertCircle className="w-3 h-3"/> Digite um tema para continuar</p>}
                    </div>
                </div>
            )}

            {/* STEP 3: TONE & CONFIRMATION (Enhanced for Trends/Evidence) */}
            {step === 3 && (
                <div className="space-y-8 animate-slideUp">
                    
                    {/* Trend Strategy Card */}
                    {isTrendMode && (
                        <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/20 mb-8 border border-slate-800">
                             {/* Abstract Background Effects */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                             <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-10"></div>
                             
                             <div className="relative p-8">
                                 <div className="flex items-center justify-between mb-6">
                                     <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-lg shadow-orange-900/20">
                                         <Flame className="w-3.5 h-3.5 fill-orange-400" /> ESTRATÉGIA VIRAL
                                     </span>
                                 </div>
                                 
                                 <h3 className="text-2xl font-black leading-tight mb-3 text-white tracking-tight">"{topic}"</h3>
                                 <p className="text-sm text-slate-300 leading-relaxed mb-6 border-l-2 border-primary pl-4">
                                     A IA detectou alta demanda. O post será otimizado para <span className="text-white font-bold">retenção</span> e <span className="text-white font-bold">compartilhamento</span>.
                                 </p>
                                 
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3 backdrop-blur-sm">
                                         <Zap className="w-5 h-5 text-yellow-400" />
                                         <span className="text-xs font-bold text-slate-200">Headline Clickbait</span>
                                     </div>
                                     <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3 backdrop-blur-sm">
                                         <div className="w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                         </div>
                                         <span className="text-xs font-bold text-slate-200">Alta Relevância</span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* Evidence Strategy Card */}
                    {isEvidenceMode && (
                        <div className="relative overflow-hidden rounded-[1.5rem] bg-blue-900 text-white shadow-2xl shadow-blue-900/20 mb-8 border border-blue-800">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
                             
                             <div className="relative p-8">
                                 <div className="flex items-center justify-between mb-6">
                                     <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                                         <FlaskConical className="w-3.5 h-3.5 fill-blue-400" /> BASEADO EM EVIDÊNCIA
                                     </span>
                                 </div>
                                 
                                 <h3 className="text-lg font-bold leading-tight mb-2 text-white tracking-tight line-clamp-2">
                                     {initialState?.evidence?.title}
                                 </h3>
                                 <p className="text-[10px] text-blue-200 font-mono mb-6 bg-blue-950/50 p-2 rounded border border-blue-800/50 inline-block">
                                     Fonte: {initialState?.evidence?.source}
                                 </p>
                                 
                                 <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs text-slate-200 italic">
                                     "O conteúdo será gerado citando este artigo científico para aumentar sua autoridade."
                                 </div>
                             </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                            {isTrendMode || isEvidenceMode ? 'Ajuste Fino da IA' : 'Qual a "vibe" do post?'}
                        </h2>
                        
                        <div className="space-y-3">
                            {Object.values(Tone).slice(0, 5).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all group active:scale-[0.99]
                                    ${tone === t 
                                        ? 'border-primary bg-primary/5 text-primary-900 shadow-lg shadow-primary/10 ring-1 ring-primary/20' 
                                        : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold text-sm">{t.split('/')[0]}</span>
                                        <span className="text-xs opacity-70 font-medium mt-0.5">{t.split('/')[1]}</span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${tone === t ? 'bg-primary border-primary text-white' : 'border-slate-200 bg-slate-50'}`}>
                                        {tone === t && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {(isTrendMode || isEvidenceMode) && (
                        <div className="pt-6 border-t border-slate-100 mt-6">
                            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Adicionar Foto Pessoal (Opcional)</label>
                            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                            
                            {!uploadedImage ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-20 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-slate-500 hover:text-primary group bg-white active:scale-[0.99]"
                                >
                                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold">Usar foto ao invés de IA</span>
                                </div>
                            ) : (
                                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                                    <img src={uploadedImage} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                         <button onClick={() => setUploadedImage(null)} className="bg-white text-red-500 px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-transform">Remover</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

        </div>

        {/* Footer Navigation / Loading State */}
        <div className="pt-6 mt-2 border-t border-slate-100 flex items-center gap-4">
            {isGenerating ? (
                <div className="w-full flex flex-col items-center justify-center py-6 animate-fadeIn">
                    <div className="relative mb-4">
                       <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                       <div className="relative bg-white p-5 rounded-full shadow-xl border border-orange-100">
                           <Wand2 className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                       </div>
                    </div>
                    <p className="text-sm font-bold text-slate-800">Criando Post Incrível...</p>
                    <p className="text-xs text-slate-400 animate-pulse font-medium">Gerando imagem e legenda criativa</p>
                </div>
            ) : (
                <>
                    {step > 1 && (
                        <button 
                            onClick={handleBack}
                            className="px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    
                    {step < 3 ? (
                        <button 
                            onClick={handleNext}
                            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] group"
                        >
                            Próximo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            className={`flex-1 bg-gradient-to-r ${isTrendMode ? 'from-orange-500 to-red-600' : isEvidenceMode ? 'from-blue-600 to-indigo-600' : 'from-primary to-blue-600'} text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transform active:scale-[0.98] transition-all group hover:brightness-110`}
                        >
                            <Sparkles className="w-5 h-5 text-white/90 group-hover:rotate-12 transition-transform" />
                            {isTrendMode ? 'Gerar Post Viral' : isEvidenceMode ? 'Gerar Post Científico' : 'Gerar Post'}
                        </button>
                    )}
                </>
            )}
        </div>

    </div>
  );
};

export default PostWizard;
