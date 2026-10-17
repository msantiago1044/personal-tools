# 📖 Niqqud Lab • Hebreo Bíblico & Siddur SRS

## 🎯 Intención y Propósito del Módulo
El objetivo principal de este módulo es **entrenar y automatizar la lectura fluida del Siddur (libro de oraciones cotidianas), el Jumash y la Torá con Niqqudot**, eliminando el titubeo cognitivo al decodificar consonantes combinadas con signos vocálicos tiberianos.

---

## 🧠 Filosofía Pedagógica y de Diseño
1. **Cero Configuración Manual para el Usuario:**
   El usuario no debe configurar bloques ni metodologías manualmente. El sistema orquesta de forma inteligente y adaptativa qué técnica pedagógica aplicar a cada letra según su grado de consolidación en la memoria.
2. **Experiencia de 2 Botones:**
   - **`▶ Iniciar Mi Sesión de Hoy`:** Sesión diaria guiada de 7 a 10 minutos (10 ejercicios). Aplica repetición espaciada estricta, respeta el reposo biológico (Ítem 1) e introduce tarjetas nuevas cuando no hay repasos vencidos (Ítem 4).
   - **`🔄 Práctica Libre`:** Entrenamiento a voluntad sin límites de tiempo y sin alterar los intervalos del calendario SRS.
3. **Diagnóstico Cognitivo Transparente:**
   El usuario sabe exactamente qué método le funciona mejor mediante métricas duras (latencia en ms medida con `performance.now()` y tasa de retención a 7 y 30 días), presentado en español simple:
   - *Inmediato:* En el modal de felicitaciones al terminar la sesión del día.
   - *Histórico:* En la pestaña permanente de "Métricas".

---

## ⚡ Los 9 Métodos y Mecánicas Integrados
1. **Motor SRS Leitner (5 Cajas):** Intervalos progresivos de 1, 3, 7, 14 y 30 días para consolidación en memoria a largo plazo.
2. **Mnemotecnia Visual:** Anclas y metáforas de forma visual al presentar un signo nuevo por primera vez.
3. **Discriminación de Pares Mínimos:** Ejercicios a contrarreloj de 2 a 3 opciones para no confundir letras/vocales semejantes (`בָּ` vs `בַּ`, `ד` vs `ר`, `שַׁ` vs `שַׂ`, `וֹ` vs `וּ`).
4. **Decodificación Inversa (Cloze):** Escuchar el sonido objetivo y colocar el Niqqud activo correspondiente.
5. **Palabras y Frases Reales del Siddur & Jumash:** Lectura contextual de derecha a izquierda de oraciones sagradas (*Baruj Atah Adonai*, *Shemá Yisrael*, Génesis 1:1).
6. **Ensamblador de Sílabas (Syllable Builder):** Fichas táctiles interactivas para armar palabras bíblicas sílaba por sílaba sin requerir teclado hebreo físico.
7. **Emparejamiento Rápido de Fichas (Match Pairs):** Cuadrícula de 8 fichas (4 símbolos ↔ 4 sonidos) para agilidad mental instantánea.
8. **Audio Dual (Normal + Tortuga Lenta 🐢) y Verificación por Micrófono 🎙️:**
   - Síntesis Web Speech API con velocidad normal (0.85x) y tortuga (0.45x).
   - Reconocimiento de voz en hebreo (`he-IL`) para comprobar la dicción en voz alta.
9. **Racha Diaria (Streak 🔥) y Cierre de Sesión:** Barra de progreso corta (10 pasos) y contador de días consecutivos para afianzar el hábito.

---

## 🗺️ Ruta Curricular de 5 Fases
- **Fase 1:** Vocales A (*Qamats* `ָ` y *Pataj* `ַ`) & *Begadkefat* con/sin Daguesh.
- **Fase 2:** Vocales E (*Tsere* `ֵ` y *Segol* `ֶ`) & el *Sheva* (`ְ`).
- **Fase 3:** Vocales I y O (*Hireq* `ִ` y *Holem* `ֹ / וֹ`).
- **Fase 4:** Vocales U (*Qibbuts* `ֻ` y *Shuruq* `וּ`) & Letras Finales (*Sofit* `ך`, `ם`, `ן`, `ף`, `ץ`).
- **Fase 5:** Textos litúrgicos y versículos continuos del Siddur y Jumash.

---

## 💾 Persistencia Híbrida
- **Supabase Cloud:** Tablas `hebrew_study_blocks`, `hebrew_cards`, `user_hebrew_card_progress`, `hebrew_review_logs`. Esquema en `backend/supabase/hebrew_srs_schema.sql`.
- **LocalStorage Fallback:** Si no hay conexión o no se han corrido las tablas, el módulo funciona al 100% de manera autónoma en el navegador.
