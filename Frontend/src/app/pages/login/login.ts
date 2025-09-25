import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
          
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error en el login:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
