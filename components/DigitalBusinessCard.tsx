
import React from 'react';
import { Share2, Download, Smartphone, Check, UserPlus, QrCode, MessageCircle } from 'lucide-react';

const DigitalBusinessCard: React.FC = () => {
  // Doctor Data
  const doctorData = {
    name: "Dr. Carlos Franciozi",
    title: "Cirurgião de Joelho e Ombro",
    org: "Instituto de Ortopedia",
    phone: "5511998447964", 
    displayPhone: "+55 11 99844-7964",
    email: "contato@seujoelho.com",
    website: "https://seujoelho.com",
    address: "Av. Albert Einstein, 627 - Bloco A1 - Sala 113",
    crm: "CRM 111501 / TEOT 10930"
  };

  // WhatsApp Link
  const whatsappUrl = `https://wa.me/${doctorData.phone}`;

  // Construct vCard 3.0 String
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${doctorData.name}
N:Franciozi;Carlos;;Dr.;
ORG:${doctorData.org}
TITLE:${doctorData.title}
TEL;TYPE=CELL:${doctorData.displayPhone}
EMAIL:${doctorData.email}
URL:${doctorData.website}
ADR;TYPE=WORK:;;${doctorData.address};São Paulo;SP;;Brasil
NOTE:${doctorData.crm}
X-SOCIALPROFILE;type=whatsapp:${whatsappUrl}
END:VCARD`;

  // Encode for URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(whatsappUrl)}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Contato Dr. Carlos Franciozi',
          text: 'Fale comigo no WhatsApp ou salve meu contato.',
          url: whatsappUrl
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(whatsappUrl);
      alert("Link do WhatsApp copiado!");
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col items-center justify-center p-4 animate-fadeIn pb-24 lg:pb-0 overflow-y-auto no-scrollbar">
      
      <div className="w-full max-w-sm relative group perspective-1000 my-auto">
        
        {/* Card Container */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative">
            
            {/* Header / Brand Background */}
            <div className="h-36 bg-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-900 opacity-90"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full pt-2">
                    <img 
                        src="https://seujoelho.com/wp-content/uploads/2021/03/02_seu_joelho_logotipo-1-2048x534.png" 
                        alt="Seu Joelho" 
                        className="h-10 w-auto brightness-0 invert opacity-100"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 pt-0 flex flex-col items-center text-center relative z-10 -mt-14">
                
                {/* Profile Picture */}
                <div className="w-28 h-28 rounded-full p-1.5 bg-white shadow-xl mb-4">
                    <img 
                        src="https://seujoelho.com/wp-content/uploads/2021/01/Dr-Carlos-Franciozi-781x1024.jpg" 
                        className="w-full h-full rounded-full object-cover object-top bg-slate-100"
                        alt="Dr. Carlos"
                    />
                </div>

                {/* Name & Title */}
                <h1 className="text-2xl font-black text-slate-900 leading-tight mb-1">{doctorData.name}</h1>
                <p className="text-sm font-bold text-blue-600 mb-2">{doctorData.title}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full mb-6 border border-slate-100">{doctorData.crm}</p>

                {/* QR Code Area */}
                <div className="w-full bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-6 flex items-center gap-4 shadow-inner">
                    <div className="bg-white p-2 rounded-xl shadow-sm cursor-pointer" onClick={() => window.open(whatsappUrl, '_blank')}>
                        <img src={qrCodeUrl} alt="QR" className="w-20 h-20 rounded-lg mix-blend-multiply" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="text-xs font-bold text-slate-900 mb-1">Escaneie para Whats</p>
                        <p className="text-[10px] text-slate-500 leading-snug">Aponte a câmera do celular ou toque no código.</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                    >
                        <Share2 className="w-4 h-4" /> Compartilhar
                    </button>
                    
                    <a 
                        href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vCardData)}`} 
                        download="Dr_Carlos_Franciozi.vcf"
                        className="flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-100 py-4 rounded-2xl font-bold text-sm hover:border-slate-200 transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Salvar Contato
                    </a>
                </div>

            </div>
        </div>

        <div className="mt-6 text-center">
             <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300 flex items-center justify-center gap-2">
                <QrCode className="w-3 h-3" /> Cartão Digital V3.0
             </p>
        </div>

      </div>
    </div>
  );
};

export default DigitalBusinessCard;
