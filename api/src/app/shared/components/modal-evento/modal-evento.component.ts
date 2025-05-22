import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { EventosService, Evento } from '../../../services/eventos.service';

@Component({
  selector: 'app-modal-evento',
  standalone: true,
  imports: [CommonModule, FormularioEventoComponent],
  template: `
    <div class="modal-backdrop" (click)="onCerrar()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="onCerrar()">×</button>
        <app-formulario-evento
          [evento]="evento"
          [loading]="loading"
          (guardar)="onGuardar($event)"
          (cancelar)="onCerrar()"
        ></app-formulario-evento>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  `]
})
export class ModalEventoComponent {
  @Input() evento?: Evento;
  @Output() cerrar = new EventEmitter<void>();
  @Output() eventoGuardado = new EventEmitter<Evento>();

  loading = false;

  constructor(private eventosService: EventosService) {}

  onCerrar(): void {
    this.cerrar.emit();
  }

  onGuardar(evento: Evento): void {
    this.loading = true;

    if (evento.id) {
      // Actualizar evento existente
      this.eventosService.actualizarEvento(evento.id, evento).subscribe({
        next: (eventoActualizado) => {
          this.loading = false;
          this.eventoGuardado.emit(eventoActualizado);
          this.cerrar.emit();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al actualizar el evento:', error);
          // Aquí podrías mostrar un mensaje de error
        }
      });
    } else {
      // Crear nuevo evento
      this.eventosService.crearEvento(evento).subscribe({
        next: (nuevoEvento) => {
          this.loading = false;
          this.eventoGuardado.emit(nuevoEvento);
          this.cerrar.emit();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al crear el evento:', error);
          // Aquí podrías mostrar un mensaje de error
        }
      });
    }
  }
}
