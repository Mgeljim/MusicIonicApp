import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController, PopoverController } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { MusicService } from '../services/music.service';
import { Router } from '@angular/router';
import { SongsModalPage } from '../songs-modal/songs-modal.page';
import { MusicPlayerComponent } from '../music-player/music-player.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, MusicPlayerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  // Variables para el tema
  isDarkTheme = false;
  
  // Slides con géneros musicales populares en Latinoamérica
  genres = [
    {
      title: "Reggaeton",
      image: "assets/reggaeton.jpg",
      description: "El género urbano que conquistó el mundo desde Puerto Rico. Con artistas como Bad Bunny, J Balvin y Daddy Yankee liderando las listas globales."
    },
    {
      title: "Salsa",
      image: "assets/salsa.jpg",
      description: "La pasión del Caribe en cada compás. Ritmos vibrantes que hacen bailar a toda Latinoamérica con su sabor inconfundible."
    },
    {
      title: "Bachata",
      image: "assets/bachata.jpg",
      description: "Romance dominicano que conquista corazones. La sensualidad y el amor se expresan en cada guitarra y cada verso de este género."
    },
    {
      title: "Pop Latino",
      image: "assets/pop-latino.jpg",
      description: "La evolución moderna del sonido latino. Artistas como Shakira, Maluma y Karol G fusionan tradición con innovación musical."
    }
  ];

  constructor(
    private storageServcie: StorageService, 
    private router: Router,
    private authService: AuthService,
    private musicService: MusicService,
    private modalController: ModalController,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {}

  async ngOnInit() {
    await this.loadTheme();
    this.simularCargaDatos();
    // Cargar artistas al inicializar la página
    await this.loadArtists();
  }

  // Cambiar tema
  async toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    await this.storageServcie.set('darkTheme', this.isDarkTheme);
    document.body.classList.toggle('dark', this.isDarkTheme);
    console.log('Tema Guardado: ', this.isDarkTheme ? 'Oscuro' : 'Claro');
  }

  async loadTheme(){
    const savedTheme = await this.storageServcie.get('darkTheme');
    if (savedTheme !== null) {
      this.isDarkTheme = savedTheme;
      document.body.classList.toggle('dark', this.isDarkTheme);
    }
  }

  async simularCargaDatos() {
    const data = await this.obtenerDatosSimudalos();
    console.log('Datos simulados: ', data)
  }

  obtenerDatosSimudalos(){
    return new Promise((resolve, reject) =>{
      setTimeout(() =>{
        resolve(['Reggaeton', 'Salsa', 'Bachata', 'Pop Latino'])
        //reject("hubo error al obtener los datos")
      }, 6000)
    })
  }

  // Función para ver la intro nuevamente
  async verIntroNuevamente() {
    // Borrar del Storage la variable que indica que ya se vio la intro
    await this.storageServcie.remove('introSeen');
    console.log('Intro reseteada - redirigiendo a la intro');
    // Redirigir a la vista de introducción
    this.router.navigateByUrl('/intro');
  }

  // Función para cerrar sesión
  async logout() {
    try {
      // Llamar al método logout del servicio de autenticación
      await this.authService.logout();
      console.log("Sesión cerrada exitosamente");
      // Redirigir al login
      this.router.navigateByUrl("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  // ===== NUEVAS FUNCIONALIDADES AÑADIDAS =====
  
  artists: any[] = [];
  isLoadingArtists = false;

  // Función para mostrar canciones de un artista (ShowSongsByArtists)
  async showSongsByArtists(artist: any) {
    try {
      console.log("Obteniendo canciones del artista:", artist.name);
      
      // Obtener canciones del artista desde la API
      const songs = await this.musicService.getTracksByArtist(artist.id);
      
      // Crear el modal con las canciones
      const modal = await this.modalController.create({
        component: SongsModalPage,
        componentProps: {
          songs: songs,
          artistName: artist.name
        }
      });
      
      await modal.present();
    } catch (error) {
      console.error("Error al obtener canciones del artista:", error);
      // Mostrar mensaje de error al usuario
      this.showErrorAlert("Error al cargar las canciones del artista");
    }
  }

  // Cargar artistas desde el servidor
  async loadArtists() {
    try {
      this.isLoadingArtists = true;
      const artistsData = await this.musicService.getArtists();
      this.artists = artistsData;
      console.log("Artistas cargados:", this.artists);
    } catch (error) {
      console.error("Error al cargar artistas:", error);
      this.showErrorAlert("Error al cargar los artistas");
    } finally {
      this.isLoadingArtists = false;
    }
  }

  // Mostrar alerta de error
  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: "Error",
      message: message,
      buttons: ["OK"]
    });
    await alert.present();
  }

  // Función para ver favoritos del usuario
  async viewFavorites() {
    try {
      const favorites = await this.musicService.getUserFavorites();
      
      if (favorites.length === 0) {
        const alert = await this.alertController.create({
          header: "Favoritos",
          message: "No tienes canciones favoritas aún.",
          buttons: ["OK"]
        });
        await alert.present();
        return;
      }

      // Crear modal con las canciones favoritas
      const modal = await this.modalController.create({
        component: SongsModalPage,
        componentProps: {
          songs: favorites,
          artistName: "Mis Favoritos"
        }
      });
      
      await modal.present();
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      this.showErrorAlert("Error al cargar tus canciones favoritas");
    }
  }

  // Función para manejar la selección del menú desplegable
  async onMenuOptionSelected(event: any) {
    const selectedValue = event.detail.value;
    
    switch (selectedValue) {
      case "artists":
        // Recargar artistas
        await this.loadArtists();
        break;
      case "favorites":
        await this.viewFavorites();
        break;
      case "theme":
        await this.toggleTheme();
        break;
      case "intro":
        await this.verIntroNuevamente();
        break;
      case "logout":
        await this.logout();
        break;
      default:
        console.log("Opción no reconocida:", selectedValue);
    }
  }

  // Función para cerrar el popover
  async closePopover() {
    const popover = await this.popoverController.getTop();
    if (popover) {
      await popover.dismiss();
    }
  }
}
