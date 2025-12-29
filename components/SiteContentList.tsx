
import React, { useEffect, useState } from 'react';
import { getWordPressPosts, WPPost } from '../services/wordpressService';
import { Search, Globe, ExternalLink, Loader2, Calendar, ArrowRight } from 'lucide-react';

const SiteContentList: React.FC = () => {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWordPressPosts(term);
      setPosts(data);
    } catch (err) {
      setError('Não foi possível carregar os posts. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts('');
  }, []);

  const PostSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4 animate-pulse">
        <div className="w-24 h-24 bg-slate-200 rounded-xl flex-shrink-0"></div>
        <div className="flex-1 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
                <div className="h-2 bg-slate-200 rounded w-full"></div>
                <div className="h-2 bg-slate-200 rounded w-5/6"></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-fadeIn">
      
      {/* Header Section */}
      <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-10">
          <div className="flex items-center gap-4 mb-2">
            <img 
                src="https://seujoelho.com/wp-content/uploads/2021/03/02_seu_joelho_logotipo-1-2048x534.png" 
                alt="Seu Joelho" 
                className="h-10 w-auto object-contain"
            />
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">Integração Web</h1>
                <p className="text-xs text-slate-500 font-medium">Sincronizado com seujoelho.com</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <input 
              type="text" 
              placeholder="Pesquisar artigo no site..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPosts(searchTerm)}
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            {loading && <div className="absolute right-4 top-3.5"><Loader2 className="w-5 h-5 text-blue-500 animate-spin" /></div>}
          </div>
      </div>

      {/* Content List */}
      <div className="p-6 space-y-4">
        {loading ? (
             <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
             </>
        ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium">
                {error}
                <button onClick={() => fetchPosts(searchTerm)} className="block mx-auto mt-2 text-red-700 underline">Tentar novamente</button>
            </div>
        ) : (
            <>
                {posts.map(post => {
                    const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                    
                    return (
                        <div key={post.id} className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex gap-4 cursor-pointer hover:border-blue-200" onClick={() => window.open(post.link, '_blank')}>
                            {/* Image Thumbnail */}
                            <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                                {featuredImg ? (
                                    <img src={featuredImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                        <Globe className="w-8 h-8 opacity-50" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 
                                    className="font-bold text-slate-800 text-base mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors"
                                    dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                                />
                                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Ler no site <ExternalLink className="w-3 h-3" />
                                    </span>
                                </div>
                                <div 
                                    className="text-xs text-slate-500 mt-2 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                />
                            </div>
                            
                            <div className="hidden sm:flex items-center justify-center px-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    );
                })}

                {posts.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Search className="w-8 h-8" />
                        </div>
                        <p className="text-slate-500 font-medium">Nenhum artigo encontrado.</p>
                        <p className="text-xs text-slate-400">Tente buscar por outro termo.</p>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default SiteContentList;
