
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Briefcase,
  History as HistoryIcon,
  CheckCircle2,
  Stethoscope, // Replaced Globe
  BookOpen,
  Globe
} from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PostWizard from './components/PostWizard';
import ArticleWizard from './components/ArticleWizard';
import InfographicWizard from './components/InfographicWizard';
import ConversionWizard from './components/ConversionWizard';
import TrendAnalyzer from './components/TrendAnalyzer';
import ReturnToSportCalculator from './components/ReturnToSportCalculator';
import AnatomyLibrary from './components/AnatomyLibrary';
import DigitalBusinessCard from './components/DigitalBusinessCard';
import PostPreview from './components/PostPreview';
import ArticlePreview from './components/ArticlePreview';
import InfographicPreview from './components/InfographicPreview';
import ConversionPreview from './components/ConversionPreview';
import MaterialsLibrary from './components/MaterialsLibrary';
import SiteContentList from './components/SiteContentList';
import PublicationsList from './components/PublicationsList';
import ScoreCalculator from './components/ScoreCalculator'; // New
import FraxCalculator from './components/FraxCalculator'; // New
import VisualPrescription from './components/VisualPrescription'; // New

import { generatePostImage, generatePostText, generateSEOArticle, generateInfographicContent, generateConversionContent } from './services/geminiService';
import { GeneratedResult, PostState, GeneratedArticle, ArticleState, InfographicState, InfographicResult, ConversionState, ConversionResult, PostFormat, PostCategory, Tone, PubMedArticle } from './types';

