import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ScreenId, UserMode, UserProfile } from './types';
import { supabase } from './services/supabase';
import { loadLocalProfile, createGuestProfile, saveLocalProfile, syncProfileWithSupabase, syncProfileWithSupabaseDebounced, fetchOrCreateUserProfile } from './services/authService';
import { saveUserScoreLocally, submitGameScoreToSupabase } from './services/scoresService';
import { sound } from './lib/sound';

// Navigation & Global UI Components
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { PWAInstallBanner } from './components/ui/PWAInstallBanner';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { UiverseLoader } from './components/ui/UiverseLoader';

// Onboarding Tutorial
import { OnboardingTutorial } from './components/onboarding/OnboardingTutorial';

// Primary Core Screens (Eager loaded for instant first render)
import { SplashScreen } from './pages/Splash/SplashScreen';
import { HomeScreen } from './pages/Home/HomeScreen';
import { KidsAdventurePage } from './pages/Kids/KidsAdventurePage';
import { AdultsDashboardPage } from './pages/Adults/AdultsDashboardPage';
import { RankingPage } from './pages/Ranking/RankingPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { LanguageProvider } from './i18n/LanguageContext';

// Lazy Loaded Minigames (Code-splitting to reduce initial bundle)
const WhatIsSeismicGame = lazy(() => import('./components/games/WhatIsSeismicGame').then(m => ({ default: m.WhatIsSeismicGame })));
const SafeHomeGame = lazy(() => import('./components/games/SafeHomeGame').then(m => ({ default: m.SafeHomeGame })));
const EmergencyKitGame = lazy(() => import('./components/games/EmergencyKitGame').then(m => ({ default: m.EmergencyKitGame })));
const WhatWouldYouDoGame = lazy(() => import('./components/games/WhatWouldYouDoGame').then(m => ({ default: m.WhatWouldYouDoGame })));
const MythOrRealityGame = lazy(() => import('./components/games/MythOrRealityGame').then(m => ({ default: m.MythOrRealityGame })));
const FinalBossChallengeGame = lazy(() => import('./components/games/FinalBossChallengeGame').then(m => ({ default: m.FinalBossChallengeGame })));

