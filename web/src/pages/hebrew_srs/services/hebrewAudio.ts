/**
 * Servicio de Audio Nativo y Verificación de Pronunciación para Hebreo Bíblico
 * Soporta Web Speech API (Síntesis) con Modo Normal y Modo Tortuga Lenta (🐢)
 * Soporta Web Speech Recognition para validación de pronunciación en voz alta ('he-IL')
 */

export class HebrewAudioService {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

  private static hebrewVoice: SpeechSynthesisVoice | null = null;
  private static isInitialized = false;

  /**
   * Inicializa y busca la mejor voz en hebreo disponible en el navegador
   */
  public static initVoices(): void {
    if (!this.synth || this.isInitialized) return;

    const findVoice = () => {
      const voices = this.synth?.getVoices() || [];
      // Buscar voz con código 'he-IL' o 'he'
      this.hebrewVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('he')) ||
        voices.find((v) => v.lang.toLowerCase().includes('iw')) || // Antiguo código ISO para hebreo
        null;
      this.isInitialized = true;
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  /**
   * Reproduce el sonido en Hebreo Bíblico con opción de velocidad Normal o Tortuga Lenta (🐢)
   * @param symbol Texto o glifo hebreo a pronunciar (ej. 'בָּרוּךְ')
   * @param phoneticFallback Fonética auxiliar de respaldo
   * @param speedMode 'normal' (0.85x) o 'turtle' (0.45x) para articulación silábica hiperdetallada
   */
  public static speak(
    symbol: string,
    phoneticFallback?: string,
    speedMode: 'normal' | 'turtle' = 'normal'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('[HebrewAudio] Web Speech API no soportada en este entorno');
        resolve(false);
        return;
      }

      this.initVoices();

      // Cancelar cualquier locución en curso para evitar superposiciones
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }

      const textToSpeak = symbol || phoneticFallback || '';
      if (!textToSpeak.trim()) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'he-IL';

      // Configuración de velocidad y tono según el modo
      if (speedMode === 'turtle') {
        utterance.rate = 0.45; // Modo tortuga para audición fonética detallada
        utterance.pitch = 0.95;
      } else {
        utterance.rate = 0.85; // Velocidad pausada didáctica
        utterance.pitch = 1.0;
      }

      if (this.hebrewVoice) {
        utterance.voice = this.hebrewVoice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = (err) => {
        console.warn('[HebrewAudio] Advertencia de locución:', err);
        resolve(false);
      };

      try {
        this.synth.speak(utterance);
      } catch (e) {
        console.warn('[HebrewAudio] Fallo al invocar speak():', e);
        resolve(false);
      }
    });
  }

  /**
   * Comprueba si el reconocimiento de voz está soportado en este navegador
   */
  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  /**
   * Escucha la pronunciación del usuario por el micrófono y valida si coincide con el texto esperado
   */
  public static listenPronunciation(
    expectedText: string,
    timeLimitMs = 4500
  ): Promise<{
    success: boolean;
    spokenText: string;
    isMatch: boolean;
    message: string;
  }> {
    return new Promise((resolve) => {
      const SpeechRecognitionClass =
        (window as unknown as { SpeechRecognition?: new () => any }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        resolve({
          success: false,
          spokenText: '',
          isMatch: false,
          message: 'Tu navegador no soporta reconocimiento de voz. Usa la comparación de audio.',
        });
        return;
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'he-IL';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;

        let hasResult = false;
        const timer = setTimeout(() => {
          if (!hasResult) {
            try {
              recognition.stop();
            } catch (e) {}
            resolve({
              success: true,
              spokenText: '',
              isMatch: false,
              message: 'Tiempo agotado. Intenta hablar más cerca del micrófono.',
            });
          }
        }, timeLimitMs);

        recognition.onresult = (event: any) => {
          hasResult = true;
          clearTimeout(timer);

          const transcript = event.results[0]?.[0]?.transcript?.trim() || '';
          const cleanExpected = expectedText.replace(/[\u0591-\u05C7]/g, '').trim(); // Quitar diacríticos para cotejar consonantes
          const cleanSpoken = transcript.replace(/[\u0591-\u05C7]/g, '').trim();

          const isMatch =
            cleanExpected.length > 0 &&
            (cleanSpoken.includes(cleanExpected) || cleanExpected.includes(cleanSpoken));

          resolve({
            success: true,
            spokenText: transcript,
            isMatch,
            message: isMatch
              ? '¡Excelente pronunciación!'
              : `Detectado: "${transcript}". Escucha el audio de referencia.`,
          });
        };

        recognition.onerror = (err: any) => {
          hasResult = true;
          clearTimeout(timer);
          resolve({
            success: false,
            spokenText: '',
            isMatch: false,
            message: 'No se detectó audio del micrófono o se denegó el permiso.',
          });
        };

        recognition.start();
      } catch (e) {
        resolve({
          success: false,
          spokenText: '',
          isMatch: false,
          message: 'Error al iniciar el micrófono.',
        });
      }
    });
  }
}
