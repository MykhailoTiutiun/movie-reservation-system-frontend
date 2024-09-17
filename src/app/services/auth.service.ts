import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/v1/users';
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {email, password});
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-token`, {email, password}).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    let token = localStorage.getItem(this.tokenKey);
    if (token) {
      const expTime = this.getExpirationTime(token);
      if (expTime && expTime > Date.now()) {
        return token;
      } else {
        this.logout();
      }
    }
    return null;
  }

  private getExpirationTime(token: string): number | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp * 1000 || null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserId(): number | null {
    const token = this.getToken()

    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken()

    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role === 'ADMIN' || false;
    } catch (error) {
      console.error('Error decoding token', error);
      return false;
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
