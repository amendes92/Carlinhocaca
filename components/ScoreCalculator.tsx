
import React, { useState } from 'react';
import { ClipboardList, CheckCircle, Calculator, Info, ChevronRight, BarChart, ArrowLeft, Activity, AlertCircle } from 'lucide-react';

type ScoreType = 'lysholm' | 'ikdc' | 'koos' | 'womac';

interface Question {
    id: string;
    title: string;
    options: { l: string; v: number }[];
}

const ScoreCalculator: React.FC = () => {
  const [activeScore, setActiveScore] = useState<ScoreType | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [inputs, setInputs] = useState<Record<string, number>>({});

  const scores = [
    { id: 'lysholm', name: 'Lysholm Score', desc: 'Avaliação de sintomas e função (Ligamentar/Meniscal).', color: 'text-blue-600 bg-blue-50' },
    { id: 'ikdc', name: 'IKDC Subjetivo', desc: 'Padrão-ouro para diversas patologias do joelho.', color: 'text-purple-600 bg-purple-50' },
    { id: 'womac', name: 'WOMAC', desc: 'Específico para Artrose (Dor, Rigidez, Função).', color: 'text-orange-600 bg-orange-50' },
    { id: 'koos', name: 'KOOS-12', desc: 'Monitoramento rápido de resultados (Short Form).', color: 'text-teal-600 bg-teal-50' }
  ];

  const questions: Record<ScoreType, Question[]> = {
      lysholm: [
        { id: 'claudicacao', title: 'Claudicação (Mancar)', options: [{l:'Nenhuma', v:5}, {l:'Leve ou periódica', v:3}, {l:'Grave e constante', v:0}] },
        { id: 'apoio', title: 'Uso de Apoio', options: [{l:'Nenhum', v:5}, {l:'Bengala ou muleta', v:2}, {l:'Impossível apoiar', v:0}] },
        { id: 'bloqueio', title: 'Bloqueio', options: [{l:'Nenhum', v:15}, {l:'Sensação de bloqueio, mas não trava', v:10}, {l:'Bloqueio ocasional', v:6}, {l:'Bloqueio frequente', v:2}, {l:'Joelho travado no exame', v:0}] },
        { id: 'instabilidade', title: 'Instabilidade (Falseio)', options: [{l:'Nunca falseia', v:25}, {l:'Raramente, durante esporte', v:20}, {l:'Frequentemente no esporte', v:15}, {l:'Ocasionalmente no dia a dia', v:10}, {l:'Frequentemente no dia a dia', v:5}, {l:'A cada passo', v:0}] },
        { id: 'dor', title: 'Dor', options: [{l:'Nenhuma', v:25}, {l:'Inconstante / Leve no esforço', v:20}, {l:'Marcada no esporte', v:15}, {l:'Marcada ao caminhar < 2km', v:10}, {l:'Marcada ao caminhar < 200m', v:5}, {l:'Constante', v:0}] },
        { id: 'inchaco', title: 'Inchaço', options: [{l:'Nenhum', v:10}, {l:'Após esforço intenso', v:6}, {l:'Após esforço leve', v:2}, {l:'Constante', v:0}] },
        { id: 'escadas', title: 'Subir Escadas', options: [{l:'Sem problemas', v:10}, {l:'Leve dificuldade', v:6}, {l:'Um degrau por vez', v:2}, {l:'Impossível', v:0}] },
        { id: 'agachamento', title: 'Agachamento', options: [{l:'Sem problemas', v:5}, {l:'Leve dificuldade', v:4}, {l:'Não consegue além de 90°', v:2}, {l:'Impossível', v:0}] },
      ],
      ikdc: [
          { id: 'atv_nivel', title: 'Nível mais alto de atividade sem dor significativa', options: [{l:'Muito extenuante (futebol, basquete)', v:4}, {l:'Extenuante (esqui, tênis)', v:3}, {l:'Moderado (corrida leve)', v:2}, {l:'Leve (caminhada)', v:1}, {l:'Incapaz', v:0}] },
          { id: 'dor_freq', title: 'Com que frequência sente dor? (Últimas 4 semanas)', options: [{l:'Nunca', v:10}, {l:'Raramente', v:9}, {l:'As vezes', v:8}, {l:'Frequentemente', v:7}, {l:'Sempre', v:0}] }, 
          { id: 'dor_grav', title: 'Gravidade da dor (0-10)', options: [{l:'0-1 (Mínima)', v:10}, {l:'2-3', v:8}, {l:'4-6', v:5}, {l:'7-8', v:2}, {l:'9-10 (Pior)', v:0}] },
          { id: 'rigidez', title: 'Rigidez ou inchaço', options: [{l:'Nunca', v:2}, {l:'Raramente', v:1}, {l:'Frequentemente', v:0}] },
          { id: 'func_escada', title: 'Dificuldade: Subir/Descer Escadas', options: [{l:'Nenhuma', v:4}, {l:'Leve', v:3}, {l:'Moderada', v:2}, {l:'Extrema', v:1}, {l:'Incapaz', v:0}] },
          { id: 'func_agachar', title: 'Dificuldade: Agachar', options: [{l:'Nenhuma', v:4}, {l:'Leve', v:3}, {l:'Moderada', v:2}, {l:'Extrema', v:1}, {l:'Incapaz', v:0}] },
          { id: 'func_pular', title: 'Dificuldade: Pular', options: [{l:'Nenhuma', v:4}, {l:'Leve', v:3}, {l:'Moderada', v:2}, {l:'Extrema', v:1}, {l:'Incapaz', v:0}] },
          { id: 'func_correr', title: 'Dificuldade: Correr', options: [{l:'Nenhuma', v:4}, {l:'Leve', v:3}, {l:'Moderada', v:2}, {l:'Extrema', v:1}, {l:'Incapaz', v:0}] },
          { id: 'func_ajoelhar', title: 'Dificuldade: Ajoelhar', options: [{l:'Nenhuma', v:4}, {l:'Leve', v:3}, {l:'Moderada', v:2}, {l:'Extrema', v:1}, {l:'Incapaz', v:0}] },
          { id: 'func_geral', title: 'Como avalia o joelho hoje? (0-10)', options: [{l:'Normal (10)', v:10}, {l:'Quase normal (8-9)', v:8}, {l:'Regular (5-7)', v:5}, {l:'Ruim (0-4)', v:0}] }
      ],
      womac: [
          { id: 'p1', title: 'Dor: Andando no plano', options: [{l:'Nenhuma', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Forte', v:3}, {l:'Muito Forte', v:4}] },
          { id: 'p2', title: 'Dor: Subindo/Descendo escadas', options: [{l:'Nenhuma', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Forte', v:3}, {l:'Muito Forte', v:4}] },
          { id: 'p3', title: 'Dor: À noite na cama', options: [{l:'Nenhuma', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Forte', v:3}, {l:'Muito Forte', v:4}] },
          { id: 'p4', title: 'Dor: Sentado ou deitado', options: [{l:'Nenhuma', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Forte', v:3}, {l:'Muito Forte', v:4}] },
          { id: 'p5', title: 'Dor: Ficando de pé', options: [{l:'Nenhuma', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Forte', v:3}, {l:'Muito Forte', v:4}] },
          { id: 's1', title: 'Rigidez: Ao acordar', options: [{l:'Nenhuma', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Forte', v:3}, {l:'Muito Forte', v:4}] },
          { id: 's2', title: 'Rigidez: Durante o dia', options: [{l:'Nenhuma', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Forte', v:3}, {l:'Muito Forte', v:4}] },
          { id: 'f1', title: 'Função: Descer escadas', options: [{l:'Nenhuma dif.', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Difícil', v:3}, {l:'Incapaz', v:4}] },
          { id: 'f2', title: 'Função: Subir escadas', options: [{l:'Nenhuma dif.', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Difícil', v:3}, {l:'Incapaz', v:4}] },
          { id: 'f3', title: 'Função: Levantar sentada', options: [{l:'Nenhuma dif.', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Difícil', v:3}, {l:'Incapaz', v:4}] },
          { id: 'f4', title: 'Função: Ficar em pé', options: [{l:'Nenhuma dif.', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Difícil', v:3}, {l:'Incapaz', v:4}] },
          { id: 'f5', title: 'Função: Entrar/Sair carro', options: [{l:'Nenhuma dif.', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Difícil', v:3}, {l:'Incapaz', v:4}] },
          { id: 'f6', title: 'Função: Andar no plano', options: [{l:'Nenhuma dif.', v:0}, {l:'Leve', v:1}, {l:'Moderada', v:2}, {l:'Difícil', v:3}, {l:'Incapaz', v:4}] },
      ],
      koos: [
          { id: 'k1', title: 'Com que frequência sente dor?', options: [{l:'Nunca', v:100}, {l:'Mensalmente', v:75}, {l:'Semanalmente', v:50}, {l:'Diariamente', v:25}, {l:'Sempre', v:0}] },
          { id: 'k2', title: 'Dor ao esticar totalmente?', options: [{l:'Nenhuma', v:100}, {l:'Leve', v:75}, {l:'Moderada', v:50}, {l:'Forte', v:25}, {l:'Extrema', v:0}] },
          { id: 'k3', title: 'Dor ao dobrar totalmente?', options: [{l:'Nenhuma', v:100}, {l:'Leve', v:75}, {l:'Moderada', v:50}, {l:'Forte', v:25}, {l:'Extrema', v:0}] },
          { id: 'k4', title: 'Inchaço no joelho?', options: [{l:'Nunca', v:100}, {l:'Raramente', v:75}, {l:'As vezes', v:50}, {l:'Frequentemente', v:25}, {l:'Sempre', v:0}] },
          { id: 'k5', title: 'Dificuldade: Descer escadas', options: [{l:'Nenhuma', v:100}, {l:'Leve', v:75}, {l:'Moderada', v:50}, {l:'Forte', v:25}, {l:'Extrema', v:0}] },
          { id: 'k6', title: 'Dificuldade: Ficar em pé', options: [{l:'Nenhuma', v:100}, {l:'Leve', v:75}, {l:'Moderada', v:50}, {l:'Forte', v:25}, {l:'Extrema', v:0}] },
          { id: 'k7', title: 'Dificuldade: Correr', options: [{l:'Nenhuma', v:100}, {l:'Leve', v:75}, {l:'Moderada', v:50}, {l:'Forte', v:25}, {l:'Extrema', v:0}] },
          { id: 'k8', title: 'Dificuldade: Ajoelhar', options: [{l:'Nenhuma', v:100}, {l:'Leve', v:75}, {l:'Moderada', v:50}, {l:'Forte', v:25}, {l:'Extrema', v:0}] },
          { id: 'k9', title: 'Consciência do joelho', options: [{l:'Nunca', v:100}, {l:'Mensalmente', v:75}, {l:'Semanalmente', v:50}, {l:'Diariamente', v:25}, {l:'Sempre', v:0}] },
          { id: 'k10', title: 'Modificou estilo de vida?', options: [{l:'Não', v:100}, {l:'Um pouco', v:75}, {l:'Moderadamente', v:50}, {l:'Muito', v:25}, {l:'Totalmente', v:0}] },
          { id: 'k11', title: 'Confiança no joelho', options: [{l:'Total', v:100}, {l:'Muita', v:75}, {l:'Moderada', v:50}, {l:'Pouca', v:25}, {l:'Nenhuma', v:0}] },
          { id: 'k12', title: 'Dificuldade geral', options: [{l:'Nenhuma', v:100}, {l:'Leve', v:75}, {l:'Moderada', v:50}, {l:'Forte', v:25}, {l:'Extrema', v:0}] },
      ]
  };

  const handleInput = (sectionId: string, val: number) => {
      setInputs(prev => ({...prev, [sectionId]: val}));
  };

  const calculateScore = () => {
      if (!activeScore) return;
      const currentQuestions = questions[activeScore];
      const allAnswered = currentQuestions.every(q => inputs[q.id] !== undefined);
      if (!allAnswered) {
          alert("Por favor, responda todas as perguntas.");
          return;
      }
      let finalScore = 0;
      const totalPoints = Object.values(inputs).reduce((a, b) => a + b, 0);
      if (activeScore === 'lysholm') finalScore = totalPoints;
      else if (activeScore === 'ikdc') {
          const maxPossible = currentQuestions.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.v)), 0);
          finalScore = (totalPoints / maxPossible) * 100;
      } else if (activeScore === 'womac') {
          const numItems = currentQuestions.length;
          const maxPossible = numItems * 4;
          finalScore = 100 - ((totalPoints / maxPossible) * 100);
      } else if (activeScore === 'koos') finalScore = totalPoints / currentQuestions.length;
      setResult(Math.round(finalScore));
  };

  const getInterpretation = (val: number) => {
      if (val >= 90) return { label: 'Excelente', color: 'text-green-600', stroke: '#16a34a', bg: 'bg-green-100', msg: 'Função articular preservada.' };
      if (val >= 80) return { label: 'Bom', color: 'text-blue-600', stroke: '#2563eb', bg: 'bg-blue-100', msg: 'Limitações leves.' };
      if (val >= 60) return { label: 'Regular', color: 'text-yellow-600', stroke: '#ca8a04', bg: 'bg-yellow-100', msg: 'Sintomas impactam qualidade de vida.' };
      return { label: 'Ruim', color: 'text-red-600', stroke: '#dc2626', bg: 'bg-red-100', msg: 'Disfunção significativa.' };
  };

  const reset = () => {
      setActiveScore(null);
      setResult(null);
      setInputs({});
  }

  if (activeScore) {
      const config = scores.find(s => s.id === activeScore);
      const activeQuestions = questions[activeScore];
      const percentComplete = Math.round((Object.keys(inputs).length / activeQuestions.length) * 100);
      const interpretation = result !== null ? getInterpretation(result) : null;

      return (
          <div className="h-full bg-slate-50 flex flex-col pb-24 lg:pb-0 animate-fadeIn">
              <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-4 py-3 border-b border-slate-200 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <button onClick={reset} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-none">{config?.name}</h2>
                        <div className="w-24 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${percentComplete === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percentComplete}%` }}></div>
                        </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-400">{Object.keys(inputs).length} / {activeQuestions.length}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {result !== null && interpretation ? (
                      <div className="animate-scaleIn max-w-sm mx-auto mt-6">
                          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 text-center relative overflow-hidden">
                              <div className={`absolute top-0 left-0 right-0 h-2 ${interpretation.bg}`}></div>
                              <div className="relative w-48 h-48 mx-auto mb-6">
                                  <svg className="w-full h-full transform -rotate-90">
                                      <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                                      <circle cx="96" cy="96" r="88" stroke={interpretation.stroke} strokeWidth="12" fill="transparent" strokeDasharray="552" strokeDashoffset={552 - (552 * result) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-6xl font-black text-slate-900 tracking-tighter">{result}</span>
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pontos</span>
                                  </div>
                              </div>
                              <h3 className={`text-2xl font-black mb-2 ${interpretation.color}`}>{interpretation.label}</h3>
                              <p className="text-sm text-slate-500 leading-relaxed px-4">{interpretation.msg}</p>
                              <button onClick={reset} className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg">Novo Cálculo</button>
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-4 max-w-2xl mx-auto">
                          {activeQuestions.map((q, idx) => (
                              <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                                  <h3 className="font-bold text-slate-900 text-sm mb-4 flex gap-2">
                                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs h-fit">{idx + 1}</span>
                                      {q.title}
                                  </h3>
                                  <div className="space-y-2">
                                      {q.options.map((opt) => (
                                          <button
                                              key={opt.l}
                                              onClick={() => handleInput(q.id, opt.v)}
                                              className={`w-full text-left p-4 rounded-xl text-xs font-medium transition-all border flex items-center justify-between active:scale-[0.99]
                                              ${inputs[q.id] === opt.v 
                                                  ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-md z-10' 
                                                  : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                          >
                                              <span className={inputs[q.id] === opt.v ? 'text-blue-700 font-bold' : 'text-slate-600'}>{opt.l}</span>
                                              {inputs[q.id] === opt.v && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          ))}
                          <div className="pt-4 pb-8">
                              <button onClick={calculateScore} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                                  <Calculator className="w-6 h-6" /> Calcular Resultado
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0"><Activity className="w-8 h-8" /></div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-tight mb-1">Scores Funcionais</h1>
                        <p className="text-sm text-slate-500">Selecione o questionário para avaliar a função articular.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scores.map((score) => (
                        <button key={score.id} onClick={() => setActiveScore(score.id as ScoreType)} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all text-left group active:scale-[0.98]">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${score.color} bg-opacity-20`}><ClipboardList className={`w-6 h-6 ${score.color.split(' ')[0]}`} /></div>
                                <div className="bg-slate-50 p-2 rounded-full text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"><ChevronRight className="w-5 h-5" /></div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{score.name}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{score.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScoreCalculator;
    