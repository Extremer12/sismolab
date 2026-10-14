import React from 'react';
import { ArrowLeft, ExternalLink, Mail, Code2, Sparkles, Database, ShieldCheck, Cpu } from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';

interface CreditsPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CreditsPage: React.FC<CreditsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const es = language === 'es';

  const projectSpecs = [
    {
      label: es ? 'Autor, Diseño e Ingeniería:' : 'Author, Design & Engineering:',
      value: 'Cristian Bordón',
      sub: 'Zion Code',
    },
    {
      label: es ? 'Iniciativa & Titularidad:' : 'Initiative & Ownership:',
      value: 'Zion Code · San Juan',
      sub: es ? 'Software Educativo Independiente' : 'Independent Educational Software',
    },
    {
      label: es ? 'Fuentes Sismológicas:' : 'Seismic Data Sources:',
      value: 'INPRES · EMSC · USGS',
      sub: es ? 'Datos científicos y abiertos de libre consulta' : 'Public & open scientific earthquake records',
    },
    {
      label: es ? 'Tecnologías Centrales:' : 'Core Technologies:',
      value: 'React · TypeScript · Leaflet · PWA / TWA',
      sub: 'Vite · Tailwind CSS · Offline First',
    },
  ];

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
          {es ? 'CRÉDITOS Y AUTORÍA' : 'CREDITS & AUTHORSHIP'}
        </span>

        <div className="w-10" />
      </div>

      {/* 2. Hero Editorial Section */}
      <header className="relative pt-6 pb-4 space-y-4 animate-editorial-1 text-left">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-navy-900 border border-brand-cyan/30 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,184,255,0.25)]">
            <img
              src="/images/logozioncode-sinfondo.png"
              alt="Zion Code"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">
              SOFTWARE EDUCATIVO · SAN JUAN, ARGENTINA
            </span>
            <h1 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
              SISMO <span className="text-brand-cyan">LAB</span>
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
          {es
            ? 'Plataforma digital interactiva de ciencia, monitoreo sísmico en tiempo real y autoprotección ciudadana creada y desarrollada en la Provincia de San Juan.'
            : 'Interactive digital platform for earthquake science, real-time seismic monitoring, and citizen self-protection built in San Juan, Argentina.'}
        </p>

        <div className="editorial-divider" />
      </header>

      {/* 3. Section 01: Autoría & Desarrollo Oficial */}
      <section className="space-y-4 pt-4 animate-editorial-2">
        <div className="flex items-baseline justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan block">
              01 · AUTORÍA & INGENIERÍA
            </span>
            <h2 className="font-black text-2xl text-white tracking-tight">
              Cristian Bordón
            </h2>
          </div>
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
            Zion Code
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {es
            ? 'Idea original, diseño integral de experiencia de usuario (UI/UX), arquitectura de software, gamificación educativa y conexión en tiempo real con sistemas sismológicos.'
            : 'Original concept, end-to-end UI/UX design, software architecture, educational gamification, and real-time seismic monitoring integration.'}
        </p>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a
            href="https://zion-code.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-full bg-navy-900 border border-brand-cyan/40 hover:border-brand-cyan flex items-center justify-between text-xs text-white transition-all hover:bg-navy-850 group active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-cyan" />
              <span className="font-bold">zion-code.vercel.app</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="mailto:zioncode25@gmail.com"
            className="flex-1 py-3 px-4 rounded-full bg-navy-900 border border-brand-yellow/40 hover:border-brand-yellow flex items-center justify-between text-xs text-white transition-all hover:bg-navy-850 group active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-yellow" />
              <span className="font-bold">zioncode25@gmail.com</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-brand-yellow group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>

      {/* 4. Section 02: Ficha Técnica y Titularidad */}
      <section className="space-y-3 pt-6 animate-editorial-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
            02 · FICHA TÉCNICA Y RECURSOS
          </span>
          <h2 className="font-black text-xl text-white tracking-tight">
            {es ? 'Especificaciones del Proyecto' : 'Project Specifications'}
          </h2>
        </div>

        <div className="divide-y divide-white/5 bg-navy-900/60 rounded-2xl border border-white/10 p-3 sm:p-4">
          {projectSpecs.map((spec) => (
            <div key={spec.label} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-xs text-slate-400 font-medium">{spec.label}</span>
              <div className="text-left sm:text-right">
                <span className="font-black text-sm text-white block">{spec.value}</span>
                <span className="text-[11px] text-slate-400 block">{spec.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Section 03: Fuentes Científicas y Datos Abiertos */}
      <section className="space-y-3 pt-6 animate-editorial-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 block">
            03 · FUENTES CIENTÍFICAS
          </span>
          <h2 className="font-black text-xl text-white tracking-tight">
            {es ? 'Datos Abiertos y Protocolos' : 'Open Data & Scientific Protocols'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-navy-900/60 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-brand-cyan font-bold text-xs">
              <Database className="w-4 h-4" />
              <span>INPRES / EMSC / CSN</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {es
                ? 'Monitoreo sísmico en base a registros públicos del Instituto Nacional de Prevención Sísmica y agencias sismológicas sudamericanas.'
                : 'Seismic monitoring based on public records from the National Institute of Seismic Prevention and South American seismic agencies.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-navy-900/60 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>{es ? 'Protección Civil' : 'Civil Protection'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {es
                ? 'Pautas de autoprotección, zonas seguras y armado de mochila de emergencia conformes a las recomendaciones oficiales de seguridad.'
                : 'Self-protection guidelines, safe zones, and emergency kit contents following official civil protection safety recommendations.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Section 04: Propósito del Proyecto */}
      <section className="space-y-2 pt-6 pb-4">
        <div className="border-l-2 border-brand-cyan pl-4 py-1 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan block">
            {es ? 'PROPÓSITO & ALCANCE' : 'PURPOSE & SCOPE'}
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {es
              ? 'SISMO LAB es una iniciativa de software cívico y divulgación científica independiente de Zion Code para la comunidad de San Juan, Argentina y la región de Cuyo, diseñada para fortalecer la cultura de prevención sísmica a través de la tecnología interactiva y el aprendizaje gamificado.'
              : 'SISMO LAB is an independent civic software and scientific outreach initiative by Zion Code for the community of San Juan, Argentina, and Cuyo, designed to strengthen seismic preparedness through interactive technology.'}
          </p>
        </div>
      </section>

      {/* 7. Footer Return Button */}
      <div className="pt-6">
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
