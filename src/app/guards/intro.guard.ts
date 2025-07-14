import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class IntroGuard implements CanActivate {
  canActivate(){
    //obtener del storage si ya vi la intro y dependiendo del resultado dejar pasar o no hacia el home
    //en caso false (osea no vi la intro aun) redireccionar con angular router hacia la intro nuevamente 
    return true;
  }
}
