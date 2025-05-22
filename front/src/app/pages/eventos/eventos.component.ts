import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosService, Evento } from '../../services/eventos.service';
import { ModalEventoComponent } from '../../shared/components/modal-evento/modal-evento.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, ModalEventoComponent, ButtonComponent],
  template: `
    <div class="eventos-container">
      <div class="eventos-header">
        <h1>Mis Eventos</h1>
        <app-button label="Crear Evento" (click)="mostrarModalCreacion()"></app-button>
      </div>

      <!-- Aquí iría la lista de eventos -->

      <app-modal-evento
        *ngIf="modalVisible"
        [evento]="eventoSeleccionado"
        (cerrar)="cerrarModal()"
        (eventoGuardado)="onEventoGuardado($event)"
      ></app-modal-evento>
    </div>
  `,
  styles: [`
    .eventos-container {
      padding: 20px;
    }

    .eventos-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
  `]
})
export class EventosComponent {
  eventos: Evento[] = [];
  modalVisible = false;
  eventoSeleccionado?: Evento;

  constructor(private eventosService: EventosService) {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.eventosService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
      }
    });
  }

  mostrarModalCreacion(): void {
    this.eventoSeleccionado = undefined; // Para crear un nuevo evento
    this.modalVisible = true;
  }

  mostrarModalEdicion(evento: Evento): void {
    this.eventoSeleccionado = evento;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  onEventoGuardado(evento: Evento): void {
    this.cargarEventos(); // Recargar la lista de eventos
  }
}
