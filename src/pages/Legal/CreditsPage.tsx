import React from 'react';
import { ArrowLeft, Award, Building2, Code2, Users, School, Sparkles } from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../lib/sound';

interface CreditsPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CreditsPage: React.FC<CreditsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const collaborators = [
    { name: 'Karina Noemí Pedrozo', role: language === 'es' ? 'Colaboradora de Proyecto & Coordinación' : 'Project Collaborator & Coordinator', icon: '👩‍🏫' },
    { name: 'Mauro Sebastián Figueroa', role: language === 'es' ? 'Colaborador Pedagógico & Contenidos' : 'Pedagogical Content Collaborator', icon: '👨‍🏫' },
    { name: 'María Eugenia Fernández', role: language === 'es' ? 'Colaboradora en Educación & Difusión' : 'Educational Outreach Collaborator', icon: '👩‍🔬' },
    { name: 'Cristian Bordon', role: language === 'es' ? 'Creador, Arquitecto & Lead Developer' : 'Creator, Architect & Lead Developer', icon: '💻' },
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

        <div className="px-3.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'CRÉDITOS OFICIALES' : 'OFFICIAL CREDITS'}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-1.5 py-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-electric via-brand-cyan to-brand-purple p-0.5 mx-auto shadow-glow-cyan mb-2">
          <div className="w-full h-full rounded-2xl bg-navy-900 flex items-center justify-center text-3xl">
            🏛️
          </div>
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
      <div className="sismo-card p-5 space-y-3 border-2 border-brand-cyan/40 bg-gradient-to-br from-navy-900 via-navy-950 to-blue-950/40 shadow-xl">
        <div className="flex items-center gap-2.5 text-brand-cyan">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/50 flex items-center justify-center text-white">
            <Code2 className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              {language === 'es' ? 'EMPRESA DE DESARROLLO DE SOFTWARE' : 'SOFTWARE DEVELOPMENT COMPANY'}
            </span>
            <h2 className="font-black text-xl text-white tracking-wide">
              ZION CODE
            </h2>
          </div>
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'es'
            ? 'Ingeniería de software, diseño interactivo gamificado, arquitectura cloud PWA y desarrollo tecnológico de vanguardia aplicado a la educación ciudadana y la prevención de riesgos.'
            : 'Software engineering, gamified interactive design, cloud PWA architecture, and advanced educational technology for civic risk prevention.'}
        </p>

        <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-brand-yellow border-t border-white/10">
          <span>{language === 'es' ? 'Lead Software Engineer:' : 'Lead Software Engineer:'}</span>
          <span className="text-white font-black text-xs">Cristian Bordon</span>
        </div>
      </div>

      {/* 2. Institución Educativa & Dirección */}
      <div className="sismo-card p-5 space-y-3 border-2 border-brand-gold/40 bg-gradient-to-br from-navy-900 via-navy-950 to-amber-950/30 shadow-xl">
        <div className="flex items-center gap-2.5 text-brand-yellow">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-white">
            <School className="w-5 h-5 text-brand-gold" />
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

        <div className="bg-navy-950/80 p-3 rounded-xl border border-white/10 space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              {language === 'es' ? 'Directora de la Institución:' : 'School Principal:'}
            </span>
            <span className="font-black text-brand-yellow text-sm">
              Vanessa Lewyle
            </span>
          </div>
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
              className="bg-navy-900/90 p-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-sm hover:border-brand-cyan/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center text-2xl shrink-0 border border-white/5">
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

      {/* 4. Marco Científico e Institucional */}
      <div className="sismo-card p-4 space-y-2 border-brand-cyan/25">
        <div className="flex items-center gap-2 text-brand-cyan font-black text-xs uppercase">
          <Building2 className="w-4 h-4" />
          <span>{language === 'es' ? 'Marco Científico & Articulación Pública' : 'Scientific Framework & Public Governance'}</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {language === 'es'
            ? 'Los contenidos, normativas constructivas y directivas de autoprotección se encuentran fundamentados en las investigaciones oficiales del INPRES (Instituto Nacional de Prevención Sísmica) y alineados a los programas de prevención del Ministerio de Educación.'
            : 'Content, building regulations, and safety protocols are based on official research from INPRES (National Institute for Seismic Prevention) and aligned with Ministry of Education programs.'}
        </p>
      </div>

      {/* Back button */}
      <div className="pt-2">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-full py-3 rounded-2xl bg-navy-900 border border-brand-purple/40 text-purple-300 font-bold text-xs uppercase tracking-wider hover:bg-navy-850 transition-all text-center flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>
      </div>
    </div>
  );
};
