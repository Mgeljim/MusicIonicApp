import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavParams, IonicModule, ModalController } from '@ionic/angular';
import { MusicService } from '../services/music.service';

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
    private musicService: MusicService
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

  // Cerrar el modal
  async closeModal() {
    await this.modalController.dismiss();
  }
}

