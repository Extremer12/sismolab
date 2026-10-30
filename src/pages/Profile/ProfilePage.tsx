import React, { useState } from 'react';
import { 
  ArrowLeft, Edit3, Check, Settings, ShieldCheck, Scale, Award, 
  ChevronRight, HelpCircle, Sparkles, LogOut, Trash2, AlertTriangle, 
  Loader2, Star, Target, CheckCircle2, Lock, Flame, Globe, Sun, Moon
} from 'lucide-react';
import { ScreenId, UserProfile, UserMode } from '../../types';
import { OFFICIAL_ACHIEVEMENTS } from '../../services/gamesService';
import { OFFICIAL_AVATARS, AvatarOption, createGuestProfile, isNicknameAvailable, deleteUserAccount } from '../../services/authService';
import { supabase } from '../../services/supabase';
import { sound } from '../../lib/sound';
import { Modal } from '../../components/ui/Modal';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import { OnboardingTutorial } from '../../components/onboarding/OnboardingTutorial';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onNavigate
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, isDark, setTheme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.nickname);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState<'all' | 'fauna' | 'science' | 'rescue'>('all');
  const [pendingSwitch, setPendingSwitch] = useState<{
    nickname: string;
    age: number;
    mode: UserMode;
  } | null>(null);

  const handleSaveName = async () => {
    const clean = nameInput.trim();
    if (!clean || clean.length < 3) {
      alert(language === 'es' ? 'El nombre debe tener al menos 3 letras' : 'Nickname must have at least 3 letters');
      return;
    }
    const check = await isNicknameAvailable(clean, user.id);
    if (!check.available) {
      alert(check.error || (language === 'es' ? '¡Ese nombre ya está en uso por otro explorador!' : 'Name already taken!'));
      return;
    }
    sound.playClick();
    onUpdateUser({
      nickname: clean.slice(0, 18),
      display_name: clean.slice(0, 18)
    });
    setIsEditingName(false);
  };

  const handleConfirmSwitchAndReset = () => {
    if (!pendingSwitch) return;
    sound.playClick();
    onUpdateUser({
      nickname: pendingSwitch.nickname,
      display_name: pendingSwitch.nickname,
      age: pendingSwitch.age,
      mode: pendingSwitch.mode,
      total_score: 0,
      level: 1,
      games_played: 0,
      correct_answers_count: 0,
      total_answers_count: 0,
      completed_game_ids: [],
      game_high_scores: {},
      has_completed_onboarding: true
    });
    setPendingSwitch(null);
  };

  const handleSelectAvatar = (avatar: AvatarOption) => {
    sound.playClick();
    onUpdateUser({
      avatar_url: avatar.url,
      avatar_emoji: avatar.emoji
    });
    setIsAvatarModalOpen(false);
  };

  const accuracyPercent = user.total_answers_count > 0
    ? Math.round((user.correct_answers_count / user.total_answers_count) * 100)
    : 100;

  // Level progression calculation
  const levelPointsCurrent = user.total_score % 400;
  const levelPointsNeeded = 400;
  const levelProgressPercent = Math.min(100, Math.round((levelPointsCurrent / levelPointsNeeded) * 100));
  const pointsToNextLevel = levelPointsNeeded - levelPointsCurrent;

  // Compute unlocked achievements based on real game progress
  const isUnlocked = (achId: string) => {
    const completed = user.completed_game_ids || [];
    if (achId === 'ach_explorador') return user.games_played >= 1 || completed.length >= 1;
    if (achId === 'ach_preparado') return completed.includes('game-emergency-kit') || user.total_score >= 400;
    if (achId === 'ach_casa_segura') return completed.includes('game-safe-home');
    if (achId === 'ach_experto') return completed.includes('game-final-challenge') || user.correct_answers_count >= 5;
    if (achId === 'ach_historiador') return completed.includes('history') || user.games_played >= 3;
    if (achId === 'ach_campeon') return user.total_score >= 1200;
    return false;
  };

  // Helper hint for how to unlock an achievement
  const getUnlockHint = (achId: string) => {
    if (language === 'es') {
      switch (achId) {
        case 'ach_explorador': return 'Completá tu 1ra actividad';
        case 'ach_preparado': return 'Armá la Mochila o sumá 400 XP';
        case 'ach_casa_segura': return 'Completá Casa Segura';
        case 'ach_experto': return 'Acertá 5 preguntas en Desafío Final';
        case 'ach_historiador': return 'Explorá la Historia Sísmica';
        case 'ach_campeon': return 'Alcanzá 1.200 puntos XP';
        default: return 'Desafío en progreso';
      }
    } else {
      switch (achId) {
        case 'ach_explorador': return 'Complete your 1st mission';
        case 'ach_preparado': return 'Pack Emergency Kit or 400 XP';
        case 'ach_casa_segura': return 'Finish Safe Home inspection';
        case 'ach_experto': return 'Get 5 correct in Final Challenge';
        case 'ach_historiador': return 'Read Seismic History';
        case 'ach_campeon': return 'Reach 1,200 XP points';
        default: return 'Challenge in progress';
      }
    }
  };

  const unlockedCount = OFFICIAL_ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length;

  const filteredAvatars = avatarFilter === 'all'
    ? OFFICIAL_AVATARS
    : OFFICIAL_AVATARS.filter(a => a.category === avatarFilter);

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto select-none font-sans">
      
      {/* Onboarding Tutorial Modal if requested from profile */}
      {isTutorialOpen && (
        <OnboardingTutorial
          user={user}
          onComplete={(newNick, newAge, newMode) => {
            const isChangingCategory = user.mode !== newMode || (user.age && ((user.age >= 13 && newAge < 13) || (user.age < 13 && newAge >= 13)));
            const hasPointsToLose = user.total_score > 0 || user.games_played > 0;

            if (isChangingCategory && hasPointsToLose) {
              setPendingSwitch({ nickname: newNick, age: newAge, mode: newMode });
              setIsTutorialOpen(false);
            } else {
              onUpdateUser({
                nickname: newNick,
                display_name: newNick,
                age: newAge,
                mode: newMode,
                has_completed_onboarding: true
              });
              setIsTutorialOpen(false);
            }
          }}
          onClose={() => setIsTutorialOpen(false)}
        />
      )}

      {/* Mode / Category Switch & Points Reset Warning Modal */}
      {pendingSwitch && (
        <Modal
          isOpen={true}
          onClose={() => setPendingSwitch(null)}
          title={language === 'es' ? '⚠️ ¿Cambiar Categoría y Reiniciar Puntos?' : '⚠️ Change Category & Reset Score?'}
        >
          <div className="space-y-4 text-left font-sans">
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 space-y-2">
              <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider block">
                {language === 'es' ? 'ADVERTENCIA DE JUEGO JUSTO' : 'FAIR PLAY WARNING'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {language === 'es' ? (
                  <>
                    Estás por cambiar a la categoría <strong>{pendingSwitch.mode === 'kids' ? 'Modo Niños (6-12 años)' : 'Modo Jóvenes y Adultos (+13)'}</strong>. Para evitar el farmeo de puntos entre modos y mantener el ranking oficial justo, <strong>tus {user.total_score.toLocaleString()} XP actuales se reiniciarán a 0</strong>.
                  </>
                ) : (
                  <>
                    You are switching to <strong>{pendingSwitch.mode === 'kids' ? 'Kids Category (6-12 yrs)' : 'Youth & Adults (+13)'}</strong>. To ensure fair competition, your current <strong>{user.total_score.toLocaleString()} XP will be reset to 0</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmSwitchAndReset}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all"
              >
                {language === 'es' ? 'Sí, Reiniciar Puntos y Cambiar' : 'Yes, Reset Score & Switch'}
              </button>

              <button
                onClick={() => setPendingSwitch(null)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase transition-colors ${
                  isDark
                    ? 'bg-navy-900 border border-white/15 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900'
                }`}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 1. HEADER                                                                 */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isDark
              ? 'sismo-card text-slate-300 hover:text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950 shadow-sm'
          }`}
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className={`px-3.5 py-1 rounded-full border font-black text-xs uppercase tracking-wider ${
          isDark ? 'bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan' : 'bg-cyan-100 border-cyan-300 text-cyan-800'
        }`}>
          {t.profile.title}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sound.playClick(); onNavigate('admin'); }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              isDark
                ? 'sismo-card text-slate-400 hover:text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-950 shadow-sm'
            }`}
            title={t.profile.adminAccess}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TARJETA DE PERFIL (Avatar, Nivel, Progreso & Edición Clara)            */}
      {/* ========================================================================= */}
      <div className={`p-5 flex flex-col items-center text-center space-y-4 rounded-3xl border relative overflow-hidden transition-all duration-200 ${
        isDark ? 'sismo-card border-brand-cyan/25' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />

        {/* Avatar with clear Edit Button */}
        <div className="relative">
          <button
            onClick={() => { sound.playClick(); setIsAvatarModalOpen(true); }}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full border-2 border-brand-cyan flex items-center justify-center shadow-lg hover:scale-105 transition-all group overflow-visible ${
              isDark ? 'bg-navy-950' : 'bg-slate-100'
            }`}
            title={language === 'es' ? 'Cambiar avatar' : 'Change avatar'}
          >
            <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${
              isDark ? 'bg-navy-950' : 'bg-slate-100'
            }`}>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.nickname}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + '/images/avatar/avatar_1.webp') {
                      target.src = '/images/avatar/avatar_1.webp';
                    }
                  }}
                />
              ) : (
                <span className="text-5xl">{user.avatar_emoji || '🦅'}</span>
              )}
            </div>

            {/* Clear Edit Badge */}
            <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full bg-brand-cyan text-navy-950 flex items-center gap-1 font-black text-[10px] uppercase shadow-md border-2 group-hover:scale-105 transition-transform ${
              isDark ? 'border-navy-950' : 'border-white'
            }`}>
              <Edit3 className="w-3 h-3 stroke-[2.5]" />
              <span>{language === 'es' ? 'Avatar' : 'Edit'}</span>
            </div>
          </button>
        </div>

        {/* Editable Nickname */}
        <div className="w-full max-w-xs space-y-1">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={18}
                className={`flex-1 px-3 py-2 rounded-xl border font-black text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 ${
                  isDark ? 'bg-navy-950 border-brand-cyan text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-2.5 rounded-xl bg-brand-cyan text-navy-950 font-bold hover:scale-105 transition-transform"
                title={language === 'es' ? 'Guardar apodo' : 'Save nickname'}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className={`font-black text-lg sm:text-xl tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900 font-extrabold'
              }`}>
                {user.nickname}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                  isDark
                    ? 'bg-navy-950/80 border-white/10 text-slate-400 hover:text-brand-cyan'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                }`}
                title={language === 'es' ? 'Editar nombre' : 'Edit nickname'}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mode Pill */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className={`px-3 py-0.5 rounded-full font-black text-xs uppercase tracking-wider ${
              user.mode === 'kids'
                ? isDark
                  ? 'bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan'
                  : 'bg-cyan-100 border border-cyan-300 text-cyan-800'
                : isDark
                  ? 'bg-brand-purple/20 border border-brand-purple/40 text-purple-300'
                  : 'bg-purple-100 border border-purple-300 text-purple-800'
            }`}>
              {user.mode === 'kids' ? t.common.modeKids : t.common.modeAdults}
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {user.age ? `${user.age} ${language === 'es' ? 'años' : 'yrs'}` : 'Explorador'}
            </span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className={`w-full p-3 rounded-2xl border space-y-2 text-left ${
          isDark ? 'bg-navy-950/80 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-black flex items-center gap-1.5 ${
              isDark ? 'text-brand-yellow' : 'text-amber-800 font-extrabold'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t.profile.currentLevel} {user.level}</span>
            </span>
            <span className={`font-bold tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              {levelPointsCurrent} / {levelPointsNeeded} XP
            </span>
          </div>

          {/* Progress Bar */}
          <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
            isDark ? 'bg-navy-900 border-white/5' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-yellow shadow-glow-gold transition-all duration-500"
              style={{ width: `${Math.max(5, levelProgressPercent)}%` }}
            />
          </div>

          <div className={`flex items-center justify-between text-[11px] font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-700'
          }`}>
            <span>{language === 'es' ? `Faltan ${pointsToNextLevel} XP para Nivel ${user.level + 1}` : `${pointsToNextLevel} XP to Level ${user.level + 1}`}</span>
            <span className={`font-black ${isDark ? 'text-brand-yellow' : 'text-amber-800'}`}>{levelProgressPercent}%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ESTADÍSTICAS ORDENADAS                                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Puntos Totales */}
        <div className={`p-3 space-y-1 rounded-2xl border transition-all ${
          isDark ? 'sismo-card' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mx-auto ${
            isDark ? 'bg-navy-950 border-brand-gold/30 text-brand-gold' : 'bg-amber-100 border-amber-300 text-amber-700'
          }`}>
            <Star className="w-4 h-4 fill-current" />
          </div>
          <span className={`text-xl font-black block tabular-nums leading-tight ${
            isDark ? 'text-brand-yellow' : 'text-amber-800 font-black'
          }`}>
            {user.total_score.toLocaleString()}
          </span>
          <span className={`text-[11px] font-black uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-700'
          }`}>
            {t.common.points}
          </span>
        </div>

        {/* Misiones */}
        <div className={`p-3 space-y-1 rounded-2xl border transition-all ${
          isDark ? 'sismo-card' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mx-auto ${
            isDark ? 'bg-navy-950 border-brand-cyan/30 text-brand-cyan' : 'bg-cyan-100 border-cyan-300 text-cyan-800'
          }`}>
            <Target className="w-4 h-4" />
          </div>
          <span className={`text-xl font-black block tabular-nums leading-tight ${
            isDark ? 'text-brand-cyan' : 'text-cyan-700 font-black'
          }`}>
            {user.games_played}
          </span>
          <span className={`text-[11px] font-black uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-700'
          }`}>
            {language === 'es' ? 'Misiones' : 'Missions'}
          </span>
        </div>

        {/* Precisión */}
        <div className={`p-3 space-y-1 rounded-2xl border transition-all ${
          isDark ? 'sismo-card' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mx-auto ${
            isDark ? 'bg-navy-950 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className={`text-xl font-black block tabular-nums leading-tight ${
            isDark ? 'text-emerald-400' : 'text-emerald-700 font-black'
          }`}>
            {accuracyPercent}%
          </span>
          <span className={`text-[11px] font-black uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-700'
          }`}>
            {t.profile.accuracyRate}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COLECCIÓN DE INSIGNIAS                                                 */}
      {/* ========================================================================= */}
      <div className={`p-4 sm:p-5 space-y-3.5 rounded-3xl border transition-all duration-200 ${
        isDark ? 'sismo-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-black text-sm uppercase tracking-wider flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-900 font-extrabold'
          }`}>
            <Award className="w-4 h-4 text-brand-gold" />
            <span>{t.profile.badgesTitle}</span>
          </h3>
          <span className={`text-xs font-black tabular-nums px-2.5 py-0.5 rounded-full border ${
            isDark ? 'text-brand-cyan bg-navy-950 border-brand-cyan/30' : 'text-cyan-800 bg-cyan-100 border-cyan-300 font-bold'
          }`}>
            {unlockedCount} / {OFFICIAL_ACHIEVEMENTS.length}
          </span>
        </div>

        {/* Achievements Grid: Legible card design with unlock hints */}
        <div className="grid grid-cols-2 gap-2.5">
          {OFFICIAL_ACHIEVEMENTS.map((ach) => {
            const unlocked = isUnlocked(ach.id);
            const hint = getUnlockHint(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  unlocked
                    ? (isDark ? 'bg-navy-900/90 border-brand-gold/40 shadow-sm' : 'bg-amber-50/80 border-amber-300 shadow-xs')
                    : (isDark ? 'bg-navy-950/70 border-white/10 opacity-75' : 'bg-slate-50 border-slate-200')
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-2xl ${unlocked ? '' : 'filter grayscale opacity-60'}`}>
                    {ach.icon}
                  </span>

                  {unlocked ? (
                    <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider border ${
                      isDark ? 'bg-brand-gold/15 text-brand-yellow border-brand-gold/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {language === 'es' ? 'Conseguida' : 'Unlocked'}
                    </span>
                  ) : (
                    <span className={`p-1 rounded-full border ${
                      isDark ? 'bg-navy-900 text-slate-400 border-white/10' : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}>
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className={`font-black text-xs leading-snug ${
                    unlocked
                      ? (isDark ? 'text-white' : 'text-slate-900 font-black')
                      : (isDark ? 'text-slate-300' : 'text-slate-800 font-black')
                  }`}>
                    {ach.name}
                  </h4>
                  <p className={`text-[11px] font-semibold leading-tight line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {unlocked ? ach.description : hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. AJUSTES Y CONFIGURACIÓN (IDIOMA, TEMA & TUTORIAL)                     */}
      {/* ========================================================================= */}
      <div className={`p-4 space-y-4 rounded-3xl border transition-all duration-200 ${
        isDark ? 'sismo-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`text-[11px] font-black uppercase tracking-wider ${
          isDark ? 'text-slate-400' : 'text-slate-700 font-extrabold'
        }`}>
          {language === 'es' ? 'Preferencias y Configuración' : 'Preferences & Settings'}
        </div>

        {/* 1. Selector de Idioma (Español / English) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-cyan" />
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900 font-extrabold'}`}>
              {language === 'es' ? 'Idioma del Sistema' : 'System Language'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setLanguage('es');
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                language === 'es'
                  ? (isDark ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-sm font-black' : 'bg-cyan-100 border-cyan-400 text-cyan-900 font-black shadow-xs')
                  : (isDark ? 'bg-navy-950/80 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-950')
              }`}
            >
              <span className="text-base">🇦🇷</span>
              <span>Español</span>
              {language === 'es' && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setLanguage('en');
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                language === 'en'
                  ? (isDark ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-sm font-black' : 'bg-cyan-100 border-cyan-400 text-cyan-900 font-black shadow-xs')
                  : (isDark ? 'bg-navy-950/80 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-950')
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span>English</span>
              {language === 'en' && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>
        </div>

        {/* 2. Selector de Tema Visual (Modo Oscuro / Modo Claro) */}
        <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900 font-extrabold'}`}>
                {language === 'es' ? 'Apariencia Visual' : 'Appearance'}
              </span>
            </div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600 font-bold'}`}>
              {isDark ? (language === 'es' ? 'Oscuro' : 'Dark') : (language === 'es' ? 'Claro' : 'Light')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isDark
                  ? 'bg-amber-400/15 border-amber-400/50 text-amber-300 shadow-sm font-black'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
              }`}
            >
              <Moon className="w-4 h-4 text-amber-400" />
              <span>{language === 'es' ? 'Modo Oscuro' : 'Dark Mode'}</span>
              {isDark && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                !isDark
                  ? 'bg-sky-500/15 border-sky-400 text-sky-800 shadow-sm font-black'
                  : 'bg-navy-950/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-sky-500" />
              <span>{language === 'es' ? 'Modo Claro' : 'Light Mode'}</span>
              {!isDark && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>
        </div>

        {/* 3. Tutorial y Cambio de Edad */}
        <div className={`pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <button
            onClick={() => { sound.playClick(); setIsTutorialOpen(true); }}
            className={`w-full p-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
              isDark ? 'text-slate-200 hover:text-white hover:bg-white/5' : 'text-slate-800 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                isDark ? 'bg-navy-950 border-brand-cyan/30 text-brand-cyan' : 'bg-cyan-100 border-cyan-300 text-cyan-800'
              }`}>
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900 font-extrabold'}`}>
                  {language === 'es' ? 'Tutorial y Cambio de Edad' : 'Tutorial & Change Age'}
                </span>
                <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'es' ? 'Reconfigurar categoría y modo de juego' : 'Reconfigure mode and age bracket'}
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. TRANSPARENCIA INSTITUCIONAL & LEGAL                                    */}
      {/* ========================================================================= */}
      <div className={`p-2 rounded-3xl border transition-all duration-200 space-y-0.5 divide-y ${
        isDark ? 'sismo-card divide-white/5' : 'bg-white border-slate-200 shadow-sm divide-slate-100'
      }`}>
        <div className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${
          isDark ? 'text-slate-400' : 'text-slate-700 font-extrabold'
        }`}>
          {language === 'es' ? 'Institucional y Legal' : 'Institutional & Legal'}
        </div>

        {/* Credits */}
        <button
          onClick={() => { sound.playClick(); onNavigate('credits'); }}
          className={`w-full p-2.5 flex items-center justify-between text-xs transition-colors rounded-xl ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-bold'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-purple-400" />
            <span>{t.profile.institutionalCredits}</span>
          </div>
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        </button>

        {/* Privacy Policy */}
        <button
          onClick={() => { sound.playClick(); onNavigate('privacy'); }}
          className={`w-full p-2.5 flex items-center justify-between text-xs transition-colors rounded-xl ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-bold'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>{t.profile.privacyPolicy}</span>
          </div>
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        </button>

        {/* Terms */}
        <button
          onClick={() => { sound.playClick(); onNavigate('terms'); }}
          className={`w-full p-2.5 flex items-center justify-between text-xs transition-colors rounded-xl ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-bold'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-brand-gold" />
            <span>{t.profile.termsConditions}</span>
          </div>
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 7. GESTIÓN DE SESIÓN Y CUENTA                                            */}
      {/* ========================================================================= */}
      <div className={`p-2 rounded-3xl border transition-all duration-200 space-y-0.5 divide-y ${
        isDark ? 'sismo-card divide-white/5' : 'bg-white border-slate-200 shadow-sm divide-slate-100'
      }`}>
        {/* Logout / Switch User */}
        <button
          onClick={async () => {
            if (window.confirm(t.profile.logoutConfirm)) {
              sound.playClick();
              try {
                await supabase.auth.signOut();
              } catch {}
              localStorage.removeItem('sismolab_user_profile_v2');
              localStorage.removeItem('sismolab_leaderboard_v2');
              const newGuest = createGuestProfile();
              onUpdateUser(newGuest);
              onNavigate('splash');
            }
          }}
          className={`w-full p-2.5 flex items-center justify-between text-xs rounded-xl transition-colors font-bold ${
            isDark ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/20' : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{t.profile.logoutBtn}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-500" />
        </button>

        {/* Delete Account Permanently */}
        <button
          onClick={() => {
            sound.playClick();
            setIsDeleteModalOpen(true);
          }}
          className="w-full p-2.5 flex items-center justify-between text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span className="font-bold">{language === 'es' ? 'Eliminar Cuenta Permanentemente' : 'Delete Account Permanently'}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-500" />
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title={language === 'es' ? 'Eliminar Cuenta' : 'Delete Account'}
      >
        <div className="space-y-4 py-2 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-rose-500/15 border-2 border-rose-500/40 text-rose-500 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(244,63,94,0.3)]">
            <Trash2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <h3 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'es' ? '¿Eliminar tu cuenta permanentemente?' : 'Delete your account permanently?'}
            </h3>
            <p className={`text-xs leading-relaxed max-w-sm mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {language === 'es'
                ? 'Esta acción es irreversible. Se borrarán todos tus datos personales, estadísticas de juego, medallas, puntajes y tu posición en el ranking general.'
                : 'This action is irreversible. All your personal data, game stats, badges, scores and leaderboard position will be deleted.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => { sound.playClick(); setIsDeleteModalOpen(false); }}
              className={`flex-1 h-11 rounded-full font-bold text-xs transition-all active:scale-95 disabled:opacity-50 ${
                isDark
                  ? 'bg-navy-900 border border-white/20 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                sound.playWrong();
                setIsDeleting(true);
                await deleteUserAccount(user.id);
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
                const newGuest = createGuestProfile();
                onUpdateUser(newGuest);
                onNavigate('splash');
              }}
              className="flex-1 h-11 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95 transition-all disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'es' ? 'Borrando...' : 'Deleting...'}</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>{language === 'es' ? 'Sí, Eliminar Cuenta' : 'Yes, Delete Account'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* 3D Character Avatar Picker Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title={language === 'es' ? 'Elegí tu Avatar 3D' : 'Choose your 3D Avatar'}
      >
        <div className="space-y-4 py-1">
          {/* Category Tabs */}
          <div className={`flex items-center justify-center gap-1.5 p-1 rounded-full border text-[11px] font-black uppercase ${
            isDark ? 'bg-navy-950 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            {[
              { id: 'all', label: language === 'es' ? 'Todos' : 'All' },
              { id: 'fauna', label: language === 'es' ? 'Fauna Cuyo' : 'Fauna' },
              { id: 'science', label: language === 'es' ? 'Ciencia' : 'Science' },
              { id: 'rescue', label: language === 'es' ? 'Rescate' : 'Rescue' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { sound.playClick(); setAvatarFilter(tab.id as any); }}
                className={`flex-1 py-1.5 px-2 rounded-full transition-all ${
                  avatarFilter === tab.id
                    ? 'bg-brand-cyan text-navy-950 font-black shadow-glow-cyan'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 12 Avatars Grid */}
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredAvatars.map((avatar) => {
              const isSelected = user.avatar_url === avatar.url || user.avatar_emoji === avatar.emoji;

              return (
                <button
                  key={avatar.id}
                  onClick={() => handleSelectAvatar(avatar)}
                  className={`group relative p-2 rounded-2xl border text-center space-y-1.5 transition-all active:scale-95 flex flex-col items-center ${
                    isSelected
                      ? 'border-brand-cyan shadow-[0_0_20px_rgba(0,184,255,0.4)] ring-2 ring-brand-cyan/60'
                      : isDark
                        ? 'bg-navy-950 border-white/10 hover:border-brand-cyan/50 hover:bg-navy-900'
                        : 'bg-white border-slate-200 hover:border-brand-cyan hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-full overflow-hidden border group-hover:scale-105 transition-transform flex items-center justify-center ${
                    isDark ? 'bg-navy-900 border-white/15' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <span className={`text-[10px] font-bold line-clamp-1 block leading-tight px-0.5 ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {avatar.name}
                  </span>

                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-brand-cyan text-navy-950 flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

    </div>
  );
};
