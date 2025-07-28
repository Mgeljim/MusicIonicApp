import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  providers: [FormBuilder]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = "";
  isLoading: boolean = false;

  // Añadir los validation_message para password
  validation_messages = {
    email: [
      {
        type: "required", message: "El email es obligatorio."
      },
      {
        type: "email", message: "Email invalido."
      }
    ],
    password: [
      {
        type: "required", message: "La contraseña es obligatoria."
      },
      {
        type: "minlength", message: "La contraseña debe tener al menos 6 caracteres."
      }
    ]
  }

  constructor( 
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required, //Campo obligatorio
          Validators.email //Valida el correo electrinico
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required, //Campo obligatorio
          Validators.minLength(6)
        ])
    )
    })
   }

  ngOnInit() {
    // Verificar si ya está logueado
    this.checkLoginStatus();
  }

  async checkLoginStatus() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.navCtrl.navigateRoot("/home");
    }
  }

  async loginUser(credentials: any) {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";

      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const result = await this.authService.loginUser(credentials);
        
        if (result.success) {
          await loading.dismiss();
          
          // Mostrar mensaje de éxito
          const alert = await this.alertController.create({
            header: 'Éxito',
            message: 'Inicio de sesión exitoso',
            buttons: ['OK']
          });
          await alert.present();
          
          // Navegar al home
          this.navCtrl.navigateRoot("/home");
        }
      } catch (error: any) {
        await loading.dismiss();
        this.isLoading = false;
        
        // Manejar diferentes tipos de errores
        if (typeof error === 'string') {
          this.errorMessage = error;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
        }

        // Mostrar alerta de error
        const alert = await this.alertController.create({
          header: 'Error de Login',
          message: this.errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      this.errorMessage = "Por favor, completa todos los campos correctamente.";
    }
  }

  goToRegister(){
    this.navCtrl.navigateForward("/register");
  }
}