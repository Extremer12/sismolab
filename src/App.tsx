import React, { useState, useEffect } from 'react';
import { ScreenId, UserMode, UserProfile } from './types';
import { loadLocalProfile, createGuestProfile, saveLocalProfile, syncProfileWithSupabase } from './services/authService';
import { saveUserScoreLocally } from './services/scoresService';
import { sound } from './lib/sound';

// Navigation Components
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { PWAInstallBanner } from './components/ui/PWAInstallBanner';

// Pages
import { SplashScreen } from './pages/Splash/SplashScreen';
import { HomeScreen } from './pages/Home/HomeScreen';
import { KidsAdventurePage } from './pages/Kids/KidsAdventurePage';
import { AdultsDashboardPage } from './pages/Adults/AdultsDashboardPage';
import { HistoryPage } from './pages/History/HistoryPage';
import { RankingPage } from './pages/Ranking/RankingPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';

// Games
import { WhatIsSeismicGame } from './components/games/WhatIsSeismicGame';
import { SafeHomeGame } from './components/games/SafeHomeGame';
import { EmergencyKitGame } from './components/games/EmergencyKitGame';
import { WhatWouldYouDoGame } from './components/games/WhatWouldYouDoGame';
import { MythOrRealityGame } from './components/games/MythOrRealityGame';
import { FinalBossChallengeGame } from './components/games/FinalBossChallengeGame';

export function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('splash');
  const [isHistoryExperienceActive, setIsHistoryExperienceActive] = useState(false);
  
  const [user, setUser] = useState<UserProfile>(() => {
    return loadLocalProfile() || createGuestProfile();
  });

  // Sync profile when state updates
  useEffect(() => {
    saveLocalProfile(user);
    saveUserScoreLocally(user);
    syncProfileWithSupabase(user);
  }, [user]);

  // Handler for login/nickname from Splash
  const handleLoginSuccess = (nickname: string) => {
    setUser(prev => ({
      ...prev,
      nickname,
      display_name: nickname
    }));
    setActiveScreen('home');
  };

  // Handler for selecting Mode (Kids vs Adults)
  const handleSelectMode = (mode: UserMode) => {
    setUser(prev => ({ ...prev, mode }));
  };

  // Handler for updating user properties (avatar, name, mode, etc.)
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  // Handler when any minigame completes
  const handleFinishGame = (earnedScore: number, correctCount: number, totalCount: number, gameId?: string) => {
    sound.playWinFanfare();

    setUser(prev => {
      const currentHighScores = prev.game_high_scores || {};
      const completedIds = prev.completed_game_ids || [];
      const id = gameId || activeScreen;

      const previousHighScore = currentHighScores[id] || 0;
      let addedScore = 0;

      if (!completedIds.includes(id)) {
        // First completion of this mission -> full score
        addedScore = earnedScore;
      } else {
        // Replaying: award delta if high score improved + 25 XP practice bonus
        if (earnedScore > previousHighScore) {
          addedScore = (earnedScore - previousHighScore) + 25;
        } else {
          addedScore = 25; // small repeat practice bonus
        }
      }

      const newHighScore = Math.max(previousHighScore, earnedScore);
      const newHighScores = { ...currentHighScores, [id]: newHighScore };
      const newCompletedIds = completedIds.includes(id) ? completedIds : [...completedIds, id];

      const newScore = prev.total_score + addedScore;
      const newLevel = Math.floor(newScore / 400) + 1;

      return {
        ...prev,
        total_score: newScore,
        level: newLevel,
        games_played: prev.games_played + 1,
        completed_game_ids: newCompletedIds,
        game_high_scores: newHighScores,
        correct_answers_count: prev.correct_answers_count + correctCount,
        total_answers_count: prev.total_answers_count + totalCount
      };
    });

    // Navigate to ranking so user sees their new position
    setActiveScreen('ranking');
  };

  const showTopBar = activeScreen !== 'splash' && !activeScreen.startsWith('game-') && activeScreen !== 'history';

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950">
      {/* Persistent Top Bar Header */}
      {showTopBar && (
        <TopBar
          user={user}
          onNavigate={setActiveScreen}
        />
      )}

      {/* Main Dynamic Screen Routing */}
      <main className="flex-1 animate-in fade-in duration-200">
        {activeScreen === 'splash' && (
          <SplashScreen
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {activeScreen === 'home' && (
          <HomeScreen
            user={user}
            onSelectMode={handleSelectMode}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'kids' && (
          <KidsAdventurePage
            user={user}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'adults' && (
          <AdultsDashboardPage
            user={user}
            onNavigate={setActiveScreen}
          />
        )}

        {/* 5 Minigames + Final Challenge */}
        {activeScreen === 'game-what-is' && (
          <WhatIsSeismicGame
            userMode={user.mode}
            onFinishGame={handleFinishGame}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'game-safe-home' && (
          <SafeHomeGame
            userMode={user.mode}
            onFinishGame={handleFinishGame}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'game-emergency-kit' && (
          <EmergencyKitGame
            userMode={user.mode}
            onFinishGame={handleFinishGame}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'game-what-would-you-do' && (
          <WhatWouldYouDoGame
            userMode={user.mode}
            onFinishGame={handleFinishGame}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'game-myth-reality' && (
          <MythOrRealityGame
            userMode={user.mode}
            onFinishGame={handleFinishGame}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'game-final-challenge' && (
          <FinalBossChallengeGame
            userMode={user.mode}
            onFinishGame={handleFinishGame}
            onNavigate={setActiveScreen}
          />
        )}

        {/* Exploration & Management */}
        {activeScreen === 'history' && (
          <HistoryPage
            onNavigate={setActiveScreen}
            onExperienceChange={setIsHistoryExperienceActive}
            onFinishGame={handleFinishGame}
          />
        )}

        {activeScreen === 'ranking' && (
          <RankingPage
            user={user}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfilePage
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'admin' && (
          <AdminDashboardPage
            onNavigate={setActiveScreen}
          />
        )}
      </main>

      {/* PWA Install Banner for Mobile Browsers */}
      <PWAInstallBanner />

      {/* Persistent Bottom Navigation (Hidden during fullscreen History Experience) */}
      {!(activeScreen === 'history' && isHistoryExperienceActive) && (
        <BottomNav
          activeScreen={activeScreen}
          userMode={user.mode}
          onNavigate={setActiveScreen}
        />
      )}
    </div>
  );
}

export default App;
