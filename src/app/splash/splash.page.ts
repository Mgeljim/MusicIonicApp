import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface Particle {
  x: number;
  y: number;
  delay: number;
}

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SplashPage implements OnInit {
  showLogo = false;
  showText = false;
  showParticles = false;
  particles: Particle[] = [];

  constructor(private router: Router) {
    this.generateParticles();
  }

  ngOnInit() {
    this.startSplashSequence();
  }

  private startSplashSequence() {
    // Mostrar logo después de 300ms
    setTimeout(() => {
      this.showLogo = true;
    }, 300);

    // Mostrar texto después de 1.5s
    setTimeout(() => {
      this.showText = true;
    }, 1500);

    // Mostrar partículas después de 2.5s
    setTimeout(() => {
      this.showParticles = true;
    }, 2500);

    // Navegar a la página principal después de 4.5s
    setTimeout(() => {
      this.navigateToMain();
    }, 4500);
  }

  private generateParticles() {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 2000
      });
    }
  }

  private async navigateToMain() {
    // Añadir clase de fade out
    const splashContainer = document.querySelector('.splash-container');
    if (splashContainer) {
      splashContainer.classList.add('fade-out');
    }

    // Navegar después de la animación de salida
    setTimeout(() => {
      // Navegar a home, que activará los guards automáticamente
      this.router.navigate(['/home']);
    }, 800);
  }
}

