import React, { useState } from 'react';
import { ArrowLeft, Users, Gamepad2, Award, BarChart3, PieChart, ShieldAlert, Sparkles, Download, Check } from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../../components/ui/Button';
import { sound } from '../../lib/sound';

interface AdminDashboardPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [demoMode, setDemoMode] = useState(true);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    sound.playClick();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 pb-28 max-w-lg mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>INPRES · PANEL ADMINISTRATIVO</span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-black text-2xl text-white tracking-tight uppercase">
          MÉTRICAS DE LA FERIA
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          Monitoreo en tiempo real del impacto educativo en el stand INPRES San Juan.
        </p>
      </div>

      {/* 4 Big Stat Cards (Section 30) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="sismo-card p-4 space-y-1 border-brand-cyan/30">
          <div className="flex items-center justify-between text-brand-cyan">
            <span className="text-[10px] font-black uppercase tracking-wider">Participantes</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="font-black text-3xl text-white">428</div>
          <span className="text-[10px] text-accent-success font-bold">+18 en la última hora</span>
        </div>

        <div className="sismo-card p-4 space-y-1 border-brand-blue/30">
          <div className="flex items-center justify-between text-brand-electric">
            <span className="text-[10px] font-black uppercase tracking-wider">Partidas</span>
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div className="font-black text-3xl text-white">1.284</div>
          <span className="text-[10px] text-brand-cyan font-bold">~3.0 partidas por usuario</span>
        </div>

        <div className="sismo-card p-4 space-y-1 border-brand-gold/30">
          <div className="flex items-center justify-between text-brand-yellow">
            <span className="text-[10px] font-black uppercase tracking-wider">Puntaje Promedio</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="font-black text-3xl text-brand-yellow">1.740</div>
          <span className="text-[10px] text-accent-gray font-semibold">pts por sesión</span>
        </div>

        <div className="sismo-card p-4 space-y-1 border-brand-purple/30">
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-[10px] font-black uppercase tracking-wider">Distribución</span>
            <PieChart className="w-4 h-4" />
          </div>
          <div className="font-black text-xl text-white flex items-center gap-1.5 pt-1">
            <span className="text-brand-cyan">61% 🧒</span>
            <span className="text-slate-500">/</span>
            <span className="text-purple-300">39% 🔬</span>
          </div>
          <span className="text-[10px] text-accent-gray font-semibold">Niños vs Adultos</span>
        </div>
      </div>

      {/* Popular Games Breakdown */}
      <div className="sismo-card p-4 space-y-3 border-white/10">
        <h3 className="font-black text-xs text-white uppercase tracking-wider">
          Juegos Más Populares del Stand
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-200 pb-1">
              <span>🎒 Kit de Emergencia 72h</span>
              <span className="text-brand-cyan">412 partidas (32%)</span>
            </div>
            <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
              <div className="h-full bg-brand-cyan rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-200 pb-1">
              <span>🏠 Casa Segura (Riesgos)</span>
              <span className="text-brand-electric">345 partidas (27%)</span>
            </div>
            <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
              <div className="h-full bg-brand-electric rounded-full" style={{ width: '27%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-200 pb-1">
              <span>⚡ ¿Qué es un sismo?</span>
              <span className="text-purple-400">298 partidas (23%)</span>
            </div>
            <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
              <div className="h-full bg-brand-purple rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Metric: Questions with highest error rate */}
      <div className="sismo-card p-4 space-y-2.5 border-accent-error/30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent-error" />
          <h3 className="font-black text-xs text-white uppercase tracking-wider">
            Conceptos a Reforzar (Mayor Tasa de Error)
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="bg-navy-950 p-2.5 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Ubicación segura (Mito del marco de puerta)</span>
              <span className="text-accent-error font-black">48% error</span>
            </div>
            <p className="text-[11px] text-accent-gray font-normal">
              Muchos usuarios aún eligen el marco en lugar de cubrirse bajo mesa firme.
            </p>
          </div>

          <div className="bg-navy-950 p-2.5 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Elementos no esenciales en mochila</span>
              <span className="text-brand-yellow font-black">34% error</span>
            </div>
            <p className="text-[11px] text-accent-gray font-normal">
              Inclusión frecuente de velas (peligro por fugas de gas).
            </p>
          </div>
        </div>
      </div>

      {/* Export & Controls */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={exportSuccess ? <Check className="w-4 h-4 text-accent-success" /> : <Download className="w-4 h-4" />}
          onClick={handleExportData}
        >
          <span>{exportSuccess ? '¡Datos Exportados (CSV)!' : 'Exportar Métricas INPRES'}</span>
        </Button>
      </div>
    </div>
  );
};
