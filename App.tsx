
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Briefcase,
  History as HistoryIcon,
  CheckCircle2,
  Stethoscope,
  BookOpen,
  Globe,
  ArrowLeft,
  BookCopy // Changed from Library to BookCopy for compatibility safety
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
import ScoreCalculator from './components/ScoreCalculator';
import FraxCalculator from './components/FraxCalculator';
import VisualPrescription from './components/VisualPrescription';
import MedicalNewsFeed from './components/MedicalNewsFeed';
import PatientJourney from './components/PatientJourney';
import VideoWizard from './components/VideoWizard';
import ClinicalSuite from './components/ClinicalSuite';
import MarketingROI from './components/MarketingROI';

import { generatePostImage, generatePostText, generateSEOArticle, generateInfographicContent, generateConversionContent, updateUserProfile } from './services/geminiService';
import { GeneratedResult, PostState, GeneratedArticle, ArticleState, InfographicState, InfographicResult, ConversionState, ConversionResult, PostFormat, PostCategory, Tone, PubMedArticle, UserProfile } from './types';

type ViewMode = 'dashboard' | 'post' | 'seo' | 'materials' | 'infographic' | 'conversion' | 'history' | 'site' | 'trends' | 'calculator' | 'publications' | 'anatomy' | 'card' | 'scores' | 'frax' | 'prescription' | 'news' | 'journey' | 'video' | 'clinical' | 'marketing_roi';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
      // Safety check for local storage
      const saved = localStorage.getItem('medisocial_last_view');
      return (saved as ViewMode) || 'dashboard';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
      const saved = localStorage.getItem('medisocial_profile');
      return saved ? JSON.parse(saved) : {
          name: "Dr. Carlos Franciozi",
          specialty: "Cirurgião de Joelho",
          crm: "111501",
          defaultTone: Tone.PROFESSIONAL
      };
  });
  
  const [history, setHistory] = useState<GeneratedResult[]>([]);
  
  // Post State
  const [postResult, setPostResult] = useState<GeneratedResult | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postLastState, setPostLastState] = useState<PostState | null>(null);
  const [wizardInitialState, setWizardInitialState] = useState<PostState | null>(null);
  
  const [regenTextLoading, setRegenTextLoading] = useState(false);
  const [regenImageLoading, setRegenImageLoading] = useState(false);

  // Article State
  const [articleResult, setArticleResult] = useState<GeneratedArticle | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleWizardState, setArticleWizardState] = useState<ArticleState | null>(null);

  // Other Tools
  const [infographicResult, setInfographicResult] = useState<InfographicResult | null>(null);
  const [infographicLoading, setInfographicLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('medisocial_last_view', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('medisocial_profile', JSON.stringify(userProfile));
    updateUserProfile(userProfile); 
  }, [userProfile]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('medisocial_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedDraft = localStorage.getItem('medisocial_last_post');
    if (savedDraft) setPostResult(JSON.parse(savedDraft));
  }, []);

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
  };

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
        
        generatePostImage(data.heroImagePrompt, PostFormat.FEED)
            .then(url => setInfographicResult(prev => prev ? { ...prev, heroImageUrl: url } : null));
        
        if(data.anatomy.imagePrompt) {
            generatePostImage(data.anatomy.imagePrompt, PostFormat.FEED)
            .then(url => setInfographicResult(prev => prev ? { ...prev, anatomyImageUrl: url } : null));
        }

    } catch (err: any) {
        setError(err.message || "Erro no infográfico.");
    } finally {
        setInfographicLoading(false);
    }
  };

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
      case 'news': return { title: 'OrtoNews', subtitle: 'Atualização Profissional' };
      case 'journey': return { title: 'Jornada do Paciente', subtitle: 'Automação Pós-Operatória' };
      case 'video': return { title: 'Studio de Vídeo', subtitle: 'Roteiros e Podcast' };
      case 'clinical': return { title: 'Clínica & Biomecânica', subtitle: 'Ferramentas de Medicina Esportiva' };
      case 'marketing_roi': return { title: 'Gestão Financeira', subtitle: 'ROI & CAC Marketing' };
      default: return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo();
  const hasResult = postResult || articleResult || infographicResult || conversionResult;
  const isGenerating = postLoading || articleLoading || infographicLoading || conversionLoading;
  const isFullPageTool = ['trends', 'calculator', 'materials', 'site', 'publications', 'anatomy', 'card', 'scores', 'frax', 'prescription', 'news', 'journey', 'video', 'clinical', 'marketing_roi'].includes(viewMode);
  const showPreview = hasResult || isGenerating;
  
  const isZenMode = viewMode === 'post';

  // Navigation Items - Updated 6 Icons
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'scores', label: 'Clínica', icon: Stethoscope },
    { id: 'post', label: 'Post', icon: Briefcase },
    { id: 'seo', label: 'Artigo', icon: BookOpen },
    { id: 'materials', label: 'Materiais', icon: BookCopy }, // Updated Icon
    { id: 'history', label: 'Histórico', icon: HistoryIcon },
  ];

  return (
    <div className="flex h-screen w-full bg-app-bg text-app-text overflow-hidden font-sans relative selection:bg-primary/30 selection:text-primary-900">
      
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slideUp bg-slate-900/90 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 text-sm font-bold border border-white/10">
            <div className="bg-green-500 rounded-full p-1"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>
            {toast}
        </div>
      )}

      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
          
          {!isZenMode && viewMode !== 'dashboard' && (
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

          {isZenMode && (
             <div className="absolute top-4 left-4 z-50">
                <button 
                    onClick={() => setViewMode('dashboard')}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-slate-400 hover:text-slate-700 transition-colors border border-slate-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
             </div>
          )}

          <main className="flex-1 overflow-hidden relative flex flex-col bg-[#F8FAFC]">
              {viewMode === 'dashboard' && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar pb-32">
                      <Dashboard onSelectTool={(tool) => setViewMode(tool as ViewMode)} />
                  </div>
              )}

              {viewMode === 'history' && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar p-4 lg:p-6 pb-32">
                      {history.length === 0 ? (
                          <div className="text-center text-slate-400 mt-20 flex flex-col items-center">
                              <HistoryIcon className="w-16 h-16 mb-4 opacity-10" />
                              <p className="font-medium">Nenhum histórico encontrado.</p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {viewMode !== 'dashboard' && viewMode !== 'history' && (
                  <div className="flex flex-col h-full relative">
                       <div className={`flex-1 relative flex flex-col ${showPreview ? 'hidden lg:flex' : 'flex'} ${!isFullPageTool ? 'overflow-hidden' : 'overflow-hidden'}`}>
                            <div className={`flex-1 overflow-y-auto no-scrollbar ${isFullPageTool ? 'w-full' : 'p-0 lg:p-6 w-full lg:max-w-2xl lg:mx-auto'}`}>
                                {error && (
                                    <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 text-sm animate-fadeIn mx-6 mt-6 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        {error}
                                        <button onClick={() => setError(null)} className="ml-auto underline text-xs">Dispensar</button>
                                    </div>
                                )}

                                {viewMode === 'post' && (
                                    <div className="h-full flex flex-col p-4 pb-0 lg:pb-0 pt-16 lg:pt-4">
                                        <PostWizard onGenerate={handleGeneratePost} isGenerating={postLoading} initialState={wizardInitialState} />
                                    </div>
                                )}
                                
                                {viewMode === 'seo' && <div className="p-4 pb-32 lg:pb-0"><ArticleWizard onGenerate={handleGenerateArticle} isGenerating={articleLoading} initialState={articleWizardState} /></div>}
                                {viewMode === 'infographic' && <div className="p-4 pb-32 lg:pb-0"><InfographicWizard onGenerate={handleGenerateInfographic} isGenerating={infographicLoading} /></div>}
                                {viewMode === 'conversion' && <div className="p-4 pb-32 lg:pb-0"><ConversionWizard onGenerate={handleGenerateConversion} isGenerating={conversionLoading} /></div>}
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
                                {viewMode === 'news' && <MedicalNewsFeed />}
                                {viewMode === 'journey' && <PatientJourney />}
                                {viewMode === 'video' && <VideoWizard />}
                                {viewMode === 'clinical' && <ClinicalSuite />}
                                {viewMode === 'marketing_roi' && <MarketingROI />}
                            </div>
                       </div>

                       <div className={`flex-1 bg-white relative flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] ${showPreview ? 'flex h-full' : 'hidden lg:flex'} ${isFullPageTool ? '!hidden' : ''}`}>
                            <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar pb-0 relative">
                                {isGenerating && (
                                    <div className="h-full flex flex-col items-center justify-center p-8 animate-fadeIn bg-white/90 backdrop-blur-xl absolute inset-0 z-50">
                                        <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-full bg-slate-200 h-10 w-10 animate-pulse"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                                                    <div className="h-2 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="aspect-square bg-slate-200 rounded-xl w-full animate-pulse"></div>
                                            <div className="space-y-3 pt-2">
                                                <div className="h-3 bg-slate-200 rounded w-full animate-pulse"></div>
                                                <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                                                <div className="h-3 bg-slate-200 rounded w-4/6 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-8 animate-pulse text-center">
                                            Criando Conteúdo...
                                        </p>
                                    </div>
                                )}

                                {(viewMode as string) === 'post' && postResult && <div className="py-4 px-4 flex justify-center min-h-full bg-slate-50"><PostPreview result={postResult} onRegenerateText={handleRegeneratePostText} onRegenerateImage={handleRegeneratePostImage} isRegenerating={regenTextLoading || regenImageLoading} /></div>}
                                {(viewMode as string) === 'post' && !postResult && !isGenerating && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8">
                                        <Globe className="w-16 h-16 mb-4 opacity-20" />
                                        <p className="text-sm font-medium">Configure o post para visualizar.</p>
                                    </div>
                                )}
                                {(viewMode as ViewMode) === 'seo' && articleResult && <div className="p-4 lg:p-12 max-w-6xl mx-auto h-full"><ArticlePreview article={articleResult} onConvertToPost={handleTransformArticleToPost} /></div>}
                                {(viewMode as ViewMode) === 'infographic' && infographicResult && <div className="w-full h-full min-h-screen lg:min-h-0"><InfographicPreview data={infographicResult.data} heroImageUrl={infographicResult.heroImageUrl} anatomyImageUrl={infographicResult.anatomyImageUrl} onBack={() => setInfographicResult(null)} /></div>}
                                {(viewMode as ViewMode) === 'conversion' && conversionResult && <div className="p-4 lg:p-12 max-w-4xl mx-auto"><ConversionPreview result={conversionResult} /></div>}
                            </div>
                       </div>
                  </div>
              )}
          </main>

          {!isZenMode && (
            <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-200/60 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)] min-h-[70px]">
                <div className="grid grid-cols-6 h-full items-end pb-2 pt-2 px-1">
                    {navItems.map((item) => {
                        const isActive = item.id === 'scores' 
                            ? ['scores', 'frax', 'calculator', 'prescription', 'journey', 'video', 'clinical'].includes(viewMode)
                            : viewMode === item.id;
                        
                        return (
                            <button 
                                key={item.id}
                                onClick={() => setViewMode(item.id as ViewMode)} 
                                className={`flex flex-col items-center gap-1 group transition-all duration-300 active:scale-95 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <div className={`p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
                                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-[9px] font-bold truncate w-full text-center">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
          )}
      </div>
    </div>
  );
}

export default App;
    