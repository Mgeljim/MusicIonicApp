import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlServer = "https://music.fly.dev";

  constructor(private storageService: StorageService) {}

  async loginUser(credentials: any): Promise<any> {
    try {
      const response = await fetch(`${this.urlServer}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            email: credentials.email,
            password: credentials.password
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar estado de login y datos del usuario
        await this.storageService.set('login', true);
        if (data.token) {
          await this.storageService.set('userToken', data.token);
        }
        if (data.user) {
          await this.storageService.set('userData', data.user);
        }
        return { success: true, data: data };
      } else {
        throw data.error || 'Error en el login';
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async registerUser(userData: any): Promise<any> {
    try {
      // Mapear los campos del formulario a los esperados por la API
      const userPayload = {
        user: {
          email: userData.email,
          password: userData.password,
          name: `${userData.nombre} ${userData.apellido}`,
          username: userData.email.split('@')[0] // Usar la parte antes del @ como username
        }
      };

      const response = await fetch(`${this.urlServer}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userPayload)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Registro exitoso', data: data };
      } else {
        throw data.error || 'Error en el registro';
      }
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
    try {
      // Intentar hacer logout en el servidor
      const token = await this.storageService.get('userToken');
      if (token) {
        await fetch(`${this.urlServer}/logout`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar storage local independientemente del resultado del servidor
      await this.storageService.remove('login');
      await this.storageService.remove('userToken');
      await this.storageService.remove('userData');
    }
  }

  async getCurrentUser(): Promise<any> {
    return await this.storageService.get('userData');
  }

  async getToken(): Promise<string | null> {
    return await this.storageService.get('userToken');
  }
}