import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  urlServer = "https://music.fly.dev";
  
  constructor(private storageService: StorageService) { }

  // Obtener todos los tracks
  getTracks() {
    return fetch(`${this.urlServer}/tracks`).then(
      response => response.json()
    );
  }

  // Obtener todos los álbumes
  getAlbums() {
    return fetch(`${this.urlServer}/albums`).then(
      response => response.json()
    );
  }

  // Obtener todos los artistas desde el servidor
  getArtists() {
    return fetch(`${this.urlServer}/artists`).then(
      response => response.json()
    );
  }

  // Obtener canciones de un artista específico
  getTracksByArtist(artistId: string) {
    return fetch(`${this.urlServer}/tracks/artist/${artistId}`).then(
      response => response.json()
    );
  }

  // Obtener canciones de un álbum específico
  getTracksByAlbum(albumId: string) {
    return fetch(`${this.urlServer}/tracks/album/${albumId}`).then(
      response => response.json()
    );
  }

  // Buscar tracks
  searchTracks(query: string) {
    return fetch(`${this.urlServer}/search_track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query })
    }).then(response => response.json());
  }

  //  FAVORITOS 

  // Obtener favoritos del usuario actual (simulado localmente)
  async getUserFavorites(): Promise<any[]> {
    const favorites = await this.storageService.get('userFavorites');
    return favorites || [];
  }

  // Verificar si una canción está en favoritos
  async isTrackFavorite(trackId: string): Promise<boolean> {
    const favorites = await this.getUserFavorites();
    return favorites.some(fav => fav.id === trackId);
  }

  // Agregar una canción a favoritos
  async addToFavorites(track: any): Promise<void> {
    const favorites = await this.getUserFavorites();
    
    // Verificar si ya está en favoritos
    const isAlreadyFavorite = favorites.some(fav => fav.id === track.id);
    
    if (!isAlreadyFavorite) {
      favorites.push(track);
      await this.storageService.set('userFavorites', favorites);
    }
  }

  // Eliminar una canción de favoritos
  async removeFromFavorites(trackId: string): Promise<void> {
    const favorites = await this.getUserFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== trackId);
    await this.storageService.set('userFavorites', updatedFavorites);
  }

  // Alternar estado de favorito (agregar o quitar)
  async toggleFavorite(track: any): Promise<boolean> {
    const isFavorite = await this.isTrackFavorite(track.id);
    
    if (isFavorite) {
      await this.removeFromFavorites(track.id);
      return false; // Ya no es favorito
    } else {
      await this.addToFavorites(track);
      return true; // Ahora es favorito
    }
  }

  // ===== SERVICIOS PARA CONECTAR CON LA API DE FAVORITOS (cuando esté disponible) =====

  // Obtener favoritos desde el servidor
  getFavoritesFromServer() {
    return fetch(`${this.urlServer}/favorite_tracks`).then(
      response => response.json()
    );
  }

  // Obtener favoritos de un usuario específico desde el servidor
  getUserFavoritesFromServer(userId: string) {
    return fetch(`${this.urlServer}/user_favorites/${userId}`).then(
      response => response.json()
    );
  }
}

