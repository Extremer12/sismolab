import React, { useState } from 'react';
import { ArrowLeft, Edit3, Check, Lock, Settings } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';
import { OFFICIAL_ACHIEVEMENTS } from '../../services/gamesService';
import { sound } from '../../lib/sound';
import { Modal } from '../../components/ui/Modal';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (screen: ScreenId) => void;
}

const AVATAR_LIST = ['🦅', '🦙', '🐆', '🦊', '🦉', '🦎', '🔬', '👷', '🌋', '⛺', '🧑‍🔬', '🎒'];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onNavigate
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.nickname);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    sound.playClick();
    onUpdateUser({
      nickname: nameInput.trim().slice(0, 18),
      display_name: nameInput.trim().slice(0, 18)
    });
    setIsEditingName(false);
  };

  const handleSelectAvatar = (emoji: string) => {
    sound.playClick();
    onUpdateUser({ avatar_emoji: emoji });
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

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onNavigate('home'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-300 hover:text-white"
          aria-label="Volver a Inicio"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan font-black text-xs uppercase tracking-wider">
          MI PERFIL
        </span>

        <button
          onClick={() => { sound.playClick(); onNavigate('admin'); }}
          className="w-10 h-10 rounded-2xl sismo-card flex items-center justify-center text-slate-400 hover:text-white"
          title="Panel de Métricas INPRES"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Card & Avatar */}
      <div className="sismo-card p-5 flex flex-col items-center text-center space-y-3 border-brand-cyan/30">
        <button
          onClick={() => { sound.playClick(); setIsAvatarModalOpen(true); }}
          className="relative w-24 h-24 aspect-square rounded-full bg-gradient-to-br from-brand-blue via-navy-800 to-navy-950 border-2 border-brand-cyan flex items-center justify-center text-5xl shadow-glow-cyan/40 hover:scale-105 transition-transform"
        >
          <span>{user.avatar_emoji}</span>
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-cyan text-navy-950 flex items-center justify-center shadow-md">
            <Edit3 className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Editable Nickname */}
        {isEditingName ? (
          <div className="flex items-center gap-2 w-full max-w-xs">
            <input
              type="text"
              maxLength={18}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-navy-950 border border-brand-cyan rounded-xl text-sm font-black text-white outline-none"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="p-2.5 rounded-xl bg-brand-cyan text-navy-950 font-black text-xs"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="font-black text-xl text-white">
              {user.nickname}
            </h2>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-accent-gray hover:text-brand-cyan p-1"
              aria-label="Editar apodo"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mode Selector */}
        <div className="flex bg-navy-950 border border-white/10 p-1 rounded-full text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              onUpdateUser({ mode: 'kids' });
            }}
            className={`px-3.5 py-1 rounded-full transition-all ${
              user.mode === 'kids' ? 'bg-brand-cyan text-navy-950 font-black shadow-sm' : 'text-accent-gray'
            }`}
          >
            🧒 Modo Niños
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onUpdateUser({ mode: 'adult' });
            }}
            className={`px-3.5 py-1 rounded-full transition-all ${
              user.mode === 'adult' ? 'bg-brand-purple text-white font-black shadow-sm' : 'text-accent-gray'
            }`}
          >
            🔬 Jóvenes y Adultos
          </button>
        </div>
      </div>

      {/* Stats Summary Grid (Section 27) */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="sismo-card p-3 space-y-0.5 border-brand-gold/30">
          <span className="text-[10px] font-bold text-accent-gray block">Puntaje Total</span>
          <span className="font-black text-base text-brand-yellow tabular-nums">⭐ {user.total_score}</span>
        </div>

        <div className="sismo-card p-3 space-y-0.5 border-brand-cyan/30">
          <span className="text-[10px] font-bold text-accent-gray block">Nivel Actual</span>
          <span className="font-black text-base text-brand-cyan">Nivel {user.level}</span>
        </div>

        <div className="sismo-card p-3 space-y-0.5 border-accent-success/30">
          <span className="text-[10px] font-bold text-accent-gray block">Aciertos</span>
          <span className="font-black text-base text-accent-success">{accuracyPercent}%</span>
        </div>
      </div>

      {/* Badges / Achievements Section (Section 26) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-white uppercase tracking-wide">
            Insignias Oficiales ({unlockedCount}/6)
          </h3>
          <span className="text-xs font-bold text-brand-gold">
            INPRES
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {OFFICIAL_ACHIEVEMENTS.map((ach) => {
            const unlocked = isUnlocked(ach.id);
            return (
              <div
                key={ach.id}
                className={`sismo-card p-3.5 flex flex-col justify-between text-left transition-all ${
                  unlocked
                    ? 'border-brand-gold/50 bg-gradient-to-br from-navy-850 via-navy-900 to-amber-950/20'
                    : 'opacity-40 border-white/5 bg-navy-950/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{ach.icon}</span>
                  {unlocked ? (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-gold text-navy-950">
                      Desbloqueada
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                <div className="pt-2">
                  <h4 className="font-black text-xs text-white leading-tight">
                    {ach.name}
                  </h4>
                  <p className="text-[11px] text-accent-gray leading-snug font-normal mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Elegí tu Avatar Sanjuanino"
      >
        <div className="grid grid-cols-4 gap-3 py-2">
          {AVATAR_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSelectAvatar(emoji)}
              className="w-14 h-14 rounded-2xl bg-navy-950 hover:bg-navy-800 border border-white/10 hover:border-brand-cyan flex items-center justify-center text-3xl transition-transform hover:scale-110 active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};
