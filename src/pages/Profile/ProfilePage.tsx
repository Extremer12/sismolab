import React, { useState } from 'react';
import { ArrowLeft, Edit3, Check, Settings, ShieldCheck, Scale, Award, ChevronRight, HelpCircle, Sparkles, LogOut } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';
import { OFFICIAL_ACHIEVEMENTS } from '../../services/gamesService';
import { OFFICIAL_AVATARS, AvatarOption, createGuestProfile, isNicknameAvailable } from '../../services/authService';
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
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState<'all' | 'fauna' | 'science' | 'rescue'>('all');

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

  // Compute unlocked achievements based on conditions
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
          onComplete={(nickname, age, mode) => {
            onUpdateUser({ nickname, display_name: nickname, age, mode, has_completed_onboarding: true });
            setIsTutorialOpen(false);
          }}
          onClose={() => setIsTutorialOpen(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase tracking-wider">
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

      {/* Profile Card & Avatar */}
      <div className="sismo-card p-5 flex flex-col items-center text-center space-y-3 border-brand-cyan/30 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-cyan/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={() => { sound.playClick(); setIsAvatarModalOpen(true); }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full bg-navy-900 border-2 border-brand-cyan flex items-center justify-center shadow-[0_0_25px_rgba(0,184,255,0.4)] hover:scale-105 transition-transform group overflow-visible"
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-navy-950">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.nickname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-5xl">{user.avatar_emoji || '🦅'}</span>
            )}
          </div>

          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-cyan text-navy-950 flex items-center justify-center shadow-lg border-2 border-navy-950 group-hover:scale-110 transition-transform">
            <Edit3 className="w-4 h-4" />
          </div>
        </button>

        {/* Editable Nickname */}
        {isEditingName ? (
          <div className="flex items-center gap-2 w-full max-w-xs">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={18}
              className="flex-1 px-3 py-2 rounded-xl bg-navy-900 border border-brand-cyan/50 text-white font-black text-sm text-center focus:outline-none focus:border-brand-cyan"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="p-2 rounded-xl bg-brand-cyan text-navy-950 font-bold"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="font-black text-lg text-white">
              {user.nickname}
            </h2>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-slate-400 hover:text-brand-cyan"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Level & Mode Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-yellow font-black text-xs">
            {t.profile.currentLevel}: {user.level}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 font-black text-xs uppercase">
            {user.mode === 'kids' ? t.common.modeKids : t.common.modeAdults}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="sismo-card p-3 space-y-0.5">
          <span className="text-xl font-black text-brand-yellow block tabular-nums">
            {user.total_score.toLocaleString()}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            {t.common.points}
          </span>
        </div>

        <div className="sismo-card p-3 space-y-0.5">
          <span className="text-xl font-black text-brand-cyan block tabular-nums">
            {user.games_played}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            {language === 'es' ? 'Misiones' : 'Missions'}
          </span>
        </div>

        <div className="sismo-card p-3 space-y-0.5">
          <span className="text-xl font-black text-emerald-400 block tabular-nums">
            {accuracyPercent}%
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            {t.profile.accuracyRate}
          </span>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="sismo-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-gold" />
            <span>{t.profile.badgesTitle}</span>
          </h3>
          <span className="text-xs font-black text-brand-cyan tabular-nums">
            {unlockedCount} / {OFFICIAL_ACHIEVEMENTS.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {OFFICIAL_ACHIEVEMENTS.map((ach) => {
            const unlocked = isUnlocked(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-2.5 rounded-2xl border flex flex-col items-center text-center space-y-1 transition-all ${
                  unlocked
                    ? 'bg-navy-900/90 border-brand-gold/50 shadow-[0_0_12px_rgba(245,184,61,0.2)]'
                    : 'bg-navy-950/60 border-white/5 opacity-40 grayscale'
                }`}
                title={ach.description}
              >
                <span className="text-2xl">{ach.icon}</span>
                <span className="text-[10px] font-black text-white leading-tight line-clamp-1">
                  {ach.name}
                </span>
                <span className="text-[8px] font-bold text-slate-400 line-clamp-1">
                  {ach.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings & Info Links */}
      <div className="sismo-card p-2 divide-y divide-white/5">
        {/* Onboarding & Age Reconfiguration */}
        <button
          onClick={() => { sound.playClick(); setIsTutorialOpen(true); }}
          className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-brand-cyan" />
            <span className="font-bold">{language === 'es' ? 'Tutorial de SISMO LAB y Cambiar Edad' : 'SISMO LAB Tutorial & Change Age'}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Credits */}
        <button
          onClick={() => { sound.playClick(); onNavigate('credits'); }}
          className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
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
          className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
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
          className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-brand-gold" />
            <span className="font-bold">{t.profile.termsConditions}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Logout / Switch User */}
        <button
          onClick={async () => {
            if (window.confirm(t.profile.logoutConfirm)) {
              sound.playClick();
              try {
                await supabase.auth.signOut();
              } catch {
                // Fallback
              }
              const newGuest = createGuestProfile();
              onUpdateUser(newGuest);
              onNavigate('splash');
            }
          }}
          className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-rose-400" />
            <span className="font-bold">{t.profile.logoutBtn}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-500" />
        </button>
      </div>

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
