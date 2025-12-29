
import React, { useState, useMemo } from 'react';
import { publicationsData } from '../services/publicationsData';
import { Search, ExternalLink, FileText, Calendar, Users, GraduationCap, Award } from 'lucide-react';

const PublicationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPublications = useMemo(() => {
    if (!searchTerm) return publicationsData;
    const term = searchTerm.toLowerCase();
    return publicationsData.filter(pub => 
      pub.titulo.toLowerCase().includes(term) || 
      pub.journal.toLowerCase().includes(term) ||
      pub.ano.includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-white px-6 py-6 border-b border-slate-200 sticky top-0 z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                    <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Minhas Publicações</h1>
                    <p className="text-sm text-slate-500 font-medium">Portfólio Científico do Dr. Carlos Franciozi ({publicationsData.length} artigos)</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Pesquisar por título, revista ou ano..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total</p>
                    <p className="font-bold text-slate-900">{publicationsData.length}</p>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Calendar className="w-4 h-4" /></div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Recente</p>
                    <p className="font-bold text-slate-900">2025</p>
                </div>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredPublications.map(pub => (
                <div key={pub.id} className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-teal-100">
                                    {pub.journal}
                                </span>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {pub.ano}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-teal-700 transition-colors">
                                {pub.titulo}
                            </h3>
                            
                            <div className="flex items-start gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <Users className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                <span className="line-clamp-2">{pub.autores}</span>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-medium">
                                <span className="text-slate-400">PMID: <span className="font-mono text-slate-600">{pub.pmid}</span></span>
                            </div>
                        </div>

                        <a 
                            href={pub.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-colors flex flex-col items-center gap-1 min-w-[60px]"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span className="text-[9px] font-bold uppercase">Abrir</span>
                        </a>
                    </div>
                </div>
            ))}

            {filteredPublications.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhuma publicação encontrada para "{searchTerm}".</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default PublicationsList;
