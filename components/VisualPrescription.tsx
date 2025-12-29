
import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, Share2, Plus, Video, Check } from 'lucide-react';

const exerciseLibrary = [
    { id: 1, title: 'Isometria de Quadríceps', duration: '2 min', category: 'Fortalecimento', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Elevação da Perna Reta', duration: '3 séries', category: 'Fortalecimento', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Mobilização de Patela', duration: '5 min', category: 'Mobilidade', img: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Extensão Passiva', duration: '10 min', category: 'Amplitude', img: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=400&q=80' },
    { id: 5, title: 'Bom dia (Posterior)', duration: '3 séries', category: 'Posterior', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80' },
    { id: 6, title: 'Cadeira Extensora', duration: '4 séries', category: 'Academia', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80' },
];

const VisualPrescription: React.FC = () => {
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const toggleSelection = (id: number) => {
      setSelectedVideos(prev => 
        prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
      );
  };

  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: 'Reabilitação Dr. Carlos',
              text: 'Sua playlist de exercícios.',
              url: 'https://seujoelho.com/prescricao/xyz123'
          });
      } else {
          alert("Link copiado!");
      }
  };

  if (showSummary) {
      return (
          <div className="h-full bg-[#F8FAFC] flex flex-col pb-24 lg:pb-0 animate-fadeIn">
              <div className="bg-white px-6 py-6 border-b border-slate-200 sticky top-0 z-10 flex justify-between items-center shadow-sm">
                  <div>
                    <h1 className="text-xl font-black text-slate-900">Playlist Pronta</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enviar ao Paciente</p>
                  </div>
                  <button onClick={() => setShowSummary(false)} className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 bg-slate-100 rounded-lg">Editar</button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                  <div className="bg-white rounded-[1.5rem] shadow-premium overflow-hidden border border-slate-100 relative">
                      {/* Card Header Gradient */}
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[60px] opacity-20"></div>
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                             <PlayCircle className="w-8 h-8 text-white" />
                          </div>
                          <h2 className="text-2xl font-black tracking-tight mb-1">Reabilitação Domiciliar</h2>
                          <p className="text-purple-100 text-sm font-medium">{selectedVideos.length} exercícios selecionados</p>
                      </div>
                      
                      <div className="p-2 divide-y divide-slate-50">
                          {exerciseLibrary.filter(ex => selectedVideos.includes(ex.id)).map(ex => (
                              <div key={ex.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors rounded-xl group">
                                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative shadow-inner">
                                      <img src={ex.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                                  <div className="flex-1">
                                      <p className="font-bold text-slate-800 text-sm mb-0.5">{ex.title}</p>
                                      <div className="flex items-center gap-2">
                                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{ex.category}</span>
                                          <span className="text-[10px] text-slate-400 font-medium">{ex.duration}</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <button 
                    onClick={handleShare}
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-600/20 mt-6 flex items-center justify-center gap-2 hover:bg-green-700 transition-all active:scale-[0.98]"
                  >
                      <Share2 className="w-5 h-5" /> Enviar no WhatsApp
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl px-6 py-6 border-b border-slate-200 sticky top-0 z-20 flex justify-between items-center shadow-sm">
            <div>
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Video className="w-5 h-5" /></div>
                    Prescrição Visual
                </h1>
                <p className="text-slate-500 text-xs mt-1 font-medium ml-11">Selecione os vídeos.</p>
            </div>
            {selectedVideos.length > 0 && (
                <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-scaleIn shadow-lg shadow-purple-500/30">
                    {selectedVideos.length} selecionados
                </div>
            )}
        </div>

        {/* Video Grid */}
        <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto pb-32">
            {exerciseLibrary.map(video => {
                const isSelected = selectedVideos.includes(video.id);
                return (
                    <div 
                        key={video.id}
                        onClick={() => toggleSelection(video.id)}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group
                        ${isSelected ? 'ring-4 ring-purple-500 shadow-xl scale-[0.98]' : 'shadow-sm hover:shadow-md border border-slate-100 bg-white'}`}
                    >
                        <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                            <img src={video.img} className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'opacity-60 scale-105' : 'group-hover:scale-105'}`} />
                            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                                {isSelected ? (
                                    <div className="bg-purple-600 text-white p-3 rounded-full shadow-lg scale-110">
                                        <Check className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" />
                                )}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {video.duration}
                            </div>
                        </div>
                        <div className={`p-3 transition-colors ${isSelected ? 'bg-purple-50' : 'bg-white'}`}>
                            <h3 className={`font-bold text-xs line-clamp-1 mb-1 ${isSelected ? 'text-purple-900' : 'text-slate-900'}`}>{video.title}</h3>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{video.category}</p>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-30 pb-safe pointer-events-none">
            <button 
                onClick={() => setShowSummary(true)}
                disabled={selectedVideos.length === 0}
                className="w-full max-w-md mx-auto bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 pointer-events-auto transition-all active:scale-95 disabled:translate-y-20 disabled:opacity-0 duration-300"
            >
                <Plus className="w-5 h-5" /> Criar Prescrição ({selectedVideos.length})
            </button>
        </div>
    </div>
  );
};

export default VisualPrescription;
