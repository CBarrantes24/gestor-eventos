import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Ampliamos la interfaz Usuario para incluir todos los campos posibles
interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  identificacion?: string;
  rol?: string;
  // Añade aquí cualquier otro campo que venga del backend
  [key: string]: any; // Esto permite almacenar cualquier propiedad adicional
}

interface LoginResponse {
  usuario: Usuario;
  access_token: string;
  user?: Usuario; // Añadimos este campo para manejar ambas posibilidades
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1'; // Ajusta esta URL según tu backend
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  private tokenKey = 'auth_token'; // Clave para almacenar el token en localStorage
  private userKey = 'auth_user'; // Clave para almacenar el usuario en localStorage
  private tokenSubject = new BehaviorSubject<string | null>(null); // BehaviorSubject para el token

  constructor(private http: HttpClient) {
    this.cargarUsuario();
  }

  get usuario(): Observable<Usuario | null> {
    return this.usuarioActual.asObservable();
  }

  get usuarioValue(): Usuario | null {
    return this.usuarioActual.value;
  }

  // Obtener el token del localStorage
  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Observable para suscribirse a cambios en el token
  get tokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          this.guardarSesion(response);
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Error al iniciar sesión'));
        })
      );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/register`, userData)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Error al registrarse'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.usuarioActual.next(null);
    this.tokenSubject.next(null);
  }

  private guardarSesion(response: LoginResponse): void {
    console.log(response);
    
    // Guardamos el token
    localStorage.setItem(this.tokenKey, response.access_token);
    this.tokenSubject.next(response.access_token);
    
    // Determinamos qué objeto de usuario usar (puede venir como 'usuario' o 'user')
    const userData = response.usuario || response.user;
    
    if (userData) {
      // Guardamos el usuario completo en localStorage
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      this.usuarioActual.next(userData);
    }
  }

  private cargarUsuario(): void {
    const token = this.token;
    const userJson = localStorage.getItem(this.userKey);
    
    if (token) {
      // Actualizar el BehaviorSubject con el token almacenado
      this.tokenSubject.next(token);
      
      // Si tenemos datos del usuario en localStorage, los cargamos
      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          this.usuarioActual.next(userData);
        } catch (e) {
          console.error('Error al parsear datos del usuario:', e);
        }
      } else {
        // Si no tenemos datos del usuario en localStorage, los obtenemos del servidor
        this.verificarToken().subscribe({
          error: () => {
            // Si hay un error al verificar el token, limpiamos la sesión
            this.logout();
          }
        });
      }
    }
  }

  verificarToken(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/users/me`)
      .pipe(
        tap(usuario => {
          // Guardamos el usuario completo en localStorage
          localStorage.setItem(this.userKey, JSON.stringify(usuario));
          this.usuarioActual.next(usuario);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => new Error('Sesión expirada'));
        })
      );
  }

  estaAutenticado(): boolean {
    return !!this.token;
  }

  // Método para establecer un token manualmente (útil para pruebas)
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSubject.next(token);
  }
  
  // Método para actualizar la información del usuario
  actualizarUsuario(usuario: Usuario): void {
    localStorage.setItem(this.userKey, JSON.stringify(usuario));
    this.usuarioActual.next(usuario);
  }
}
