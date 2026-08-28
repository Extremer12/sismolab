import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';

interface TermsPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-5 sm:p-8 pb-32 max-w-2xl mx-auto font-sans selection:bg-brand-cyan selection:text-navy-950">
      
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between animate-editorial-1">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-10 h-10 rounded-full bg-navy-900 border border-white/10 hover:border-brand-gold/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-gold">
          {language === 'es' ? 'TÉRMINOS DE USO' : 'TERMS OF USE'}
        </span>

        <div className="w-10" />
      </div>

      {/* 2. Hero Header */}
      <header className="relative pt-6 pb-4 space-y-2 animate-editorial-1 text-left">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">
            CONDICIONES DE USO Y PARTICIPACIÓN
          </span>
          <h1 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
            {t.legal.termsTitle}
          </h1>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
          {t.legal.termsSubtitle}
        </p>

        <div className="editorial-divider-gold" />
      </header>

      {/* 3. Editorial Legal Articles (Streamline No-Card Architecture) */}
      <div className="space-y-8 pt-4 text-xs text-slate-300 leading-relaxed animate-editorial-2">
        
        {/* Article 01 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-brand-gold font-mono text-xs">01.</span>
            <h2>{language === 'es' ? 'Propósito Educativo y Formativo' : 'Educational & Training Purpose'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
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
        </section>

        {/* Article 02 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-rose-400 font-mono text-xs">02.</span>
            <h2>{language === 'es' ? 'Alcance ante Emergencias Reales' : 'Real Emergency Protocols'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
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
        </section>

        {/* Article 03 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-brand-cyan font-mono text-xs">03.</span>
            <h2>{language === 'es' ? 'Propiedad Intelectual y Licencia' : 'Intellectual Property & License'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
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
        </section>

        {/* Article 04 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-brand-yellow font-mono text-xs">04.</span>
            <h2>{language === 'es' ? 'Fair Play y Convivencia en el Ranking' : 'Fair Play & Respectful Gaming'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
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
        </section>

      </div>

      {/* Footer Return Button */}
      <div className="pt-10">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-full py-3.5 rounded-full bg-navy-900 border border-white/10 hover:border-brand-gold text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:text-white active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>
      </div>

    </div>
  );
};
