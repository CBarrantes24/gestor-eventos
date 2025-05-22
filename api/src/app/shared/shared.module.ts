import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EventoCardComponent } from './components/evento-card/evento-card.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { FormularioEventoComponent } from './components/formulario-evento/formulario-evento.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EventoCardComponent,
    InputComponent,
    ButtonComponent,
    FormularioEventoComponent
  ],
  exports: [
    EventoCardComponent,
    InputComponent,
    ButtonComponent,
    FormularioEventoComponent
  ]
})
export class SharedModule { }
