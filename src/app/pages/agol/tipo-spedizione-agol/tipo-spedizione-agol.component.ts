import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionSingleMultipleComponent } from '../../../component/selection-single-multiple/selection-single-multiple.component';
import { ProductTypes } from '../../../interfaces/EnumTypes';

@Component({
  selector: 'app-tipo-spedizione-agol',
  imports: [ReactiveFormsModule, CommonModule, SelectionSingleMultipleComponent],
  templateUrl: './tipo-spedizione-agol.component.html',
  styleUrl: './tipo-spedizione-agol.component.scss'
})
export class TipoSpedizioneAgolComponent {
  private appStorage = inject(AppStorageService);
  constructor() {}

  tipoProdotto: number = ProductTypes.AGOL; 

  ngOnInit(): void{
    this.appStorage.setItem('productType', this.tipoProdotto!.toString());
  }

}
