
import React from 'react';
import { ChevronLeft, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ onBack, showBack, title, subtitle }) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl h-16 px-6 flex items-center justify-between sticky top-0 z-[50] border-b border-slate-200/50 pt-safe transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        {showBack ? (
            <>
              <button 
                onClick={onBack}
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors active:scale-95 flex-shrink-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col justify-center animate-fadeIn">
                    <h2 className="text-sm font-bold text-slate-900 leading-none truncate tracking-tight">{title}</h2>
                    {subtitle && <p className="text-[10px] text-primary font-bold truncate mt-1 uppercase tracking-wider opacity-80">{subtitle}</p>}
              </div>
            </>
        ) : (
            <img 
                src="https://seujoelho.com/wp-content/uploads/2021/03/02_seu_joelho_logotipo-1-2048x534.png" 
                alt="Seu Joelho" 
                className="h-8 w-auto object-contain"
            />
        )}
      </div>
      
      {!showBack && (
        <div className="flex items-center gap-3">
             <button className="w-10 h-10 rounded-full hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center text-slate-400 transition-all active:scale-95">
                <Search className="w-5 h-5" />
            </button>
             <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative active:scale-95 transition-all hover:shadow-sm hover:border-slate-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-red rounded-full border border-white ring-1 ring-white"></span>
            </button>
        </div>
      )}
    </header>
  );
};

export default Header;
