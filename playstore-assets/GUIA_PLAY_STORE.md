# 🚀 Guía Maestra de Publicación en Google Play Store · SISMO LAB

Esta guía contiene **todo** lo necesario para publicar **SISMO LAB** en Google Play Store paso a paso, con los archivos exactos, textos oficiales ya redactados y respuestas preconfiguradas para los cuestionarios de Google.

---

## 📁 1. Recursos Gráficos Listos en la Carpeta `playstore-assets/`

Ya generamos y verificamos los recursos obligatorios con los tamaños exactos que exige Google:

| Archivo | Tipo | Tamaño | Estado |
| :--- | :--- | :--- | :---: |
| `icon-512x512.png` | Icono de alta resolución | 512 x 512 px (PNG 32-bit) | ✅ Listo |
| `feature-graphic-1024x500.png` | Gráfico de funciones | 1024 x 500 px (PNG sin canal alfa) | ✅ Listo |
| `screenshot-1-inicio.png` | Captura 1: Portada & Modo Selección | 1082 x 2402 px | ✅ Listo |
| `screenshot-2-misiones.png` | Captura 2: Centro de Misiones Niños | 1082 x 2402 px | ✅ Listo |
| `screenshot-3-historia.png` | Captura 3: Línea de Tiempo Histórica | 1082 x 2402 px | ✅ Listo |
| `screenshot-4-prevencion.png` | Captura 4: Guías y Prevención | 1082 x 2402 px | ✅ Listo |

---

## 📦 2. Cómo Generar el Paquete `.aab` en 2 Minutos (Vía PWABuilder)

Para empaquetar tu PWA como una aplicación nativa de Android (.aab) firmada:

