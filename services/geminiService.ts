
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { PostState, GeneratedPostContent, ArticleState, GeneratedArticle, InfographicState, GeneratedInfographic, ConversionState, ConversionResult, PostFormat, MessageTemplateState, TrendTopic, ComplianceAuditResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to validate API Key availability
const checkApiKey = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }
};

const commonSafetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// --- CFM COMPLIANCE PROMPT (Resolução 2.336/2023) ---
const CFM_COMPLIANCE_INSTRUCTIONS = `
  *** DIRETRIZES OBRIGATÓRIAS DO CONSELHO FEDERAL DE MEDICINA (CFM 2.336/2023) ***
  Você DEVE seguir estritamente estas regras em TODAS as gerações:
  
  1. IDENTIFICAÇÃO (Art. 4): Sempre assuma que o Dr. Carlos Franciozi (CRM: 111501 / TEOT: 10930) é o autor. Se mencionar especialidade, use o RQE se disponível (assuma RQE fictício 99999 para este contexto de geração se não informado).
  2. VEDAÇÃO AO SENSACIONALISMO (Art. 8, 11):
     - NÃO use termos como "o melhor", "o único", "milagroso", "garantido", "resultado certo".
     - NÃO prometa cura ou resultados específicos. A medicina é de meio, não de fim.
     - Evite causar pânico ou medo para atrair pacientes.
  3. PREÇOS E PROMOÇÕES (Art. 9, 11):
     - JAMAIS mencione preços, descontos, "promoção", "black friday" ou parcelamentos promocionais.
     - NÃO faça vendas casadas.
  4. ANTES E DEPOIS (Art. 14):
     - Se o conteúdo descrever casos clínicos ou "antes e depois", deve ter caráter ESTRITAMENTE EDUCATIVO.
     - Adicione sempre um aviso de que "cada caso é único e os resultados variam biologicamente".
     - Mantenha a imagem do paciente anônima (na descrição textual).
  5. EQUIPAMENTOS (Art. 11):
     - Não atribua capacidade privilegiada a máquinas. O equipamento auxilia, não garante sucesso isoladamente.
  
  Tom de voz geral: Sóbrio, educativo, ético, mas acolhedor.
`;

export const generatePostText = async (state: PostState): Promise<GeneratedPostContent> => {
  checkApiKey();

  let prompt = '';
  let parts: any[] = [];

  // RAG: EVIDENCE INJECTION
  let evidenceBlock = "";
  if (state.evidence) {
      evidenceBlock = `
        *** BASE CIENTÍFICA (RAG) ***
        O post DEVE ser baseado na seguinte evidência científica do PubMed.
        Título: ${state.evidence.title}
        Autores: ${state.evidence.authors.map(a => a.name).join(', ')}
        Journal: ${state.evidence.source} (${state.evidence.pubdate})
        Abstract: "${state.evidence.abstract || 'Resumo não disponível'}"
        
        OBRIGATÓRIO: Cite a fonte de forma amigável no texto (ex: "Um estudo recente publicado no ${state.evidence.source}...").
      `;
  }

  // LOGIC FOR MULTIMODAL (VISION)
  if (state.uploadedImage) {
      // Extract base64 data
      const base64Data = state.uploadedImage.split(',')[1];
      const mimeType = state.uploadedImage.split(';')[0].split(':')[1];

      parts.push({
          inlineData: {
              data: base64Data,
              mimeType: mimeType
          }
      });

      prompt = `
        Analise esta imagem médica/clínica. Você é o Dr. Carlos Franciozi, cirurgião de joelho.
        Crie uma legenda para o Instagram baseada EXATAMENTE no que está na imagem e no tópico "${state.topic}".
        
        Categoria: ${state.category}
        Tom de voz: ${state.tone}
        Formato: ${state.format}
        
        ${evidenceBlock}
        ${CFM_COMPLIANCE_INSTRUCTIONS}
        
        A legenda deve explicar a imagem de forma educativa, profissional e conectar com a patologia.
      `;
  } else {
      // CHAIN OF THOUGHT PROMPTING FOR HIGHER QUALITY
      prompt = `
        Você é o Dr. Carlos Franciozi, autoridade em Cirurgia de Joelho. 
        Sua tarefa é criar um post para Instagram de alta performance.

        --- INPUTS ---
        Categoria: ${state.category}
        Tópico: ${state.topic}
        Tom de voz: ${state.tone}
        Formato: ${state.format}
        Instruções Extras: ${state.customInstructions || "Nenhuma"}

        ${evidenceBlock}
        ${CFM_COMPLIANCE_INSTRUCTIONS}

        --- CADEIA DE PENSAMENTO (Raciocínio Interno) ---
        1. Analise a patologia ou evidência fornecida. Identifique a dor do paciente.
        2. Identifique um mito ou erro comum.
        3. Estruture: Gancho (Headline), Corpo Educativo (analogias, citando evidência se houver), CTA (Ético: "Agende sua avaliação" ou "Tire suas dúvidas").
        
        --- REGRAS DE ESTILO ---
        - Use emojis moderados.
        - Parágrafos curtos.
      `;
  }

  // Add the text prompt instruction
  prompt += `
    Gere APENAS um objeto JSON válido (sem markdown \`\`\`json) com:
    1. 'headline': Título curto e impactante (máx 6 palavras).
    2. 'caption': A legenda do post formatada.
    3. 'hashtags': 15 hashtags focadas em ortopedia.
    4. 'imagePromptDescription': ${state.uploadedImage ? '"USE_UPLOADED_IMAGE"' : 'Descrição visual ultra-detalhada e artística para gerar uma imagem médica premium. Estilo: "Cinematic lighting, high-end medical illustration, blue and gold color palette, clean background".'}
  `;

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: parts },
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      thinkingConfig: { thinkingBudget: 1024 }, 
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          caption: { type: Type.STRING },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          imagePromptDescription: { type: Type.STRING }
        },
        required: ["headline", "caption", "hashtags", "imagePromptDescription"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o texto.");

  return JSON.parse(text) as GeneratedPostContent;
};

