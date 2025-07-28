import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavParams, IonicModule, ModalController } from '@ionic/angular';
import { MusicService } from '../services/music.service';
import { PlayerService, Song } from '../services/player.service';

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SongsModalPage implements OnInit {

  songs: any[] = [];
  artistName: string = '';
  favoriteStates: { [key: string]: boolean } = {};

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private musicService: MusicService,
    private playerService: PlayerService
  ) { }

  async ngOnInit() {
    this.songs = this.navParams.data['songs'] || [];
    this.artistName = this.navParams.data['artistName'] || 'Artista';
    console.log("Canciones recibidas: ", this.songs);
    
    // Cargar el estado de favoritos para cada canción
    await this.loadFavoriteStates();
  }

  // Cargar el estado de favoritos para todas las canciones
  async loadFavoriteStates() {
    for (const song of this.songs) {
      this.favoriteStates[song.id] = await this.musicService.isTrackFavorite(song.id);
    }
  }

  // Alternar estado de favorito
  async toggleFavorite(song: any) {
    try {
      const newState = await this.musicService.toggleFavorite(song);
      this.favoriteStates[song.id] = newState;
      
      console.log(`Canción "${song.name}" ${newState ? 'agregada a' : 'eliminada de'} favoritos`);
    } catch (error) {
      console.error('Error al cambiar estado de favorito:', error);
    }
  }

  // Reproducir canción
  playSong(song: any) {
    // Convertir la canción del API al formato del reproductor
    const playerSong: Song = {
      id: song.id,
      name: song.name,
      artist: this.artistName,
      album: song.album?.name,
      duration: song.duration_ms ? song.duration_ms / 1000 : undefined,
      preview_url: song.preview_url,
      image: song.album?.images?.[0]?.url || song.image
    };

    // Reproducir la canción
    this.playerService.playSong(playerSong);
    
    console.log(`Reproduciendo: ${song.name} - ${this.artistName}`);
    
    // Cerrar el modal después de seleccionar la canción
    this.closeModal();
  }

  // Cerrar el modal
  async closeModal() {
    await this.modalController.dismiss();
  }
}

