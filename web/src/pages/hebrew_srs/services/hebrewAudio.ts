/**
 * Servicio de Audio Nativo para Hebreo Bíblico con Web Speech API
 * Reproducción en idioma hebreo ('he-IL') sin dependencias externas
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
   * Reproduce el sonido de la letra / combinación con Niqqud
   * @param symbol Texto o glifo hebreo a pronunciar (ej. 'בָּ')
   * @param phoneticFallback Fonética auxiliar de respaldo si la síntesis pura falla
   */
  public static speak(symbol: string, phoneticFallback?: string): Promise<boolean> {
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
      utterance.rate = 0.85; // Velocidad ligeramente pausada para audición didáctica
      utterance.pitch = 1.0;

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
}
