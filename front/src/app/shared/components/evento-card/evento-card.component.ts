import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evento } from '../../../services/eventos.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-evento-card',
  standalone: true,
  imports: [CommonModule], // Remove ButtonComponent if not used in template
  templateUrl: './evento-card.component.html',
  styleUrl: './evento-card.component.css'
})
export class EventoCardComponent {
  @Input() evento!: Evento;
  @Input() mostrarDetalle: boolean = false;
  @Input() mostrarAcciones: boolean = false;

  @Output() editar = new EventEmitter<Evento>();
  @Output() eliminar = new EventEmitter<Evento>();
  @Output() registrar = new EventEmitter<Evento>();

  getEstadoClase(): string {
    if (!this.evento.status) return 'estado-desconocido';

    switch (this.evento.status.toLowerCase()) {
      case 'programado': return 'estado-programado';
      case 'en curso': return 'estado-en-curso';
      case 'finalizado': return 'estado-finalizado';
      case 'cancelado': return 'estado-cancelado';
      default: return 'estado-desconocido';
    }
  }

  onEditar(): void {
    this.editar.emit(this.evento);
  }

  onEliminar(): void {
    this.eliminar.emit(this.evento);
  }

  onRegistrar(): void {
    this.registrar.emit(this.evento);
  }
}
