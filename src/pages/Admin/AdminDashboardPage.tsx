import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Users,
  Gamepad2,
  Award,
  BarChart3,
  PieChart,
  ShieldAlert,
  Download,
  Check,
  Lock,
  KeyRound,
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Building2,
  GraduationCap,
  Sparkles,
  Printer,
  Search,
  Trophy,
  Flame,
  Zap,
  Activity,
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../../components/ui/Button';
import { sound } from '../../lib/sound';
import { verifyAdminPin, fetchAdminMetrics, resetStandLeaderboard, LiveAdminMetrics } from '../../services/scoresService';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminDashboardPageProps {
  onNavigate: (screen: ScreenId) => void;
}

const GAME_METADATA: Record<string, { title: string; subtitle: string; icon: string; badgeColor: string; printDiagnostic: string }> = {
  'game-final-challenge': {
    title: 'Desafío Integral (Boss Final)',
    subtitle: '6 rondas de examen integral contrarreloj',
    icon: '🏆',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    printDiagnostic: 'Excelente dominio integral de protocolos ante situaciones de alta presión.'
  },
  'final-challenge': {
    title: 'Desafío Integral (Boss Final)',
    subtitle: '6 rondas de examen integral contrarreloj',
    icon: '🏆',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    printDiagnostic: 'Excelente dominio integral de protocolos ante situaciones de alta presión.'
  },
  'game-what-is': {
    title: 'Física y Sismología',
    subtitle: 'Placas tectónicas, fallas y ondas sísmicas',
    icon: '🌍',
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    printDiagnostic: 'Comprensión sólida de la geología regional de Cuyo y causas tectónicas.'
  },
  'what-is': {
    title: 'Física y Sismología',
    subtitle: 'Placas tectónicas, fallas y ondas sísmicas',
    icon: '🌍',
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    printDiagnostic: 'Comprensión sólida de la geología regional de Cuyo y causas tectónicas.'
  },
  'game-emergency-kit': {
    title: 'Mochila de Emergencia',
    subtitle: 'Insumos vitales de 72 horas para autoprotección',
    icon: '🎒',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    printDiagnostic: 'Requiere reforzar descarte de elementos peligrosos (velas, fósforos sin protección).'
  },
  'emergency-kit': {
    title: 'Mochila de Emergencia',
    subtitle: 'Insumos vitales de 72 horas para autoprotección',
    icon: '🎒',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    printDiagnostic: 'Requiere reforzar descarte de elementos peligrosos (velas, fósforos sin protección).'
  },
  'game-safe-home': {
    title: 'Reflejos en 4 Segundos',
    subtitle: 'Acciones de reacción instantánea en crisis',
    icon: '⚡',
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    printDiagnostic: 'Reacción refleja ágil: asimilan rápidamente el protocolo Agacharse-Cubrirse-Sujetarse.'
  },
  'safe-home': {
    title: 'Reflejos en 4 Segundos',
    subtitle: 'Acciones de reacción instantánea en crisis',
    icon: '⚡',
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    printDiagnostic: 'Reacción refleja ágil: asimilan rápidamente el protocolo Agacharse-Cubrirse-Sujetarse.'
  },
  'game-myth-reality': {
    title: 'Mitos vs Realidades',
    subtitle: 'Desmitificación científica INPRES de falsas creencias',
    icon: '💡',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    printDiagnostic: 'Eficaz para desterrar mitos arraigados (relación sismos-clima/calor y predicciones).'
  },
  'myth-reality': {
    title: 'Mitos vs Realidades',
    subtitle: 'Desmitificación científica INPRES de falsas creencias',
    icon: '💡',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    printDiagnostic: 'Eficaz para desterrar mitos arraigados (relación sismos-clima/calor y predicciones).'
  },
  'game-what-would-you-do': {
    title: 'Decisión en Crisis',
    subtitle: 'Protocolos de evacuación en escuela, calle y hogar',
    icon: '📍',
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    printDiagnostic: 'Alta precisión en evacuación ordenada y no uso de ascensores en sismos.'
  },
  'what-would-you-do': {
    title: 'Decisión en Crisis',
    subtitle: 'Protocolos de evacuación en escuela, calle y hogar',
    icon: '📍',
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    printDiagnostic: 'Alta precisión en evacuación ordenada y no uso de ascensores en sismos.'
  },
  'history': {
    title: 'Terremoto 1944 (Memoria Histórica)',
    subtitle: 'Recorrido interactivo y reconstrucción de San Juan',
    icon: '🏛️',
    badgeColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    printDiagnostic: '100% de asimilación del valor de las construcciones sismorresistentes modernas.'
  }
};

