import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  providers: [FormBuilder]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;

  // Mensajes de validación para todos los campos
  validation_messages = {
    nombre: [
      {
        type: "required", message: "El nombre es obligatorio."
      },
      {
        type: "minlength", message: "El nombre debe tener al menos 2 caracteres."
      },
      {
        type: "pattern", message: "El nombre solo puede contener letras."
      }
    ],
    apellido: [
      {
        type: "required", message: "El apellido es obligatorio."
      },
      {
        type: "minlength", message: "El apellido debe tener al menos 2 caracteres."
      },
      {
        type: "pattern", message: "El apellido solo puede contener letras."
      }
    ],
    email: [
      {
        type: "required", message: "El email es obligatorio."
      },
      {
        type: "email", message: "Email inválido."
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
    this.registerForm = this.formBuilder.group({
      nombre: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
        ])
      ),
      apellido: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.email
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6)
        ])
      )
    });
  }

  ngOnInit() {
  }

  async registerUser(userData: any) {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const loading = await this.loadingController.create({
        message: 'Registrando usuario...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const result = await this.authService.registerUser(userData);
        
        if (result.success) {
          await loading.dismiss();
          this.isLoading = false;
          
          // Mostrar mensaje de éxito
          const alert = await this.alertController.create({
            header: 'Registro Exitoso',
            message: 'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.navigateBack("/login");
                }
              }
            ]
          });
          await alert.present();
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
          header: 'Error de Registro',
          message: this.errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      this.errorMessage = "Por favor, completa todos los campos correctamente.";
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack("/login");
  }
}
