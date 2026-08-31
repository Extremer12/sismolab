import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { ScreenId, UserProfile, RankEntry, UserMode } from '../../types';
import { fetchLeaderboard, calculateUserRank } from '../../services/scoresService';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { UiverseLoader } from '../../components/ui/UiverseLoader';

interface RankingPageProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const RankingPage: React.FC<RankingPageProps> = ({ user, onNavigate }) => {
  const { t, language } = useLanguage();
  const [filterMode, setFilterMode] = useState<'all' | UserMode>('all');
  const [leaderboard, setLeaderboard] = useState<RankEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const data = await fetchLeaderboard(filterMode);
    
    // Ensure current user is in the list if they have points and match filter
    const hasUserInList = data.some(p => p.id === user.id || p.nickname === user.nickname);
    let finalList = [...data];
    if (!hasUserInList && user.total_score > 0 && (filterMode === 'all' || user.mode === filterMode)) {
      finalList.push({
        id: user.id,
        rank: 0,
        nickname: user.display_name || user.nickname,
        avatar_emoji: user.avatar_emoji,
        avatar_url: user.avatar_url,
        score: user.total_score,
        mode: user.mode,
        isCurrentUser: true
      });
      finalList = finalList
        .sort((a, b) => b.score - a.score)
        .map((p, idx) => ({ ...p, rank: idx + 1 }));
    }

