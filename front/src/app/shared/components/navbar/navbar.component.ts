import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  usuario: any = null;
  mostrarDropdown = false;

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.storageService.getItem<any>('auth_user');
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  cerrarDropdown() {
    this.mostrarDropdown = false;
  }

  cerrarSesion() {
    this.storageService.removeItem('auth_token');
    this.storageService.removeItem('auth_user');
    this.router.navigate(['/auth']);
  }

  irAPerfil() {
    this.cerrarDropdown();
    this.router.navigate(['/perfil']);
  }
}
