
import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, BookOpen, TrendingUp, Search, Bell, 
  Stethoscope, FileText, Activity, Bone, Briefcase, 
  Newspaper, PieChart, QrCode, Globe, Cuboid, GraduationCap,
  CalendarCheck2, PlayCircle, FlaskConical, ChevronRight
} from 'lucide-react';

interface DashboardProps {
  onSelectTool: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const date = new Date();
    setCurrentDate(date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));
  }, []);

  return (
    <div className="pb-32 animate-fadeIn min-h-full bg-[#F8FAFC]">
      
      {/* 1. HERO HEADER (Inspiration Image 1 & 2) */}
      <div className="pt-12 px-6 pb-6 bg-white rounded-b-[2.5rem] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] border-b border-slate-100">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{currentDate}</p>
                  <h1 className="text-3xl font-medium text-slate-900 leading-tight">
                      {greeting}, <br />
                      <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Dr. Carlos!</span>
                  </h1>
              </div>
              <div className="relative">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      <img 
                          src="https://seujoelho.com/wp-content/uploads/2021/01/Dr-Carlos-Franciozi-781x1024.jpg" 
                          className="w-full h-full rounded-full object-cover border-2 border-white" 
                          alt="Profile" 
                      />
                  </div>
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
              </div>
          </div>

          {/* Search Pill (Image 3 Inspiration) */}
          <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <input 
                  type="text" 
                  placeholder="O que vamos criar hoje?" 
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-[1.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <button className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600 transition-colors">
                      <Bell className="w-5 h-5" />
                  </button>
              </div>
          </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        
        {/* 2. MAIN ACTIONS (Bento Grid) */}
        <div>
            <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="text-lg font-black text-slate-900">Studio de Criação</h2>
                <button className="text-xs font-bold text-blue-600 hover:underline">Ver tudo</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Primary Action - Create Post */}
                <button 
                    onClick={() => onSelectTool('post')}
                    className="col-span-2 bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group active:scale-[0.98] transition-all"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-white border border-white/10">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Criar Novo Post</h3>
                            <p className="text-slate-400 text-xs font-medium">Instagram Feed & Stories</p>
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/5">
                            IA Ativa
                        </div>
                    </div>
                </button>

                {/* Secondary - Video */}
                <button 
                    onClick={() => onSelectTool('video')}
                    className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-purple-100 hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between h-40 group"
                >
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Vídeo</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Roteiros & Podcast</p>
                    </div>
                </button>

                {/* Secondary - SEO */}
                <button 
                    onClick={() => onSelectTool('seo')}
                    className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between h-40 group"
                >
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Artigo</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Blog & SEO</p>
                    </div>
                </button>
            </div>
        </div>

        {/* 3. CLINICAL TOOLS (Horizontal Scroll) */}
        <div>
            <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="text-lg font-black text-slate-900">Ferramentas Clínicas</h2>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4 snap-x">
                <button onClick={() => onSelectTool('clinical')} className="min-w-[160px] bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm snap-start active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                        <FlaskConical className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Bio-Age</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Calculadora Biológica</p>
                </button>

                <button onClick={() => onSelectTool('scores')} className="min-w-[160px] bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm snap-start active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Scores</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Lysholm, IKDC, KOOS</p>
                </button>

                <button onClick={() => onSelectTool('calculator')} className="min-w-[160px] bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm snap-start active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">RTS Calc</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Retorno ao Esporte</p>
                </button>
            </div>
        </div>

        {/* 4. MANAGEMENT LIST (Clean List) */}
        <div>
            <h2 className="text-lg font-black text-slate-900 mb-4 px-1">Gestão & Marca</h2>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                
                {[
                    { id: 'site', label: 'Meu Site', icon: Globe, color: 'text-blue-600 bg-blue-50' },
                    { id: 'marketing_roi', label: 'ROI Marketing', icon: PieChart, color: 'text-emerald-600 bg-emerald-50' },
                    { id: 'card', label: 'Cartão Digital', icon: QrCode, color: 'text-slate-600 bg-slate-100' },
                    { id: 'news', label: 'Notícias', icon: Newspaper, color: 'text-pink-600 bg-pink-50' }
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => onSelectTool(item.id)}
                        className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors active:bg-slate-100"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-left font-bold text-sm text-slate-900">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                ))}

            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