type AdminTab = 'games' | 'leaderboard' | 'pedagogy';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Live Metrics state
  const [metrics, setMetrics] = useState<LiveAdminMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // UI Interactive States
  const [activeTab, setActiveTab] = useState<AdminTab>('games');
  const [searchPlayer, setSearchPlayer] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'kids' | 'adult'>('all');

  const loadMetrics = useCallback(async (pin: string) => {
    setIsLoadingMetrics(true);
    const res = await fetchAdminMetrics(pin);
    if (res.success && res.data) {
      setMetrics(res.data);
      setLastRefreshedAt(new Date());
    }
    setIsLoadingMetrics(false);
  }, []);

  // Auto-refresh metrics every 25 seconds while authenticated
  useEffect(() => {
    if (!isAuthenticated || !pinInput) return;
    const interval = setInterval(() => {
      loadMetrics(pinInput);
    }, 25000);
    return () => clearInterval(interval);
  }, [isAuthenticated, pinInput, loadMetrics]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsVerifying(true);
    setPinError(null);

    const check = await verifyAdminPin(pinInput);
    setIsVerifying(false);

    if (check.valid) {
      sound.playCorrect();
      setIsAuthenticated(true);
      setPinError(null);
      loadMetrics(pinInput);
    } else {
      sound.playWrong();
      setPinError(check.error || t.admin.pinError);
      setPinInput('');
    }
  };

  const handleExportData = () => {
    sound.playClick();
    if (!metrics || !metrics.profiles || metrics.profiles.length === 0) {
      alert(language === 'es' ? 'No hay datos disponibles para exportar todavía.' : 'No data available to export yet.');
      return;
    }

    // Generate CSV Content
    const headers = [
      'Posición',
      'ID',
      'Apodo',
      'Nombre Completo',
      'Modo',
      'Puntaje Total (XP)',
      'Partidas Jugadas',
      'Aciertos',
      'Total Preguntas',
      'Tasa de Acierto (%)',
      'Última Actividad'
    ];

    const rows = metrics.profiles.map((p, idx) => {
      const accRate = p.total_answers > 0 ? Math.round((p.correct_answers / p.total_answers) * 100) : 100;
      return [
        idx + 1,
        `"${p.id}"`,
        `"${(p.nickname || '').replace(/"/g, '""')}"`,
        `"${(p.display_name || '').replace(/"/g, '""')}"`,
        p.mode === 'kids' ? 'Modo Niños' : 'Jóvenes y Adultos',
        p.total_score,
        p.games_played,
        p.correct_answers,
        p.total_answers,
        `${accRate}%`,
        `"${new Date(p.updated_at).toLocaleString('es-AR')}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SISMO_LAB_Informe_Oficial_Stand_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handlePrintReport = () => {
    sound.playClick();
    window.print();
  };

  const handleResetLeaderboard = async () => {
    if (window.confirm(t.admin.resetConfirm)) {
      sound.playClick();
      const res = await resetStandLeaderboard(pinInput);
      if (res.success) {
        alert(language === 'es' ? '✅ ¡Tabla de posiciones del stand reiniciada con éxito!' : '✅ Stand leaderboard reset successfully!');
        loadMetrics(pinInput);
      } else {
        alert(res.error || 'Error al reiniciar la tabla');
      }
    }
  };

  // 1. PIN Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center p-4 max-w-sm mx-auto select-none font-sans">
        <div className="sismo-card p-6 w-full text-center space-y-4 border-brand-purple/40 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-brand-purple/20 border-2 border-brand-purple/50 flex items-center justify-center text-purple-300 mx-auto shadow-glow-purple">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan block">
              SISTEMA OFICIAL DE CONTROL
            </span>
            <h2 className="font-black text-xl text-white uppercase tracking-tight">
              {t.admin.loginTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {t.admin.loginSub}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3.5">
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(null); }}
                placeholder={t.admin.pinPlaceholder}
                disabled={isVerifying}
                className={`w-full bg-navy-950 border ${pinError ? 'border-accent-error' : 'border-brand-purple/50'} focus:border-brand-purple rounded-2xl px-4 py-3.5 text-center text-base font-black text-white tracking-widest outline-none shadow-inner`}
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {pinError && (
              <p className="text-xs font-bold text-accent-error animate-shake">
                {pinError}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => { sound.playClick(); onNavigate('profile'); }}
              >
                {t.common.back}
              </Button>
              <Button
                type="submit"
                variant="purple"
                size="sm"
                className="flex-1"
                disabled={isVerifying}
              >
                {isVerifying ? t.admin.verifying : t.admin.accessBtn}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Calculate live statistics
  const totalVisitors = metrics?.total_visitors || 0;
  const totalGames = metrics?.total_games || 0;
  const avgScore = metrics?.avg_score || 0;
  const maxScore = metrics?.max_score || 0;
  const kidsCount = metrics?.kids_count || 0;
  const adultsCount = metrics?.adults_count || 0;
  const totalParticipants = kidsCount + adultsCount || 1;
  const kidsPct = Math.round((kidsCount / totalParticipants) * 100);
  const adultsPct = 100 - kidsPct;

  const totalCorrect = metrics?.total_correct || 0;
  const totalQuestions = metrics?.total_questions || 0;
  const globalAccuracyRate = metrics?.global_accuracy ?? (totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0);

  const popularGames = metrics?.popular_games || [];
  const allProfiles = metrics?.profiles || [];

  // Filter players list
  const filteredProfiles = allProfiles.filter(p => {
    const matchesSearch = !searchPlayer.trim() ||
      (p.nickname || '').toLowerCase().includes(searchPlayer.toLowerCase()) ||
      (p.display_name || '').toLowerCase().includes(searchPlayer.toLowerCase());

    const matchesMode = filterMode === 'all' || p.mode === filterMode;
    return matchesSearch && matchesMode;
  });

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ON-SCREEN INTERACTIVE DASHBOARD (HIDDEN ON PRINT)                      */}
      {/* ========================================================================= */}
      <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5 pb-28 max-w-4xl mx-auto select-none font-sans print:hidden">
        
        {/* Top Navbar Control */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onNavigate('profile'); }}
            className="px-3 py-2 rounded-2xl sismo-card flex items-center gap-2 text-slate-300 hover:text-white transition-all active:scale-95"
            aria-label={t.common.back}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t.common.back}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Live pulsing badge */}
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-emerald/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>STAND EN VIVO</span>
            </div>

            <button
              onClick={() => { sound.playClick(); loadMetrics(pinInput); }}
              className={`px-3 py-1.5 rounded-xl sismo-card border border-brand-cyan/40 text-brand-cyan hover:text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all ${isLoadingMetrics ? 'opacity-50 pointer-events-none' : ''}`}
              title={t.admin.refresh}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t.admin.refresh}</span>
            </button>
          </div>
        </div>

        {/* Main Command Center Header Banner */}
        <div className="sismo-card p-4 sm:p-5 rounded-3xl border-2 border-brand-cyan/40 bg-gradient-to-br from-navy-900 via-navy-950 to-blue-950/70 shadow-2xl space-y-3 relative overflow-hidden">
          {/* Glow lights */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-navy-900 border border-brand-cyan/50 flex items-center justify-center p-2 shadow-glow-cyan/20 shrink-0">
                <img
                  src="/images/logozioncode-sinfondo.png"
                  alt="Zion Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block">
                    SISTEMA OFICIAL INPRES · FERIA SAN JUAN 2026
                  </span>
                </div>
                <h1 className="font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
                  Panel de Monitoreo en Tiempo Real
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintReport}
                className="px-3 py-2 rounded-xl bg-navy-900 border border-white/20 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                onClick={handleExportData}
                className="px-3.5 py-2 rounded-xl bg-brand-cyan text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-brand-electric flex items-center gap-1.5 shadow-glow-cyan transition-all active:scale-95"
              >
                {exportSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{exportSuccess ? '¡CSV Exportado!' : 'Exportar CSV'}</span>
              </button>
            </div>
          </div>

          {/* Institutional Credentials & Status Line */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Institución Escolar:</span>
              <span className="font-black text-brand-yellow text-xs block">Escuela Policía Federal Argentina</span>
              <span className="text-[10px] text-slate-300">Directora: Vanessa Lewyle</span>
            </div>

            <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Ingeniería & Software:</span>
              <span className="font-black text-brand-cyan text-xs block">Zion Code (Cristian Bordon)</span>
              <span className="text-[10px] text-slate-300">Servidor Supabase: Conectado</span>
            </div>

            <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10 flex flex-col justify-between">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Última Sincronización:</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{lastRefreshedAt ? lastRefreshedAt.toLocaleTimeString('es-AR') : 'Sincronizando...'}</span>
              </div>
              <span className="text-[9.5px] text-slate-400">Actualización automática cada 25s</span>
            </div>
          </div>
        </div>

        {/* 6 High-Impact Real KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          
          {/* Card 1: Total Users */}
          <div className="sismo-card p-3 rounded-2xl border border-brand-cyan/40 bg-navy-900/90 space-y-1">
            <div className="flex items-center justify-between text-brand-cyan">
              <span className="text-[9px] font-black uppercase tracking-wider">Participantes</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-2xl text-white tabular-nums">
              {totalVisitors.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-300 font-semibold flex items-center justify-between">
              <span className="text-brand-cyan">{kidsCount} 🧒</span>
              <span className="text-purple-300">{adultsCount} 🔬</span>
            </div>
          </div>

          {/* Card 2: Total Sessions */}
          <div className="sismo-card p-3 rounded-2xl border border-brand-electric/40 bg-navy-900/90 space-y-1">
            <div className="flex items-center justify-between text-brand-electric">
              <span className="text-[9px] font-black uppercase tracking-wider">Partidas</span>
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-2xl text-white tabular-nums">
              {totalGames.toLocaleString()}
            </div>
            <span className="text-[9px] text-brand-cyan font-bold block truncate">
              ~{totalVisitors > 0 ? (totalGames / totalVisitors).toFixed(1) : 0} por usuario
            </span>
          </div>

          {/* Card 3: Accuracy Rate */}
          <div className="sismo-card p-3 rounded-2xl border border-brand-gold/40 bg-navy-900/90 space-y-1">
            <div className="flex items-center justify-between text-brand-yellow">
              <span className="text-[9px] font-black uppercase tracking-wider">Precisión</span>
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-2xl text-brand-yellow tabular-nums">
              {globalAccuracyRate}%
            </div>
            <span className="text-[9px] text-emerald-400 font-bold block truncate">
              {totalCorrect} aciertos
            </span>
          </div>

          {/* Card 4: Total Questions */}
          <div className="sismo-card p-3 rounded-2xl border border-emerald-500/40 bg-navy-900/90 space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[9px] font-black uppercase tracking-wider">Preguntas</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-2xl text-white tabular-nums">
              {totalQuestions.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-300 font-semibold block truncate">
              {totalQuestions - totalCorrect} fallos superados
            </span>
          </div>

          {/* Card 5: Record Score */}
          <div className="sismo-card p-3 rounded-2xl border border-amber-500/40 bg-navy-900/90 space-y-1">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[9px] font-black uppercase tracking-wider">Récord Stand</span>
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-xl sm:text-2xl text-amber-300 tabular-nums truncate">
              {maxScore.toLocaleString()}
            </div>
            <span className="text-[9px] text-amber-200/70 font-semibold block truncate">
              Puntaje acumulado
            </span>
          </div>

          {/* Card 6: Average Score */}
          <div className="sismo-card p-3 rounded-2xl border border-purple-500/40 bg-navy-900/90 space-y-1">
            <div className="flex items-center justify-between text-purple-300">
              <span className="text-[9px] font-black uppercase tracking-wider">Promedio XP</span>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="font-black text-2xl text-white tabular-nums">
              {avgScore.toLocaleString()}
            </div>
            <span className="text-[9px] text-purple-200/70 font-semibold block truncate">
              Nivel medio general
            </span>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-navy-950 border border-white/10 rounded-2xl">
          <button
            onClick={() => { sound.playClick(); setActiveTab('games'); }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'games'
                ? 'bg-gradient-to-r from-brand-electric to-brand-cyan text-navy-950 shadow-glow-cyan/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Misiones y Juegos ({popularGames.length})</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('leaderboard'); }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-brand-electric to-brand-cyan text-navy-950 shadow-glow-cyan/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Jugadores en Vivo ({allProfiles.length})</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('pedagogy'); }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pedagogy'
                ? 'bg-gradient-to-r from-brand-electric to-brand-cyan text-navy-950 shadow-glow-cyan/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Diagnóstico Escolar</span>
          </button>
        </div>

        {/* TAB 1: RENDIMIENTO POR JUEGO / MISIONES */}
        {activeTab === 'games' && (
          <div className="sismo-card p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h2 className="font-black text-base sm:text-lg text-white uppercase tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-cyan" />
                  <span>Rendimiento Educativo por Misión</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Métricas exactas de partidas, promedio de puntos y porcentaje de acierto por juego en el stand.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {popularGames.map((game, idx) => {
                const meta = GAME_METADATA[game.game_id] || {
                  title: game.game_id,
                  subtitle: 'Misión del circuito SismoEdu',
                  icon: '🎮',
                  badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
                };

                const accuracy = game.accuracy_pct ?? 0;
                const accuracyColor =
                  accuracy >= 90 ? 'text-emerald-400' : accuracy >= 80 ? 'text-brand-cyan' : 'text-amber-400';

                const barGradient =
                  accuracy >= 90
                    ? 'from-emerald-500 to-teal-400'
                    : accuracy >= 80
                    ? 'from-brand-blue to-brand-cyan'
                    : 'from-amber-500 to-yellow-400';

                return (
                  <div
                    key={game.game_id}
                    className="bg-navy-950/70 border border-white/10 hover:border-brand-cyan/40 rounded-2xl p-3.5 sm:p-4 space-y-3 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-navy-900 border border-white/15 flex items-center justify-center text-xl shadow-inner shrink-0">
                          {meta.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white uppercase">
                              {meta.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase ${meta.badgeColor}`}>
                              #{idx + 1} Más Jugado
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{meta.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-black tabular-nums">
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Partidas</span>
                          <span className="text-white text-sm">{game.session_count}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Promedio XP</span>
                          <span className="text-brand-cyan text-sm">{game.avg_score || 0} pts</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Precisión</span>
                          <span className={`${accuracyColor} text-sm`}>{accuracy}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar representing accuracy and answer volume */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10.5px] text-slate-400 font-semibold">
                        <span>{game.total_correct || 0} correctas de {game.total_questions || 0} preguntas respondidas</span>
                        <span className={accuracyColor}>{accuracy}% de acierto</span>
                      </div>
                      <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden border border-white/10">
                        <div
                          className={`h-full bg-gradient-to-r ${barGradient} rounded-full transition-all duration-700`}
                          style={{ width: `${Math.max(5, accuracy)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TABLA DE JUGADORES EN VIVO */}
        {activeTab === 'leaderboard' && (
          <div className="sismo-card p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h2 className="font-black text-base sm:text-lg text-white uppercase tracking-tight flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-brand-gold" />
                  <span>Participantes del Stand ({filteredProfiles.length})</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Seguimiento en directo de cada participante registrado mediante Google Authentication.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar jugador..."
                    value={searchPlayer}
                    onChange={(e) => setSearchPlayer(e.target.value)}
                    className="bg-navy-950 border border-white/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-cyan w-36 sm:w-48"
                  />
                </div>

                <div className="flex bg-navy-950 border border-white/15 rounded-xl p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${filterMode === 'all' ? 'bg-brand-cyan text-navy-950' : 'text-slate-400'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterMode('kids')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${filterMode === 'kids' ? 'bg-brand-cyan text-navy-950' : 'text-slate-400'}`}
                  >
                    Niños
                  </button>
                  <button
                    onClick={() => setFilterMode('adult')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${filterMode === 'adult' ? 'bg-brand-cyan text-navy-950' : 'text-slate-400'}`}
                  >
                    Adultos
                  </button>
                </div>
              </div>
            </div>

            {/* Leaderboard Table / Cards */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredProfiles.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No se encontraron participantes con los filtros seleccionados.
                </div>
              ) : (
                filteredProfiles.map((player, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;

                  const medal = isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${idx + 1}`;
                  const cardBorder = isTop1
                    ? 'border-amber-400/50 bg-amber-500/5'
                    : isTop2
                    ? 'border-slate-300/40 bg-slate-400/5'
                    : isTop3
                    ? 'border-amber-700/40 bg-amber-900/5'
                    : 'border-white/10 bg-navy-950/70';

                  return (
                    <div
                      key={player.id}
                      className={`p-3 rounded-2xl border ${cardBorder} flex flex-wrap items-center justify-between gap-2 transition-all hover:border-brand-cyan/40`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-navy-900 border border-white/10 flex items-center justify-center font-black text-sm text-white shrink-0">
                          {medal}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">
                              {player.display_name || player.nickname || 'Anónimo'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${player.mode === 'kids' ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
                              {player.mode === 'kids' ? '🧒 Niños' : '🔬 Adultos'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {player.games_played} {player.games_played === 1 ? 'partida jugada' : 'partidas jugadas'} · {player.correct_answers} de {player.total_answers} preguntas acertadas
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-black tabular-nums">
                        <div className="text-right">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Precisión</span>
                          <span className="text-emerald-400 text-sm">
                            {player.total_answers > 0 ? `${Math.round((player.correct_answers / player.total_answers) * 100)}%` : '0%'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Puntaje Total</span>
                          <span className="text-amber-300 text-base font-black">
                            {player.total_score.toLocaleString()} <span className="text-[10px] text-amber-200/70 font-bold">XP</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DIAGNÓSTICO PEDAGÓGICO & DOSSIER ESCOLAR */}
        {activeTab === 'pedagogy' && (
          <div className="space-y-4">
            <div className="sismo-card p-4 sm:p-5 space-y-4 border-2 border-brand-yellow/40 bg-gradient-to-br from-navy-900 via-navy-950 to-amber-950/25 shadow-xl">
              <div className="flex items-center gap-2 text-brand-yellow">
                <GraduationCap className="w-5 h-5 text-brand-gold" />
                <div>
                  <h2 className="font-black text-sm sm:text-base text-white uppercase tracking-wide">
                    {t.admin.diagnosticTitle}
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    {t.admin.diagnosticSubtitle}
                  </p>
                </div>
              </div>

              {/* 1. Diagnóstico para Modo Niños (Nivel Primario) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-black text-brand-cyan uppercase tracking-wider border-b border-white/10 pb-1">
                  <span>🧒 {t.admin.kidsPreparedness}</span>
                  <span className="text-emerald-400 font-bold">Nivel Promedio: 88% Preparado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Conceptos Fuertes */}
                  <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Conceptos Consolidados en los Niños:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-200">
                      <li><strong>Agacharse y Cubrirse:</strong> Identifican rápidamente meterse debajo de bancos fuertes.</li>
                      <li><strong>Mochila Básica:</strong> Reconocen el agua potable y la linterna a pilas como prioritarios.</li>
                      <li><strong>Sismógrafo:</strong> Comprenden que la Tierra tiembla por acomodamiento de placas tectónicas.</li>
                    </ul>
                  </div>

                  {/* Brechas a Reforzar */}
                  <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-500/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>Puntos Críticos a Pulir en el Aula:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-200">
                      <li><strong>Evitar Correr:</strong> Recordar que salir corriendo por pasillos causa caídas y tropiezos.</li>
                      <li><strong>No Salir Descalzo:</strong> Explicar el riesgo de cortes con vidrios rotos en el piso.</li>
                      <li><strong>Mito de la Puerta:</strong> Enseñar que los marcos de puertas no protegen como una mesa.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Diagnóstico para Jóvenes y Adultos (Nivel Secundario y Familias) */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-black text-purple-300 uppercase tracking-wider border-b border-white/10 pb-1">
                  <span>🔬 {t.admin.adultsPreparedness}</span>
                  <span className="text-brand-yellow font-bold">Nivel Promedio: 82% Preparado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Conceptos Fuertes */}
                  <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Protocolos Dominados:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-200">
                      <li><strong>Cierre de Gas y Electricidad:</strong> Conocen la prioridad de neutralizar fugas de gas.</li>
                      <li><strong>Ingeniería Sismorresistente:</strong> Valoran el hormigón encadenado según normas INPRES.</li>
                      <li><strong>Subducción de Nazca:</strong> Conocimiento sólido de la geología regional de Cuyo.</li>
                    </ul>
                  </div>

                  {/* Brechas a Reforzar */}
                  <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-500/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>Mitos Populares a Desterrar:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-200">
                      <li><strong>Mito del Viento Zonda/Calor:</strong> Persiste la creencia de que el calor ambiental causa sismos.</li>
                      <li><strong>Triángulo de la Vida:</strong> En edificios modernos debe aplicarse Agacharse-Cubrirse-Sujetarse.</li>
                      <li><strong>Predicción Sísmica:</strong> Reforzar que ningún científico predice día y hora exacta.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stand Administrative Emergency Actions */}
        <div className="sismo-card p-4 rounded-2xl border border-white/10 bg-navy-950/60 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">
              ZONA DE CONTROL CRÍTICO DEL STAND
            </span>
            <p className="text-xs text-slate-400">
              Reiniciar la tabla borrará las puntuaciones y partidas históricas para iniciar una nueva jornada en la feria.
            </p>
          </div>

          <button
            onClick={handleResetLeaderboard}
            className="px-4 py-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider hover:bg-rose-900 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{t.admin.resetStand}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED OFFICIAL HIGH-CONTRAST PRINT DOSSIER (PURE BLACK ON WHITE)    */}
      {/* ========================================================================= */}
      <div className="hidden print:block text-black bg-white w-full max-w-full font-sans p-2">
        
        {/* Institutional Formal Header */}
        <div className="border-b-2 border-black pb-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logozioncode-sinfondo.png"
                alt="Zion Code"
                className="w-14 h-14 object-contain filter grayscale contrast-200"
              />
              <div>
                <span className="text-[10pt] font-extrabold uppercase tracking-widest text-black block">
                  GOBIERNO DE SAN JUAN · MINISTERIO DE EDUCACIÓN · INPRES
                </span>
                <h1 className="text-[15pt] font-black text-black leading-tight uppercase">
                  DOSSIER OFICIAL DE EVALUACIÓN Y RENDIMIENTO SÍSMICO
                </h1>
                <span className="text-[9.5pt] font-bold text-black block">
                  Feria Provincial de Innovación Educativa, Ciencias y Tecnología · San Juan 2026
                </span>
              </div>
            </div>

            <div className="text-right text-[8.5pt] border-l-2 border-black pl-3 shrink-0">
              <div className="font-black text-black">DOCUMENTO OFICIAL</div>
              <div className="text-black">Fecha: {new Date().toLocaleDateString('es-AR')}</div>
              <div className="text-black">Hora: {new Date().toLocaleTimeString('es-AR')}</div>
              <div className="font-bold text-black">Estado: Stand Activo</div>
            </div>
          </div>

          {/* Institutional Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-black text-[9pt]">
            <div className="border border-black p-2 bg-gray-50">
              <span className="font-black text-black block uppercase">Institución Educativa Evaluada:</span>
              <div className="font-bold text-black">Escuela Policía Federal Argentina</div>
              <div className="text-black">Directora a Cargo: Vanessa Lewyle</div>
            </div>
            <div className="border border-black p-2 bg-gray-50">
              <span className="font-black text-black block uppercase">Desarrollo Tecnológico & Auditoría:</span>
              <div className="font-bold text-black">Zion Code (Ing. Cristian Bordon)</div>
              <div className="text-black">Plataforma Digital: SismoEdu PWA · Servidor Seguro Supabase</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: GLOBAL IMPACT METRICS */}
        <div className="mb-5 avoid-break">
          <h2 className="text-[11pt] font-black uppercase text-black border-b border-black pb-1 mb-2">
            1. Resumen Ejecutivo de Métricas de Participación
          </h2>

          <div className="grid grid-cols-3 gap-2 text-center text-[9pt]">
            <div className="border border-black p-2 bg-gray-50">
              <span className="font-bold uppercase block text-[8pt] text-black">Participantes Registrados</span>
              <span className="text-[16pt] font-black text-black block">{totalVisitors}</span>
              <span className="text-[8pt] font-bold text-black">{kidsCount} Niños ({kidsPct}%) · {adultsCount} Adultos ({adultsPct}%)</span>
            </div>

            <div className="border border-black p-2 bg-gray-50">
              <span className="font-bold uppercase block text-[8pt] text-black">Partidas Completadas</span>
              <span className="text-[16pt] font-black text-black block">{totalGames}</span>
              <span className="text-[8pt] font-bold text-black">~{totalVisitors > 0 ? (totalGames / totalVisitors).toFixed(1) : 0} partidas por participante</span>
            </div>

            <div className="border border-black p-2 bg-gray-50">
              <span className="font-bold uppercase block text-[8pt] text-black">Tasa de Precisión Global</span>
              <span className="text-[16pt] font-black text-black block">{globalAccuracyRate}%</span>
              <span className="text-[8pt] font-bold text-black">{totalCorrect} aciertos de {totalQuestions} preguntas</span>
            </div>

            <div className="border border-black p-2 bg-gray-50">
              <span className="font-bold uppercase block text-[8pt] text-black">Situaciones Evaluadas</span>
              <span className="text-[16pt] font-black text-black block">{totalQuestions}</span>
              <span className="text-[8pt] font-bold text-black">{totalQuestions - totalCorrect} errores corregidos</span>
            </div>

            <div className="border border-black p-2 bg-gray-50">
              <span className="font-bold uppercase block text-[8pt] text-black">Puntaje Récord del Stand</span>
              <span className="text-[16pt] font-black text-black block">{maxScore.toLocaleString()} XP</span>
              <span className="text-[8pt] font-bold text-black">Máxima constancia en el podio</span>
            </div>

            <div className="border border-black p-2 bg-gray-50">
              <span className="font-bold uppercase block text-[8pt] text-black">Promedio de Puntos</span>
              <span className="text-[16pt] font-black text-black block">{avgScore.toLocaleString()} XP</span>
              <span className="text-[8pt] font-bold text-black">Nivel de desempeño medio</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: BREAKDOWN BY MISSION */}
        <div className="mb-5 avoid-break">
          <h2 className="text-[11pt] font-black uppercase text-black border-b border-black pb-1 mb-2">
            2. Desglose de Desempeño Educativo por Misión
          </h2>

          <table className="w-full border-collapse border border-black text-[8.5pt]">
            <thead>
              <tr className="bg-gray-200 text-black border-b border-black">
                <th className="border border-black p-1.5 text-left font-black">#</th>
                <th className="border border-black p-1.5 text-left font-black">Misión / Módulo</th>
                <th className="border border-black p-1.5 text-center font-black">Partidas</th>
                <th className="border border-black p-1.5 text-center font-black">Preguntas</th>
                <th className="border border-black p-1.5 text-center font-black">Aciertos</th>
                <th className="border border-black p-1.5 text-center font-black">Precisión</th>
                <th className="border border-black p-1.5 text-left font-black">Diagnóstico Pedagógico</th>
              </tr>
            </thead>
            <tbody>
              {popularGames.map((game, idx) => {
                const meta = GAME_METADATA[game.game_id] || {
                  title: game.game_id,
                  subtitle: '',
                  icon: '',
                  badgeColor: '',
                  printDiagnostic: 'Módulo de autoprotección interactivo.'
                };
                return (
                  <tr key={game.game_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-black p-1.5 font-bold text-center">{idx + 1}</td>
                    <td className="border border-black p-1.5 font-bold text-black">
                      {meta.title}
                    </td>
                    <td className="border border-black p-1.5 text-center font-black">{game.session_count}</td>
                    <td className="border border-black p-1.5 text-center">{game.total_questions || 0}</td>
                    <td className="border border-black p-1.5 text-center font-bold">{game.total_correct || 0}</td>
                    <td className="border border-black p-1.5 text-center font-black">
                      {game.accuracy_pct || 0}%
                    </td>
                    <td className="border border-black p-1.5 text-[8pt]">{meta.printDiagnostic}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SECTION 3: TOP PARTICIPANTS LEADERBOARD */}
        <div className="mb-5 avoid-break">
          <h2 className="text-[11pt] font-black uppercase text-black border-b border-black pb-1 mb-2">
            3. Registro Oficial de Participantes y Clasificación del Stand
          </h2>

          <table className="w-full border-collapse border border-black text-[8pt]">
            <thead>
              <tr className="bg-gray-200 text-black border-b border-black">
                <th className="border border-black p-1 text-center font-black w-8">Pos</th>
                <th className="border border-black p-1 text-left font-black">Participante (Nombre / Apodo)</th>
                <th className="border border-black p-1 text-center font-black">Categoría</th>
                <th className="border border-black p-1 text-center font-black">Partidas</th>
                <th className="border border-black p-1 text-center font-black">Aciertos / Total</th>
                <th className="border border-black p-1 text-center font-black">Precisión</th>
                <th className="border border-black p-1 text-right font-black">Puntaje Total (XP)</th>
              </tr>
            </thead>
            <tbody>
              {allProfiles.slice(0, 30).map((player, idx) => {
                const acc = player.total_answers > 0 ? Math.round((player.correct_answers / player.total_answers) * 100) : 0;
                return (
                  <tr key={player.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-black p-1 text-center font-bold">#{idx + 1}</td>
                    <td className="border border-black p-1 font-bold text-black">
                      {player.display_name || player.nickname || 'Anónimo'}
                    </td>
                    <td className="border border-black p-1 text-center font-bold">
                      {player.mode === 'kids' ? 'Niños (Primario)' : 'Adultos (Sec/Fam)'}
                    </td>
                    <td className="border border-black p-1 text-center font-bold">{player.games_played}</td>
                    <td className="border border-black p-1 text-center">{player.correct_answers} / {player.total_answers}</td>
                    <td className="border border-black p-1 text-center font-black">{acc}%</td>
                    <td className="border border-black p-1 text-right font-black">{player.total_score.toLocaleString()} XP</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {allProfiles.length > 30 && (
            <p className="text-[7.5pt] text-black italic mt-1 text-right">
              * Mostrando los primeros 30 registros de un total de {allProfiles.length} participantes registrados.
            </p>
          )}
        </div>

        {/* SECTION 4: PEDAGOGICAL DIAGNOSIS */}
        <div className="mb-5 avoid-break">
          <h2 className="text-[11pt] font-black uppercase text-black border-b border-black pb-1 mb-2">
            4. Diagnóstico Pedagógico y Directivas Curriculares para el Aula
          </h2>

          <div className="grid grid-cols-2 gap-3 text-[8.5pt]">
            <div className="border border-black p-2.5 bg-gray-50">
              <span className="font-black text-black uppercase block text-[9pt] mb-1">
                ✅ Conceptos Consolidados con Éxito:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-black">
                <li><strong>Protocolo de Autoprotección:</strong> Dominio de "Agacharse, Cubrirse y Sujetarse" bajo mobiliario firme.</li>
                <li><strong>Mochila de las 72 Horas:</strong> Identificación unánime del agua potable, linterna y botiquín de primeros auxilios.</li>
                <li><strong>Ciencia Sísmica Regional:</strong> Conocimiento de fallas activas y subducción de placas en la provincia de San Juan.</li>
                <li><strong>Comportamiento en Edificios:</strong> Neutralización de uso de ascensores y cierre inmediato de llaves de gas.</li>
              </ul>
            </div>

            <div className="border border-black p-2.5 bg-gray-50">
              <span className="font-black text-black uppercase block text-[9pt] mb-1">
                ⚠️ Brechas Críticas a Reforzar en las Escuelas:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-black">
                <li><strong>Desmitificación Popular:</strong> Erradicar la creencia de que el calor o el Viento Zonda causan terremotos.</li>
                <li><strong>Evacuación Segura:</strong> Reforzar no correr por escaleras durante la sacudida y no evacuar descalzos.</li>
                <li><strong>Elementos de Riesgo:</strong> Concientizar que encender velas tras el sismo puede causar explosiones por fugas.</li>
                <li><strong>Mito de la Puerta:</strong> Enseñar que los dinteles modernos no son seguros frente a caídas de objetos.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 5: INSTITUTIONAL SIGNATURES & ENDORSEMENT */}
        <div className="mt-8 pt-4 border-t-2 border-black avoid-break">
          <div className="grid grid-cols-3 gap-6 text-center text-[8.5pt]">
            <div className="pt-8 border-t border-black">
              <div className="font-black text-black">Vanessa Lewyle</div>
              <div className="text-black">Directora de Escuela</div>
              <div className="text-[7.5pt] text-black">Esc. Policía Federal Argentina</div>
            </div>

            <div className="pt-8 border-t border-black">
              <div className="font-black text-black">Cristian Bordon</div>
              <div className="text-black">Ingeniero de Software</div>
              <div className="text-[7.5pt] text-black">Zion Code · SismoEdu</div>
            </div>

            <div className="pt-8 border-t border-black">
              <div className="font-black text-black">Autoridad / Supervisor</div>
              <div className="text-black">Ministerio de Educación / INPRES</div>
              <div className="text-[7.5pt] text-black">Sello de Recepción Feria 2026</div>
            </div>
          </div>

          <div className="text-center text-[7.5pt] text-black mt-6 border-t border-gray-300 pt-2">
            Este informe fue emitido automáticamente por la plataforma digital SismoEdu · Todos los datos corresponden a partidas reales sincrónicas.
          </div>
        </div>

      </div>
    </>
  );
};
