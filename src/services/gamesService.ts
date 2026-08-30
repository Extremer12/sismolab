import {
  Question,
  NumericQuestion,
  SafeHomeHazard,
  EmergencyKitItem,
  ScenarioChoice,
  MythStatement,
  HistoricalEvent,
  SeismicEvent,
  Achievement,
  UserMode
} from '../types';

// Import curated content for ES and EN
import {
  NUMERIC_QUESTIONS_ADULTS,
  NUMERIC_QUESTIONS_KIDS,
  WHAT_IS_SEISMIC_QUESTIONS,
  KIDS_SEISMIC_QUESTIONS,
  SAFE_HOME_HAZARDS,
  EMERGENCY_KIT_ITEMS,
  SCENARIO_CHOICES,
  KIDS_SCENARIO_CHOICES,
  MYTH_STATEMENTS,
  KIDS_MYTH_STATEMENTS,
  HISTORICAL_EVENTS,
  SEISMIC_MAP_EVENTS,
  OFFICIAL_ACHIEVEMENTS
} from './gamesContentEs';

import {
  WHAT_IS_SEISMIC_QUESTIONS_EN,
  KIDS_SEISMIC_QUESTIONS_EN,
  MYTH_STATEMENTS_EN,
  KIDS_MYTH_STATEMENTS_EN,
  SCENARIO_CHOICES_EN,
  KIDS_SCENARIO_CHOICES_EN,
  NUMERIC_QUESTIONS_ADULTS_EN,
  NUMERIC_QUESTIONS_KIDS_EN
} from './gamesContentEn';

// Re-export constants for full backwards compatibility
export {
  NUMERIC_QUESTIONS_ADULTS,
  NUMERIC_QUESTIONS_KIDS,
  WHAT_IS_SEISMIC_QUESTIONS,
  KIDS_SEISMIC_QUESTIONS,
  SAFE_HOME_HAZARDS,
  EMERGENCY_KIT_ITEMS,
  SCENARIO_CHOICES,
  KIDS_SCENARIO_CHOICES,
  MYTH_STATEMENTS,
  KIDS_MYTH_STATEMENTS,
  HISTORICAL_EVENTS,
  SEISMIC_MAP_EVENTS,
  OFFICIAL_ACHIEVEMENTS
};

function getCurrentLanguage(): 'es' | 'en' {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('sismolab_app_lang_v1');
    if (lang === 'en') return 'en';
  }
  return 'es';
}

// 1. Selector de Preguntas Numéricas (Código Sísmico)
export function getRandomNumericQuestions(count: number = 5, mode: UserMode = 'kids'): NumericQuestion[] {
  const lang = getCurrentLanguage();
  let pool: NumericQuestion[];

  if (lang === 'en') {
    pool = mode === 'kids' ? NUMERIC_QUESTIONS_KIDS_EN : NUMERIC_QUESTIONS_ADULTS_EN;
  } else {
    pool = mode === 'kids' ? NUMERIC_QUESTIONS_KIDS : NUMERIC_QUESTIONS_ADULTS;
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, pool.length));
}

// 2. Selector de Preguntas ¿Qué es un sismo?
export function getRandomQuestions(count: number = 5, userMode: UserMode = 'kids', lang?: 'es' | 'en'): Question[] {
  const currentLang = lang || getCurrentLanguage();
  let pool: Question[];
  if (currentLang === 'en') {
    pool = userMode === 'kids' ? KIDS_SEISMIC_QUESTIONS_EN : WHAT_IS_SEISMIC_QUESTIONS_EN;
  } else {
    pool = userMode === 'kids' ? KIDS_SEISMIC_QUESTIONS : WHAT_IS_SEISMIC_QUESTIONS;
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 3. Selector de Escenarios ¿Qué harías?
export function getRandomScenarios(count: number = 4, userMode: UserMode = 'kids', lang?: 'es' | 'en'): ScenarioChoice[] {
  const currentLang = lang || getCurrentLanguage();
  let pool: ScenarioChoice[];
  if (currentLang === 'en') {
    pool = userMode === 'kids' ? KIDS_SCENARIO_CHOICES_EN : SCENARIO_CHOICES_EN;
  } else {
    pool = userMode === 'kids' ? KIDS_SCENARIO_CHOICES : SCENARIO_CHOICES;
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 4. Selector de Mitos o Realidades
export function getRandomMyths(count: number = 5, userMode: UserMode = 'kids', lang?: 'es' | 'en'): MythStatement[] {
  const currentLang = lang || getCurrentLanguage();
  let pool: MythStatement[];
  if (currentLang === 'en') {
    pool = userMode === 'kids' ? KIDS_MYTH_STATEMENTS_EN : MYTH_STATEMENTS_EN;
  } else {
    pool = userMode === 'kids' ? KIDS_MYTH_STATEMENTS : MYTH_STATEMENTS;
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
