import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/service/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public errorMessage: string | null = null;
  public isLoading = false;

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials = this.loginForm.getRawValue() as any;

    this.authService.login(credentials).subscribe({
      next: () => {
        const roles = this.authService.getUserRoles();

        if (roles.includes('ROLE_ADMIN')) {
          this.isLoading = false; 
          this.router.navigate(['/admin']);
        } 
        else {
          this.isLoading = false;
          this.errorMessage = 'Доступ заборонено';
          this.authService.clearToken(); 

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Невірний email або пароль';
        this.cdr.detectChanges();
        NotificationService.showError('Невірний email або пароль', err);
      }
    });
  }
}