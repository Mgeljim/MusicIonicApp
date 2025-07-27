import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
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
      },
      {
        type: "pattern", message: "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número."
      }
    ]
  }

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private navCtrl: NavController
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
          Validators.minLength(6),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]+$')
        ])
      )
    });
  }

  ngOnInit() {
  }

  registerUser(userData: any) {
    console.log('Datos de registro:', userData);
    this.authService.registerUser(userData).then(res => {
      this.errorMessage = "";
      this.successMessage = "Registro exitoso. Redirigiendo al login...";
      
      // Esperar 2 segundos antes de navegar al login
      setTimeout(() => {
        this.navCtrl.navigateForward("/login");
      }, 2000);
      
    }).catch(error => {
      this.successMessage = "";
      this.errorMessage = error;
    });
  }

  goToLogin() {
    this.navCtrl.navigateBack("/login");
  }
}

