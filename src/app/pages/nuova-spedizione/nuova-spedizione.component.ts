import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../services/form-storage.service';

@Component({
  selector: 'app-nuova-spedizione',
  imports: [RouterLink],
  templateUrl: './nuova-spedizione.component.html',
  styleUrl: './nuova-spedizione.component.scss'
})
export class NuovaSpedizioneComponent {
    constructor(private formStorage: FormStorageService ) {}
    ngOnInit() {
        this.formStorage.clearAll();
    }
}
