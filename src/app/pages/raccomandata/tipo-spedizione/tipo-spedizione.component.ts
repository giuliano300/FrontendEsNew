import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionSingleMultipleComponent } from '../../../component/selection-single-multiple/selection-single-multiple.component';
import { ProductTypes } from '../../../interfaces/EnumTypes';

@Component({
  selector: 'app-tipo-spedizione',
  imports: [ReactiveFormsModule, CommonModule, SelectionSingleMultipleComponent],
  templateUrl: './tipo-spedizione.component.html',
  styleUrl: './tipo-spedizione.component.scss'
})
export class TipoSpedizioneRaccomandataComponent {
  private appStorage = inject(AppStorageService);
  constructor() {}

  tipoProdotto: number = ProductTypes.ROL; 

  ngOnInit(): void{
    this.appStorage.setItem('productType', this.tipoProdotto!.toString());
  }
}
