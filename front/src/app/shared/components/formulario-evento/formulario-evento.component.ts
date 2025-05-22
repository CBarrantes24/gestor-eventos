import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

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
  ubicacion?: string; // Mantenemos este campo para compatibilidad
  imagen?: string; // Mantenemos este campo para compatibilidad
}

@Component({
  selector: 'app-formulario-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './formulario-evento.component.html',
  styleUrl: './formulario-evento.component.css'
})
export class FormularioEventoComponent implements OnInit {
  @Input() evento?: Evento;
  @Input() loading: boolean = false;
  @Output() guardar = new EventEmitter<Evento>();
  @Output() cancelar = new EventEmitter<void>();

  formulario!: FormGroup;
  modoEdicion: boolean = false;

  minDate: string = '';
  minStartTime: string = '';
  minEndTime: string = '';

  ngOnInit(): void {
    this.modoEdicion = !!this.evento?.id;
    this.setMinDate();
    this.inicializarFormulario();
    this.formulario.get('date')?.valueChanges.subscribe(() => {
      this.updateMinStartTime();
      this.formulario.get('start_time')?.updateValueAndValidity();
      this.formulario.get('end_time')?.updateValueAndValidity();
    });
    this.formulario.get('start_time')?.valueChanges.subscribe(() => {
      this.formulario.get('end_time')?.updateValueAndValidity();
    });
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.updateMinStartTime();
  }

  updateMinStartTime() {
    const selectedDate = this.formulario?.get('date')?.value;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (selectedDate === todayStr) {
      // Si la fecha es hoy, la hora mínima es la actual (redondeada a minutos)
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      this.minStartTime = `${hours}:${minutes}`;
    } else {
      this.minStartTime = '00:00';
    }
  }

  inicializarFormulario(): void {
    let fechaEvento = '';
    if (this.evento?.date) {
      fechaEvento = this.evento.date;
    }
    this.formulario = this.fb.group({
      title: [this.evento?.title || '', [Validators.required, Validators.maxLength(100)]],
      date: [fechaEvento, Validators.required],
      start_time: [this.evento?.start_time || '', [Validators.required, this.startTimeValidator.bind(this)]],
      end_time: [this.evento?.end_time || '', [Validators.required, this.endTimeValidator.bind(this)]],
      ubicacion: [this.evento?.ubicacion || '', [Validators.required, Validators.maxLength(200)]],
      description: [this.evento?.description || '', [Validators.required, Validators.maxLength(1000)]],
      imagen: [this.evento?.imagen || ''],
      organizer: [this.evento?.organizer || '', Validators.required],
      capacity: [this.evento?.capacity || null, [Validators.min(1), Validators.max(10000)]],
      status: [this.evento?.status || 'programado']
    });
  }

  startTimeValidator(control: AbstractControl) {
    const date = this.formulario?.get('date')?.value;
    const startTime = control.value;
    if (!date || !startTime) return null;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (date === todayStr) {
      const now = today.getHours() * 60 + today.getMinutes();
      const [h, m] = startTime.split(':').map((v: string) => parseInt(v, 10));
      const startMinutes = h * 60 + m;
      if (startMinutes <= now) {
        return { startTimeInvalid: true };
      }
    }
    return null;
  }

  endTimeValidator(control: AbstractControl) {
    const startTime = this.formulario?.get('start_time')?.value;
    const endTime = control.value;
    if (!startTime || !endTime) return null;
    const [h1, m1] = startTime.split(':').map((v: string) => parseInt(v, 10));
    const [h2, m2] = endTime.split(':').map((v: string) => parseInt(v, 10));
    const startMinutes = h1 * 60 + m1;
    const endMinutes = h2 * 60 + m2;
    if (endMinutes <= startMinutes) {
      return { endTimeInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const eventoData: Evento = {
        ...this.formulario.value,
        id: this.evento?.id
      };
      this.guardar.emit(eventoData);
    } else {
      this.marcarCamposComoTocados();
    }
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach(campo => {
      const control = this.formulario.get(campo);
      control?.markAsTouched();
    });
  }

  onCancelar(): void {
    this.cancelar.emit();
  }

  constructor(private fb: FormBuilder) {}
}
