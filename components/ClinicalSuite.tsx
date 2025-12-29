
import React, { useState, useRef } from 'react';
import { 
    Activity, Eye, Camera, Syringe, Weight, Pill, Utensils, 
    ChevronRight, AlertTriangle, CheckCircle2, UploadCloud, 
    Loader2, Scale, Calendar, Info, FlaskConical, PersonStanding, ArrowLeft
} from 'lucide-react';
import { analyzeWoundImage, checkDrugInteractions, generateSupplementPlan, analyzeWoundImage as analyzeValgusImage } from '../services/geminiService'; // Reusing wound function for valgus prompt injection logic or create new
import { WoundAnalysisResult, DrugInteractionResult, SupplementPlan } from '../types';

type Tool = 'bioage' | 'wound' | 'valgus' | 'visco' | 'weight' | 'meds' | 'supplements';

const ClinicalSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  // --- BIO AGE STATE ---
  const [chronAge, setChronAge] = useState('');
  const [gripStrength, setGripStrength] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderado');
  const [bioResult, setBioResult] = useState<number | null>(null);

  const calculateBioAge = () => {
      let age = parseInt(chronAge) || 40;
      const grip = parseInt(gripStrength) || 40;
      
      let factor = 0;
      if (grip > 50) factor -= 5;
      else if (grip < 30) factor += 5;

      if (activityLevel === 'atleta') factor -= 3;
      if (activityLevel === 'sedentario') factor += 3;

      setBioResult(age + factor);
  };

  // --- WOUND STATE ---
  const [woundImage, setWoundImage] = useState<string | null>(null);
  const [woundAnalysis, setWoundAnalysis] = useState<WoundAnalysisResult | null>(null);
  const [woundLoading, setWoundLoading] = useState(false);
  const woundInputRef = useRef<HTMLInputElement>(null);

  const handleWoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setWoundImage(reader.result as string);
              analyzeWound(reader.result as string);
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const analyzeWound = async (base64: string) => {
      setWoundLoading(true);
      try {
          const result = await analyzeWoundImage(base64);
          setWoundAnalysis(result);
      } catch (e) {
          console.error(e);
      } finally {
          setWoundLoading(false);
      }
  };

  // --- VALGUS STATE ---
  // Using image analysis instead of live MediaPipe for stability/simplicity
  const [valgusImage, setValgusImage] = useState<string | null>(null);
  const valgusInputRef = useRef<HTMLInputElement>(null);

  // --- VISCO STATE ---
  const [viscoDate, setViscoDate] = useState('');
  const [viscoBrand, setViscoBrand] = useState('Synvisc One');

  // --- WEIGHT SIMULATOR ---
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  
  // --- MEDS STATE ---
  const [medsList, setMedsList] = useState('');
  const [medResult, setMedResult] = useState<DrugInteractionResult | null>(null);
  const [medLoading, setMedLoading] = useState(false);

  const checkMeds = async () => {
      if(!medsList) return;
      setMedLoading(true);
      try {
          const result = await checkDrugInteractions(medsList);
          setMedResult(result);
      } catch (e) { console.error(e); } finally { setMedLoading(false); }
  };

  // --- SUPPLEMENTS STATE ---
  const [injuryType, setInjuryType] = useState('Cartilagem (Artrose)');
  const [suppPlan, setSuppPlan] = useState<SupplementPlan | null>(null);
  const [suppLoading, setSuppLoading] = useState(false);

  const generateSupplements = async () => {
      setSuppLoading(true);
      try {
          const result = await generateSupplementPlan(injuryType);
          setSuppPlan(result);
      } catch (e) { console.error(e); } finally { setSuppLoading(false); }
  };

  // TOOL CARD COMPONENT
  const ToolCard = ({ id, icon: Icon, title, desc, color }: any) => (
      <button 
        onClick={() => setActiveTool(id)}
        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left flex items-start gap-4 group active:scale-[0.98]"
      >
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-current shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div>
              <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
          </div>
      </button>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn pb-24 lg:pb-0">
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            
            {/* Inline Navigation for Active Tool */}
            {activeTool && (
                <button 
                    onClick={() => setActiveTool(null)} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm mb-6 transition-colors bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-fit"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Menu
                </button>
            )}

            {/* MENU GRID */}
            {!activeTool && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ToolCard id="bioage" icon={Activity} title="Bio-Age Calculator" desc="Idade biológica do joelho vs. Cronológica." color="text-green-600 bg-green-600" />
                    <ToolCard id="wound" icon={Eye} title="Analisador de Feridas (Vision AI)" desc="Detecção de sinais de infecção/deiscência." color="text-red-500 bg-red-500" />
                    <ToolCard id="valgus" icon={Camera} title="Valgus Detector (AI)" desc="Análise de ângulo em agachamento por foto." color="text-purple-600 bg-purple-600" />
                    <ToolCard id="visco" icon={Syringe} title="Ciclo Visco" desc="Gestão de datas e meia-vida do Ácido Hialurônico." color="text-blue-500 bg-blue-500" />
                    <ToolCard id="weight" icon={Weight} title="Simulador de Carga" desc="Impacto da perda de peso na articulação." color="text-orange-500 bg-orange-500" />
                    <ToolCard id="meds" icon={Pill} title="Interação Medicamentosa" desc="Segurança com anti-inflamatórios e anticoagulantes." color="text-teal-600 bg-teal-600" />
                    <ToolCard id="supplements" icon={Utensils} title="Planner Suplementação" desc="Protocolos para músculo e cartilagem." color="text-pink-600 bg-pink-600" />
                </div>
            )}

            {/* --- TOOLS RENDER --- */}

            {/* 1. BIO AGE */}
            {activeTool === 'bioage' && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-slideUp">
                    <h2 className="text-lg font-bold text-slate-900">Calculadora de Idade Biológica</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Idade Real</label>
                            <input type="number" value={chronAge} onChange={e => setChronAge(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Anos" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Força (Dinamômetro)</label>
                            <input type="number" value={gripStrength} onChange={e => setGripStrength(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="kgf" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nível de Atividade</label>
                        <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="w-full p-3 border rounded-xl">
                            <option value="sedentario">Sedentário</option>
                            <option value="moderado">Moderado</option>
                            <option value="atleta">Atleta</option>
                        </select>
                    </div>
                    <button onClick={calculateBioAge} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Calcular Bio-Age</button>
                    
                    {bioResult && (
                        <div className="bg-green-50 p-4 rounded-xl text-center mt-4 border border-green-100">
                            <p className="text-xs text-green-800 uppercase font-bold">Idade do Joelho</p>
                            <p className="text-4xl font-black text-green-700">{bioResult} Anos</p>
                            <p className="text-xs text-green-600 mt-1">
                                {bioResult < parseInt(chronAge) ? "Parabéns! Mais jovem que você." : "Atenção! Envelhecimento acelerado."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* 2. WOUND ANALYZER */}
            {activeTool === 'wound' && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 animate-slideUp">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-red-100 p-2 rounded-lg text-red-600"><Eye className="w-6 h-6" /></div>
                        <h2 className="text-lg font-bold text-slate-900">Análise de Ferida (IA)</h2>
                    </div>
                    
                    <div 
                        onClick={() => woundInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        {woundImage ? (
                            <img src={woundImage} className="h-full w-full object-contain rounded-xl" />
                        ) : (
                            <>
                                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                                <span className="text-sm text-slate-500 font-medium">Tirar foto ou upload</span>
                            </>
                        )}
                        <input type="file" ref={woundInputRef} className="hidden" accept="image/*" onChange={handleWoundUpload} />
                    </div>

                    {woundLoading && (
                        <div className="flex items-center justify-center gap-2 text-red-600 font-bold">
                            <Loader2 className="w-5 h-5 animate-spin" /> Analisando tecidos...
                        </div>
                    )}

                    {woundAnalysis && (
                        <div className={`p-4 rounded-xl border-l-4 ${woundAnalysis.riskLevel === 'Alto' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                            <h3 className="font-bold text-lg mb-2">Risco: {woundAnalysis.riskLevel}</h3>
                            <ul className="list-disc pl-4 text-sm space-y-1 mb-3">
                                {woundAnalysis.signs.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                            <p className="text-sm font-bold">{woundAnalysis.recommendation}</p>
                            <p className="text-[10px] mt-3 opacity-70 border-t pt-2 border-black/10">DISCLAIMER: {woundAnalysis.disclaimer}</p>
                        </div>
                    )}
                </div>
            )}

            {/* 3. VALGUS DETECTOR */}
            {activeTool === 'valgus' && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 animate-slideUp">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><PersonStanding className="w-6 h-6" /></div>
                        <h2 className="text-lg font-bold text-slate-900">Detector de Valgo Dinâmico</h2>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-xl text-sm text-purple-800 border border-purple-100 mb-4">
                        <Info className="w-4 h-4 inline mr-1" /> Faça o upload de uma foto frontal do agachamento (ponto mais baixo). A IA traçará as linhas de alinhamento.
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500">Upload Foto Agachamento</span>
                    </div>
                    
                    <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold opacity-50 cursor-not-allowed">
                        Gerar Análise (Mockup)
                    </button>
                </div>
            )}

            {/* 4. VISCO CYCLE */}
            {activeTool === 'visco' && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-slideUp">
                    <h2 className="text-lg font-bold text-slate-900">Gestão de Viscossuplementação</h2>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data da Aplicação</label>
                        <input type="date" value={viscoDate} onChange={e => setViscoDate(e.target.value)} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Produto</label>
                        <select value={viscoBrand} onChange={e => setViscoBrand(e.target.value)} className="w-full p-3 border rounded-xl">
                            <option>Synvisc One (12 meses)</option>
                            <option>Euflexxa (6 meses)</option>
                            <option>Suprahyal (6 meses)</option>
                        </select>
                    </div>
                    
                    {viscoDate && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-blue-600 uppercase">Próximo Ciclo</span>
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-xl font-bold text-slate-900">
                                {new Date(new Date(viscoDate).setFullYear(new Date(viscoDate).getFullYear() + 1)).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Efeito terapêutico estimado de 100% até mês 6.</p>
                        </div>
                    )}
                </div>
            )}

            {/* 5. WEIGHT SIMULATOR */}
            {activeTool === 'weight' && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-slideUp">
                    <h2 className="text-lg font-bold text-slate-900">Simulador de Carga Articular</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Peso Atual</label>
                            <input type="number" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="kg" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta</label>
                            <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="kg" />
                        </div>
                    </div>

                    {currentWeight && targetWeight && (
                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 text-center mt-4">
                            <Scale className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <p className="text-sm font-bold text-orange-800">Redução de Carga Diária</p>
                            <p className="text-4xl font-black text-orange-600 my-2">
                                {((parseInt(currentWeight) - parseInt(targetWeight)) * 4 * 5000 / 1000).toFixed(1)} Ton
                            </p>
                            <p className="text-xs text-orange-700">
                                Baseado em 5.000 passos/dia. Cada 1kg perdido = 4kg a menos de carga por passo.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* 6. MED CHECKER */}
            {activeTool === 'meds' && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-slideUp">
                    <h2 className="text-lg font-bold text-slate-900">Verificador de Interações</h2>
                    <textarea 
                        value={medsList}
                        onChange={e => setMedsList(e.target.value)}
                        placeholder="Digite os medicamentos do paciente (ex: Losartana, AAS, Omeprazol)..."
                        className="w-full p-4 border rounded-xl h-32 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <button 
                        onClick={checkMeds} 
                        disabled={medLoading}
                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                        {medLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Verificar Segurança
                    </button>

                    {medResult && (
                        <div className={`p-4 rounded-xl border-l-4 mt-4 ${medResult.hasInteraction ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                            <h3 className="font-bold">Interação: {medResult.hasInteraction ? 'DETECTADA' : 'Nenhuma Crítica'}</h3>
                            <p className="text-sm mt-2">{medResult.details}</p>
                            <p className="text-sm font-bold mt-2 text-teal-800">Recomendação: {medResult.recommendation}</p>
                        </div>
                    )}
                </div>
            )}

            {/* 7. SUPPLEMENT PLANNER */}
            {activeTool === 'supplements' && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-slideUp">
                    <h2 className="text-lg font-bold text-slate-900">Planner de Suplementação</h2>
                    <select 
                        value={injuryType} 
                        onChange={e => setInjuryType(e.target.value)}
                        className="w-full p-3 border rounded-xl mb-4"
                    >
                        <option>Cartilagem (Artrose)</option>
                        <option>Músculo (Atrofia/Sarcopenia)</option>
                        <option>Tendão (Tendinite)</option>
                        <option>Pós-Operatório LCA</option>
                    </select>
                    
                    <button 
                        onClick={generateSupplements}
                        disabled={suppLoading}
                        className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                        {suppLoading ? <Loader2 className="animate-spin" /> : <Utensils />} Gerar Tabela
                    </button>

                    {suppPlan && (
                        <div className="mt-4 space-y-3">
                            {suppPlan.supplements.map((supp, idx) => (
                                <div key={idx} className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                                    <div className="flex justify-between font-bold text-pink-900">
                                        <span>{supp.name}</span>
                                        <span>{supp.dosage}</span>
                                    </div>
                                    <p className="text-xs text-pink-700 mt-1">{supp.reason}</p>
                                    <div className="mt-2 text-xs font-mono bg-white/50 p-1 rounded inline-block px-2">
                                        🕒 {supp.timing}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    </div>
  );
};

export default ClinicalSuite;
