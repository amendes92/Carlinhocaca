
import React, { useState, useRef } from 'react';
import { Tone, TargetAudience, VideoState, VideoScriptResult, GeneratedArticle } from '../types';
import { generateVideoScript, generateBlogFromAudio } from '../services/geminiService';
import VideoScriptPreview from './VideoScriptPreview';
import ArticlePreview from './ArticlePreview';
import { 
    Video, Mic, FileText, Youtube, UploadCloud, 
    Wand2, ArrowRight, CheckCircle2, PlayCircle 
} from 'lucide-react';

const VideoWizard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'script' | 'podcast'>('script');
  const [loading, setLoading] = useState(false);
  
  // Script State
  const [videoState, setVideoState] = useState<VideoState>({
      topic: '',
      targetAudience: TargetAudience.PATIENT,
      tone: Tone.EDUCATIONAL,
      customInstructions: ''
  });
  const [scriptResult, setScriptResult] = useState<VideoScriptResult | null>(null);

  // Podcast State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [blogResult, setBlogResult] = useState<GeneratedArticle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateScript = async () => {
      if (!videoState.topic) return;
      setLoading(true);
      try {
          const result = await generateVideoScript(videoState);
          setScriptResult(result);
      } catch (e) {
          console.error(e);
          alert("Erro ao gerar roteiro.");
      } finally {
          setLoading(false);
      }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setAudioFile(e.target.files[0]);
      }
  };

  const handlePodcastConversion = async () => {
      if (!audioFile) return;
      setLoading(true);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
          try {
              const base64Audio = (reader.result as string).split(',')[1];
              const mimeType = audioFile.type;
              const result = await generateBlogFromAudio(base64Audio, mimeType);
              setBlogResult(result);
          } catch (e) {
              console.error(e);
              alert("Erro ao processar áudio. Verifique se o arquivo é válido e tente novamente.");
          } finally {
              setLoading(false);
          }
      };
      reader.readAsDataURL(audioFile);
  };

  if (loading) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 animate-fadeIn p-8">
              <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-white p-6 rounded-full shadow-xl border border-red-100">
                      {activeTab === 'script' ? (
                          <Video className="w-10 h-10 text-red-600 animate-pulse" />
                      ) : (
                          <Mic className="w-10 h-10 text-purple-600 animate-pulse" />
                      )}
                  </div>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {activeTab === 'script' ? 'Criando Roteiro Magnético...' : 'Ouvindo e Escrevendo...'}
              </h2>
              <p className="text-sm text-slate-500 text-center max-w-xs animate-pulse">
                  {activeTab === 'script' 
                    ? 'A IA está estruturando o Hook, Conteúdo Técnico e Quebra de Objeções.' 
                    : 'A IA está transcrevendo seu áudio e formatando como um artigo de blog completo.'}
              </p>
          </div>
      );
  }

  if (scriptResult) {
      return (
          <div className="h-full flex flex-col animate-fadeIn">
              <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                  <button onClick={() => setScriptResult(null)} className="text-sm font-bold text-slate-500 hover:text-slate-800">Voltar</button>
                  <span className="font-bold text-slate-800">Resultado Gerado</span>
                  <div className="w-10"></div>
              </div>
              <div className="flex-1 overflow-hidden p-4 bg-slate-100">
                  <VideoScriptPreview script={scriptResult} />
              </div>
          </div>
      );
  }

  if (blogResult) {
      return (
          <div className="h-full flex flex-col animate-fadeIn">
              <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                  <button onClick={() => setBlogResult(null)} className="text-sm font-bold text-slate-500 hover:text-slate-800">Voltar</button>
                  <span className="font-bold text-slate-800">Artigo do Podcast</span>
                  <div className="w-10"></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
                  <ArticlePreview article={blogResult} />
              </div>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 pb-24 lg:pb-0 animate-fadeIn">
        
        {/* Inline Tabs */}
        <div className="p-4 lg:p-6 pb-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                    onClick={() => setActiveTab('script')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'script' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Youtube className="w-4 h-4" /> Roteiro YouTube
                </button>
                <button 
                    onClick={() => setActiveTab('podcast')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'podcast' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Mic className="w-4 h-4" /> Podcast → Blog
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
            
            {/* SCRIPT WIZARD */}
            {activeTab === 'script' && (
                <div className="max-w-lg mx-auto space-y-6 animate-slideUp">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Novo Vídeo (10-15 min)</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tema do Vídeo</label>
                                <input 
                                    type="text" 
                                    value={videoState.topic}
                                    onChange={e => setVideoState({...videoState, topic: e.target.value})}
                                    placeholder="Ex: Como tratar lesão de menisco sem cirurgia"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Público</label>
                                    <select 
                                        value={videoState.targetAudience}
                                        onChange={e => setVideoState({...videoState, targetAudience: e.target.value as TargetAudience})}
                                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 text-sm"
                                    >
                                        {Object.values(TargetAudience).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tom</label>
                                    <select 
                                        value={videoState.tone}
                                        onChange={e => setVideoState({...videoState, tone: e.target.value as Tone})}
                                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 text-sm"
                                    >
                                        {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Instruções Específicas</label>
                                <textarea 
                                    value={videoState.customInstructions}
                                    onChange={e => setVideoState({...videoState, customInstructions: e.target.value})}
                                    placeholder="Ex: Citar caso clínico anônimo de atleta..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerateScript}
                            disabled={!videoState.topic}
                            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                        >
                            <Wand2 className="w-5 h-5" /> Gerar Roteiro Estruturado
                        </button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
                        <span className="font-bold block mb-1">Estrutura de Retenção Aplicada:</span>
                        O roteiro será gerado com Hook (60s), Vinheta, Conteúdo Profundo, Quebra de Objeção e CTA, focado em manter o espectador até o final.
                    </div>
                </div>
            )}

            {/* PODCAST WIZARD */}
            {activeTab === 'podcast' && (
                <div className="max-w-lg mx-auto space-y-6 animate-slideUp">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Transforme Áudio em Blog</h2>
                        <p className="text-sm text-slate-500 mb-8">
                            Faça upload do seu podcast ou gravação de voz. A IA transcreve, organiza e cria um artigo otimizado para SEO.
                        </p>

                        <input 
                            type="file" 
                            accept="audio/*" 
                            ref={fileInputRef}
                            onChange={handleAudioUpload}
                            className="hidden" 
                        />

                        {!audioFile ? (
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-purple-200 bg-purple-50 text-purple-700 py-8 rounded-2xl font-bold hover:bg-purple-100 hover:border-purple-300 transition-all flex flex-col items-center justify-center gap-2"
                            >
                                <span className="text-lg">Selecionar Arquivo</span>
                                <span className="text-xs font-normal opacity-70">MP3, WAV, M4A (Max 20MB)</span>
                            </button>
                        ) : (
                            <div className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-purple-200 text-purple-700 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm text-purple-900 truncate">{audioFile.name}</span>
                                </div>
                                <button onClick={() => setAudioFile(null)} className="text-slate-400 hover:text-red-500">
                                    Remover
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={handlePodcastConversion}
                            disabled={!audioFile}
                            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                        >
                            <Wand2 className="w-5 h-5" /> Criar Artigo do Áudio
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default VideoWizard;
