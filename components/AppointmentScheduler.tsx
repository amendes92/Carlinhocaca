
import React, { useState, useMemo } from 'react';
import { Appointment, AppointmentStatus, AppointmentType, Tone, FinancialStatus } from '../types';
import { 
    Calendar, Clock, MessageCircle, CheckCircle2, X, Sparkles, User, Columns, List,
    Syringe, Bone, Stethoscope, Activity, Star, Send, DollarSign, FileText, Mic, 
    MoreVertical, ChevronLeft, ChevronRight, Search, Filter, AlertOctagon, ClipboardList,
    Printer, Phone, Mail, PauseCircle, PlayCircle
} from 'lucide-react';
import { generateAppointmentMessage } from '../services/geminiService';

// Extended Mock Data
const initialAppointments: Appointment[] = [
    { 
        id: '1', patientName: 'Ana Clara Souza', date: '2024-10-25', time: '09:00', type: 'first_visit', status: 'confirmed', phone: '5511999999999',
        financialStatus: 'paid', value: 800, tags: ['VIP', 'Indicação'], notes: 'Dor há 3 meses.'
    },
    { 
        id: '2', patientName: 'Roberto Mendes', date: '2024-10-25', time: '10:30', type: 'post_op', status: 'checkin', phone: '5511988888888',
        financialStatus: 'insurance', tags: ['Pós-Op'], notes: 'Retirada de pontos.'
    },
    { 
        id: '3', patientName: 'Fernanda Oliveira', date: '2024-10-25', time: '14:00', type: 'surgery', status: 'confirmed', phone: '5511977777777',
        financialStatus: 'pending', value: 15000, tags: ['Prioridade', 'Atleta'], 
        surgeryChecklist: { fasting: true, exams: true, materials: false, anesthetist: true }
    },
    { 
        id: '4', patientName: 'Carlos Lima', date: '2024-10-25', time: '14:00', type: 'infiltration', status: 'pending', phone: '5511966666666',
        financialStatus: 'pending', value: 2500, tags: ['Dor Crônica']
    },
    { 
        id: '5', patientName: 'Mariana Costa', date: '2024-10-26', time: '11:00', type: 'first_visit', status: 'confirmed', phone: '5511955555555',
        financialStatus: 'paid', value: 800
    },
];

const waitlistData: Appointment[] = [
    { id: 'w1', patientName: 'João Silva', date: '', time: '', type: 'first_visit', status: 'pending', phone: '', notes: 'Prefere manhã', tags: ['Espera'] }
];

