import React from 'react';
import { ArrowLeft, ExternalLink, Mail, Code2, School, Users, Sparkles, ChevronRight } from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';

interface CreditsPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CreditsPage: React.FC<CreditsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const collaborators = [
    {
      name: 'Karina Noemí Pedrozo',
      role: language === 'es' ? 'Coordinación & Gestión de Proyecto' : 'Project Coordination & Management',
      tag: 'Coordinación'
    },
    {
      name: 'Mauro Sebastián Figueroa',
      role: language === 'es' ? 'Contenidos & Asesoría Pedagógica' : 'Educational Content & Pedagogy',
      tag: 'Pedagogía'
    },
    {
      name: 'María Eugenia Fernández',
      role: language === 'es' ? 'Difusión & Educación Comunitaria' : 'Community Outreach & Education',
      tag: 'Difusión'
    },
    {
      name: 'Cristian Bordon',
      role: language === 'es' ? 'Lead Software Engineer & Arquitecto' : 'Lead Software Engineer & Architect',
      tag: 'Zion Code'
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
          {language === 'es' ? 'CRÉDITOS INSTITUCIONALES' : 'INSTITUTIONAL CREDITS'}
        </span>

        <div className="w-10" />
      </div>

      {/* 2. Hero Editorial Section with Ambient Glow */}
      <header className="relative pt-6 pb-4 space-y-4 animate-editorial-1 text-left">
        {/* Subtle Ambient Light (No Box, pure atmospheric glow) */}
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
              SOFTWARE EDUCATIVO · SAN JUAN
            </span>
            <h1 className="font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
              SISMO <span className="text-brand-cyan">LAB</span>
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
          {language === 'es'
            ? 'Plataforma digital interactiva de ciencia, autoprotección y prevención sísmica creada para fomentar la resiliencia en la comunidad escolar.'
            : 'Interactive digital platform for earthquake science, self-protection, and resilience built for the school community.'}
        </p>

        <div className="editorial-divider" />
      </header>

      {/* 3. Section 01: Zion Code (Ingeniería de Software) - Editorial Spatial Layout */}
      <section className="space-y-4 pt-4 animate-editorial-2">
        <div className="flex items-baseline justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan block">
              01 · INGENIERÍA & DESARROLLO
            </span>
            <h2 className="font-black text-2xl text-white tracking-tight">
              Zion Code
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Empresa de Software
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'es'
            ? 'Empresa de ingeniería de software especializada en el diseño de arquitecturas digitales interactivas, interfaces gamificadas fluidas y tecnologías cloud seguras orientadas al impacto social y la educación ciudadana.'
            : 'Software engineering company specialized in interactive digital architecture, gamified fluid interfaces, and civic education technology.'}
        </p>

        {/* Action Links (Clean Pill style, no nested cards) */}
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

        <div className="flex items-center justify-between pt-2 text-xs border-b border-white/5 pb-4">
          <span className="text-slate-400 font-medium">Lead Software Developer & Creador:</span>
          <span className="font-black text-brand-cyan">Cristian Bordon</span>
        </div>
      </section>

      {/* 4. Section 02: Institución Educativa */}
      <section className="space-y-3 pt-6 animate-editorial-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
            02 · INSTITUCIÓN EDUCATIVA
          </span>
          <h2 className="font-black text-2xl text-white tracking-tight uppercase">
            Escuela Policía Federal Argentina
          </h2>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-900/60 border border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <School className="w-4 h-4 text-brand-gold" />
            <span className="text-slate-300 font-medium">{language === 'es' ? 'Dirección Institucional:' : 'Principal:'}</span>
          </div>
          <span className="font-black text-brand-yellow text-sm">Vanessa Lewyle</span>
        </div>

        <div className="editorial-divider-gold mt-4" />
      </section>

      {/* 5. Section 03: Equipo de Colaboradores (Timeline Stream Layout) */}
      <section className="space-y-4 pt-6 animate-editorial-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 block">
            03 · EQUIPO Y COLABORADORES
          </span>
          <h2 className="font-black text-xl text-white tracking-tight">
            {language === 'es' ? 'Colaboradores del Proyecto' : 'Project Collaborators'}
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {collaborators.map((collab, idx) => (
            <div
              key={collab.name}
              className="py-3.5 flex items-center justify-between group hover:pl-1 transition-all"
            >
              <div className="space-y-0.5">
                <h3 className="font-black text-sm text-white group-hover:text-brand-cyan transition-colors">
                  {collab.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {collab.role}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-navy-900 border border-white/10 text-slate-300">
                {collab.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Section 04: Propósito del Proyecto (Minimal Quote Layout) */}
      <section className="space-y-2 pt-6 pb-4">
        <div className="border-l-2 border-brand-cyan pl-4 py-1 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan block">
            PROPÓSITO & ALCANCE
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {language === 'es'
              ? 'SISMO LAB fue concebida y desarrollada como una propuesta de innovación pedagógica para ser presentada ante autoridades ministeriales y educativas de San Juan, con la meta de llevar a las escuelas una herramienta interactiva, medible y accesible que prepare a las futuras generaciones.'
              : 'SISMO LAB was engineered as a pedagogical innovation proposal for educational and civil authorities in San Juan, aimed at delivering interactive and measurable safety tools to school classrooms.'}
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
