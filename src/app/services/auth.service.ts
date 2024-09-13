import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, tap} from "rxjs";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/v1/users';
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient, private router: Router) {
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {email, password});
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
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): number | null {
    const token = this.getToken()

    if (!token) {
      return null;  // If there's no token, return null
    }

    try {
      const decodedToken: any = jwtDecode(token); // Decode the token
      return decodedToken.sub || null;  // Assuming the userId field is in the token
    } catch (error) {
      console.error('Error decoding token', error);
      return null;  // If decoding fails, return null
    }
  }

  isAdmin(): boolean {
    const token = this.getToken()

    if (!token) {
      return false;  // If there's no token, return null
    }

    try {
      const decodedToken: any = jwtDecode(token); // Decode the token
      return decodedToken.role === 'ADMIN' || false;  // Assuming the userId field is in the token
    } catch (error) {
      console.error('Error decoding token', error);
      return false;  // If decoding fails, return null
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
