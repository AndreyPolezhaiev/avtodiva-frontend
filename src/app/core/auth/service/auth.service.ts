import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponseDto } from '../models/login-response.dto';
import { LoginRequestDto } from '../models/login-request.dto';
import { environment } from '../../../../environments/environment.prod';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  roles?: string[];
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient); 
  private router = inject(Router);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private readonly TOKEN_KEY = 'avtodiva_jwt_token';

  constructor() {
    this.initStorageListener();
  }

  private initStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.TOKEN_KEY && !event.newValue) {
        this.logout();
      }
    });
  }

  public login(credentials: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      })
    );
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      return [];
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return decoded.roles || []; 
    } 
    catch (error) {
      console.error('Can\'t decode JWT token:', error);

      return [];
    }
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);

    this.router.navigate(['/login']);
  }

  public clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}