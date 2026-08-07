import { Component, inject } from '@angular/core';
// import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    // RouterLink,

    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabel,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.nonNullable.group({
    login    : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]], 
    password : ['', [Validators.required, Validators.minLength(8)]]
  });

  login(): void {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login({ username: this.loginForm.value.login!, password: this.loginForm.value.password! }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.authService.saveTokens(response.accessToken, response.refreshToken);
        this.authService.setCurrentUser(response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}
