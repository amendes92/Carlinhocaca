
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  TrendingUp,
  Activity,
  Globe,
  Plus,
  Stethoscope,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Cuboid,
  QrCode,
  FileText,
  PlayCircle,
  Bone,
  Newspaper,
  CalendarCheck2,
  Video,
  FlaskConical,
  PieChart,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onSelectTool: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [smartSuggestion, setSmartSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sun, 1 = Mon, ...

    // Greeting
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    // Date String
    setCurrentDate(date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));

    // Smart Context Logic
    // Monday(1)/Tuesday(2) -> Plan Week / Create Content
    // Friday(5) -> Analytics/ROI
    // Morning (< 10) -> News
    if (day === 1 || day === 2) {
        setSmartSuggestion('post'); 
    } else if (day === 5) {
        setSmartSuggestion('marketing_roi'); 
    } else if (hour < 10) {
        setSmartSuggestion('news'); 
    } else {
        setSmartSuggestion('post'); // Default fallback
    }

  }, []);
  
  // Organized Categories
  const marketingTools = [
    {
      id: 'seo',
      label: 'Novo Artigo',
      icon: BookOpen,
      desc: 'Blog & SEO',
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'hover:border-blue-200'
    },
    {
      id: 'post',
      label: 'Criar Post',
      icon: Plus,
      desc: 'Instagram',
      color: 'text-brand-red', 
      bg: 'bg-red-50',
      border: 'hover:border-red-200'
    },
    {
      id: 'video', // New Video Tool
      label: 'Vídeo Studio',
      icon: Video,
      desc: 'YouTube & Podcast',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'hover:border-purple-200'
    },
    {
      id: 'trends',
      label: 'Trends',
      icon: TrendingUp,
      desc: 'O que está em alta',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'hover:border-orange-200'
    }
  ];

  return (
    <div className="pb-32 animate-fadeIn min-h-full bg-[#F8FAFC]">
      
      {/* EXECUTIVE HEADER */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 pt-safe pt-8 pb-6 sticky top-0 z-20 transition-all duration-300">
         <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
             <div>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80 animate-slideUp" style={{animationDelay: '0.1s'}}>{currentDate}</p>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none animate-slideUp" style={{animationDelay: '0.2s'}}>
                     {greeting}, Dr. Carlos
                 </h1>
                 <p className="text-slate-400 text-xs mt-1.5 font-medium flex items-center gap-2 animate-slideUp" style={{animationDelay: '0.3s'}}>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide text-slate-500">CRM 111501</span>
                 </p>
             </div>
             <div className="relative group cursor-pointer animate-scaleIn" style={{animationDelay: '0.4s'}}>
                 <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-brand-red to-primary shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-200 relative">
                        <img 
                            src="https://seujoelho.com/wp-content/uploads/2021/01/Dr-Carlos-Franciozi-781x1024.jpg" 
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" 
                            alt="Dr. Carlos" 
                        />
                    </div>
                 </div>
             </div>
         </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        
        {/* MARKETING SECTION (TOP) */}
        <div className="px-6 py-6 animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Studio de Criação</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {marketingTools.map((action) => (
                    <button 
                        key={action.id}
                        onClick={() => onSelectTool(action.id)}
                        className={`relative bg-white p-4 rounded-[1.25rem] border shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-start gap-3 transition-all duration-300 group active:scale-[0.98] ${action.border} hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]
                        ${smartSuggestion === action.id ? 'ring-2 ring-offset-2 ring-blue-500 border-blue-200' : 'border-slate-100'}
                        `}
                    >
                        {smartSuggestion === action.id && (
                            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 animate-bounce">
                                <Sparkles className="w-2.5 h-2.5 text-yellow-300" /> Sugestão
                            </div>
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${action.bg} ${action.color}`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-slate-900 text-sm mb-0.5">{action.label}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{action.desc}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* CLINICAL PRACTICE */}
        <div className="px-6 mb-8 animate-slideUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prática Clínica</h3>
            </div>
            
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden divide-y divide-slate-50">
                
                <div onClick={() => onSelectTool('clinical')} className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100 bg-indigo-50/50">
                    <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <FlaskConical className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-indigo-900 text-sm">Clínica & Biomecânica</h4>
                        <p className="text-xs text-indigo-600/80 mt-0.5 font-medium">Bio-Age, Feridas, Valgo AI.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-indigo-300" />
                </div>

                <div onClick={() => onSelectTool('journey')} className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <CalendarCheck2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Jornada do Paciente</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Protocolos de Pós-Operatório.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                <div onClick={() => onSelectTool('scores')} className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Scores Funcionais</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Lysholm, IKDC, WOMAC.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                <div onClick={() => onSelectTool('calculator')} className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">RTS Calc (LCA)</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Critérios de alta esportiva.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                <div onClick={() => onSelectTool('frax')} className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <Bone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Risco de Fratura (FRAX)</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Osteoporose.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                <div onClick={() => onSelectTool('prescription')} className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Prescrição Visual</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Playlist de exercícios.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

            </div>
        </div>

        {/* MANAGEMENT & ACADEMIC */}
        <div className="px-6 animate-slideUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gestão</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => onSelectTool('news')}
                    className={`bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-3 hover:border-pink-300 transition-all active:scale-[0.98] ${smartSuggestion === 'news' ? 'border-pink-400 ring-2 ring-pink-100' : 'border-slate-100'}`}
                 >
                     <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                         <Newspaper className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                         <span className="block font-bold text-slate-900 text-xs">Notícias</span>
                     </div>
                 </button>

                 <button 
                    onClick={() => onSelectTool('marketing_roi')}
                    className={`bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-3 hover:border-emerald-300 transition-all active:scale-[0.98] ${smartSuggestion === 'marketing_roi' ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-100'}`}
                 >
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                         <PieChart className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                         <span className="block font-bold text-slate-900 text-xs">ROI Marketing</span>
                     </div>
                 </button>

                 <button 
                    onClick={() => onSelectTool('card')}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-slate-300 transition-all active:scale-[0.98]"
                 >
                     <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                         <QrCode className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                         <span className="block font-bold text-slate-900 text-xs">Cartão Digital</span>
                     </div>
                 </button>

                 <button 
                    onClick={() => onSelectTool('site')}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-slate-300 transition-all active:scale-[0.98]"
                 >
                     <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                         <Globe className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                         <span className="block font-bold text-slate-900 text-xs">Meu Site</span>
                     </div>
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