type ViewMode = 'dashboard' | 'post' | 'seo' | 'materials' | 'infographic' | 'conversion' | 'history' | 'site' | 'trends' | 'calculator' | 'publications' | 'anatomy' | 'card' | 'scores' | 'frax' | 'prescription';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  // --- STATE MANAGEMENT & HISTORY ---
  const [history, setHistory] = useState<GeneratedResult[]>([]);
  
  // Post State (Persistent)
  const [postResult, setPostResult] = useState<GeneratedResult | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postLastState, setPostLastState] = useState<PostState | null>(null);
  const [wizardInitialState, setWizardInitialState] = useState<PostState | null>(null);
  
  // Regeneration Loading States
  const [regenTextLoading, setRegenTextLoading] = useState(false);
  const [regenImageLoading, setRegenImageLoading] = useState(false);

  // Article State (Persistent)
  const [articleResult, setArticleResult] = useState<GeneratedArticle | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleWizardState, setArticleWizardState] = useState<ArticleState | null>(null);

  // Other Tools State
  const [infographicResult, setInfographicResult] = useState<InfographicResult | null>(null);
  const [infographicLoading, setInfographicLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  
  // Feedback UI
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load History on Mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('medisocial_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) { console.error(e); }
    }
    
    // Resume last draft if available
    const savedDraft = localStorage.getItem('medisocial_last_post');
    if (savedDraft) setPostResult(JSON.parse(savedDraft));
  }, []);

  // Save History
  useEffect(() => {
    localStorage.setItem('medisocial_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (postResult) localStorage.setItem('medisocial_last_post', JSON.stringify(postResult));
  }, [postResult]);

  useEffect(() => {
    setError(null);
  }, [viewMode]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGeneratePost = async (state: PostState) => {
    setPostLoading(true);
    setError(null);
    setPostLastState(state);

    try {
      const content = await generatePostText(state);
      
      let imageUrl = null;
      let isCustomImage = false;

      if (state.uploadedImage) {
          imageUrl = state.uploadedImage;
          isCustomImage = true;
      } else {
          imageUrl = await generatePostImage(content.imagePromptDescription, state.format);
      }

      const newResult = { 
          id: Date.now().toString(),
          date: new Date().toISOString(),
          content, 
          imageUrl, 
          isCustomImage,
          type: 'post' as const
      };

      setPostResult(newResult);
      setHistory(prev => [newResult, ...prev]); 
      showToast('Post gerado com sucesso!'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar o post.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleRegeneratePostText = async () => {
    if (!postLastState || !postResult) return;
    setRegenTextLoading(true);
    try {
      const newContent = await generatePostText(postLastState);
      setPostResult({ ...postResult, content: newContent });
      showToast('Texto atualizado!');
    } catch (err: any) {
        setError("Falha ao regerar o texto");
    } finally {
      setRegenTextLoading(false);
    }
  };

  const handleRegeneratePostImage = async () => {
    if (!postResult?.content?.imagePromptDescription || postResult.isCustomImage) return;
    setRegenImageLoading(true);
    try {
      const newImageUrl = await generatePostImage(postResult.content.imagePromptDescription, postLastState?.format || PostFormat.FEED);
      setPostResult({ ...postResult, imageUrl: newImageUrl });
      showToast('Nova imagem gerada!');
    } catch (err: any) {
        setError("Falha ao regerar a imagem");
    } finally {
        setRegenImageLoading(false);
    }
  };

  const handleGenerateArticle = async (state: ArticleState) => {
    setArticleLoading(true);
    setError(null);
    try {
        const article = await generateSEOArticle(state);
        setArticleResult(article);
        showToast('Artigo SEO criado!');
    } catch (err: any) {
        setError(err.message || "Erro ao gerar artigo.");
    } finally {
        setArticleLoading(false);
    }
  }

  const handleTransformArticleToPost = (article: GeneratedArticle) => {
      const newState: PostState = {
          topic: article.title,
          category: PostCategory.PATHOLOGY, 
          tone: Tone.EDUCATIONAL,
          format: PostFormat.FEED,
          customInstructions: `Baseie o post EXATAMENTE neste artigo: "${article.title}". Resuma os pontos principais para o Instagram.`
      };

      setWizardInitialState(newState);
      setViewMode('post');
      showToast('Iniciando Post do Artigo...');
  };

  const handleGenerateInfographic = async (state: InfographicState) => {
    setInfographicLoading(true);
    setError(null);
    try {
        const data = await generateInfographicContent(state);
        setInfographicResult({ data }); 
        showToast('Infográfico estruturado!');

        const heroPromise = data.heroImagePrompt 
            ? generatePostImage(data.heroImagePrompt, PostFormat.FEED)
            : Promise.resolve(null);
        const anatomyPromise = data.anatomy?.imagePrompt 
            ? generatePostImage(data.anatomy.imagePrompt, PostFormat.FEED)
            : Promise.resolve(null);

        heroPromise.then(url => setInfographicResult(prev => prev ? { ...prev, heroImageUrl: url } : null));
        anatomyPromise.then(url => setInfographicResult(prev => prev ? { ...prev, anatomyImageUrl: url } : null));

    } catch (err: any) {
        setError(err.message || "Erro no infográfico.");
    } finally {
        setInfographicLoading(false);
    }
  }

  const handleGenerateConversion = async (state: ConversionState) => {
      setConversionLoading(true);
      setError(null);
      try {
          const result = await generateConversionContent(state);
          setConversionResult(result);
          showToast('Estratégia de conversão pronta!');
      } catch (err: any) {
          setError(err.message || "Erro na estratégia.");
      } finally {
          setConversionLoading(false);
      }
  };

  const handleUseTrend = (partialState: Partial<PostState>) => {
      const fullState: PostState = {
          topic: '',
          category: partialState.category!,
          tone: partialState.tone!,
          format: partialState.format!,
          customInstructions: partialState.customInstructions || '',
          ...partialState
      };
      
      setWizardInitialState(fullState); 
      setViewMode('post'); 
  };

  const handleUseEvidence = (article: PubMedArticle, type: 'post' | 'seo') => {
      if (type === 'post') {
          setWizardInitialState({
              topic: article.title,
              category: PostCategory.PATHOLOGY, 
              tone: Tone.EDUCATIONAL,
              format: PostFormat.FEED,
              customInstructions: '',
              evidence: article
          });
          setViewMode('post');
      } else {
          setArticleWizardState({
              topic: article.title,
              keywords: '',
              length: 2, 
              audience: 0, 
              tone: Tone.EDUCATIONAL,
              evidence: article
          } as any);
          setViewMode('seo');
      }
      showToast('Contexto científico carregado!');
  };

  const getPageInfo = () => {
    switch (viewMode) {
      case 'post': return { title: 'Criar Post', subtitle: 'Instagram Feed/Story' };
      case 'seo': return { title: 'Blog Médico', subtitle: 'Artigo SEO (Prioridade)' };
      case 'infographic': return { title: 'Infográfico', subtitle: 'Educação Visual' };
      case 'materials': return { title: 'Biblioteca', subtitle: 'Materiais e Evidências' };
      case 'conversion': return { title: 'Conversão', subtitle: 'Quebra de Objeções' };
      case 'history': return { title: 'Histórico', subtitle: 'Criações Anteriores' };
      case 'site': return { title: 'Seu Joelho', subtitle: 'Conteúdo do Site' };
      case 'trends': return { title: 'Trends', subtitle: 'Google Trends Brasil' };
      case 'calculator': return { title: 'RTS Calc', subtitle: 'Retorno ao Esporte' };
      case 'publications': return { title: 'Publicações', subtitle: 'Portfólio Científico' };
      case 'anatomy': return { title: 'Anatomia 3D', subtitle: 'Educação do Paciente' };
      case 'card': return { title: 'Cartão Digital', subtitle: 'QR Code de Contato' };
      case 'scores': return { title: 'Scores Funcionais', subtitle: 'Lysholm, IKDC, WOMAC' };
      case 'frax': return { title: 'Risco de Fratura', subtitle: 'Calculadora FRAX' };
      case 'prescription': return { title: 'Prescrição Visual', subtitle: 'Playlist de Reabilitação' };
      default: return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo();
  const hasResult = postResult || articleResult || infographicResult || conversionResult;
  const isGenerating = postLoading || articleLoading || infographicLoading || conversionLoading;
  // Tools that take full page
  const isFullPageTool = ['trends', 'calculator', 'materials', 'site', 'publications', 'anatomy', 'card', 'scores', 'frax', 'prescription'].includes(viewMode);
  const showPreview = hasResult || isGenerating;

  return (
    <div className="flex h-screen bg-app-bg text-app-text overflow-hidden font-sans relative selection:bg-primary/30 selection:text-primary-900">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-slideUp bg-slate-900/90 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 text-sm font-bold border border-white/10">
            <div className="bg-green-500 rounded-full p-1"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>
            {toast}
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {viewMode !== 'dashboard' && (
            <Header 
                onBack={() => {
                    if (showPreview && !isFullPageTool) {
                        setPostResult(null);
                        setArticleResult(null);
                        setInfographicResult(null);
                        setConversionResult(null);
                    } else {
                        setViewMode('dashboard');
                    }
                }}
                showBack={true}
                title={title}
                subtitle={subtitle}
            />
          )}

          <main className="flex-1 overflow-hidden relative flex flex-col bg-[#F8FAFC]">
              
              {viewMode === 'dashboard' && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar pb-28">
                      <Dashboard onSelectTool={(tool) => setViewMode(tool as ViewMode)} />
                  </div>
              )}

              {viewMode === 'history' && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar p-6 pb-28">
                      {history.length === 0 ? (
                          <div className="text-center text-slate-400 mt-20 flex flex-col items-center">
                              <HistoryIcon className="w-16 h-16 mb-4 opacity-10" />
                              <p className="font-medium">Nenhum histórico encontrado.</p>
                              <p className="text-xs mt-1 opacity-70">Seus posts aparecerão aqui.</p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {history.map(item => (
                                  <div key={item.id} onClick={() => { setPostResult(item); setViewMode('post'); }} className="bg-white p-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                          {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                                      </div>
                                      <div className="overflow-hidden py-1">
                                          <p className="font-bold text-sm truncate text-slate-800">{item.content?.headline || 'Sem título'}</p>
                                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.content?.caption}</p>
                                          <p className="text-[10px] text-slate-400 mt-2 font-medium">{new Date(item.date).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              )}

              {/* TOOL VIEWS */}
              {viewMode !== 'dashboard' && viewMode !== 'history' && (
                  <div className="flex flex-col h-full relative">
                       
                       {/* EDITOR PANEL */}
                       <div className={`
                            flex-1 relative flex flex-col
                            ${showPreview ? 'hidden lg:flex' : 'flex'}
                            ${!isFullPageTool ? 'overflow-hidden' : 'overflow-hidden'} 
                       `}>
                            <div className={`flex-1 overflow-y-auto no-scrollbar ${isFullPageTool ? 'w-full' : 'p-0 lg:p-6 w-full lg:max-w-2xl lg:mx-auto'}`}>
                                {error && (
                                    <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 text-sm animate-fadeIn mx-6 mt-6 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        {error}
                                    </div>
                                )}

                                {viewMode === 'post' && (
                                    <div className="h-full flex flex-col p-4 pb-32 lg:pb-0">
                                        <PostWizard onGenerate={handleGeneratePost} isGenerating={postLoading} initialState={wizardInitialState} />
                                    </div>
                                )}
                                {viewMode === 'seo' && <div className="p-4"><ArticleWizard onGenerate={handleGenerateArticle} isGenerating={articleLoading} initialState={articleWizardState} /></div>}
                                {viewMode === 'infographic' && <div className="p-4"><InfographicWizard onGenerate={handleGenerateInfographic} isGenerating={infographicLoading} /></div>}
                                {viewMode === 'conversion' && <div className="p-4"><ConversionWizard onGenerate={handleGenerateConversion} isGenerating={conversionLoading} /></div>}
                                
                                {viewMode === 'materials' && <MaterialsLibrary onUseArticle={handleUseEvidence} />}
                                {viewMode === 'trends' && <TrendAnalyzer onUseTrend={handleUseTrend} />}
                                {viewMode === 'calculator' && <ReturnToSportCalculator />}
                                {viewMode === 'site' && <SiteContentList />}
                                {viewMode === 'publications' && <PublicationsList />}
                                {viewMode === 'anatomy' && <AnatomyLibrary />}
                                {viewMode === 'card' && <DigitalBusinessCard />}
                                {viewMode === 'scores' && <ScoreCalculator />}
                                {viewMode === 'frax' && <FraxCalculator />}
                                {viewMode === 'prescription' && <VisualPrescription />}
                            </div>
                       </div>

                       {/* PREVIEW PANEL */}
                       <div className={`
                            flex-1 bg-white relative flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]
                            ${showPreview ? 'flex h-full' : 'hidden lg:flex'}
                            ${isFullPageTool ? '!hidden' : ''}
                       `}>
                            <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar pb-32 lg:pb-0 relative">
                                
                                {isGenerating && (
                                    <div className="h-full flex flex-col items-center justify-center p-8 animate-fadeIn bg-white/80 backdrop-blur-xl absolute inset-0 z-50">
                                        <div className="relative mb-8">
                                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                                            <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100">
                                                <div className="w-12 h-12 border-4 border-slate-100 rounded-full border-t-primary animate-spin"></div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Criando Conteúdo</h3>
                                        <p className="text-slate-500 text-sm animate-pulse text-center max-w-xs font-medium leading-relaxed">
                                            A IA está analisando protocolos clínicos, compliance e referências visuais...
                                        </p>
                                    </div>
                                )}

                                {viewMode === 'post' && postResult && (
                                    <div className="py-8 px-4 flex justify-center min-h-full bg-slate-50">
                                        <PostPreview 
                                            result={postResult}
                                            onRegenerateText={handleRegeneratePostText}
                                            onRegenerateImage={handleRegeneratePostImage}
                                            isRegenerating={regenTextLoading || regenImageLoading}
                                        />
                                    </div>
                                )}
                                {viewMode === 'post' && !postResult && !isGenerating && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Globe className="w-10 h-10 opacity-30" />
                                        </div>
                                        <p className="text-sm font-medium">O preview do seu post aparecerá aqui.</p>
                                    </div>
                                )}

                                {viewMode === 'seo' && articleResult && (
                                    <div className="p-4 lg:p-12 max-w-6xl mx-auto h-full">
                                        <ArticlePreview 
                                            article={articleResult} 
                                            onConvertToPost={handleTransformArticleToPost} 
                                        />
                                    </div>
                                )}
                                
                                {viewMode === 'infographic' && infographicResult && <div className="w-full h-full min-h-screen lg:min-h-0"><InfographicPreview data={infographicResult.data} heroImageUrl={infographicResult.heroImageUrl} anatomyImageUrl={infographicResult.anatomyImageUrl} onBack={() => setInfographicResult(null)} /></div>}
                                {viewMode === 'conversion' && conversionResult && <div className="p-4 lg:p-12 max-w-4xl mx-auto"><ConversionPreview result={conversionResult} /></div>}
                            </div>
                       </div>

                  </div>
              )}

          </main>

          {/* PREMIUM BOTTOM NAVIGATION */}
          <nav className="fixed bottom-0 left-0 right-0 h-[90px] bg-white/90 backdrop-blur-2xl border-t border-slate-200/60 flex justify-between items-start pt-2 px-6 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
              
              <button 
                  onClick={() => { setViewMode('dashboard'); }}
                  className={`flex flex-col items-center gap-1.5 w-16 group transition-all duration-300 active:scale-90 relative top-1
                  ${viewMode === 'dashboard' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <div className={`p-1.5 rounded-2xl transition-all duration-300 ${viewMode === 'dashboard' ? 'bg-primary/10' : 'bg-transparent'}`}>
                    <LayoutDashboard className={`w-6 h-6 ${viewMode === 'dashboard' ? 'fill-current' : ''}`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight transition-all ${viewMode === 'dashboard' ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-0.5'}`}>Início</span>
                  {viewMode === 'dashboard' && <span className="absolute -top-2 w-8 h-1 bg-primary rounded-full"></span>}
              </button>
              
              {/* Changed Site -> Clinica (Clinical Tools) */}
              <button 
                onClick={() => setViewMode('scores')}
                className={`flex flex-col items-center gap-1.5 w-16 group transition-all duration-300 active:scale-90 relative top-1
                ${['scores', 'frax', 'calculator', 'prescription'].includes(viewMode) ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <div className={`p-1.5 rounded-2xl transition-all duration-300 ${['scores', 'frax', 'calculator', 'prescription'].includes(viewMode) ? 'bg-primary/10' : 'bg-transparent'}`}>
                    <Stethoscope className={`w-6 h-6 ${['scores', 'frax', 'calculator', 'prescription'].includes(viewMode) ? 'stroke-[2.5px]' : ''}`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight transition-all ${['scores', 'frax', 'calculator', 'prescription'].includes(viewMode) ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-0.5'}`}>Clínica</span>
                  {['scores', 'frax', 'calculator', 'prescription'].includes(viewMode) && <span className="absolute -top-2 w-8 h-1 bg-primary rounded-full"></span>}
              </button>

              <div className="relative -top-8">
                 <button 
                    onClick={() => { setViewMode('seo'); }} 
                    className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-glow border-[4px] border-[#F8FAFC] transition-transform duration-300 active:scale-90 group relative z-10"
                 >
                    <BookOpen className="w-7 h-7 group-hover:scale-110 transition-transform" />
                 </button>
                 <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 blur-xl opacity-50 z-0"></div>
              </div>

              <button 
                onClick={() => setViewMode('post')} 
                className={`flex flex-col items-center gap-1.5 w-16 group transition-all duration-300 active:scale-90 relative top-1
                ${viewMode === 'post' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <div className={`p-1.5 rounded-2xl transition-all duration-300 ${viewMode === 'post' ? 'bg-primary/10' : 'bg-transparent'}`}>
                     <Briefcase className={`w-6 h-6 ${viewMode === 'post' ? 'stroke-[2.5px]' : ''}`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight transition-all ${viewMode === 'post' ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-0.5'}`}>Post</span>
                  {viewMode === 'post' && <span className="absolute -top-2 w-8 h-1 bg-primary rounded-full"></span>}
              </button>

              <button 
                onClick={() => setViewMode('history')}
                className={`flex flex-col items-center gap-1.5 w-16 group transition-all duration-300 active:scale-90 relative top-1
                ${viewMode === 'history' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <div className={`p-1.5 rounded-2xl transition-all duration-300 ${viewMode === 'history' ? 'bg-primary/10' : 'bg-transparent'}`}>
                    <HistoryIcon className={`w-6 h-6 ${viewMode === 'history' ? 'stroke-[2.5px]' : ''}`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight transition-all ${viewMode === 'history' ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-0.5'}`}>Histórico</span>
                  {viewMode === 'history' && <span className="absolute -top-2 w-8 h-1 bg-primary rounded-full"></span>}
              </button>
          </nav>

      </div>
    </div>
  );
}

export default App;