    setLeaderboard(finalList);
    setIsLoading(false);
  }, [filterMode, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const userRank = calculateUserRank(user.total_score, leaderboard);

  // Top 3 Podium players from REAL data
  const first = leaderboard[0];
  const second = leaderboard[1];
  const third = leaderboard[2];

  // Remaining list (#4+)
  const generalList = leaderboard.slice(3);

  // Target score to reach next rank
  const playerAbove = leaderboard.find(p => p.rank === userRank - 1);
  const pointsToNext = playerAbove ? Math.max(0, playerAbove.score - user.total_score + 10) : 0;

  // Helper avatar renderer
  const renderAvatar = (url?: string, emoji?: string, sizeClass = "w-full h-full") => {
    if (url) {
      return (
        <img
          src={url}
          alt="Avatar"
          className={`${sizeClass} object-cover`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    }
    return <span>{emoji || '🦅'}</span>;
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed select-none font-sans text-slate-100 overflow-x-hidden"
      style={{ backgroundImage: `url('/images/fondoinicio.png')` }}
    >
      {/* Background Dark Overlay */}
      <div className="fixed inset-0 bg-navy-950/85 pointer-events-none z-0" />

      {/* Main Content Layout */}
      <div className="relative z-10 p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto">
        {/* 1. Header Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playClick(); onNavigate('home'); }}
            className="w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 transition-all shadow-glow-cyan/20 active:scale-95"
            aria-label={t.common.back}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Pill: RANKING EN VIVO */}
          <div className="px-4 py-1.5 rounded-full bg-navy-900/90 border border-brand-gold/50 text-brand-yellow font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-gold/20">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span>{t.ranking.livePill}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => { sound.playClick(); loadData(); }}
            className={`w-10 h-10 rounded-2xl bg-navy-900/90 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan hover:bg-navy-800 transition-all shadow-glow-cyan/20 active:scale-95 ${isLoading ? 'animate-spin' : ''}`}
            aria-label="Actualizar ranking"
          >
            <RefreshCw className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 2. Main Title */}
        <div className="text-center space-y-0.5 pt-0.5">
          <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            {t.ranking.title} <span className="text-brand-cyan">{t.ranking.titleSpan}</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            {t.ranking.subtitle}
          </p>
        </div>

        {/* 3. Filter Chips (TODOS / NIÑOS / ADULTOS) */}
        <div className="flex gap-2 justify-center pt-0.5">
          {(['all', 'kids', 'adult'] as const).map((mode) => {
            const isActive = filterMode === mode;
            const labels = { all: t.ranking.filterAll, kids: t.ranking.filterKids, adult: t.ranking.filterAdults };

            return (
              <button
                key={mode}
                onClick={() => {
                  sound.playClick();
                  setFilterMode(mode);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan scale-105'
                    : 'bg-navy-900/90 text-slate-300 border border-white/10 hover:border-brand-cyan/40 hover:text-white'
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        {/* Loading State with Uiverse Loader */}
        {isLoading && leaderboard.length === 0 ? (
          <div className="py-12 flex justify-center">
            <UiverseLoader text={language === 'es' ? 'CARGANDO CLASIFICACIÓN...' : 'LOADING LEADERBOARD...'} />
          </div>
        ) : (
          <>
            {/* 4. Sleek Minimalist Top 3 Podium with 3D Avatars */}
            <div className="pt-3 pb-1">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end text-center">
            
            {/* 2nd Place (Silver - Left) */}
            <div className="relative rounded-3xl p-3 border border-slate-400/30 bg-gradient-to-b from-slate-900/90 via-navy-950/95 to-slate-950/95 shadow-lg flex flex-col items-center space-y-2">
              <div className="px-2.5 py-0.5 rounded-full bg-slate-300 text-navy-950 font-black text-[10px] tracking-wider shadow-sm">
                {t.ranking.silverBadge}
              </div>

              <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square shrink-0 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-400 shadow-md">
                <div className="w-full h-full aspect-square rounded-full bg-navy-900 flex items-center justify-center text-3xl overflow-hidden border border-slate-300/40">
                  {second ? renderAvatar(second.avatar_url, second.avatar_emoji) : '🥈'}
                </div>
              </div>

              <div className="space-y-0.5 w-full min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm text-white truncate px-0.5" title={second?.nickname}>
                  {second ? (second.nickname || second.id) : (language === 'es' ? 'Disponible' : 'Open')}
                </h3>
                <span className="font-black text-xs text-brand-cyan tabular-nums block">
                  {second ? `${second.score.toLocaleString()} pts` : '-'}
                </span>
              </div>
            </div>

            {/* 1st Place (Gold - Center Protagonist & Elevated) */}
            <div className="relative rounded-3xl p-3.5 border-2 border-brand-gold/60 bg-gradient-to-b from-amber-950/70 via-navy-900/95 to-navy-950/95 shadow-[0_8px_35px_rgba(245,184,61,0.25)] flex flex-col items-center space-y-2.5 -mt-3 z-10">
              <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-navy-950 font-black text-[11px] tracking-wider shadow-glow-gold">
                {t.ranking.goldBadge}
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square shrink-0 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-amber-300 to-amber-500 shadow-glow-gold">
                <div className="w-full h-full aspect-square rounded-full bg-navy-950 flex items-center justify-center text-4xl overflow-hidden border-2 border-amber-300/60">
                  {first ? renderAvatar(first.avatar_url, first.avatar_emoji) : '🥇'}
                </div>
              </div>

              <div className="space-y-0.5 w-full min-w-0">
                <h3 className="font-black text-sm sm:text-base text-brand-yellow truncate px-0.5" title={first?.nickname}>
                  {first ? (first.nickname || first.id) : (language === 'es' ? 'Disponible' : 'Open')}
                </h3>
                <span className="font-black text-sm text-white tabular-nums block drop-shadow-md">
                  {first ? `${first.score.toLocaleString()} pts` : '-'}
                </span>
              </div>
            </div>

            {/* 3rd Place (Bronze - Right) */}
            <div className="relative rounded-3xl p-3 border border-amber-700/30 bg-gradient-to-b from-amber-950/70 via-navy-950/95 to-slate-950/95 shadow-lg flex flex-col items-center space-y-2">
              <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-[10px] tracking-wider shadow-sm">
                {t.ranking.bronzeBadge}
              </div>

              <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square shrink-0 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 shadow-md">
                <div className="w-full h-full aspect-square rounded-full bg-navy-900 flex items-center justify-center text-3xl overflow-hidden border border-amber-600/40">
                  {third ? renderAvatar(third.avatar_url, third.avatar_emoji) : '🥉'}
                </div>
              </div>

              <div className="space-y-0.5 w-full min-w-0">
                <h3 className="font-extrabold text-xs sm:text-sm text-white truncate px-0.5" title={third?.nickname}>
                  {third ? (third.nickname || third.id) : (language === 'es' ? 'Disponible' : 'Open')}
                </h3>
                <span className="font-black text-xs text-brand-cyan tabular-nums block">
                  {third ? `${third.score.toLocaleString()} pts` : '-'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 5. Real User Status Banner */}
        <div className="sismo-card p-3.5 rounded-2xl border border-brand-cyan/40 bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy-950 border border-brand-cyan/50 overflow-hidden flex items-center justify-center shrink-0">
              {renderAvatar(user.avatar_url, user.avatar_emoji)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white">{user.nickname}</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-brand-cyan/20 text-brand-cyan uppercase">
                  {t.ranking.youBadge} · #{user.total_score > 0 ? userRank : '-'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                {user.total_score === 0
                  ? (language === 'es' ? '¡Jugá tus primeras misiones para entrar al ranking!' : 'Play your first missions to join the leaderboard!')
                  : userRank <= 3
                  ? t.ranking.podiumMessage
                  : playerAbove
                  ? t.ranking.ptsToNext.replace('{pts}', pointsToNext.toString()).replace('{rank}', playerAbove.rank.toString())
                  : t.ranking.keepPlaying}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="font-black text-base text-brand-yellow tabular-nums block">
              ★ {user.total_score.toLocaleString()}
            </span>
            <span className="text-[9px] font-black text-accent-gray uppercase tracking-wider block">
              {t.common.points}
            </span>
          </div>
        </div>

        {/* 6. General Classification List (#4 to #60) */}
        {generalList.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <span>{t.ranking.headerRank}</span>
              <span>{t.ranking.headerScore}</span>
            </div>

            {generalList.map((player) => {
              const isMe = player.id === user.id || player.nickname === user.nickname;

              return (
                <div
                  key={player.id}
                  className={`sismo-card p-3 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                    isMe
                      ? 'border-2 border-brand-cyan bg-gradient-to-r from-blue-950/90 via-navy-900/95 to-navy-950/95 shadow-[0_4px_25px_rgba(0,184,255,0.35)]'
                      : 'border-white/10 bg-navy-950/80 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className={`w-6 font-black text-xs text-center ${isMe ? 'text-brand-cyan' : 'text-slate-400'}`}>
                      #{player.rank}
                    </span>

                    <div className={`relative w-9 h-9 rounded-full overflow-hidden ${isMe ? 'ring-2 ring-brand-cyan shadow-glow-cyan' : 'border border-white/10'} shrink-0 bg-navy-900 flex items-center justify-center`}>
                      {renderAvatar(player.avatar_url, player.avatar_emoji)}
                    </div>

                    <div className="min-w-0">
                      <h4 className={`font-black text-xs truncate ${isMe ? 'text-brand-cyan' : 'text-white'}`}>
                        {isMe ? `${user.nickname} (${t.ranking.youBadge})` : player.nickname}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {player.mode === 'kids' ? t.common.modeKids : t.common.modeAdults}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-black text-xs text-brand-yellow tabular-nums shrink-0">
                    <span className="text-[10px] text-brand-gold">★</span>
                    <span>{player.score.toLocaleString()} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};
