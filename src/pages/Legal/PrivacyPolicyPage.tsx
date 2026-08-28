import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, FileCheck, CheckCircle2, Mail, ExternalLink } from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';

interface PrivacyPolicyPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
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

        <div className="px-3.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'SEGURIDAD & PRIVACIDAD' : 'PRIVACY & SAFETY'}</span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
          {t.legal.privacyTitle}
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          {t.legal.privacySubtitle}
        </p>
        <span className="text-[10px] text-brand-cyan font-bold block pt-1">
          {t.legal.lastUpdated}
        </span>
      </div>

      {/* Main Legal Content */}
      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
        
        {/* 1. Marco Institucional y Responsable del Tratamiento */}
        <div className="sismo-card p-4 space-y-2 border-brand-cyan/25">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <FileCheck className="w-4 h-4 text-brand-cyan" />
            <h3>{language === 'es' ? '1. Responsable del Proyecto y Desarrollo' : '1. Project Lead & Development'}</h3>
          </div>
          <p>
            {language === 'es' ? (
              <>
                La plataforma digital interactiva <strong>SISMO LAB</strong> es un software educativo desarrollado por la empresa <strong>Zion Code</strong> para la <strong>Escuela Policía Federal Argentina</strong> (San Juan), con fines de innovación pedagógica, entrenamiento lúdico y concientización sobre la autoprotección ante sismos.
              </>
            ) : (
              <>
                The interactive digital platform <strong>SISMO LAB</strong> is educational software engineered by <strong>Zion Code</strong> for <strong>Escuela Policía Federal Argentina</strong> (San Juan), focused on pedagogical innovation, interactive training, and civic earthquake safety awareness.
              </>
            )}
          </p>
        </div>

        {/* 2. Protección Especial de Menores de Edad */}
        <div className="sismo-card p-4 space-y-2 border-emerald-500/30">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3>{language === 'es' ? '2. Protección Especial de la Niñez y Estudiantes' : '2. Protection of Minors & Students'}</h3>
          </div>
          <p>
            {language === 'es' ? (
              <>
                Diseñada con un estricto principio de <strong>Privacidad por Diseño (Privacy by Design)</strong>. SISMO LAB no solicita ni almacena datos sensibles, números de documento (DNI), direcciones físicas, números de teléfono ni datos financieros de los estudiantes. El acceso se realiza mediante autenticación segura para guardar progreso y ranking.
              </>
            ) : (
              <>
                Built under strict <strong>Privacy by Design</strong> principles. SISMO LAB does not request or store sensitive personal data, national ID numbers, physical addresses, phone numbers or payment information.
              </>
            )}
          </p>
        </div>

        {/* 3. Datos Recopilados y Finalidad */}
        <div className="sismo-card p-4 space-y-2 border-white/10">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
            <h3>{language === 'es' ? '3. Datos Técnicos y Finalidad Pedagógica' : '3. Technical Data & Pedagogical Purpose'}</h3>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-300">
            <li><strong>{language === 'es' ? 'Puntajes y progreso de juego:' : 'Game scores and progress:'}</strong> {language === 'es' ? 'Puntos, nivel, misiones completadas, edad y respuestas para calcular el ranking escolar y detectar conceptos a reforzar.' : 'Points, level, completed missions, age and answers to compute leaderboard ranks and diagnose learning areas.'}</li>
            <li><strong>{language === 'es' ? 'Autenticación Google OAuth:' : 'Google OAuth login:'}</strong> {language === 'es' ? 'Nombre público de perfil y correo para persistir el progreso de juego en la nube.' : 'Public display name and email to persist gameplay progress across devices.'}</li>
            <li><strong>{language === 'es' ? 'Almacenamiento Local (PWA Offline):' : 'Local Storage (Offline PWA):'}</strong> {language === 'es' ? 'La aplicación guarda configuraciones y caché para funcionar sin conexión a internet en escuelas o zonas rurales.' : 'The application caches assets locally so it can run fully offline in schools or remote rural areas.'}</li>
          </ul>
        </div>

        {/* 4. No Comercialización y Seguridad */}
        <div className="sismo-card p-4 space-y-2 border-brand-purple/30">
          <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
            <EyeOff className="w-4 h-4 text-purple-300" />
            <h3>{language === 'es' ? '4. Cero Publicidad y Cero Venta de Datos' : '4. Zero Ads & Zero Data Selling'}</h3>
          </div>
          <p>
            {language === 'es' ? (
              <>
                SISMO LAB es 100% libre de anuncios comerciales y rastreadores de terceros con fines publicitarios. Los datos jamás son comercializados, alquilados ni transferidos a terceros.
              </>
            ) : (
              <>
                SISMO LAB is 100% free of commercial advertising and third-party commercial trackers. Data is never sold, rented, or transferred to marketing brokers.
              </>
            )}
          </p>
        </div>

        {/* 5. Contacto Oficial de Privacidad */}
        <div className="sismo-card p-4 space-y-2.5 border-brand-cyan/30 bg-navy-900/90">
          <h3 className="text-white font-black text-sm uppercase">
            {language === 'es' ? '5. Ejercicio de Derechos y Contacto Oficial' : '5. User Rights & Official Contact'}
          </h3>
          <p>
            {language === 'es' ? (
              <>
                En cumplimiento de la Ley 25.326 de Protección de Datos Personales, cualquier usuario o tutor legal puede solicitar la supresión de sus registros escribiendo directamente a la empresa desarrolladora <strong>Zion Code</strong>.
              </>
            ) : (
              <>
                Under Argentine Law 25.326, any user or legal guardian can request data deletion by contacting <strong>Zion Code</strong>.
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <a
              href="mailto:zioncode25@gmail.com"
              className="p-2.5 rounded-xl bg-navy-950 border border-white/10 hover:border-brand-yellow flex items-center justify-between text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-yellow" />
                <span>zioncode25@gmail.com</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://zion-code.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-navy-950 border border-white/10 hover:border-brand-cyan flex items-center justify-between text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-brand-cyan" />
                <span>zion-code.vercel.app</span>
              </div>
            </a>
          </div>
        </div>

      </div>

      {/* Back button */}
      <div className="pt-2">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-full py-3 rounded-2xl bg-navy-900 border border-brand-cyan/40 text-brand-cyan font-bold text-xs uppercase tracking-wider hover:bg-navy-850 transition-all text-center flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>
      </div>
    </div>
  );
};
