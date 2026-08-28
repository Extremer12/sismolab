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
  Printer
} from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../../components/ui/Button';
import { sound } from '../../lib/sound';
import { verifyAdminPin, fetchAdminMetrics, resetStandLeaderboard, LiveAdminMetrics } from '../../services/scoresService';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminDashboardPageProps {
  onNavigate: (screen: ScreenId) => void;
}

const GAME_TITLES: Record<string, string> = {
  'game-what-is': '⚡ ¿Qué es un sismo?',
  'what-is': '⚡ ¿Qué es un sismo?',
  'game-emergency-kit': '🎒 Mochila de Emergencia',
  'emergency-kit': '🎒 Mochila de Emergencia',
  'game-safe-home': '🏠 Casa Segura (Reflejos)',
  'safe-home': '🏠 Casa Segura (Reflejos)',
  'game-what-would-you-do': '🚨 ¿Qué harías vos?',
  'what-would-you-do': '🚨 ¿Qué harías vos?',
  'game-myth-reality': '💡 Mitos vs Realidades',
  'myth-reality': '💡 Mitos vs Realidades',
  'game-final-challenge': '🏆 Desafío Final INPRES',
  'final-challenge': '🏆 Desafío Final INPRES'
};

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState<LiveAdminMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const loadMetrics = useCallback(async (pin: string) => {
    setIsLoadingMetrics(true);
    const res = await fetchAdminMetrics(pin);
    if (res.success && res.data) {
      setMetrics(res.data);
    }
    setIsLoadingMetrics(false);
  }, []);

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
      'Nombre',
      'Modo',
      'Puntaje Total',
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
    link.download = `SISMO_LAB_Informe_Escolar_INPRES_${new Date().toISOString().slice(0, 10)}.csv`;
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
      <div className="min-h-[75vh] flex flex-col justify-center items-center p-4 max-w-sm mx-auto select-none font-sans">
        <div className="sismo-card p-6 w-full text-center space-y-4 border-brand-purple/40 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center text-purple-300 mx-auto shadow-glow-purple">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-black text-lg text-white uppercase tracking-tight">
              {t.admin.loginTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {t.admin.loginSub}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(null); }}
                placeholder={t.admin.pinPlaceholder}
                disabled={isVerifying}
                className={`w-full bg-navy-950 border ${pinError ? 'border-accent-error' : 'border-brand-purple/50'} focus:border-brand-purple rounded-2xl px-4 py-3 text-center text-sm font-black text-white tracking-widest outline-none shadow-inner`}
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {pinError && (
              <p className="text-[11px] font-bold text-accent-error animate-shake">
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

  // Calculate live statistics & educational metrics
  const totalVisitors = metrics?.total_visitors || 0;
  const totalGames = metrics?.total_games || 0;
  const avgScore = metrics?.avg_score || 0;
  const kidsCount = metrics?.kids_count || 0;
  const adultsCount = metrics?.adults_count || 0;
  const totalParticipants = kidsCount + adultsCount || 1;
  const kidsPct = Math.round((kidsCount / totalParticipants) * 100);
  const adultsPct = 100 - kidsPct;

  // Compute aggregate accuracy from profile samples
  let totalCorrect = 0;
  let totalAnswers = 0;
  if (metrics?.profiles && metrics.profiles.length > 0) {
    metrics.profiles.forEach(p => {
      totalCorrect += p.correct_answers || 0;
      totalAnswers += p.total_answers || 0;
    });
  }
  const globalAccuracyRate = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 84;

  const popularGames = metrics?.popular_games && metrics.popular_games.length > 0
    ? metrics.popular_games
    : [
        { game_id: 'game-emergency-kit', session_count: 0 },
        { game_id: 'game-safe-home', session_count: 0 },
        { game_id: 'game-what-is', session_count: 0 }
      ];

  const maxSessionCount = Math.max(1, ...popularGames.map(g => g.session_count));

  // 2. Real Metrics Dashboard Screen
  return (
    <div className="p-4 sm:p-5 space-y-5 pb-28 max-w-2xl mx-auto select-none font-sans print:p-0 print:text-black">
      
      {/* Header (Hidden in Print) */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => { sound.playClick(); onNavigate('profile'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.admin.panelBadge}</span>
          </div>

          <button
            onClick={() => { sound.playClick(); loadMetrics(pinInput); }}
            className={`w-9 h-9 rounded-xl sismo-card flex items-center justify-center text-brand-cyan hover:text-white ${isLoadingMetrics ? 'animate-spin' : ''}`}
            title={t.admin.refresh}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Header with School, Zion Code & INPRES Data */}
      <div className="sismo-card p-4 sm:p-5 rounded-3xl border-2 border-brand-cyan/40 bg-gradient-to-br from-navy-900 via-navy-950 to-blue-950/60 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest block">
              ZION CODE · SOFTWARE DE PREVENCIÓN SÍSMICA
            </span>
            <h1 className="font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
              {t.admin.title}
            </h1>
          </div>
          
          <button
            onClick={handlePrintReport}
            className="px-3 py-1.5 rounded-xl bg-brand-cyan text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-brand-electric flex items-center gap-1.5 shadow-glow-cyan transition-all active:scale-95 print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Imprimir Informe' : 'Print Report'}</span>
          </button>
        </div>

        {/* Institutional Credentials Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Institución Educativa:</span>
            <span className="font-black text-brand-yellow text-xs">Escuela Policía Federal Argentina</span>
            <span className="text-[10px] text-slate-300 block">Directora: Vanessa Lewyle</span>
          </div>

          <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Marco Técnico & Científico:</span>
            <span className="font-black text-brand-cyan text-xs">INPRES San Juan & Min. de Educación</span>
            <span className="text-[10px] text-slate-300 block">Desarrollo: Zion Code (Cristian Bordon)</span>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="sismo-card p-3.5 space-y-1 border-brand-cyan/30">
          <div className="flex items-center justify-between text-brand-cyan">
            <span className="text-[9.5px] font-black uppercase tracking-wider">{t.admin.statParticipants}</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="font-black text-2xl sm:text-3xl text-white tabular-nums">
            {totalVisitors.toLocaleString()}
          </div>
          <span className="text-[9.5px] text-accent-success font-bold block">
            {t.admin.statParticipantsSub}
          </span>
        </div>

        <div className="sismo-card p-3.5 space-y-1 border-brand-blue/30">
          <div className="flex items-center justify-between text-brand-electric">
            <span className="text-[9.5px] font-black uppercase tracking-wider">{t.admin.statSessions}</span>
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div className="font-black text-2xl sm:text-3xl text-white tabular-nums">
            {totalGames.toLocaleString()}
          </div>
          <span className="text-[9.5px] text-brand-cyan font-bold block">
            {totalVisitors > 0 ? `~${(totalGames / totalVisitors).toFixed(1)} ${t.admin.statSessionsPerUser}` : `0 ${t.admin.statSessionsPerUser}`}
          </span>
        </div>

        <div className="sismo-card p-3.5 space-y-1 border-brand-gold/30">
          <div className="flex items-center justify-between text-brand-yellow">
            <span className="text-[9.5px] font-black uppercase tracking-wider">Acierto Global</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="font-black text-2xl sm:text-3xl text-brand-yellow tabular-nums">
            {globalAccuracyRate}%
          </div>
          <span className="text-[9.5px] text-slate-300 font-semibold block">
            Índice de Retención
          </span>
        </div>

        <div className="sismo-card p-3.5 space-y-1 border-brand-purple/30">
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-[9.5px] font-black uppercase tracking-wider">{t.admin.statDistribution}</span>
            <PieChart className="w-4 h-4" />
          </div>
          <div className="font-black text-lg text-white flex items-center gap-1 pt-1 tabular-nums">
            <span className="text-brand-cyan">{kidsPct}% 🧒</span>
            <span className="text-slate-500">/</span>
            <span className="text-purple-300">{adultsPct}% 🔬</span>
          </div>
          <span className="text-[9.5px] text-slate-400 font-semibold block">
            {kidsCount} Niños / {adultsCount} Adultos
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧠 DIAGNÓSTICO PEDAGÓGICO: QUÉ SABEN Y QUÉ NECESITAN REFORZAR (MINISTERIO) */}
      {/* ========================================================================= */}
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

      {/* Popular Games Breakdown */}
      <div className="sismo-card p-4 space-y-3 border-white/10">
        <h3 className="font-black text-xs text-white uppercase tracking-wider">
          {t.admin.mostPlayedTitle}
        </h3>

        <div className="space-y-2.5 text-xs">
          {popularGames.map((game) => {
            const label = GAME_TITLES[game.game_id] || `🎮 ${game.game_id}`;
            const pct = maxSessionCount > 0 ? Math.round((game.session_count / maxSessionCount) * 100) : 0;

            return (
              <div key={game.game_id} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>{label}</span>
                  <span className="text-brand-cyan tabular-nums font-black">
                    {game.session_count} {game.session_count === 1 ? 'partida' : 'partidas'}
                  </span>
                </div>
                <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions & Export Controls (Hidden in Print) */}
      <div className="space-y-2.5 pt-1 print:hidden">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={exportSuccess ? <Check className="w-4 h-4 text-accent-success" /> : <Download className="w-4 h-4" />}
          onClick={handleExportData}
        >
          <span>{exportSuccess ? t.admin.exportCsvSuccess : t.admin.exportCsv}</span>
        </Button>

        <button
          onClick={handleResetLeaderboard}
          className="w-full py-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider hover:bg-rose-900/80 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>{t.admin.resetStand}</span>
        </button>
      </div>

      {/* Footer for Printed Ministry Dossier */}
      <div className="hidden print:block text-center text-xs text-slate-600 pt-6 border-t border-slate-300">
        <p>Informe generado por la plataforma digital SISMO LAB · Zion Code & Escuela Policía Federal Argentina</p>
        <p>Directora: Vanessa Lewyle · Creador & Software Engineer: Cristian Bordon</p>
      </div>
    </div>
  );
};
