import React, { useState } from 'react';
import { 
  ArrowLeft, Edit3, Check, Settings, ShieldCheck, Scale, Award, 
  ChevronRight, HelpCircle, Sparkles, LogOut, Trash2, AlertTriangle, 
  Loader2, Star, Target, CheckCircle2, Lock, Flame
} from 'lucide-react';
import { ScreenId, UserProfile, UserMode } from '../../types';
import { OFFICIAL_ACHIEVEMENTS } from '../../services/gamesService';
import { OFFICIAL_AVATARS, AvatarOption, createGuestProfile, isNicknameAvailable, deleteUserAccount } from '../../services/authService';
import { supabase } from '../../services/supabase';
import { sound } from '../../lib/sound';
import { Modal } from '../../components/ui/Modal';
import { useLanguage, LanguageToggle } from '../../i18n/LanguageContext';
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
  const { t, language } = useLanguage();
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
                className="w-full py-3 px-4 rounded-xl bg-navy-900 border border-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase transition-colors"
              >
                {language === 'es' ? 'Cancelar y Mantener Mis Puntos' : 'Cancel and Keep Score'}
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
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="px-3.5 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase tracking-wider">
          {t.profile.title}
        </span>

        <div className="flex items-center gap-1.5">
          <LanguageToggle compact />

          <button
            onClick={() => { sound.playClick(); onNavigate('admin'); }}
            className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-400 hover:text-white"
            title={t.profile.adminAccess}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TARJETA DE PERFIL (Avatar, Nivel, Progreso & Edición Clara)            */}
      {/* ========================================================================= */}
      <div className="sismo-card p-5 flex flex-col items-center text-center space-y-4 border-brand-cyan/25 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />

        {/* Avatar with clear Edit Button */}
        <div className="relative">
          <button
            onClick={() => { sound.playClick(); setIsAvatarModalOpen(true); }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full bg-navy-950 border-2 border-brand-cyan flex items-center justify-center shadow-lg hover:scale-105 transition-all group overflow-visible"
            title={language === 'es' ? 'Cambiar avatar' : 'Change avatar'}
          >
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-navy-950">
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
            <div className="absolute -bottom-1 -right-1 px-2 py-1 rounded-full bg-brand-cyan text-navy-950 flex items-center gap-1 font-black text-[10px] uppercase shadow-md border-2 border-navy-950 group-hover:scale-105 transition-transform">
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
                className="flex-1 px-3 py-2 rounded-xl bg-navy-950 border border-brand-cyan text-white font-black text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
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
              <h2 className="font-black text-lg sm:text-xl text-white tracking-tight">
                {user.nickname}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="w-7 h-7 rounded-lg bg-navy-950/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-brand-cyan transition-colors"
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
                ? 'bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan'
                : 'bg-brand-purple/20 border border-brand-purple/40 text-purple-300'
            }`}>
              {user.mode === 'kids' ? t.common.modeKids : t.common.modeAdults}
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-300 font-bold">
              {user.age ? `${user.age} ${language === 'es' ? 'años' : 'yrs'}` : 'Explorador'}
            </span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="w-full bg-navy-950/80 p-3 rounded-2xl border border-white/10 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-brand-yellow flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t.profile.currentLevel} {user.level}</span>
            </span>
            <span className="font-bold text-slate-400 tabular-nums">
              {levelPointsCurrent} / {levelPointsNeeded} XP
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-navy-900 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-yellow shadow-glow-gold transition-all duration-500"
              style={{ width: `${Math.max(5, levelProgressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>{language === 'es' ? `Faltan ${pointsToNextLevel} XP para Nivel ${user.level + 1}` : `${pointsToNextLevel} XP to Level ${user.level + 1}`}</span>
            <span className="text-brand-yellow font-bold">{levelProgressPercent}%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ESTADÍSTICAS ORDENADAS                                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Puntos Totales */}
        <div className="sismo-card p-3 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-navy-950 border border-brand-gold/30 flex items-center justify-center text-brand-gold mx-auto">
            <Star className="w-4 h-4 fill-brand-gold" />
          </div>
          <span className="text-xl font-black text-brand-yellow block tabular-nums leading-tight">
            {user.total_score.toLocaleString()}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {t.common.points}
          </span>
        </div>

        {/* Misiones */}
        <div className="sismo-card p-3 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-navy-950 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-brand-cyan block tabular-nums leading-tight">
            {user.games_played}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {language === 'es' ? 'Misiones' : 'Missions'}
          </span>
        </div>

        {/* Precisión */}
        <div className="sismo-card p-3 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-navy-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-emerald-400 block tabular-nums leading-tight">
            {accuracyPercent}%
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {t.profile.accuracyRate}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COLECCIÓN DE INSIGNIAS                                                 */}
      {/* ========================================================================= */}
      <div className="sismo-card p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-gold" />
            <span>{t.profile.badgesTitle}</span>
          </h3>
          <span className="text-xs font-black text-brand-cyan tabular-nums bg-navy-950 px-2.5 py-0.5 rounded-full border border-brand-cyan/30">
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
                    ? 'bg-navy-900/90 border-brand-gold/40 shadow-sm'
                    : 'bg-navy-950/70 border-white/10 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-2xl ${unlocked ? '' : 'filter grayscale opacity-60'}`}>
                    {ach.icon}
                  </span>

                  {unlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-yellow font-black text-[9px] uppercase tracking-wider border border-brand-gold/30">
                      {language === 'es' ? 'Conseguida' : 'Unlocked'}
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-navy-900 text-slate-400 border border-white/10">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className={`font-black text-xs leading-snug ${unlocked ? 'text-white' : 'text-slate-300'}`}>
                    {ach.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight line-clamp-2">
                    {unlocked ? ach.description : hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. AJUSTES Y RECONFIGURACIÓN                                              */}
      {/* ========================================================================= */}
      <div className="sismo-card p-2">
        <button
          onClick={() => { sound.playClick(); setIsTutorialOpen(true); }}
          className="w-full p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-950 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-bold text-white block">
                {language === 'es' ? 'Tutorial y Cambio de Edad' : 'Tutorial & Change Age'}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {language === 'es' ? 'Reconfigurar categoría y modo de juego' : 'Reconfigure mode and age bracket'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. TRANSPARENCIA INSTITUCIONAL & LEGAL                                    */}
      {/* ========================================================================= */}
      <div className="sismo-card p-2 divide-y divide-white/5 space-y-0.5">
        <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
          {language === 'es' ? 'Institucional y Legal' : 'Institutional & Legal'}
        </div>

        {/* Credits */}
        <button
          onClick={() => { sound.playClick(); onNavigate('credits'); }}
          className="w-full p-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-purple-300" />
            <span className="font-bold">{t.profile.institutionalCredits}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Privacy Policy */}
        <button
          onClick={() => { sound.playClick(); onNavigate('privacy'); }}
          className="w-full p-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span className="font-bold">{t.profile.privacyPolicy}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Terms */}
        <button
          onClick={() => { sound.playClick(); onNavigate('terms'); }}
          className="w-full p-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-brand-gold" />
            <span className="font-bold">{t.profile.termsConditions}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 7. GESTIÓN DE SESIÓN Y CUENTA                                            */}
      {/* ========================================================================= */}
      <div className="sismo-card p-2 divide-y divide-white/5 space-y-0.5">
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
          className="w-full p-2.5 flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-950/20 rounded-xl transition-colors"
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
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              {language === 'es' ? '¿Eliminar tu cuenta permanentemente?' : 'Delete your account permanently?'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
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
              className="flex-1 h-11 rounded-full bg-navy-900 border border-white/20 text-slate-300 font-bold text-xs hover:text-white transition-all active:scale-95 disabled:opacity-50"
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
          <div className="flex items-center justify-center gap-1.5 p-1 bg-navy-950 rounded-full border border-white/10 text-[11px] font-black uppercase">
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
                    : 'text-slate-400 hover:text-white'
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
                  className={`group relative p-2 rounded-2xl bg-navy-950 border text-center space-y-1.5 transition-all active:scale-95 flex flex-col items-center ${
                    isSelected
                      ? 'border-brand-cyan shadow-[0_0_20px_rgba(0,184,255,0.4)] ring-2 ring-brand-cyan/60'
                      : 'border-white/10 hover:border-brand-cyan/50 hover:bg-navy-900'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-full overflow-hidden bg-navy-900 border border-white/15 group-hover:scale-105 transition-transform flex items-center justify-center">
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <span className="text-[10px] font-bold text-slate-200 line-clamp-1 block leading-tight px-0.5">
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
