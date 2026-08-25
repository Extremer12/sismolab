import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Users, Gamepad2, Award, BarChart3, PieChart, ShieldAlert, Download, Check, Lock, KeyRound, RefreshCw } from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../../components/ui/Button';
import { sound } from '../../lib/sound';
import { verifyAdminPin, fetchAdminMetrics, resetStandLeaderboard, LiveAdminMetrics } from '../../services/scoresService';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState<LiveAdminMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

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
      setPinError(check.error || 'PIN de administrador inválido');
      setPinInput('');
    }
  };

  const handleExportData = () => {
    sound.playClick();
    if (!metrics || !metrics.profiles || metrics.profiles.length === 0) {
      alert('No hay datos disponibles para exportar todavía.');
      return;
    }

    // Generate CSV Content
    const headers = ['Posición', 'ID', 'Apodo', 'Nombre Completo', 'Modo', 'Puntaje Total', 'Partidas Jugadas', 'Aciertos', 'Total Preguntas', 'Última Actividad'];
    const rows = metrics.profiles.map((p, idx) => [
      idx + 1,
      `"${p.id}"`,
      `"${(p.nickname || '').replace(/"/g, '""')}"`,
      `"${(p.display_name || '').replace(/"/g, '""')}"`,
      p.mode === 'kids' ? 'Niños' : 'Adultos',
      p.total_score,
      p.games_played,
      p.correct_answers,
      p.total_answers,
      `"${new Date(p.updated_at).toLocaleString('es-AR')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Metricas_Feria_INPRES_SanJuan_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleResetLeaderboard = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de reiniciar los puntajes del stand para un nuevo turno o evento? Esta acción borrará las sesiones y reiniciará los marcadores.')) {
      sound.playClick();
      const res = await resetStandLeaderboard(pinInput);
      if (res.success) {
        alert('✅ ¡Tabla de posiciones de la feria reiniciada con éxito!');
        loadMetrics(pinInput);
      } else {
        alert(res.error || 'Error al reiniciar la tabla de posiciones');
      }
    }
  };

  // 1. PIN Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col justify-center items-center p-4 max-w-sm mx-auto select-none">
        <div className="sismo-card p-6 w-full text-center space-y-4 border-brand-purple/40 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center text-purple-300 mx-auto shadow-glow-purple">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-black text-lg text-white uppercase tracking-tight">
              Panel Administrativo
            </h2>
            <p className="text-xs text-slate-400">
              Ingresá el PIN de acceso del equipo INPRES
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(null); }}
                placeholder="PIN de acceso (ej: 1944)"
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
                Volver
              </Button>
              <Button
                type="submit"
                variant="purple"
                size="sm"
                className="flex-1"
                disabled={isVerifying}
              >
                {isVerifying ? 'Verificando...' : 'Acceder'}
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
  const kidsCount = metrics?.kids_count || 0;
  const adultsCount = metrics?.adults_count || 0;
  const totalParticipants = kidsCount + adultsCount || 1;
  const kidsPct = Math.round((kidsCount / totalParticipants) * 100);
  const adultsPct = 100 - kidsPct;

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

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-purple-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>INPRES · PANEL REAL</span>
          </div>

          <button
            onClick={() => { sound.playClick(); loadMetrics(pinInput); }}
            className={`w-9 h-9 rounded-xl sismo-card flex items-center justify-center text-brand-cyan hover:text-white ${isLoadingMetrics ? 'animate-spin' : ''}`}
            title="Actualizar Métricas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-black text-2xl text-white tracking-tight uppercase">
          MÉTRICAS DE LA FERIA
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          Monitoreo en tiempo real sincronizado con Supabase · Stand INPRES San Juan.
        </p>
      </div>

      {/* 4 Big Live Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="sismo-card p-4 space-y-1 border-brand-cyan/30">
          <div className="flex items-center justify-between text-brand-cyan">
            <span className="text-[10px] font-black uppercase tracking-wider">Participantes</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="font-black text-3xl text-white tabular-nums">
            {totalVisitors.toLocaleString()}
          </div>
          <span className="text-[10px] text-accent-success font-bold">Registrados en el stand</span>
        </div>

        <div className="sismo-card p-4 space-y-1 border-brand-blue/30">
          <div className="flex items-center justify-between text-brand-electric">
            <span className="text-[10px] font-black uppercase tracking-wider">Partidas</span>
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div className="font-black text-3xl text-white tabular-nums">
            {totalGames.toLocaleString()}
          </div>
          <span className="text-[10px] text-brand-cyan font-bold">
            {totalVisitors > 0 ? `~${(totalGames / totalVisitors).toFixed(1)} por usuario` : '0 por usuario'}
          </span>
        </div>

        <div className="sismo-card p-4 space-y-1 border-brand-gold/30">
          <div className="flex items-center justify-between text-brand-yellow">
            <span className="text-[10px] font-black uppercase tracking-wider">Puntaje Promedio</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="font-black text-3xl text-brand-yellow tabular-nums">
            {avgScore.toLocaleString()}
          </div>
          <span className="text-[10px] text-accent-gray font-semibold">pts por sesión</span>
        </div>

        <div className="sismo-card p-4 space-y-1 border-brand-purple/30">
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-[10px] font-black uppercase tracking-wider">Distribución</span>
            <PieChart className="w-4 h-4" />
          </div>
          <div className="font-black text-xl text-white flex items-center gap-1.5 pt-1 tabular-nums">
            <span className="text-brand-cyan">{kidsPct}% 🧒</span>
            <span className="text-slate-500">/</span>
            <span className="text-purple-300">{adultsPct}% 🔬</span>
          </div>
          <span className="text-[10px] text-accent-gray font-semibold">
            {kidsCount} Niños / {adultsCount} Adultos
          </span>
        </div>
      </div>

      {/* Popular Games Breakdown with Live Counts */}
      <div className="sismo-card p-4 space-y-3 border-white/10">
        <h3 className="font-black text-xs text-white uppercase tracking-wider">
          Juegos Más Jugados en el Stand
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

      {/* Educational Metric: Key Safety Concepts */}
      <div className="sismo-card p-4 space-y-2.5 border-accent-error/30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent-error" />
          <h3 className="font-black text-xs text-white uppercase tracking-wider">
            Conceptos Clave de Prevención (INPRES)
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="bg-navy-950 p-2.5 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Ubicación Segura: Agacharse, Cubrirse y Sujetarse</span>
              <span className="text-accent-success font-black">Norma INPRES</span>
            </div>
            <p className="text-[11px] text-accent-gray font-normal">
              Bajo mesa resistente o junto a estructura firme. Evitar marcos de puertas y vidrios.
            </p>
          </div>

          <div className="bg-navy-950 p-2.5 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Mochila de Emergencia: Linterna a pilas y radio</span>
              <span className="text-brand-yellow font-black">72 Horas</span>
            </div>
            <p className="text-[11px] text-accent-gray font-normal">
              Nunca usar velas por riesgo de fugas de gas tras el movimiento telúrico.
            </p>
          </div>
        </div>
      </div>

      {/* Export & Controls */}
      <div className="space-y-2.5 pt-1">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={exportSuccess ? <Check className="w-4 h-4 text-accent-success" /> : <Download className="w-4 h-4" />}
          onClick={handleExportData}
        >
          <span>{exportSuccess ? '¡Archivo CSV Descargado!' : 'Exportar Métricas y Jugadores (CSV)'}</span>
        </Button>

        <button
          onClick={handleResetLeaderboard}
          className="w-full py-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider hover:bg-rose-900/80 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>Reiniciar Ranking de la Feria (Stand)</span>
        </button>
      </div>
    </div>
  );
};
