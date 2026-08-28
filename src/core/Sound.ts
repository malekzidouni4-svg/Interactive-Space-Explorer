export class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private ambientOsc: OscillatorNode | null = null;

  init(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.ambientOsc) {
      this.ambientOsc.stop();
      this.ambientOsc = null;
    } else if (!this.isMuted) {
      this.startAmbientSound();
    }
    return this.isMuted;
  }

  playClickSound(): void {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      // Ignored if browser blocks audio autoplay
    }
  }

  startAmbientSound(): void {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      if (this.ambientOsc) return;

      this.ambientOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      this.ambientOsc.type = "sine";
      this.ambientOsc.frequency.setValueAtTime(110, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.ambientOsc.connect(gain);
      gain.connect(this.ctx.destination);

      this.ambientOsc.start();
    } catch (e) {
      // Ignored
    }
  }
}
