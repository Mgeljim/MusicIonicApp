import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Verificar si el usuario está logueado
    const isLoggedIn = await this.authService.isLoggedIn();
    
    // Si no está logueado, redirigir al login
    if (!isLoggedIn) {
      console.log('Usuario no está logueado, redirigiendo al login...');
      this.router.navigateByUrl('/login');
      return false;
    }
    
    // Si está logueado, permitir el acceso
    console.log('Usuario está logueado, permitiendo acceso');
    return true;
  }
}