// NEW: COMPLIANCE AUDITOR
export const auditContent = async (textContent: string): Promise<ComplianceAuditResult> => {
    checkApiKey();
    const prompt = `
        Atue como um AUDITOR JURÍDICO rigoroso do Conselho Federal de Medicina (CFM).
        Sua tarefa é analisar o texto abaixo em busca de infrações à Resolução 2.336/2023.

        TEXTO PARA AUDITORIA:
        "${textContent.substring(0, 5000)}"

        VERIFICAÇÕES CRÍTICAS:
        1. Promessa de resultado ("garantido", "cura certa", "o melhor").
        2. Sensacionalismo (termos alarmistas, "milagroso").
        3. Comércio (menção a preços, promoções, "desconto").
        4. "Antes e Depois" sem aviso educativo de variabilidade biológica.
        5. Exclusividade (afirmar ser o único capaz/técnica exclusiva sem comprovação).

        Gere um JSON com:
        - compliant: boolean (true se passou sem erros graves).
        - riskLevel: 'safe' | 'warning' | 'danger'.
        - issues: array de strings (liste as frases problemáticas).
        - suggestions: array de strings (sugestões de correção).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            safetySettings: commonSafetySettings,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    compliant: { type: Type.BOOLEAN },
                    riskLevel: { type: Type.STRING, enum: ['safe', 'warning', 'danger'] },
                    issues: { type: Type.ARRAY, items: { type: Type.STRING } },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["compliant", "riskLevel", "issues", "suggestions"]
            }
        }
    });

    if (!response.text) {
        return { compliant: true, riskLevel: 'safe', issues: [], suggestions: [] };
    }
    return JSON.parse(response.text) as ComplianceAuditResult;
};

// NEW: SMART REFINE FUNCTION
export const refinePostCaption = async (currentCaption: string, instruction: string): Promise<string> => {
    checkApiKey();
    const prompt = `
        Refine a seguinte legenda de post médico de acordo com a instrução.
        
        ${CFM_COMPLIANCE_INSTRUCTIONS}

        Legenda Atual: "${currentCaption}"
        Instrução de Refinamento: "${instruction}".

        Retorne APENAS o novo texto da legenda, sem JSON.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { safetySettings: commonSafetySettings }
    });

    return response.text || currentCaption;
};

