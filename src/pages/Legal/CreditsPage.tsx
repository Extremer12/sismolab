import React from 'react';
import { ArrowLeft, Award, Building2, Code2, Users, School, ExternalLink, Mail, ShieldCheck, GraduationCap, Laptop, Sparkles } from 'lucide-react';
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
      icon: <GraduationCap className="w-5 h-5 text-brand-cyan" />
    },
    {
      name: 'Mauro Sebastián Figueroa',
      role: language === 'es' ? 'Contenidos & Asesoría Pedagógica' : 'Educational Content & Pedagogy',
      icon: <ShieldCheck className="w-5 h-5 text-brand-yellow" />
    },
    {
      name: 'María Eugenia Fernández',
      role: language === 'es' ? 'Difusión & Educación Comunitaria' : 'Community Outreach & Education',
      icon: <Users className="w-5 h-5 text-purple-300" />
    },
    {
      name: 'Cristian Bordon',
      role: language === 'es' ? 'Lead Software Engineer & Arquitecto' : 'Lead Software Engineer & Architect',
      icon: <Code2 className="w-5 h-5 text-brand-cyan" />
    },
  ];

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

        <div className="px-3.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-cyan/20">
          <Award className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'CRÉDITOS INSTITUCIONALES' : 'INSTITUTIONAL CREDITS'}</span>
        </div>
      </div>

      {/* Hero Header with Zion Code Logo */}
      <div className="text-center space-y-2 py-2">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-navy-900 via-navy-850 to-blue-950/80 p-2 mx-auto border-2 border-brand-cyan/40 shadow-[0_0_35px_rgba(0,184,255,0.3)] flex items-center justify-center">
          <img
            src="/images/logozioncode-sinfondo.png"
            alt="Zion Code"
            className="w-16 h-16 object-contain"
          />
        </div>

        <h1 className="font-black text-3xl text-white tracking-tight uppercase">
          SISMO <span className="text-brand-cyan">LAB</span>
        </h1>
        <p className="text-xs text-slate-300 font-medium max-w-md mx-auto">
          {language === 'es'
            ? 'Plataforma interactiva de prevención sísmica y autoprotección para la comunidad educativa.'
            : 'Interactive earthquake preparedness and safety platform for the educational community.'}
        </p>
      </div>

      {/* 1. Empresa de Desarrollo de Software: Zion Code */}
      <div className="sismo-card p-5 space-y-4 border-2 border-brand-cyan/50 bg-gradient-to-br from-navy-900 via-navy-950 to-blue-950/60 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-navy-900 border border-brand-cyan/40 flex items-center justify-center p-1.5 shadow-glow-cyan/30 shrink-0">
              <img
                src="/images/logozioncode-sinfondo.png"
                alt="Zion Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan block">
                {language === 'es' ? 'EMPRESA DE DESARROLLO DE SOFTWARE' : 'SOFTWARE DEVELOPMENT COMPANY'}
              </span>
              <h2 className="font-black text-2xl text-white tracking-wide">
                ZION CODE
              </h2>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'es'
            ? 'Empresa de ingeniería de software dedicada al desarrollo de soluciones tecnológicas interactivas, arquitecturas cloud seguras y experiencias gamificadas para la educación ciudadana y el aprendizaje digital.'
            : 'Software engineering company dedicated to interactive digital solutions, secure cloud architecture, and gamified civic education platforms.'}
        </p>

        {/* Links & Contact Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <a
            href="https://zion-code.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-navy-900/90 border border-brand-cyan/40 hover:border-brand-cyan flex items-center justify-between text-xs text-white transition-all group shadow-sm hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-brand-cyan" />
              <span className="font-bold">Sitio Web Oficial</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="mailto:zioncode25@gmail.com"
            className="p-3 rounded-xl bg-navy-900/90 border border-brand-yellow/40 hover:border-brand-yellow flex items-center justify-between text-xs text-white transition-all group shadow-sm hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-yellow" />
              <span className="font-bold">zioncode25@gmail.com</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-brand-yellow group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-slate-300 border-t border-white/10">
          <span className="text-slate-400">Lead Software Developer & Creador:</span>
          <span className="text-brand-cyan font-black text-xs">Cristian Bordon</span>
        </div>
      </div>

      {/* 2. Institución Educativa & Dirección */}
      <div className="sismo-card p-5 space-y-3 border-2 border-brand-gold/40 bg-gradient-to-br from-navy-900 via-navy-950 to-amber-950/30 shadow-xl">
        <div className="flex items-center gap-3 text-brand-yellow">
          <div className="w-11 h-11 rounded-2xl bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              {language === 'es' ? 'INSTITUCIÓN EDUCATIVA' : 'EDUCATIONAL INSTITUTION'}
            </span>
            <h2 className="font-black text-lg sm:text-xl text-white tracking-wide">
              ESCUELA POLICÍA FEDERAL ARGENTINA
            </h2>
          </div>
        </div>

        <div className="bg-navy-950/90 p-3.5 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">
            {language === 'es' ? 'Directora de la Institución:' : 'School Principal:'}
          </span>
          <span className="font-black text-brand-yellow text-sm">
            Vanessa Lewyle
          </span>
        </div>
      </div>

      {/* 3. Equipo de Colaboradores del Proyecto */}
      <div className="sismo-card p-5 space-y-3 border-white/15">
        <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
          <Users className="w-4 h-4 text-purple-300" />
          <h3>{language === 'es' ? 'Equipo de Colaboradores del Proyecto' : 'Project Collaborators & Team'}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {collaborators.map((collab) => (
            <div
              key={collab.name}
              className="bg-navy-900/90 p-3.5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-sm hover:border-brand-cyan/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                {collab.icon}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-xs text-white truncate">
                  {collab.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">
                  {collab.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Propósito Pedagógico y Presentación Institucional */}
      <div className="sismo-card p-4 space-y-2 border-brand-cyan/25">
        <div className="flex items-center gap-2 text-brand-cyan font-black text-xs uppercase">
          <Building2 className="w-4 h-4" />
          <span>{language === 'es' ? 'Propósito del Proyecto' : 'Project Purpose'}</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {language === 'es'
            ? 'SISMO LAB es una iniciativa de innovación pedagógica diseñada y desarrollada para ser presentada ante autoridades ministeriales y educativas de San Juan, como una herramienta digital lúdica para fortalecer la cultura de autoprotección y resiliencia sísmica escolar.'
            : 'SISMO LAB is a pedagogical innovation initiative developed for presentation before educational and ministerial authorities in San Juan, serving as a gamified digital tool to strengthen school earthquake safety and preparedness.'}
        </p>
      </div>

      {/* Back button */}
      <div className="pt-2">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-full py-3 rounded-2xl bg-navy-900 border border-brand-cyan/40 text-brand-cyan font-bold text-xs uppercase tracking-wider hover:bg-navy-850 transition-all text-center flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>
      </div>
    </div>
  );
};
