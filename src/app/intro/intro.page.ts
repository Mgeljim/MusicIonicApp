import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IntroPage implements OnInit {

  //organizar to el intro con slides dinamicos 
//minimo 4 slides
//utilizar variable de class
//utilizar ccs utilities
//agregar un boton que nos lleve al home 

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goBack(){
    console.log("Volver")
    this.router.navigateByUrl("/home");
    //al volver atras o volver al home guardar en el storage que ya estuve o vi la pagina de intro
  }
}
