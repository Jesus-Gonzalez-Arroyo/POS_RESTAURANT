import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth/auth';
import { Alert } from '../../shared/utils/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
          
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          const userData = this.decodeToken(response.token);
          localStorage.setItem('token', response.token);
          this.router.navigate([ userData.role === '1' ? '/sales' : '/dashboard' ]);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error en el login:', error);
          Alert('Error', 'Credenciales inválidas. Por favor, intente nuevamente.', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Token inválido');
      return null;
    }
  }
}
