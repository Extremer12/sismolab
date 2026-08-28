import React from 'react';
import { ArrowLeft, Scale, BookOpen, AlertTriangle, ShieldCheck, HeartHandshake } from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';

interface TermsPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-4 sm:p-6 pb-28 max-w-2xl mx-auto font-sans select-none space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-yellow font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'TÉRMINOS DE USO' : 'TERMS OF USE'}</span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
          {t.legal.termsTitle}
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          {t.legal.termsSubtitle}
        </p>
        <span className="text-[10px] text-brand-gold font-bold block pt-1">
          {t.legal.lastUpdated}
        </span>
      </div>

      {/* Main Legal Content */}
      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
        
        {/* 1. Finalidad Educativa y Pedagógica */}
        <div className="sismo-card p-4 space-y-2 border-brand-gold/30">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <BookOpen className="w-4 h-4 text-brand-gold" />
            <h3>{language === 'es' ? '1. Propósito Educativo y Formativo' : '1. Educational & Training Purpose'}</h3>
          </div>
          <p>
            {language === 'es' ? (
              <>
                <strong>SISMO LAB</strong> es una plataforma interactiva de divulgación pedagógica, gamificación e investigación sobre autoprotección sísmica desarrollada por la empresa <strong>Zion Code</strong> para la <strong>Escuela Policía Federal Argentina</strong>.
              </>
            ) : (
              <>
                <strong>SISMO LAB</strong> is an interactive educational platform designed by <strong>Zion Code</strong> for <strong>Escuela Policía Federal Argentina</strong> to foster civic seismic safety awareness.
              </>
            )}
          </p>
        </div>

        {/* 2. Responsabilidad y Emergencias Reales */}
        <div className="sismo-card p-4 space-y-2 border-rose-500/30">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3>{language === 'es' ? '2. Alcance ante Emergencias Reales' : '2. Real Emergency Protocols'}</h3>
          </div>
          <p>
            {language === 'es' ? (
              <>
                Las simulaciones, puntajes y recomendaciones de la aplicación tienen valor formativo para la preparación comunitaria. En caso de sismo real, la ciudadanía debe seguir siempre las instrucciones de las autoridades oficiales de <strong>Protección Civil, Bomberos y organismos de emergencia</strong>.
              </>
            ) : (
              <>
                Simulations, scores and recommendations are strictly educational. In the event of a real seismic emergency, citizens must follow instructions from official emergency authorities, <strong>Civil Defense and Firefighters</strong>.
              </>
            )}
          </p>
        </div>

        {/* 3. Propiedad Intelectual y Licencia de Uso */}
        <div className="sismo-card p-4 space-y-2 border-brand-cyan/30">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <h3>{language === 'es' ? '3. Propiedad Intelectual y Licencia' : '3. Intellectual Property & License'}</h3>
          </div>
          <p>
            {language === 'es' ? (
              <>
                El código fuente, arquitectura de software, algoritmos y diseño interactivo son propiedad de <strong>Zion Code</strong>. Se autoriza su uso público y gratuito con fines educativos para escuelas, ferias de ciencias, docentes, alumnos y familias.
              </>
            ) : (
              <>
                Source code, software architecture and interactive design are the intellectual property of <strong>Zion Code</strong>. Public free use is granted for schools, science fairs, teachers, students and educational institutions.
              </>
            )}
          </p>
        </div>

        {/* 4. Conducta en el Stand y Fair Play */}
        <div className="sismo-card p-4 space-y-2 border-white/10">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <HeartHandshake className="w-4 h-4 text-brand-yellow" />
            <h3>{language === 'es' ? '4. Fair Play y Convivencia en el Ranking' : '4. Fair Play & Respectful Gaming'}</h3>
          </div>
          <p>
            {language === 'es' ? (
              <>
                Los nombres de perfil deben mantener el decoro y las normas de convivencia escolar. Cada participante debe ingresar su edad real para competir de forma justa en su categoría.
              </>
            ) : (
              <>
                Profile names must maintain school and civic respect. Participants should enter their genuine age for fair category competition.
              </>
            )}
          </p>
        </div>

      </div>

      {/* Back button */}
      <div className="pt-2">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-full py-3 rounded-2xl bg-navy-900 border border-brand-gold/40 text-brand-yellow font-bold text-xs uppercase tracking-wider hover:bg-navy-850 transition-all text-center"
        >
          {t.common.back}
        </button>
      </div>
    </div>
  );
};