// NEW: GENERATE APPOINTMENT MESSAGE
export const generateAppointmentMessage = async (state: MessageTemplateState): Promise<string> => {
    checkApiKey();
    
    const typeMap: Record<string, string> = {
        'first_visit': 'Primeira Consulta',
        'return': 'Retorno',
        'post_op': 'Avaliação Pós-Operatória',
        'infiltration': 'Infiltração / Viscossuplementação'
    };

    const prompt = `
        Atue como a Secretária Virtual do Dr. Carlos Franciozi.
        Escreva uma mensagem de confirmação para WhatsApp.
        
        Paciente: ${state.appointment.patientName}
        Tipo: ${typeMap[state.appointment.type] || state.appointment.type}
        Data: ${state.appointment.date} às ${state.appointment.time}
        Tom: ${state.tone}
        Nota: ${state.customNote || "Nenhuma"}
        
        ${CFM_COMPLIANCE_INSTRUCTIONS}

        INFORMAÇÕES REAIS:
        Local: Hospital Israelita Albert Einstein
        Endereço: Av. Albert Einstein, 627 - Pavilhão Vicky e Joseph Safra - Bloco A1 - Sala 113 - Morumbi, São Paulo - SP.

        Diretrizes:
        1. Seja cordial e profissional.
        2. Use emojis moderados (🏥, 📅).
        3. Finalize com "Equipe Dr. Carlos Franciozi".

        Retorne APENAS o texto da mensagem.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { safetySettings: commonSafetySettings }
    });

    return response.text || "Olá, aqui é do consultório do Dr. Carlos. Gostaria de confirmar sua consulta.";
};

// NEW: TREND ANALYZER
export const generateTrendSuggestions = async (): Promise<TrendTopic[]> => {
    checkApiKey();
    const prompt = `
        Atue como um analista de tendências digitais focado em Saúde/Ortopedia no Brasil.
        Identifique 5 tópicos "Quentes".
        
        ${CFM_COMPLIANCE_INSTRUCTIONS}
        (Garanta que os tópicos sugeridos permitam uma abordagem ética e não sensacionalista).

        Gere um JSON array com: 'keyword', 'volume', 'growth', 'category', 'suggestedHeadline'.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            safetySettings: commonSafetySettings,
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        keyword: { type: Type.STRING },
                        volume: { type: Type.STRING },
                        growth: { type: Type.STRING },
                        category: { type: Type.STRING },
                        suggestedHeadline: { type: Type.STRING }
                    },
                    required: ["keyword", "volume", "growth", "category", "suggestedHeadline"]
                }
            }
        }
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as TrendTopic[];
};


export const generateSEOArticle = async (state: ArticleState): Promise<GeneratedArticle> => {
  checkApiKey();

  // RAG: EVIDENCE INJECTION
  let evidenceBlock = "";
  if (state.evidence) {
      evidenceBlock = `
        *** BASE CIENTÍFICA (RAG) ***
        Este artigo deve ser fortemente embasado na seguinte publicação:
        Título: ${state.evidence.title}
        Autores: ${state.evidence.authors.map(a => a.name).join(', ')}
        Journal: ${state.evidence.source} (${state.evidence.pubdate})
        Abstract: "${state.evidence.abstract || 'Resumo indisponível'}"
        
        INSTRUÇÃO RAG: Integre os achados deste estudo no corpo do artigo e cite a fonte corretamente.
      `;
  }

  const prompt = `
    Você é um redator médico especialista em SEO para Ortopedia.
    Escreva um artigo completo para o blog.
    
    Tópico: ${state.topic}
    Palavras-chave: ${state.keywords}
    Público: ${state.audience}
    Extensão: ${state.length}
    Tom: ${state.tone}

    ${evidenceBlock}
    ${CFM_COMPLIANCE_INSTRUCTIONS}
    
    ATENÇÃO AO ARTIGO 9 e 11 do CFM:
    - O conteúdo deve ser estritamente educativo.
    - Não use "antes e depois" sensacionalista.
    - Se citar tratamentos, mencione que resultados variam.

    Gere um JSON com: 'title', 'slug', 'metaDescription', 'contentHtml', 'seoSuggestions', 'keywordsUsed', 'wordCount'.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          slug: { type: Type.STRING },
          metaDescription: { type: Type.STRING },
          contentHtml: { type: Type.STRING },
          seoSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywordsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
          wordCount: { type: Type.INTEGER }
        },
        required: ["title", "slug", "metaDescription", "contentHtml", "seoSuggestions", "keywordsUsed", "wordCount"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o artigo.");

  return JSON.parse(text) as GeneratedArticle;
};

export const generateInfographicContent = async (state: InfographicState): Promise<GeneratedInfographic> => {
  checkApiKey();

  const prompt = `
    Crie conteúdo para um INFOGRÁFICO médico.
    Diagnóstico: ${state.diagnosis}
    Perfil: ${state.patientProfile}
    Tom: ${state.tone}
    Notas: ${state.notes}

    ${CFM_COMPLIANCE_INSTRUCTIONS}
    
    Estrutura Exigida (JSON): Hero, Anatomy, Mechanism, Symptoms, Treatment, Rehab.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          heroTitle: { type: Type.STRING },
          heroSubtitle: { type: Type.STRING },
          heroImagePrompt: { type: Type.STRING },
          anatomy: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 imagePrompt: { type: Type.STRING },
                 points: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             label: { type: Type.STRING },
                             text: { type: Type.STRING },
                             x: { type: Type.NUMBER },
                             y: { type: Type.NUMBER }
                         }
                     }
                 }
             }
          },
          mechanism: {
             type: Type.OBJECT,
             properties: {
                 title: { type: Type.STRING },
                 intro: { type: Type.STRING },
                 steps: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             title: { type: Type.STRING },
                             description: { type: Type.STRING },
                             iconName: { type: Type.STRING }
                         }
                     }
                 }
             }
          },
          symptoms: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 items: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             title: { type: Type.STRING },
                             description: { type: Type.STRING },
                             iconName: { type: Type.STRING }
                         }
                     }
                 }
             }
          },
          treatment: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 options: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             type: { type: Type.STRING, enum: ['conservador', 'cirurgico'] },
                             title: { type: Type.STRING },
                             description: { type: Type.STRING },
                             pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                             cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                             indication: { type: Type.STRING }
                         }
                     }
                 }
             }
          },
          rehab: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 phases: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             phase: { type: Type.STRING },
                             title: { type: Type.STRING },
                             items: { type: Type.ARRAY, items: { type: Type.STRING } }
                         }
                     }
                 }
             }
          },
          footerText: { type: Type.STRING }
        },
        required: ["topic", "heroTitle", "heroSubtitle", "heroImagePrompt", "anatomy", "mechanism", "symptoms", "treatment", "rehab", "footerText"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o infográfico.");

  return JSON.parse(text) as GeneratedInfographic;
};

