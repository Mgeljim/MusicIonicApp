import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorClaro = 'var(--color-claro)';
  colorOscuro = 'var(--color-oscuro';
  colorActual = this.colorOscuro;
  //[Tarea]: agregar informacion de minino 3 slides para mostrar en la vista
  //[Tarea]: cambiar mediante el click de un boton el tema (color) de los slides.
  genres = [
    {
      title: "Musica Clasica",
      image: "https://tse2.mm.bing.net/th/id/OIP.TN1mkKRFHFjmvedS-gRMewHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      description: "Lorem ipsum is a placeholder or dummy text used in typesetting and graphic design for previewing layouts. It features scrambled Latin text, which emphasizes the design over content of the layout. It is the standard placeholder text of the printing and publishing industries. It does not have any meaningful content and is often used to fill spaces in design mockups."
    }
  ]
  constructor(private storageServcie: StorageService) {}

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
        resolve(['Rock', 'Pop', 'Jazz'])
        //reject("hubo error al obtener los datos")
      }, 6000)
    })
  }

  //crear una funcion para ir a ver la intro se va conectar con un boton que debomos agregar en el html y al hacer click ejecute esta funcion apra llevarma a ver la intro
}
