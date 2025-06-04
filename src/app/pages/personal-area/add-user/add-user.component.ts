import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  alertMessage = false;
  alertText = '';

  options: string[] = ['EWT', 'Panificio', 'Mario Rossi', 'Tekmerion', 'Mimmo Carlino sas'];
  selectedOptions: string[] = [];

  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      sel_tipo: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      citta: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required]],
      pwd: ['', [Validators.required]],
      selectedOptions: [[], [this.minSelectedOptions(1)]]
    });
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    const selected = this.selectedOptions;

    if (checkbox.checked) {
      if (!selected.includes(value)) {
        selected.push(value);
      }
    } else {
      const index = selected.indexOf(value);
      if (index >= 0) {
        selected.splice(index, 1);
      }
    }

    this.form.get('selectedOptions')?.setValue(selected);
    this.form.get('selectedOptions')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.router.navigate(['/utentiList']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }

  // Custom validator per verificare che almeno una checkbox sia selezionata
  minSelectedOptions(min: number) {
    return (control: FormControl) => {
      const value = control.value;
      return value && value.length >= min ? null : { required: true };
    };
  }
}