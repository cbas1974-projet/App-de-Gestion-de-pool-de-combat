// Génération de sons de cloche de boxe avec Web Audio API
export class BellSound {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Son de cloche pour début/fin de round
  playBell(type: 'start' | 'end' = 'start'): void {
    const now = this.audioContext.currentTime;

    // Créer un oscillateur pour le son métallique
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Fréquence de base pour le son de cloche
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    // Envelope pour le son
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    oscillator.start(now);
    oscillator.stop(now + 1.5);

    if (type === 'end') {
      // Triple coup pour la fin
      setTimeout(() => this.playSingleBell(), 200);
      setTimeout(() => this.playSingleBell(), 400);
    }
  }

  // Son simple de cloche
  private playSingleBell(): void {
    const now = this.audioContext.currentTime;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    oscillator.start(now);
    oscillator.stop(now + 0.8);
  }

  // Bip de compte à rebours (10 dernières secondes)
  playCountdown(): void {
    const now = this.audioContext.currentTime;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(600, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  // Alarme pour les validations
  playWarning(): void {
    const now = this.audioContext.currentTime;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(440, now);
    oscillator.frequency.setValueAtTime(550, now + 0.1);
    oscillator.frequency.setValueAtTime(440, now + 0.2);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }
}

export const bellSound = new BellSound();
