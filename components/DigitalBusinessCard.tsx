
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

  // Encode for URL (QR points to WhatsApp now)
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
      // Fallback to copying link
      navigator.clipboard.writeText(whatsappUrl);
      alert("Link do WhatsApp copiado!");
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col items-center justify-center p-6 animate-fadeIn pb-24 lg:pb-0">
      
      <div className="w-full max-w-sm relative group perspective-1000">
        
        {/* Card Container */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative">
            
            {/* Header / Brand Background */}
            <div className="h-32 bg-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-900 opacity-90"></div>
                {/* Abstract Patterns */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full pt-4">
                    <img 
                        src="https://seujoelho.com/wp-content/uploads/2021/03/02_seu_joelho_logotipo-1-2048x534.png" 
                        alt="Seu Joelho" 
                        className="h-10 w-auto brightness-0 invert opacity-100"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 pt-0 flex flex-col items-center text-center relative z-10 -mt-12">
                
                {/* Profile Picture */}
                <div className="w-24 h-24 rounded-full p-1 bg-white shadow-lg mb-4">
                    <img 
                        src="https://seujoelho.com/wp-content/uploads/2021/01/Dr-Carlos-Franciozi-781x1024.jpg" 
                        className="w-full h-full rounded-full object-cover object-top bg-slate-100"
                        alt="Dr. Carlos"
                    />
                </div>

                {/* Name & Title */}
                <h1 className="text-xl font-black text-slate-900 leading-tight">{doctorData.name}</h1>
                <p className="text-sm font-medium text-blue-600 mb-1">{doctorData.title}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{doctorData.crm}</p>

                {/* QR Code */}
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner mb-6 relative group/qr cursor-pointer" onClick={() => window.open(whatsappUrl, '_blank')}>
                    <img src={qrCodeUrl} alt="QR Code WhatsApp" className="w-48 h-48 rounded-lg mix-blend-multiply" />
                    
                    {/* Scan Icon Overlay */}
                    <div className="absolute -bottom-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                </div>

                {/* Instructions */}
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-full mb-6">
                    <Smartphone className="w-4 h-4" />
                    Aponte para iniciar conversa no WhatsApp
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
                    >
                        <Share2 className="w-4 h-4" /> Enviar
                    </button>
                    
                    <a 
                        href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vCardData)}`} 
                        download="Dr_Carlos_Franciozi.vcf"
                        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-100 active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Salvar Contato
                    </a>
                </div>

            </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-6 text-center opacity-60">
             <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center justify-center gap-2">
                <QrCode className="w-3 h-3" /> Conexão Direta
             </p>
        </div>

      </div>
    </div>
  );
};

export default DigitalBusinessCard;
