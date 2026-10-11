# 🚀 Guía Maestra de Publicación en Google Play Store · SISMO LAB
### Cumplimiento Total de las Políticas para Desarrolladores de Google Play (Google Play Developer Content Policy)

Esta guía contiene **todo** lo necesario para publicar **SISMO LAB** en Google Play Store paso a paso, con los textos exactos, descargos de responsabilidad obligatorios y respuestas preconfiguradas para que tu aplicación sea aprobada **sin observaciones ni rechazos** por el equipo de revisión de Google Play.

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

## 📦 2. Cómo Generar el Paquete `.aab` (Vía PWABuilder)

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
   * **Signing Key**: Selecciona **Generate a new key** (o sube la keystore existente en `playstore-assets/sismolab-release.keystore`).
6. Haz clic en **Generate Package** / **Download**.
7. Te descargará un archivo `.zip` que contiene `app-release.aab` (el archivo para subir a Google Play Console).

---

## 🔗 3. Vincular tu Dominio Web con la App (Experiencia Nativa Pantalla Completa)

Para que Android reconozca que la app y la web son del mismo titular y **no muestre la barra de navegación de Chrome**:

1. En el archivo `assetlinks.json` que descargaste de PWABuilder (o desde Google Play Console > *Firma de apps de Play*), copia el valor de `sha256_cert_fingerprints`.
2. Pégalo en el archivo [`public/.well-known/assetlinks.json`](file:///c:/Users/julian/Desktop/WEBS/Proyectos%20Terminados/SismoEdu/public/.well-known/assetlinks.json).
3. Haz `git push` para desplegarlo en Vercel.
4. Verifica que responda abriendo: `https://sismolab-one.vercel.app/.well-known/assetlinks.json`.

---

## 📝 4. Textos para la Ficha de Play Store (Optimizados y 100% Conformes a Políticas)

> [!IMPORTANT]
> Google Play exige que cualquier aplicación que mencione instituciones escolares, policiales o científicas incluya un **Descargo de Responsabilidad claro** para no infringir la política de *Impersonation & Government Apps*. El siguiente texto ya incluye todas las cláusulas requeridas.

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

📶 100% OFFLINE Y SIN ANUNCIOS:
Funciona completamente sin conexión a internet una vez descargada. Cero anuncios publicitarios comerciales y cero costos ocultos.

🎭 AVATARES Y LOGROS:
Colecciona avatares representativos de la fauna autóctona cuyana (Cóndor, Guanaco, Puma, Zorro) y profesionales de la geología y protección civil.

🌐 BILINGÜE:
Disponible en Español y en Inglés.

---
⚖️ DESCARGO DE RESPONSABILIDAD INSTITUCIONAL (POLÍTICA DE GOOGLE PLAY):
SISMO LAB es una iniciativa de desarrollo de software educativo concebida por Zion Code para la comunidad escolar de la Escuela Policía Federal Argentina (San Juan). 
Esta aplicación NO representa, no es una aplicación oficial, ni actúa en representación de la Policía Federal Argentina, del Gobierno de la Provincia de San Juan, del Instituto Nacional de Prevención Sísmica (INPRES) ni de ninguna entidad estatal o gubernamental.
La información científica y geológica citada en la app es de divulgación pública general y proviene de los registros del INPRES (www.inpres.gob.ar) con fines exclusivamente pedagógicos y escolares.

🚨 AVISO DE SEGURIDAD ANTE EMERGENCIAS:
SISMO LAB es una herramienta de simulación formativa y entrenamiento escolar. NO es un detector ni un sistema de alerta sísmica en tiempo real. Ante un evento sísmico real, siga siempre las directivas oficiales de Protección Civil, Bomberos y organismos de emergencia.
```

---

## ⚖️ 5. Enlaces Obligatorios de Privacidad y Eliminación de Datos

Google Play Console exige obligatoriamente dos URLs activas en la ficha de la tienda:

1. **URL de Política de Privacidad (Privacy Policy)**:
   ```text
   https://sismolab-one.vercel.app/privacy.html
   ```
2. **URL para solicitud de eliminación de cuentas y datos (Data Deletion URL)**:
   ```text
   https://sismolab-one.vercel.app/delete-account.html
   ```

---

## 📋 6. Cuestionarios en Google Play Console (Paso a Paso)

### A. Acceso a la app
* Seleccionar: **Todas las funciones están disponibles sin restricciones de acceso** (los evaluadores de Google pueden ingresar inmediatamente en modo Explorador sin necesidad de contraseña).

### B. Anuncios (Ads)
* ¿Tu app contiene anuncios?: **NO**.

### C. Aplicaciones gubernamentales (Government Apps)
* ¿Esta app representa a una entidad gubernamental?: **NO**.
  *(Selecciona "No, mi aplicación no representa a una entidad gubernamental").*

### D. Seguridad de los datos (Data Safety)
* ¿Tu app recopila o comparte datos personales obligatorios?: **NO** (el uso es 100% anónimo por defecto).
* ¿La app permite crear una cuenta o iniciar sesión?: **SÍ** (Inicio opcional con Google OAuth / Supabase para guardar puntaje en ranking).
* Tipos de datos recopilados:
  * **Información personal**:
    * *Nombre o apodo*: Recopilado con fin de funcionalidad de la app (ranking escolar). Opcional. No se comparte.
    * *Dirección de correo electrónico*: Recopilado con fin de autenticación y gestión de cuentas. Opcional. No se comparte.
  * **Actividad en la app**:
    * *Interacciones con la app*: Puntuación de misiones y progreso. Opcional. No se comparte.
  * **Identificadores del dispositivo o de otro tipo**:
    * *ID de usuario*: Identificador de usuario de autenticación. Opcional. No se comparte.
* ¿Los datos recopilados se transfieren a través de una conexión segura y cifrada?: **SÍ (HTTPS / TLS)**.
* ¿Los usuarios pueden solicitar que se eliminen sus datos?: **SÍ**.
* **URL de solicitud de eliminación de cuentas**: `https://sismolab-one.vercel.app/delete-account.html`.

### E. Público objetivo y Familias (Target Audience & Families)
* SISMO LAB está diseñada para todo público:
  * Rangos etarios a marcar: **Menores de 13 años (o 5 y menores, 6 a 8, 9 a 12), 13 a 17 años, y 18 años o más**.
  * ¿La app puede atraer a menores de 13 años?: **SÍ**.
  * Cumplimiento de la Política de Familias:
    * ✅ No contiene anuncios comerciales.
    * ✅ No utiliza SDKs de publicidad.
    * ✅ No recopila información personal sensible ni ubicación GPS.
    * ✅ La política de privacidad detalla la protección especial a la niñez (COPPA).
    * ✅ Cuenta con descargo de responsabilidad institucional.

### F. Clasificación de contenido (IARC)
* **Correo de contacto**: `zioncode25@gmail.com`.
* **Categoría**: *Educación* o *Juegos / Preguntas*.
* **Violencia, sangre, lenguaje soez, sustancias, apuestas**: Responder **NO** a todo.
* **Resultado esperado**: Clasificación PEGI 3 / ESRB Everyone / Apta para todo público.

---

## 👥 7. La Regla de los 20 Testers (Closed Testing)

Si tu cuenta de Google Play es Personal (creada después de noviembre de 2023):
1. Ve a **Pruebas cerradas (Closed testing)** en Play Console.
2. Crea una pista de prueba cerrada (ej. "Prueba Alfa").
3. Sube tu archivo `app-release.aab`.
4. En la pestaña **Evaluadores (Testers)**:
   * Añade una lista con al menos **20 cuentas de Gmail**.
5. Comparte el enlace de invitación de prueba (*"Unirse en la Web"* o *"Unirse en Android"*).
6. Los 20 evaluadores deben aceptar la prueba y mantener instalada la app durante **14 días continuos**.
7. Al cumplirse los 14 días, Play Console te habilitará el botón **"Solicitar acceso a producción"**.
