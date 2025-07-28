import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PlayerService, PlayerState, Song } from '../services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  playerState: PlayerState = {
    isPlaying: false,
    currentSong: null,
    currentTime: 0,
    duration: 0,
    volume: 1
  };

  private playerSubscription?: Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    // Suscribirse a los cambios del estado del reproductor
    this.playerSubscription = this.playerService.playerState$.subscribe(
      state => {
        this.playerState = state;
      }
    );
  }

  ngOnDestroy() {
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }
  }

  // Alternar reproducción/pausa
  togglePlayPause() {
    this.playerService.togglePlayPause();
  }

  // Detener reproducción
  stop() {
    this.playerService.stop();
  }

  // Cambiar posición de reproducción
  onProgressChange(event: any) {
    const newTime = (event.detail.value / 100) * this.playerState.duration;
    this.playerService.seekTo(newTime);
  }

  // Cambiar volumen
  onVolumeChange(event: any) {
    const newVolume = event.detail.value / 100;
    this.playerService.setVolume(newVolume);
  }

  // Obtener progreso como porcentaje
  getProgressPercentage(): number {
    if (!this.playerState.duration) return 0;
    return (this.playerState.currentTime / this.playerState.duration) * 100;
  }

  // Obtener volumen como porcentaje
  getVolumePercentage(): number {
    return this.playerState.volume * 100;
  }

  // Formatear tiempo
  formatTime(seconds: number): string {
    return this.playerService.formatTime(seconds);
  }

  // Verificar si hay una canción cargada
  hasSong(): boolean {
    return this.playerState.currentSong !== null;
  }
}

