import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storageService: StorageService) { }

  async loginUser(credentials: any){
    //[tarea]: si el login es exito guardar en el storage "login:true"
    return new Promise(async (accept, reject) =>{
      if (
        credentials.email == "mgeljim@gmail.com" &&
        credentials.password == "Qwerty123"
      ){
        // Guardar en el storage que el usuario está logueado
        await this.storageService.set('login', true);
        accept("login correcto")
      }else{
        reject("login incorrecto")
      }
    })
  }

  // Método para verificar si el usuario está logueado
  async isLoggedIn(): Promise<boolean> {
    const loginStatus = await this.storageService.get('login');
    return loginStatus === true;
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    await this.storageService.remove('login');
  }
}
