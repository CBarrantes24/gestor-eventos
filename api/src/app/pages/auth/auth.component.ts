import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginView = true;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      identificacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  toggleView() {
    this.isLoginView = !this.isLoginView;
    this.errorMessage = '';
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value)
        .subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.message || 'Error al iniciar sesión';
          }
        });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      const userData = {
        identificacion: this.registerForm.value.identificacion,
        nombre: this.registerForm.value.nombre,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        rol: "Admin"
      };

      this.authService.register(userData)
        .subscribe({
          next: () => {
            this.loading = false;
            this.isLoginView = true;
            this.errorMessage = 'Registro exitoso. Por favor inicia sesión.';
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.message || 'Error al registrarse';
          }
        });
    }
  }
}
