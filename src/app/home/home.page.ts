import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorClaro = '#ffffff';
  colorOscuro = '#1a1a1a';
  colorActual = this.colorClaro;
  
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
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadStorageData();
    this.simularCargaDatos();
  }

  async cambiarColor(){ 
    //if ternario
    this.colorActual = this.colorActual === this.colorOscuro ? this.colorClaro : this.colorOscuro
    await this.storageServcie.set('theme', this.colorActual)
    console.log('Tema Guardado: ', this.colorActual )
  }

  async loadStorageData(){
    const savedTheme = await this.storageServcie.get('theme');
    if (savedTheme) {
      this.colorActual = savedTheme;
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
      console.log('Sesión cerrada exitosamente');
      // Redirigir al login
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
