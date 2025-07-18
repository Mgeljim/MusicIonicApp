import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})

export class IntroGuard implements CanActivate {
  
  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Obtener del storage si ya vio la intro
    const introSeen = await this.storageService.get('introSeen');
    
    // Si no ha visto la intro (false o null), redirigir a la intro
    if (!introSeen) {
      console.log('Usuario no ha visto la intro, redirigiendo...');
      this.router.navigateByUrl('/intro');
      return false;
    }
    
    // Si ya vio la intro, permitir el acceso al home
    console.log('Usuario ya vio la intro, permitiendo acceso al home');
    return true;
  }
}
