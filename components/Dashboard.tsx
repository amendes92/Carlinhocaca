
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
  Bone
} from 'lucide-react';

interface DashboardProps {
  onSelectTool: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
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
      id: 'infographic',
      label: 'Infográfico',
      icon: Stethoscope,
      desc: 'Visual',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-200'
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
    <div className="pb-32 animate-fadeIn min-h-full">
      
      {/* EXECUTIVE HEADER */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 pt-safe pt-8 pb-6 sticky top-0 z-20 transition-all duration-300">
         <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
             <div>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80 animate-slideUp" style={{animationDelay: '0.1s'}}>{greeting}, Dr.</p>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none animate-slideUp" style={{animationDelay: '0.2s'}}>
                     Carlos Franciozi
                 </h1>
                 <p className="text-slate-400 text-xs mt-1.5 font-medium flex items-center gap-2 animate-slideUp" style={{animationDelay: '0.3s'}}>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide text-slate-500">CRM 111501</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide text-slate-500">TEOT 10930</span>
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
                 <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[3px] border-white rounded-full"></div>
             </div>
         </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        
        {/* MARKETING SECTION (TOP) */}
        <div className="px-6 py-6 animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Marketing & Autoridade</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {marketingTools.map((action) => (
                    <button 
                        key={action.id}
                        onClick={() => onSelectTool(action.id)}
                        className={`bg-white p-4 rounded-[1.25rem] border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-start gap-3 transition-all duration-300 group active:scale-[0.98] ${action.border} hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]`}
                    >
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

        {/* CLINICAL PRACTICE (RETENTION FOCUS) */}
        <div className="px-6 mb-8 animate-slideUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prática Clínica Diária</h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Fidelização</span>
            </div>
            
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden divide-y divide-slate-50">
                
                {/* Scores */}
                <div 
                    onClick={() => onSelectTool('scores')}
                    className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100"
                >
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Scores Funcionais</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Lysholm, IKDC, WOMAC, KOOS.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                {/* FRAX */}
                <div 
                    onClick={() => onSelectTool('frax')}
                    className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100"
                >
                    <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <Bone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Risco de Fratura (FRAX)</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Osteoporose e decisão terapêutica.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                {/* Visual Prescription */}
                <div 
                    onClick={() => onSelectTool('prescription')}
                    className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100"
                >
                    <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">Prescrição Visual</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Playlist de exercícios para casa.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                {/* RTS Calc (Moved here) */}
                <div 
                    onClick={() => onSelectTool('calculator')}
                    className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all cursor-pointer group active:bg-slate-100"
                >
                    <div className="w-11 h-11 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">RTS Calc (LCA)</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Critérios de alta esportiva.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

            </div>
        </div>

        {/* MANAGEMENT & ACADEMIC */}
        <div className="px-6 animate-slideUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gestão & Site</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => onSelectTool('card')}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-slate-300 transition-all active:scale-[0.98]"
                 >
                     <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
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

                 <button 
                    onClick={() => onSelectTool('anatomy')}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-slate-300 transition-all active:scale-[0.98]"
                 >
                     <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                         <Cuboid className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                         <span className="block font-bold text-slate-900 text-xs">Anatomia 3D</span>
                     </div>
                 </button>

                 <button 
                    onClick={() => onSelectTool('publications')}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-slate-300 transition-all active:scale-[0.98]"
                 >
                     <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                         <GraduationCap className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                         <span className="block font-bold text-slate-900 text-xs">Publicações</span>
                     </div>
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
