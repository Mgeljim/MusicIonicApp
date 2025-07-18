import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntroPage implements OnInit {

  // Variables para el tema
  isDarkTheme = false;
  
  // Slides dinámicos con contenido
  slides = [
    {
      title: 'Bienvenido a MusicApp',
      subtitle: 'Tu música favorita en un solo lugar',
      content: 'Descubre millones de canciones, crea tus propias playlists y disfruta de la mejor calidad de audio.',
      icon: 'musical-notes',
      color: 'primary'
    },
    {
      title: 'Playlists Personalizadas',
      subtitle: 'Crea y organiza tu música',
      content: 'Organiza tus canciones favoritas en playlists personalizadas y compártelas con tus amigos.',
      icon: 'list',
      color: 'secondary'
    },
    {
      title: 'Calidad Premium',
      subtitle: 'Audio de alta fidelidad',
      content: 'Disfruta de tu música con la mejor calidad de audio disponible en el mercado.',
      icon: 'volume-high',
      color: 'tertiary'
    },
    {
      title: 'Sincronización',
      subtitle: 'Accede desde cualquier dispositivo',
      content: 'Sincroniza tu música en todos tus dispositivos y continúa escuchando donde lo dejaste.',
      icon: 'sync',
      color: 'success'
    }
  ];

  constructor(private router: Router, private storageService: StorageService) { }

  ngOnInit() {
  }

  // Cambiar tema
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  // Función para ver la intro nuevamente
  resetIntro() {
    this.storageService.remove('introSeen');
    console.log('Intro reseteada - se puede ver nuevamente');
  }

  // Navegar al home y guardar que ya vio la intro
  async goToHome() {
    await this.storageService.set('introSeen', true);
    console.log('Navegando al home y guardando que ya vio la intro');
    this.router.navigateByUrl('/home');
  }

  goBack(){
    console.log("Volver - Intentando ir a la página anterior o al login");
    // Intenta ir a la página anterior en el historial del navegador
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Si no hay historial, redirige a la página de login o a una página predeterminada
      this.router.navigateByUrl("/login"); // O la ruta que consideres adecuada como "página anterior"
    }
  }
}