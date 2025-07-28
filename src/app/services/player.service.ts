import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Song {
  id: string;
  name: string;
  artist: string;
  album?: string;
  duration?: number;
  preview_url?: string;
  image?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentSong: Song | null;
  currentTime: number;
  duration: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: HTMLAudioElement;
  private playerStateSubject = new BehaviorSubject<PlayerState>({
    isPlaying: false,
    currentSong: null,
    currentTime: 0,
    duration: 0,
    volume: 1
  });

  public playerState$: Observable<PlayerState> = this.playerStateSubject.asObservable();

  constructor() {
    this.audio = new Audio();
    this.setupAudioEventListeners();
  }

  private setupAudioEventListeners() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.updatePlayerState({
        duration: this.audio.duration
      });
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updatePlayerState({
        currentTime: this.audio.currentTime
      });
    });

    this.audio.addEventListener('ended', () => {
      this.updatePlayerState({
        isPlaying: false,
        currentTime: 0
      });
    });

    this.audio.addEventListener('play', () => {
      this.updatePlayerState({
        isPlaying: true
      });
    });

    this.audio.addEventListener('pause', () => {
      this.updatePlayerState({
        isPlaying: false
      });
    });
  }

  private updatePlayerState(updates: Partial<PlayerState>) {
    const currentState = this.playerStateSubject.value;
    this.playerStateSubject.next({
      ...currentState,
      ...updates
    });
  }

  // Establecer y reproducir una nueva canción
  playSong(song: Song) {
    // Si hay una URL de preview, usarla; si no, usar una URL de muestra
    const audioUrl = song.preview_url || `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`;
    
    this.audio.src = audioUrl;
    this.updatePlayerState({
      currentSong: song,
      currentTime: 0
    });
    
    this.audio.load();
    this.play();
  }

  // Reproducir audio
  play() {
    if (this.audio.src) {
      this.audio.play().catch(error => {
        console.error('Error al reproducir audio:', error);
      });
    }
  }

  // Pausar audio
  pause() {
    this.audio.pause();
  }

  // Alternar play/pause
  togglePlayPause() {
    if (this.playerStateSubject.value.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Detener reproducción
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.updatePlayerState({
      isPlaying: false,
      currentTime: 0
    });
  }

  // Establecer posición de reproducción
  seekTo(time: number) {
    if (this.audio.duration) {
      this.audio.currentTime = time;
      this.updatePlayerState({
        currentTime: time
      });
    }
  }

  // Establecer volumen
  setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.updatePlayerState({
      volume: this.audio.volume
    });
  }

  // Obtener estado actual
  getCurrentState(): PlayerState {
    return this.playerStateSubject.value;
  }

  // Formatear tiempo en mm:ss
  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

