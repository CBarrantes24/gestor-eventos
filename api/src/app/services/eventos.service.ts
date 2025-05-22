import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Evento {
  id?: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  capacity: number;
  status: string;
  ubicacion?: string;
  imagen?: string;
  asistentes?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/events/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Client-Header': 'my-app-client'
    });
  }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getEvento(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  registrarEvento(evento: Evento, user_id: string): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/${evento.id}/register/${user_id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  actualizarEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  eliminarEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any) {
    let errorMessage = 'Ocurrió un error en la operación';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