1. Entra a [PWABuilder.com](https://www.pwabuilder.com/) desde tu navegador.
2. Ingresa la URL de tu app: `https://sismolab-one.vercel.app/` y presiona **Start**.
3. PWABuilder comprobará tu manifest y Service Worker (obtendrá un puntaje excelente).
4. Haz clic en el botón verde **Package for Store**.
5. En la sección **Android (Google Play)**, haz clic en **Options**:
   * **Package ID**: `com.zioncode.sismolab`
   * **App Name**: `SISMO LAB`
   * **Short Name**: `SISMO LAB`
   * **Version Code**: `1`
   * **Version Name**: `1.0.0`
   * **Signing Key**: Selecciona **Generate a new key** (o genera una nueva).
6. Haz clic en **Generate Package** / **Download**.
7. Te descargará un archivo `.zip`. Al descomprimirlo tendrás:
   * `app-release.aab` (¡Este es el archivo que se sube a Google Play!).
   * `signing.keystore` (Guarda este archivo bajo llave, es la clave de firma de tu app).
   * Un archivo de texto con las contraseñas de la clave.
   * `assetlinks.json` con tu huella digital SHA-256.

---

## 🔗 3. Vincular tu Dominio Web con la App (Ocultar Barra del Navegador)

Para que Android reconozca que la app y la web son del mismo dueño y **no muestre la barra de Chrome** (experiencia 100% nativa de pantalla completa):

1. En el archivo `assetlinks.json` que descargaste de PWABuilder (o desde Google Play Console > *Firma de apps de Play*), copia el valor de `sha256_cert_fingerprints`.
2. Pégalo en el archivo [`public/.well-known/assetlinks.json`](file:///c:/Users/julian/Desktop/WEBS/Proyectos%20Terminados/SismoEdu/public/.well-known/assetlinks.json) de este proyecto.
3. Haz un `git push` a tu repositorio para que Vercel lo despliegue.
4. Puedes verificarlo abriendo en tu navegador: `https://sismolab-one.vercel.app/.well-known/assetlinks.json`.

---

## 📝 4. Textos para la Ficha de Play Store (Copiar y Pegar)

### Nombre de la app (Máx. 30 caracteres)
```text
SISMO LAB
```

### Descripción breve (Máx. 80 caracteres)
```text
Plataforma interactiva y gamificada de prevención y ciencia sísmica de San Juan.
```

### Descripción completa (Hasta 4000 caracteres)
```text
⚡ SISMO LAB · Prevención Sísmica San Juan & Zion Code
Plataforma Educativa, Gamificada e Interactiva de Prevención Sísmica y Ciencias de la Tierra.

SISMO LAB es una aplicación educativa interactiva diseñada para concientizar y entrenar a niños, jóvenes y adultos sobre el fenómeno sísmico, la historia geológica de la provincia de San Juan y las pautas oficiales de autoprotección comunitaria.

El proyecto combina pedagogía sismológica, gamificación moderna, gráficos envolventes y funcionamiento 100% Offline para su uso en escuelas, stands interactivos, ferias de ciencias y dispositivos familiares.

🌟 CARACTERÍSTICAS PRINCIPALES:

🎮 CENTRO DE MISIONES Y MINIJUEGOS:
Adapta su lenguaje y dificultad en dos modalidades:
• Modo Niños (4 a 12 años)
• Modo Jóvenes y Adultos (13+ años)

1. ¿Qué es un Sismo? (Física y Ondas Sísmicas): Descubrí las placas tectónicas (Nazca y Sudamericana), hipocentro, epicentro y ondas P y S.
2. Mochila de Emergencia (72 Horas): Selección táctica de insumos esenciales de supervivencia descartando distractores.
3. Reflejos en Acción (4 Segundos): Entrenamiento contra reloj para ejecutar la maniobra universal: Agacharse, Cubrirse y Sujetarse.
4. ¿Qué Harías Vos? (Toma de Decisiones): Escenarios situacionales en escuelas, vía pública, autos y viviendas.
5. Casa Segura: Detección interactiva de riesgos hogareños y recomendaciones constructivas sismorresistentes.
6. Mitos vs. Realidades: Derribando falsas creencias populares (viento zonda, predicción exacta, marcos de puertas).

🗺️ EXPLORADOR DE HISTORIA SÍSMICA:
Línea de tiempo interactiva con fichas técnicas y mapas de los grandes hitos sísmicos de San Juan:
• 1894: El Gran Terremoto Argentino.
• 1944: Hito histórico del hormigón armado y reconstrucción.
• 1977: Terremoto de Caucete y licuación de suelos.
• 2021: Terremoto de Pocito / Media Agua.

📶 100% OFFLINE:
Funciona completamente sin conexión a internet una vez descargada, ideal para el aula o zonas con baja señal.

🎭 AVATARES Y LOGROS:
Colecciona avatares representativos de la fauna autóctona cuyana (Cóndor, Guanaco, Puma, Zorro) y profesionales de la geología y protección civil.

🌐 BILINGÜE:
Disponible en Español y en Inglés.

---
Desarrollado por Zion Code para la Escuela Policía Federal Argentina (San Juan).
Educación y preparación ciudadana para salvar vidas.
```

---

## ⚖️ 5. Enlace Legal y Configuración de Privacidad

* **URL de Política de Privacidad**:
  ```text
  https://sismolab-one.vercel.app/privacy.html
  ```
  *(Ya creada y validada en `public/privacy.html`).*

---

## 📋 6. Cuestionarios en Google Play Console

### A. Clasificación de contenido (IARC)
* **Correo de contacto**: Tu correo (ej. `zioncode25@gmail.com`).
* **Categoría**: *Educación* o *Juegos / Preguntas*.
* **Violencia, sangre, lenguaje soez, sustancias**: Responder **NO** a todo.
* **Resultado esperado**: Clasificación PEGI 3 / ESRB Everyone / Apta para todo público.

### B. Seguridad de los datos (Data Safety)
* ¿Tu app recopila o comparte datos personales obligatorios?: **NO**.
* ¿La app permite crear una cuenta o iniciar sesión?: **SÍ (Opcional mediante Google Login / Supabase para guardar el puntaje del ranking)**.
* Tipos de datos recopilados:
  * *Información personal*: Nombre / Correo (solo para autenticación y guardado de progreso escolar).
  * *Actividad en la app*: Interacciones con el juego (puntaje en el ranking).
* ¿Los datos se transfieren a través de una conexión cifrada?: **SÍ (HTTPS)**.
* ¿Los usuarios pueden solicitar que se eliminen sus datos?: **SÍ (mediante el correo de contacto)**.

### C. Público objetivo y Familias (Recomendación Estratégica)
* En el paso de *Público objetivo*:
  * Si marcas niños (menores de 13 años), Google te exigirá cumplir con la **Política de Familias (Families Policy)** y la normativa COPPA.
  * **Recomendación para tu primera aprobación rápida**: Marca **13 a 17 años y 18 años o más** (o declara que "también puede resultar atractivo para niños"). Esto te permite aprobar la app sin las auditorías complejas de SDKs infantiles en tu primera publicación.

---

## 👥 7. La Regla de los 20 Testers (Closed Testing)

Si tu cuenta de Google Play es Personal:
1. Ve a **Pruebas cerradas (Closed testing)** en Play Console.
2. Crea una pista de prueba cerrada (ej. "Prueba Alfa").
3. Sube tu archivo `app-release.aab`.
4. En la pestaña **Evaluadores (Testers)**:
   * Crea una lista de correos con al menos **20 cuentas de Gmail** (amigos, familiares, docentes, compañeros).
   * O crea un grupo de Google (Google Group) y añade a los evaluadores.
5. Copia el enlace de invitación de prueba (*"Unirse en la Web"* o *"Unirse en Android"*).
6. Los 20 evaluadores deben hacer clic en el enlace, aceptar ser testers y descargar/abrir la app en su teléfono.
7. Deben mantenerla instalada durante **14 días continuos**.
8. Al cumplirse los 14 días, Play Console te habilitará el botón **"Solicitar acceso a producción"**.