const AppointmentScheduler = () => {
  // 1. STATE MANAGEMENT
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [currentDate, setCurrentDate] = useState(new Date('2024-10-25'));
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'agenda' | 'waitlist'>('agenda');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null); // For Voice Notes simulation
  const [filterType, setFilterType] = useState<string>('all');
  
  // Gemini Message Gen
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  
  // 2. HELPER FUNCTIONS
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const displayDate = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const handleDateChange = (days: number) => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + days);
      setCurrentDate(newDate);
  };

  const getStatusColor = (status: AppointmentStatus) => {
      switch(status) {
          case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
          case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'checkin': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'completed': return 'bg-slate-100 text-slate-500 border-slate-200';
          default: return 'bg-gray-100 text-gray-500';
      }
  };

  const getTypeIcon = (type: AppointmentType) => {
      switch(type) {
          case 'surgery': return <Bone className="w-4 h-4 text-red-500" />;
          case 'infiltration': return <Syringe className="w-4 h-4 text-purple-500" />;
          case 'post_op': return <Activity className="w-4 h-4 text-blue-500" />;
          default: return <User className="w-4 h-4 text-slate-500" />;
      }
  };

  // 3. COMPUTED DATA (Stats & Filtering)
  const filteredAppointments = useMemo(() => {
      let filtered = appointments.filter(a => {
          if (activeTab === 'agenda') return a.date === formatDate(currentDate);
          return true;
      });

      if (searchTerm) {
          filtered = filtered.filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      
      if (filterType !== 'all') {
          filtered = filtered.filter(a => a.type === filterType);
      }

      return filtered.sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, currentDate, searchTerm, activeTab, filterType]);

  const stats = useMemo(() => {
      const total = filteredAppointments.length;
      const revenue = filteredAppointments.reduce((acc, curr) => acc + (curr.value || 0), 0);
      const surgeries = filteredAppointments.filter(a => a.type === 'surgery').length;
      return { total, revenue, surgeries };
  }, [filteredAppointments]);

  // 4. ACTIONS
  const toggleFinancial = (id: string) => {
      setAppointments(prev => prev.map(a => {
          if (a.id !== id) return a;
          const nextStatus = a.financialStatus === 'paid' ? 'pending' : 'paid';
          return { ...a, financialStatus: nextStatus };
      }));
  };

  const toggleChecklist = (id: string, item: keyof NonNullable<Appointment['surgeryChecklist']>) => {
      setAppointments(prev => prev.map(a => {
          if (a.id !== id || !a.surgeryChecklist) return a;
          return {
              ...a,
              surgeryChecklist: { ...a.surgeryChecklist, [item]: !a.surgeryChecklist[item] }
          };
      }));
  };

  const handleGenerateMessage = async (apt: Appointment) => {
      setIsGenerating(true);
      setSelectedAppointment(apt);
      try {
          const msg = await generateAppointmentMessage({ appointment: apt, tone: Tone.PROFESSIONAL });
          setGeneratedMessage(msg);
      } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  // 5. COMPONENTS
  
  const StatCard = ({ icon: Icon, label, value, color }: any) => (
      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-current`}>
              <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">{label}</p>
              <p className="text-lg font-bold text-slate-900 leading-none">{value}</p>
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn">
        
        {/* TOP HEADER: NAVIGATION & STATS */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
            {/* Row 1: Date Nav & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                    <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="text-center min-w-[140px]">
                        <span className="block text-xs font-bold text-slate-400 uppercase">Agenda de</span>
                        <span className="block text-sm font-bold text-slate-900 capitalize">{displayDate(currentDate)}</span>
                    </div>
                    <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500"><ChevronRight className="w-5 h-5" /></button>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar paciente..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <button className="p-2 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800"><Filter className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Row 2: KPIs */}
            <div className="grid grid-cols-3 gap-3 px-4 pb-4">
                <StatCard icon={User} label="Pacientes" value={stats.total} color="text-blue-600 bg-blue-600" />
                <StatCard icon={Bone} label="Cirurgias" value={stats.surgeries} color="text-red-500 bg-red-500" />
                <StatCard icon={DollarSign} label="Faturamento" value={`R$ ${stats.revenue.toLocaleString()}`} color="text-green-600 bg-green-600" />
            </div>

            {/* Row 3: Tabs */}
            <div className="flex px-4 gap-6 border-t border-slate-100 pt-1">
                <button 
                    onClick={() => setActiveTab('agenda')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'agenda' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                >
                    Agenda Diária
                </button>
                <button 
                    onClick={() => setActiveTab('waitlist')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'waitlist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                >
                    Lista de Espera 
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{waitlistData.length}</span>
                </button>
            </div>
        </div>

        {/* MAIN LIST AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
            
            {(activeTab === 'agenda' ? filteredAppointments : waitlistData).map((apt, idx, arr) => {
                // Conflict Detection
                const hasConflict = idx > 0 && arr[idx-1].time === apt.time && apt.time !== '';

                return (
                <div key={apt.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
                    
                    {/* Status Strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        apt.status === 'confirmed' ? 'bg-green-500' : 
                        apt.type === 'surgery' ? 'bg-red-500' : 'bg-slate-300'
                    }`}></div>

                    <div className="p-4 pl-6">
                        {/* Header: Time & Badges */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-lg font-bold text-slate-700 bg-slate-50 px-2 rounded-md border border-slate-100">{apt.time || '--:--'}</span>
                                {hasConflict && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse border border-red-100">
                                        <AlertOctagon className="w-3 h-3" /> Conflito
                                    </span>
                                )}
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(apt.status)}`}>
                                    {apt.status}
                                </div>
                            </div>
                            
                            {/* Action Menu */}
                            <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => window.open(`tel:${apt.phone}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Phone className="w-4 h-4" /></button>
                                <button onClick={() => window.open(`mailto:patient@email.com`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Mail className="w-4 h-4" /></button>
                                <button onClick={() => handleGenerateMessage(apt)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><MessageCircle className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Patient Info */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    {apt.patientName}
                                    {apt.tags?.includes('VIP') && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
                                        {getTypeIcon(apt.type)}
                                        {apt.type.replace('_', ' ')}
                                    </div>
                                    {apt.tags?.map(tag => (
                                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded border border-slate-200">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Financial Toggle */}
                            <button 
                                onClick={() => toggleFinancial(apt.id)}
                                className={`flex flex-col items-end px-3 py-1 rounded-lg border transition-all ${
                                    apt.financialStatus === 'paid' ? 'bg-green-50 border-green-200' : 
                                    apt.financialStatus === 'insurance' ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
                                }`}
                            >
                                <span className={`text-[10px] font-bold uppercase ${
                                    apt.financialStatus === 'paid' ? 'text-green-700' : 
                                    apt.financialStatus === 'insurance' ? 'text-blue-700' : 'text-orange-700'
                                }`}>
                                    {apt.financialStatus === 'paid' ? 'Pago' : apt.financialStatus === 'insurance' ? 'Convênio' : 'Pendente'}
                                </span>
                                {apt.value && <span className="text-xs font-bold text-slate-900">R$ {apt.value}</span>}
                            </button>
                        </div>

                        {/* Special Sections: Surgery Checklist & Actions */}
                        <div className="flex flex-col gap-3">
                            
                            {/* Surgery Checklist */}
                            {apt.type === 'surgery' && apt.surgeryChecklist && (
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase">
                                        <ClipboardList className="w-3 h-3" /> Checklist Pré-Op
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {Object.entries(apt.surgeryChecklist).map(([key, checked]) => (
                                            <button 
                                                key={key}
                                                onClick={() => toggleChecklist(apt.id, key as any)}
                                                className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg border transition-all ${
                                                    checked ? 'bg-green-100 border-green-200 text-green-800' : 'bg-white border-slate-200 text-slate-400'
                                                }`}
                                            >
                                                {checked ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border-2 border-slate-300"></div>}
                                                <span className="capitalize">{key === 'anesthetist' ? 'Anestesista' : key === 'fasting' ? 'Jejum' : key}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Doc & Voice Actions */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                    <Printer className="w-3 h-3" /> Receita
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                    <FileText className="w-3 h-3" /> Atestado
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                    <Activity className="w-3 h-3" /> Pedido Exame
                                </button>
                                <div className="flex-1"></div>
                                <button 
                                    onClick={() => setRecordingId(recordingId === apt.id ? null : apt.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        recordingId === apt.id ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                                >
                                    {recordingId === apt.id ? <PauseCircle className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                                    {recordingId === apt.id ? 'Gravando...' : 'Nota de Voz'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )})}
            
            {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhum agendamento encontrado para este filtro.</p>
                </div>
            )}
        </div>

        {/* Message Modal */}
        {selectedAppointment && (
            <div className="fixed inset-0 bg-black/50 z-[60] flex items-end lg:items-center justify-center p-0 lg:p-4 animate-fadeIn">
                <div className="bg-white w-full lg:max-w-md rounded-t-3xl lg:rounded-2xl p-6 shadow-2xl animate-slideUp">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold text-lg">Mensagem WhatsApp</h3>
                        <button onClick={() => setSelectedAppointment(null)}><X className="w-5 h-5" /></button>
                    </div>
                    {isGenerating ? (
                        <div className="h-32 flex items-center justify-center gap-2 text-blue-600 font-bold">
                            <Sparkles className="w-5 h-5 animate-spin" /> Escrevendo com IA...
                        </div>
                    ) : (
                        <textarea value={generatedMessage} onChange={e => setGeneratedMessage(e.target.value)} className="w-full h-32 p-3 bg-slate-50 rounded-xl text-sm border-none mb-4 outline-none focus:ring-2 focus:ring-blue-500" />
                    )}
                    <button onClick={() => window.open(`https://wa.me/${selectedAppointment.phone}?text=${encodeURIComponent(generatedMessage)}`)} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                        <Send className="w-4 h-4" /> Enviar Agora
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default AppointmentScheduler;
