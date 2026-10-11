import React from 'react';
import { ArrowLeft, ShieldCheck, Mail, ExternalLink } from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';

interface PrivacyPolicyPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-5 sm:p-8 pb-32 max-w-2xl mx-auto font-sans selection:bg-brand-cyan selection:text-navy-950">
      
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between animate-editorial-1">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-10 h-10 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan/50 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-cyan">
          {language === 'es' ? 'POLÍTICA DE PRIVACIDAD' : 'PRIVACY POLICY'}
        </span>

        <div className="w-10" />
      </div>

      {/* 2. Hero Header */}
      <header className="relative pt-6 pb-4 space-y-2 animate-editorial-1 text-left">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">
            LEY 25.326 · PROTECCIÓN DE DATOS PERSONALES
          </span>
          <h1 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
            {t.legal.privacyTitle}
          </h1>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
          {t.legal.privacySubtitle}
        </p>

        <div className="editorial-divider" />
      </header>

      {/* Government & Safety Policy Disclaimers (Google Play Compliant) */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed space-y-1.5 animate-editorial-1">
        <p className="font-bold uppercase tracking-wider text-amber-300">
          ⚖️ {language === 'es' ? 'Descargo de Responsabilidad Institucional:' : 'Institutional Disclaimer:'}
        </p>
        <p>
          {language === 'es'
            ? 'SISMO LAB es una iniciativa de software educativo desarrollada de forma independiente por Zion Code para la comunidad escolar de la Escuela Policía Federal Argentina (San Juan). Esta aplicación NO representa, no es una aplicación oficial, ni actúa en representación de la Policía Federal Argentina, del Gobierno de San Juan, del INPRES ni de ningún organismo estatal o gubernamental. La información sismológica y geológica proviene de registros públicos del INPRES (www.inpres.gob.ar).'
            : 'SISMO LAB is an independent educational software initiative engineered by Zion Code for the school community. This app does not represent, is not an official app of, and does not act on behalf of the Argentine Federal Police, the Government of San Juan, INPRES, or any government entity. Seismic scientific data references public records from INPRES (www.inpres.gob.ar).'}
        </p>
      </div>

      {/* 3. Editorial Legal Articles (Streamline No-Card Architecture) */}
      <div className="space-y-8 pt-4 text-xs text-slate-300 leading-relaxed animate-editorial-2">
        
        {/* Article 01 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-brand-cyan font-mono text-xs">01.</span>
            <h2>{language === 'es' ? 'Responsable del Proyecto y Desarrollo' : 'Project Lead & Development'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
            {language === 'es' ? (
              <>
                La plataforma interactiva <strong>SISMO LAB</strong> es un software educativo desarrollado por <strong>Zion Code</strong> con fines de divulgación científica, investigación pedagógica y entrenamiento lúdico en autoprotección sísmica comunitaria.
              </>
            ) : (
              <>
                The interactive platform <strong>SISMO LAB</strong> is educational software engineered by <strong>Zion Code</strong>, focused on earthquake self-protection training and scientific dissemination.
              </>
            )}
          </p>
        </section>

        {/* Article 02 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-emerald-400 font-mono text-xs">02.</span>
            <h2>{language === 'es' ? 'Protección Especial de la Niñez y Estudiantes' : 'Protection of Minors & Students'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
            {language === 'es' ? (
              <>
                Diseñada bajo el principio de <strong>Privacidad por Diseño (Privacy by Design)</strong>. SISMO LAB no solicita ni almacena datos sensibles, números de documento (DNI), direcciones físicas, números de teléfono ni datos bancarios de los estudiantes. El acceso se realiza mediante autenticación segura para guardar progreso y ranking.
              </>
            ) : (
              <>
                Built under strict <strong>Privacy by Design</strong> principles. SISMO LAB does not request or store sensitive personal data, national ID numbers, physical addresses, phone numbers or payment information.
              </>
            )}
          </p>
        </section>

        {/* Article 03 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-brand-yellow font-mono text-xs">03.</span>
            <h2>{language === 'es' ? 'Datos Técnicos y Finalidad Pedagógica' : 'Technical Data & Pedagogical Purpose'}</h2>
          </div>
          <ul className="pl-9 list-disc space-y-1 text-slate-300">
            <li><strong>{language === 'es' ? 'Puntajes y progreso de juego:' : 'Game scores and progress:'}</strong> {language === 'es' ? 'Puntos, nivel, misiones completadas, edad y respuestas para calcular el ranking escolar y diagnosticar conceptos a reforzar.' : 'Points, level, completed missions, age and answers to compute leaderboard ranks and diagnose learning areas.'}</li>
            <li><strong>{language === 'es' ? 'Autenticación Google OAuth:' : 'Google OAuth login:'}</strong> {language === 'es' ? 'Nombre público de perfil y correo para persistir el progreso de juego en la nube.' : 'Public display name and email to persist gameplay progress across devices.'}</li>
            <li><strong>{language === 'es' ? 'Almacenamiento Local (PWA Offline):' : 'Local Storage (Offline PWA):'}</strong> {language === 'es' ? 'La aplicación guarda configuraciones y caché para funcionar sin conexión a internet en escuelas o zonas rurales.' : 'The application caches assets locally so it can run fully offline in schools or remote rural areas.'}</li>
          </ul>
        </section>

        {/* Article 04 */}
        <section className="space-y-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-purple-300 font-mono text-xs">04.</span>
            <h2>{language === 'es' ? 'Cero Publicidad y Cero Venta de Datos' : 'Zero Ads & Zero Data Selling'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
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
        </section>

        {/* Article 05 */}
        <section className="space-y-3 pt-2">
          <div className="flex items-baseline gap-2 text-white font-black text-sm uppercase">
            <span className="text-brand-cyan font-mono text-xs">05.</span>
            <h2>{language === 'es' ? 'Ejercicio de Derechos y Contacto Oficial' : 'User Rights & Official Contact'}</h2>
          </div>
          <p className="pl-5 text-slate-300">
            {language === 'es' ? (
              <>
                En cumplimiento de la Ley 25.326 y las políticas de Google Play, cualquier usuario o tutor legal puede solicitar la supresión inmediata de sus registros y cuenta desde la app o a través de nuestra web dedicada de eliminación de datos.
              </>
            ) : (
              <>
                Under Argentine Law 25.326 and Google Play User Data policies, any user or legal guardian can delete their account instantly in-app or via our web deletion portal.
              </>
            )}
          </p>

          <div className="pl-5 pt-1">
            <a
              href="/delete-account.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-full bg-rose-950/60 border border-rose-500/40 hover:border-rose-400 text-[11px] font-bold text-rose-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-rose-400" />
              <span>{language === 'es' ? 'Portal Web de Eliminación de Cuenta y Datos →' : 'Web Account & Data Deletion Portal →'}</span>
            </a>
          </div>

          <div className="pl-5 flex flex-col sm:flex-row gap-2 pt-2">
            <a
              href="mailto:zioncode25@gmail.com"
              className="py-2.5 px-4 rounded-full bg-navy-900 border border-white/10 hover:border-brand-yellow flex items-center justify-between text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-yellow" />
                <span>zioncode25@gmail.com</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://zion-code.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan flex items-center justify-between text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
                <span>zion-code.vercel.app</span>
              </div>
            </a>
          </div>
        </section>

      </div>

      {/* Footer Return Button */}
      <div className="pt-10">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-full py-3.5 rounded-full bg-navy-900 border border-white/10 hover:border-brand-cyan text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:text-white active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>
      </div>

    </div>
  );
};
