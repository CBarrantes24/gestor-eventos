import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { EventosService } from '../../services/eventos.service';
import { EventoCardComponent } from '../../shared/components/evento-card/evento-card.component';

interface Evento {
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

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, EventoCardComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: any = null;
  eventosRegistrados: Evento[] = [];
  loadingEventos: boolean = false;

  constructor(
    private storageService: StorageService,
    private eventosService: EventosService
  ) {}

  ngOnInit(): void {
    this.usuario = this.storageService.getItem<any>('auth_user');
    if (this.usuario) {
      this.cargarEventosDelUsuario();
    }
  }

  cargarEventosDelUsuario(): void {
    this.loadingEventos = true;
    // En una implementación real, deberías tener un endpoint específico
    // para obtener solo los eventos a los que el usuario está registrado
    this.eventosService.getEventos().subscribe({
      next: (eventos) => {
        this.eventosRegistrados = eventos;
        this.loadingEventos = false;
      },
      error: (error) => {
        console.error('Error al cargar los eventos:', error);
        this.eventosRegistrados = [];
        this.loadingEventos = false;
      }
    });
  }
}