// Lazy Loaded Secondary Pages
const HistoryPage = lazy(() => import('./pages/History/HistoryPage').then(m => ({ default: m.HistoryPage })));
const PdfReaderPage = lazy(() => import('./pages/PdfReader/PdfReaderPage').then(m => ({ default: m.PdfReaderPage })));
const AdminDashboardPage = lazy(() => import('./pages/Admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/Legal/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/Legal/TermsPage').then(m => ({ default: m.TermsPage })));
const CreditsPage = lazy(() => import('./pages/Legal/CreditsPage').then(m => ({ default: m.CreditsPage })));

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('access_token') || hash.includes('refresh_token') || search.includes('code=')) {
        return 'home';
      }
    }
    return 'splash';
  });
  
  const [isHistoryExperienceActive, setIsHistoryExperienceActive] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const [user, setUser] = useState<UserProfile>(() => {
    return loadLocalProfile() || createGuestProfile();
  });

  // Sync profile when state updates with debouncing
  useEffect(() => {
    saveLocalProfile(user);
    saveUserScoreLocally(user);
    syncProfileWithSupabaseDebounced(user);
  }, [user]);

  // Check active session & listen to Supabase OAuth login
  useEffect(() => {
    let isMounted = true;

    const handleSession = async (sessionUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => {
      const { profile, isNewUser } = await fetchOrCreateUserProfile(sessionUser);
      if (!isMounted) return;

      setUser(profile);
      setActiveScreen(curr => (curr === 'splash' ? 'home' : curr));

      if (isNewUser || !profile.age || !profile.has_completed_onboarding) {
        setShowTutorial(true);
      }

      // Clean up OAuth hash parameters from URL
      if (typeof window !== 'undefined' && (window.location.hash.includes('access_token') || window.location.search.includes('code='))) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    // 1. Check current session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSession(session.user);
      }
    });

    // 2. Listen for auth changes (SIGNED_IN, USER_UPDATED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED')) {
        handleSession(session.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Handler for login from Splash
  const handleLoginSuccess = (nickname: string) => {
    setUser(prev => ({
      ...prev,
      nickname,
      display_name: nickname
    }));
    setActiveScreen('home');
    if (!user.has_completed_onboarding || !user.age) {
      setShowTutorial(true);
    }
  };

  // Handler for completing Onboarding Tutorial
  const handleTutorialComplete = (age: number, assignedMode: UserMode) => {
    setUser(prev => {
      const updated: UserProfile = {
        ...prev,
        age,
        mode: assignedMode,
        has_completed_onboarding: true
      };
      syncProfileWithSupabase(updated);
      return updated;
    });
    setShowTutorial(false);
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

      // RULE: If an adult (age >= 13) plays in Kids mode, it's practice only (0 ranking points)
      const isAdultPlayingKids = Boolean(prev.age && prev.age >= 13 && prev.mode === 'kids');

      if (isAdultPlayingKids) {
        addedScore = 0;
      } else {
        if (!completedIds.includes(id)) {
          addedScore = earnedScore;
        } else {
          if (earnedScore > previousHighScore) {
            addedScore = (earnedScore - previousHighScore) + 25;
          } else {
            addedScore = 25;
          }
        }
      }

      const newHighScore = Math.max(previousHighScore, earnedScore);
      const newHighScores = { ...currentHighScores, [id]: newHighScore };
      const newCompletedIds = completedIds.includes(id) ? completedIds : [...completedIds, id];

      const newScore = prev.total_score + addedScore;
      const newLevel = Math.floor(newScore / 400) + 1;

      const updatedProfile = {
        ...prev,
        total_score: newScore,
        level: newLevel,
        games_played: prev.games_played + 1,
        completed_game_ids: newCompletedIds,
        game_high_scores: newHighScores,
        correct_answers_count: prev.correct_answers_count + correctCount,
        total_answers_count: prev.total_answers_count + totalCount
      };

      // Asynchronously submit score to live Supabase backend
      submitGameScoreToSupabase(updatedProfile, id, earnedScore, correctCount, totalCount);

      return updatedProfile;
    });

    // Navigate to ranking so user sees their new position
    setActiveScreen('ranking');
  };

  const showTopBar = activeScreen !== 'splash' && !activeScreen.startsWith('game-') && activeScreen !== 'history';

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950">
      {/* Real-Time Offline Status Indicator */}
      <OfflineIndicator />
      
      {/* Full-Screen Onboarding Tutorial & Age Verification */}
      {showTutorial && (
        <OnboardingTutorial
          user={user}
          onComplete={handleTutorialComplete}
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* Persistent Top Bar Header */}
      {showTopBar && (
        <TopBar
          user={user}
          onNavigate={setActiveScreen}
        />
      )}

      {/* Main Dynamic Screen Routing with Suspense Lazy Loading */}
      <main className="flex-1 animate-in fade-in duration-200">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <UiverseLoader text="CARGANDO EXPERIENCIA..." />
            </div>
          }
        >
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

          {/* 5 Minigames + Final Challenge (Lazy Loaded) */}
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

          {/* Exploration & Management (Lazy Loaded) */}
          {activeScreen === 'history' && (
            <HistoryPage
              onNavigate={setActiveScreen}
              onExperienceChange={setIsHistoryExperienceActive}
              onFinishGame={handleFinishGame}
            />
          )}

          {activeScreen === 'pdf-history' && (
            <PdfReaderPage
              onNavigate={setActiveScreen}
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

          {activeScreen === 'privacy' && (
            <PrivacyPolicyPage
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === 'terms' && (
            <TermsPage
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === 'credits' && (
            <CreditsPage
              onNavigate={setActiveScreen}
            />
          )}
        </Suspense>
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

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
