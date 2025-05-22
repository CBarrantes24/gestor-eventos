import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { EventoCardComponent } from '../../shared/components/evento-card/evento-card.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { EventosService, Evento } from '../../services/eventos.service';
import { ModalEventoComponent } from '../../shared/components/modal-evento/modal-evento.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    EventoCardComponent,
    LoadingComponent,
    ModalEventoComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  usuario: any = {};
  eventos: Evento[] = [];
  loading = false;
  modalVisible = false;
  eventoSeleccionado?: Evento;

  constructor(
    private authService: AuthService,
    private eventosService: EventosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarEventos();
  }

  cargarUsuario(): void {
    this.usuario = this.authService.usuarioValue || { nombre: 'Usuario' };
  }

  cargarEventos(): void {
    this.loading = true;
    this.eventosService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.loading = false;
        console.log('Eventos cargados:', eventos); // Add this line for debugging
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.loading = false;
      }
    });
  }

  crearEvento(): void {
    this.eventoSeleccionado = undefined; // Para crear un nuevo evento
    this.modalVisible = true;
  }

  editarEvento(evento: Evento): void {
    this.eventoSeleccionado = evento;
    this.modalVisible = true;
  }

  eliminarEvento(evento: Evento): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el evento "${evento.title}"?`)) {
      this.loading = true;
      this.eventosService.eliminarEvento(evento.id!).subscribe({
        next: () => {
          this.cargarEventos();
        },
        error: (error) => {
          console.error('Error al eliminar el evento:', error);
          this.loading = false;
        }
      });
    }
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  onEventoGuardado(evento: Evento): void {
    this.cargarEventos(); // Recargar la lista de eventos
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  registrarEvento(evento: Evento): void {
    const userId = this.usuario.id; // Asumiendo que el usuario tiene un ID
    if (!userId) {
      alert('Debes iniciar sesión para registrarte a un evento');
      return;
    }

    this.loading = true;
    this.eventosService.registrarEvento(evento, userId).subscribe({
      next: () => {
        alert(`Te has registrado exitosamente al evento "${evento.title}"`);
        this.loading = false;
      },
      error: (error: any) => {
        console.log(error)
        console.error('Error al registrarse al evento:', error);
        alert('Ocurrió un error al intentar registrarse al evento');
        this.loading = false;
      }
    });
  }
}
