import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';

    // Validation
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.http.post<{ access_token: string; message: string }>(
      `${environment.apiUrl}/auth/change-password`,
      { newPassword: this.newPassword }
    ).subscribe({
      next: (response) => {
        // Update the token in localStorage
        localStorage.setItem('access_token', response.access_token);
        
        // Redirect to dashboard
        this.router.navigate(['/ap-admin/dashboard']);
      },
      error: (err) => {
        console.error('Password change error:', err);
        this.error = err.error?.message || 'Failed to change password. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