export const generateConversionContent = async (state: ConversionState): Promise<ConversionResult> => {
  checkApiKey();

  const prompt = `
    Atue como o Dr. Carlos Franciozi. Crie conteúdo para "QUEBRAR OBJEÇÕES" de pacientes.
    Patologia: ${state.pathology}
    Objeção: ${state.objection}
    Formato: ${state.format}
    
    ${CFM_COMPLIANCE_INSTRUCTIONS}
    
    IMPORTANTE SOBRE CONVERSÃO VS ÉTICA (CFM):
    - Você PODE quebrar objeções com ciência e acolhimento.
    - Você NÃO PODE garantir sucesso ou prometer "fim da dor".
    - Use argumentos baseados em evidência e protocolos de segurança.
    - A CTA deve ser "Agende uma avaliação" e não "Compre agora".

    Gere JSON de acordo com o formato (REELS ou DEEP_ARTICLE).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', 
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          format: { type: Type.STRING, enum: ['REELS', 'DEEP_ARTICLE'] },
          title: { type: Type.STRING },
          articleContent: { type: Type.STRING },
          script: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                visual: { type: Type.STRING },
                audio: { type: Type.STRING },
                textOverlay: { type: Type.STRING }
              }
            }
          },
          caption: { type: Type.STRING },
          CTA: { type: Type.STRING }
        },
        required: ["format", "title", "CTA"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o conteúdo de conversão.");

  const result = JSON.parse(text) as ConversionResult;
  result.format = state.format; 
  return result;
};

export const generatePostImage = async (promptDescription: string, format: PostFormat): Promise<string> => {
  checkApiKey();

  if (!promptDescription || promptDescription.trim() === '') {
      throw new Error("Prompt vazio.");
  }

  // Aspect Ratio based on Format
  const aspectRatio = format === PostFormat.STORY ? "9:16" : "1:1";

  const enhancedPrompt = `
    Professional Medical illustration: ${promptDescription}.
    Style: Premium, High quality, photorealistic, clinical, orthopedics.
    Colors: Navy Blue, Gold/Bronze, White. High contrast.
    No text, no labels, no gore, no blood.
    Lighting: Studio lighting, clean shadows.
    
    COMPLIANCE SAFETY: Do not generate identifiable patient faces unless requested as abstract. Do not show graphic surgery details.
  `;

  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio, 
          },
          safetySettings: commonSafetySettings
        }
      });

      let base64String: string | null = null;
      
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
          for (const part of candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                  base64String = part.inlineData.data;
                  break;
              }
          }
      }

      if (!base64String) {
        throw new Error("Modelo não retornou imagem.");
      }

      return `data:image/png;base64,${base64String}`;
  } catch (error) {
      console.error("Erro na geração de imagem:", error);
      throw error;
  }
};
