
import React, { useState } from 'react';
import { VideoScriptResult } from '../types';
import { PlayCircle, Clock, Copy, Check, FileText, Image as ImageIcon, MessageSquare, AlertCircle } from 'lucide-react';

interface VideoScriptPreviewProps {
  script: VideoScriptResult;
}

const VideoScriptPreview: React.FC<VideoScriptPreviewProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = `${script.title}\n\n`;
    text += `DESCRIÇÃO:\n${script.description}\n\n`;
    text += `ROTEIRO:\n`;
    script.script.forEach(section => {
        text += `[${section.type} - ${section.duration}]\n`;
        text += `VISUAL: ${section.visual}\n`;
        text += `ÁUDIO: ${section.audio}\n\n`;
    });
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSectionColor = (type: string) => {
      switch(type) {
          case 'HOOK': return 'border-l-red-500 bg-red-50';
          case 'VINHETA': return 'border-l-purple-500 bg-purple-50';
          case 'OBJECAO': return 'border-l-orange-500 bg-orange-50';
          case 'CTA': return 'border-l-green-500 bg-green-50';
          default: return 'border-l-blue-500 bg-white';
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fadeIn overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        
        {/* Header - Changed from sticky to static for better flow */}
        <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-start">
            <div className="flex-1 pr-4">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1.5 block">Roteiro YouTube</span>
                <h1 className="text-xl font-black text-slate-900 leading-tight mb-2">{script.title}</h1>
                <div className="flex flex-wrap gap-1.5">
                    {script.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 font-medium">#{tag}</span>
                    ))}
                </div>
            </div>
            <button 
                onClick={handleCopy}
                className="p-3 text-slate-400 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors active:scale-95"
            >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
        </div>

        {/* Thumbnail Concept */}
        <div className="bg-slate-900 p-6 text-white flex flex-col gap-6">
            <div className="w-full aspect-video bg-red-600 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden group border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent"></div>
                <ImageIcon className="w-10 h-10 mb-3 relative z-10 opacity-90" />
                <p className="font-black text-xl md:text-2xl relative z-10 uppercase leading-none tracking-tight drop-shadow-md">{script.thumbnailText}</p>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">Conceito da Capa</h3>
                <p className="text-sm text-slate-200 italic leading-relaxed border-l-2 border-red-500 pl-3">"{script.thumbnailVisual}"</p>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">Descrição SEO</h3>
                    <p className="text-xs text-slate-400 leading-relaxed opacity-80">{script.description}</p>
                </div>
            </div>
        </div>

        {/* Script Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50">
            {script.script.map((section, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border-l-[6px] shadow-sm bg-white ${getSectionColor(section.type)}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="font-black text-xs md:text-sm text-slate-800 bg-white/80 px-2 py-1 rounded-md border border-black/5">{section.type}</span>
                            {section.type === 'HOOK' && <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3" /> Crítico</span>}
                        </div>
                        <span className="text-[10px] md:text-xs font-mono font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> {section.duration}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Visual Column */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5 tracking-wider">
                                <ImageIcon className="w-3 h-3" /> Visual
                            </p>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                {section.visual}
                            </p>
                        </div>

                        {/* Audio Column */}
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5 tracking-wider">
                                <MessageSquare className="w-3 h-3" /> Áudio
                            </p>
                            <p className="text-sm text-slate-600 italic leading-relaxed whitespace-pre-line">
                                "{section.audio}"
                            </p>
                        </div>
                    </div>
                    
                    {section.notes && (
                        <div className="mt-4 pt-3 border-t border-dashed border-slate-200 text-xs text-slate-500 flex gap-1">
                            <span className="font-bold">Nota:</span> <span>{section.notes}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default VideoScriptPreview;
