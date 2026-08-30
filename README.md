# ⚡ SISMO LAB · INPRES San Juan
### *Plataforma Educativa, Gamificada e Interactiva de Prevención Sísmica y Ciencias de la Tierra*

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-FFA000?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

**[🌍 Sitio Web Oficial / Demo](https://sismo-edu.vercel.app/)** • **[📖 Zion Code](https://zion-code.vercel.app/)**

</div>

---

## 📖 Acerca del Proyecto

**SISMO LAB** es una **Progressive Web App (PWA)** educativa, inmersiva y de alto rendimiento diseñada para concientizar y entrenar a niños, jóvenes y adultos sobre el fenómeno sísmico, la historia geológica de la provincia de San Juan y las pautas oficiales de autoprotección establecidas por el **Instituto Nacional de Prevención Sísmica (INPRES)**.

El proyecto combina pedagogía sismológica, gamificación moderna, diseño visual cinematográfico y funcionamiento **100% Offline** para su uso en ferias educativas, escuelas, stands interactivos y dispositivos móviles familiares.

---

## 🌟 Características Principales

### 🎮 1. Centro de Misiones y 6 Minijuegos Educativos
La aplicación adapta su lenguaje, tiempo y dificultad mediante dos modalidades: **Modo Niños** (4 a 12 años) y **Modo Jóvenes y Adultos** (13+ años).

| N° | Misión / Juego | Concepto Pedagógico |
| :---: | :--- | :--- |
| **01** | **¿Qué es un Sismo? / Física y Sismología** | Quiz interactivo sobre placas tectónicas (Nazca y Sudamericana), hipocentro, epicentro, ondas P/S y magnitudes. |
| **02** | **Mochila de Emergencia (72 Horas)** | Selección táctica de insumos de supervivencia (agua, linterna, botiquín, radio) descartando distractores. |
| **03** | **Reflejos en Acción (4 Segundos)** | Entrenamiento de reflejos rápidos para ejecutar la maniobra universal *Agacharse, Cubrirse y Sujetarse*. |
| **04** | **¿Qué Harías Vos? / Decisión Crítica** | Escenarios situacionales en escuelas, vía pública, vehículos, centros comerciales y dormitorios de noche. |
| **05** | **Casa Segura / Estructuras** | Detección interactiva de peligros hogareños y normativas sismorresistentes del INPRES. |
| **06** | **Mitos vs Realidades (Desafío Final)** | Derribando falsas creencias populares (viento zonda, predicción exacta, marcos de puertas, etc.). |

---

### 🗺️ 2. Explorador de Historia Sísmica & Biblioteca Digital
- **Hitos Históricos de San Juan**: Línea de tiempo interactiva con fichas técnicas y mapas de los grandes terremotos de **1894** (Gran Terremoto Argentino), **1944** (Hito fundacional del hormigón armado), **1977** (Caucete y licuación de suelos) y **2021** (Pocito / Media Agua).
- **Lector de Material Educativo (PDFs)**: Visualizador integrado de guías de autoprotección del INPRES.

---

### 🏆 3. Leaderboard & Ranking en Tiempo Real
- **Sincronización con Supabase**: Ranking en vivo de las ferias y eventos escolares.
- **Seguridad & Anti-Cheat**: Función server-side `submit_game_score` con validación de puntaje y políticas **Row Level Security (RLS)**.
- **Persistencia Offline**: Almacenamiento local automático y sincronización en segundo plano con debounce.

---

### 🎭 4. 12 Avatares 3D Coleccionables
Selección de personajes con categorías culturales y científicas:
- **Fauna Cuyana**: *Cóndor Andino Guardián*, *Guanaco Cordillerano*, *Puma Geólogo*, *Zorro del Desierto*.
- **Ciencia y Tecnología**: *Joven Geofísica*, *Geólogo de Campo*, *Ingeniero Sismorresistente*, *Dra. Ciencias de la Tierra*.
- **Protección Civil**: *Niño Explorador 72h*, *Capitana de Simulacros*, *Rescatista Urbano*, *SISMO-BOT Asistente*.

---

### 🌐 5. Bilingüe (Español / Inglés)
Sistema de internacionalización nativo (`useLanguage`) con alternancia instantánea entre español e inglés.

---

### 📶 6. PWA 100% Offline-Ready
- Precacheo integral con **Workbox** y Service Worker de todos los recursos estáticos, imágenes optimizadas WebP y pistas de audio.
- **Indicador de conectividad flotante** que notifica cuando la app opera en modo local o recupera conexión.

---

## 🛠️ Stack Tecnológico

- **Frontend Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Estilos & UI**: [Tailwind CSS 3.4](https://tailwindcss.com/) + Vanilla CSS Custom Tokens
- **PWA & Cache**: [Vite Plugin PWA](https://vite-pwa-org.netlify.app/) + [Workbox](https://developer.chrome.com/docs/workbox)
- **Backend & Autenticación**: [Supabase](https://supabase.com/) (PostgreSQL, Google OAuth, RLS, RPC Security Definer)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Efectos Visuales & Sonido**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) + Web Audio API Sintetizador Nativo
- **Optimización de Assets**: Formato WebP con alta tasa de compresión y respaldo PNG.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- Gestor de paquetes `npm` o `pnpm` / `yarn`

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sismo-edu.git
cd sismo-edu
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-public-key
```

### 4. Iniciar el entorno de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 5. Compilar para producción
```bash
npm run build
```

---

## 🗄️ Esquema de Base de Datos (Supabase)

El script SQL completo para inicializar la base de datos se encuentra en `supabase/schema.sql`:

```sql
-- Extensiones de seguridad
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  auth_user_id UUID UNIQUE,
  nickname TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  avatar_emoji TEXT DEFAULT '🦅',
  age INT,
  mode TEXT DEFAULT 'kids',
  total_score INT DEFAULT 0,
  level INT DEFAULT 1,
  games_played INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  total_answers INT DEFAULT 0,
  completed_game_ids TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de sesiones de juego
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  score INT NOT NULL,
  correct_count INT DEFAULT 0,
  total_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración general y PIN de administración hasheado
CREATE TABLE public.app_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  event_name TEXT DEFAULT 'Feria de Ciencias San Juan',
  stand_id TEXT DEFAULT 'STAND-01',
  admin_pin_hash TEXT NOT NULL,
  is_leaderboard_locked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🏛️ Créditos e Instituciones

- **Desarrollador / Creador**: Cristian Bordon
- **Desarrollo y Diseño**: [Zion Code](https://zion-code.vercel.app/) ([zioncode25@gmail.com](mailto:zioncode25@gmail.com))
- **Institución Educativa**: Escuela Policía Federal Argentina — Directora: Vanessa Lewyle
- **Marco Científico y Normativo**: [Instituto Nacional de Prevención Sísmica (INPRES)](https://www.inpres.gob.ar/), San Juan, Argentina.

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de divulgación comunitaria. Todos los derechos reservados © 2026.
