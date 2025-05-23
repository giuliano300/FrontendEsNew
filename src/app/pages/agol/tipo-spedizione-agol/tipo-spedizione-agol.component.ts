import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  constructor() {}

  tipoProdotto: number = ProductTypes.AGOL; 

  ngOnInit(): void{
    localStorage.setItem('productType', this.tipoProdotto!.toString());
  }

}
