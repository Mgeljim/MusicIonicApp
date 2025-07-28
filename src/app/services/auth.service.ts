import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlServer = "http://music.fly.dev";

  constructor(private storageService: StorageService) {}

  async loginUser(credentials: any): Promise<any> {
    try {
      const response = await fetch(`${this.urlServer}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: { ...credentials } })
      });

      const data = await response.json();

      // [tarea]: si el login es exitoso guardar en el storage "login: true"
      if (response.ok && data?.token) {
        await this.storageService.set('login', true);
        await this.storageService.set('userToken', data.token); // opcional
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: any): Promise<any> {
    try {
      const response = await fetch(`${this.urlServer}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: { ...data } })
      });

      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const loginStatus = await this.storageService.get('login');
    return loginStatus === true;
  }

  async logout(): Promise<void> {
    await this.storageService.remove('login');
    await this.storageService.remove('userToken'); // opcional
  }

  async registerUser(userData: any) {
    return new Promise(async (accept, reject) => {
      try {
        if (userData.nombre && userData.apellido && userData.email && userData.password) {
          await this.storageService.set('userData', userData);
          accept("Registro exitoso");
        } else {
          reject("Todos los campos son obligatorios");
        }
      } catch (error) {
        reject("Error en el registro");
      }
    });
  }
}
